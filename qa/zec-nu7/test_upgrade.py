"""Production package preservation and supervisor transition tests."""
import json
import os
from pathlib import Path
import signal
import subprocess
import tempfile
import time
import unittest

ROOT = Path(__file__).resolve().parent
COMPOSE = ROOT.parents[1] / 'kraskus-zec-solo/docker-compose.yml'

class ProductionUpgradeTests(unittest.TestCase):
    def test_persistence_and_exposure(self):
        before = json.loads((ROOT / 'before-compose.json').read_text())
        after = json.loads(COMPOSE.read_text())
        for name in before['services']:
            if 'volumes' in before['services'][name]:
                self.assertEqual(before['services'][name]['volumes'], after['services'][name]['volumes'])
            self.assertEqual(before['services'][name].get('security_opt'), after['services'][name].get('security_opt'))
        self.assertEqual(after['services']['kraskus']['ports'], ['3335:3335'])
        self.assertNotIn('ports', after['services']['zebra'])
        self.assertNotIn('zallet', after['services'])
        self.assertEqual(before['services']['ui']['image'], after['services']['ui']['image'])
        self.assertEqual(before['services']['zallet-init'], after['services']['zallet-init'])

    def test_gate_payout_restart_and_clean_stop(self):
        script = json.loads(COMPOSE.read_text())['services']['zebra']['entrypoint'][2]
        self.assertIn('$CONFIG_DIR'.replace('$', '$$'), script)
        script = script.replace('$$', '$')
        self.assertNotIn('nu7-v28-backup-confirmed', script)
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp); config = root / 'config'; config.mkdir()
            cache = root / 'cache'; cache.mkdir()
            sentinel = cache / 'legacy-state'; sentinel.write_bytes(b'keep-chain-state')
            events = root / 'events'
            child = root / 'node.sh'
            child.write_text('''#!/bin/bash
echo "start:${ZEBRA_MINING__MINER_ADDRESS:-none}" >> "$EVENTS"
trap 'echo stop >> "$EVENTS"; exit 0' TERM INT
while :; do sleep 0.1 & wait $! || true; done
''')
            script = script.replace('CONFIG_DIR=/kraskus-config', 'CONFIG_DIR=' + str(config))
            script = script.replace('chown -R 10001:10001 "$cache"', ':')
            script = script.replace('setpriv --reuid=10001 --regid=10001 --init-groups zebrad &', 'bash ' + str(child) + ' &')
            env = dict(os.environ, ZEBRA_STATE__CACHE_DIR=str(cache), ZEBRA_RPC__COOKIE_DIR=str(cache), EVENTS=str(events))
            proc = subprocess.Popen(['bash', '-c', script], env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            def wait_for(predicate):
                deadline = time.monotonic() + 8
                while time.monotonic() < deadline:
                    if predicate(): return
                    if proc.poll() is not None:
                        self.fail('supervisor exited: ' + proc.stderr.read().decode())
                    time.sleep(0.1)
                self.fail('supervisor transition timed out')
            try:
                time.sleep(0.4)
                self.assertFalse(events.exists(), 'storage gate bypassed')
                (config / 'network').write_text('Mainnet\n')
                (config / 'miner-address').write_text('invalid legacy payout\n')
                (config / 'zebra-start-allowed').write_text('{}')
                wait_for(lambda: events.exists())
                self.assertEqual(events.read_text().splitlines(), ['start:none'])
                address = 't1' + 'A' * 33
                (config / 'miner-address').write_text(address)
                wait_for(lambda: 'start:' + address in events.read_text())
                (config / 'miner-address').write_text('')
                wait_for(lambda: events.read_text().count('start:none') == 2)
                proc.send_signal(signal.SIGTERM)
                self.assertEqual(proc.wait(timeout=5), 0)
                self.assertEqual(events.read_text().splitlines(), ['start:none', 'stop', 'start:' + address, 'stop', 'start:none', 'stop'])
                self.assertEqual(sentinel.read_bytes(), b'keep-chain-state')
            finally:
                if proc.poll() is None:
                    proc.terminate(); proc.wait(timeout=5)
                proc.stdout.close(); proc.stderr.close()

if __name__ == '__main__':
    unittest.main()
