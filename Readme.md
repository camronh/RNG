# Web3 CSPRNG API

> A Cryptographically Secure Psuedo-Random Number Generation Web3 API Powered by [Airnode](https://docs.api3.org/pre-alpha/airnode/design-philosophy.html)

[Postman API Documentation](https://documenter.getpostman.com/view/10878361/TzzHkst7#intro)

**ProviderID:** 0x7185149b8de3f245f23c02d02542efd0f76bbc574842152035b62990ba0120fe

## /randomNumber

Used to generate a random number.

**EndpointId:** 0x4f2ea515c132c1c599e339e820e771a39e142f9282febd7798504715c86a51c9

**Params:** {address} | {commit} | {max}

- `max` _required_ - `int` - The ceiling for number generation starting from 0
- `commit` - `bool` - Use commit-reveal scheme. Will return a hash to be used in `/reveal` instead of a raw integer.
- `address` _required in `commit`_ - `string` - Address used to generate hash

## /reveal

Reveals a hashed number

**EndpointId:** 0x34f1c69255d6a4db2cbf8b09c799137045f0017654f4f68ea60b7ce708d64e00

**Params:** {hash}

- `hash`  _required_ - `string` - Hash value received from using `commit` in `/randomNumber`
