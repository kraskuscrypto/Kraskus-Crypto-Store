"""Exercise the shipped startup command using isolated temporary paths."""
import copy
import json
import pathlib
import subprocess
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parent
COMPOSE = ROOT.parents[1] / 'kraskus-zec-solo/docker-compose.yml'

class UpgradeTests(unittest.TestCase):
    def run_start(self, legacy=False, confirmed=False, network='Mainnet'):
        compose = json.loads(COMPOSE.read_text())
        script = compose['services']['zebra']['entrypoint'][2].replace('$$', '$')
        with tempfile.TemporaryDirectory() as d:
            root = pathlib.Path(d)
            config = root / 'config'; config.mkdir()
            state = root / 'zebra'; state.mkdir()
            (config / 'zebra-start-allowed').write_text('{}')
            (config / 'network').write_text(network)
            if legacy:
                old = state / 'state/v28/mainnet'; old.mkdir(parents=True)
                (old / 'sentinel').write_text('chain-data')
            if confirmed:
                (config / 'nu7-v28-backup-confirmed').write_text('v28 backup verified\n')
            stub = root / 'entrypoint'
            stub.write_text('#!/bin/sh\n[ "$1" = zebrad ] || exit 1\n[ -z "${ZEBRA_MINING__MINER_ADDRESS+x}" ] || exit 2\n[ -z "${CONFIG_FILE_PATH+x}" ] || exit 3\n[ "$ZEBRA_NETWORK__NETWORK" = Mainnet ] || exit 4\n[ "$ZEBRA_STATE__DELETE_OLD_DATABASE" = false ] || exit 5\n')
            stub.chmod(0o755)
            script = script.replace('/kraskus-config', str(config)).replace('/home/zebra/.cache/zebra', str(state)).replace('/usr/local/bin/entrypoint.sh', str(stub))
            result = subprocess.run(['bash', '-c', script], env={'PATH':'/usr/bin:/bin', 'ZEBRA_MINING__MINER_ADDRESS':'legacy-address', 'CONFIG_FILE_PATH':'legacy.toml'}, capture_output=True, text=True, timeout=5)
            if legacy:
                self.assertEqual((state / 'state/v28/mainnet/sentinel').read_text(), 'chain-data')
            return result

    def test_fresh_start_without_payout(self):
        self.assertEqual(self.run_start().returncode, 0)

    def test_legacy_state_requires_verified_backup(self):
        result = self.run_start(legacy=True)
        self.assertEqual(result.returncode, 78)
        self.assertIn('No migration started', result.stderr)

    def test_confirmed_backup_allows_start(self):
        self.assertEqual(self.run_start(legacy=True, confirmed=True).returncode, 0)

    def test_wrong_network_fails_closed(self):
        self.assertEqual(self.run_start(network='Testnet').returncode, 78)

    def test_no_gate_waits_without_starting(self):
        script = json.loads(COMPOSE.read_text())['services']['zebra']['entrypoint'][2].replace('$$', '$')
        with tempfile.TemporaryDirectory() as d:
            script = script.replace('/kraskus-config', d).replace('sleep 10', 'exit 79')
            self.assertEqual(subprocess.run(['bash', '-c', script]).returncode, 79)

    def test_unchanged_persistence_and_security(self):
        before = json.loads((ROOT / 'before-compose.json').read_text())
        after = json.loads(COMPOSE.read_text())
        expected = copy.deepcopy(before)
        expected['services']['zebra'] = after['services']['zebra']
        expected['services']['kraskus'].pop('ports')
        self.assertEqual(expected, after)
        for key in ('volumes', 'security_opt', 'restart'):
            self.assertEqual(before['services']['zebra'][key], after['services']['zebra'][key])
        self.assertNotIn('ports', after['services']['zebra'])
        self.assertNotIn('ports', after['services']['kraskus'])
        env = copy.deepcopy(before['services']['zebra']['environment'])
        env.pop('KRASKUS_MINER_ADDRESS_FILE')
        self.assertEqual(env, after['services']['zebra']['environment'])

if __name__ == '__main__':
    unittest.main()
