# Third-party notices

The container images used by this app include the third-party software listed below. Each component is licensed by its authors under the licence reproduced here; nothing in the Kraskus licence limits those rights. Kraskus Crypto components are proprietary software of 4KM Ventures LLC, licensed under https://github.com/kraskuscrypto/Kraskus-Crypto-Release-Sources/blob/kraskus-licence-2026-10-14/LICENSE-KRASKUS.md .

Release records, licence texts and published source: https://github.com/kraskuscrypto/Kraskus-Crypto-Release-Sources

## DigiByte Core 9.26.7 — MIT

Built unmodified from https://github.com/DigiByte-Core/digibyte at tag `v9.26.7` (commit `d7265fb05e26e1e799876bcd526225e4826c3ba8`); images `kraskus-dgb-solo-node` and `kraskus-dgb-solo-stratum` (whose libdgbpow compiles DigiByte Core's own sha256, hmac_sha256, scrypt and sph-skein sources).

```text
The MIT License (MIT)

Copyright (c) 2009-2023 The Bitcoin Core developers
Copyright (c) 2014-2023 DigiByte Developers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## Operating-system packages

Debian, Alpine, Python and nginx base-image packages are unmodified. Their copyright and licence notices are inside each image (Debian: `/usr/share/doc/<package>/copyright`) and their sources are available from the respective distributions (Debian: https://snapshot.debian.org/).
