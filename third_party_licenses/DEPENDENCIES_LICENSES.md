# Third-Party Dependencies - License Summary

## Frontend and Backend Dependencies

This project includes both backend (Python/FastAPI) and frontend (Angular/TypeScript) components.
Each has its own set of dependencies with compatible open source licenses.

## BACKEND DEPENDENCIES

The following dependencies are licensed under the Apache License, Version 2.0.
A complete copy of this license is available in `APACHE-2.0.txt` in this directory.

### Core Apache 2.0 Licensed Packages

- **chromadb** (1.3.5) - Apache Software License - https://github.com/chroma-core/chroma
- **fastembed** (0.7.4) - Apache License - https://github.com/qdrant/fastembed
- **PyPika** (0.48.9) - Apache Software License - https://github.com/kayak/pypika
- **huggingface_hub** (1.2.1) - Apache Software License - https://github.com/huggingface/huggingface_hub
- **kubernetes** (34.1.0) - Apache Software License - https://github.com/kubernetes-client/python
- **tokenizers** (0.22.1) - Apache Software License - https://github.com/huggingface/tokenizers
- **google-auth** (2.43.0) - Apache Software License - https://github.com/googleapis/google-auth-library-python
- **googleapis-common-protos** (1.72.0) - Apache Software License - https://github.com/google-cloud-python
- **grpcio** (1.76.0) - Apache Software License - https://grpc.io
- **flatbuffers** (25.9.23) - Apache Software License - https://google.github.io/flatbuffers/

### OpenTelemetry Packages (Apache 2.0)

- **opentelemetry-api** (1.39.0) - Apache License 2.0 - https://github.com/open-telemetry/opentelemetry-python
- **opentelemetry-sdk** (1.39.0) - Apache License 2.0 - https://github.com/open-telemetry/opentelemetry-python
- **opentelemetry-exporter-otlp-proto-common** (1.39.0) - Apache License 2.0
- **opentelemetry-exporter-otlp-proto-grpc** (1.39.0) - Apache License 2.0
- **opentelemetry-proto** (1.39.0) - Apache License 2.0
- **opentelemetry-semantic-conventions** (0.60b0) - Apache License 2.0

### aio-libs Packages (Apache 2.0)

- **aiohttp** (3.13.2) - Apache-2.0 AND MIT - https://github.com/aio-libs/aiohttp
- **aiosignal** (1.4.0) - Apache Software License - https://github.com/aio-libs/aiosignal
- **frozenlist** (1.8.0) - Apache-2.0 - https://github.com/aio-libs/frozenlist
- **multidict** (6.7.0) - Apache License 2.0 - https://github.com/aio-libs/multidict
- **yarl** (1.22.0) - Apache Software License - https://github.com/aio-libs/yarl

### Other Apache 2.0 Licensed Packages

- **cyclopts** (4.3.0) - Apache-2.0 - https://github.com/BrianPugh/cyclopts
- **fastmcp** (2.13.3) - Apache-2.0 - https://gofastmcp.com
- **hf-xet** (1.2.0) - Apache-2.0 - https://github.com/huggingface/xet-core
- **python-multipart** (0.0.20) - Apache-2.0 - https://github.com/Kludex/python-multipart
- **diskcache** (5.6.3) - Apache Software License - http://www.grantjenks.com/docs/diskcache/
- **distro** (1.9.0) - Apache Software License - https://github.com/python-distro/distro
- **importlib_metadata** (8.7.0) - Apache Software License - https://github.com/python/importlib_metadata
- **importlib_resources** (6.5.2) - Apache Software License - https://github.com/python/importlib_resources
- **jsonschema-path** (0.3.4) - Apache Software License - https://github.com/p1c2u/jsonschema-path
- **pathable** (0.4.4) - Apache Software License - https://github.com/p1c2u/pathable
- **py-key-value-aio** (0.3.0) - Apache Software License
- **py-key-value-shared** (0.3.0) - Apache Software License

## Dual-Licensed Packages

- **aiohttp** (3.13.2) - Apache-2.0 AND MIT
- **cryptography** (46.0.3) - Apache-2.0 OR BSD-3-Clause
- **orjson** (3.11.4) - Apache-2.0 OR MIT
- **pypdfium2** (5.1.0) - BSD-3-Clause / Apache-2.0

The remaining packages are licensed under MIT, BSD, or other permissive licenses that are compatible with this distribution.

## FRONTEND DEPENDENCIES

See `FRONTEND_LICENSES.md` for detailed frontend dependency information.

### Key Frontend License Information
- **Angular Framework** - MIT License
- **TypeScript** - Apache License 2.0
- **RxJS** - Apache License 2.0
- **Playwright** - Apache License 2.0 (dev/test only)
- All other frontend packages - MIT or compatible licenses

No GPL, AGPL, or incompatible licenses are used in the frontend.

## Important Notes for Redistribution

1. **You must distribute the Apache License 2.0** (APACHE-2.0.txt) along with this software
2. **Apache 2.0 Compliance**: When redistributing, ensure all NOTICE files from Apache-licensed dependencies are preserved
3. **MIT Compatibility**: MIT license is compatible with Apache 2.0, but Apache 2.0 terms must be respected for those specific components
4. **Attribution**: Maintain all copyright notices in the source code for all dependencies listed above

## How to Use These Files

- Keep this `DEPENDENCIES_LICENSES.md` file with your distribution
- Include the `APACHE-2.0.txt` file
- Include the main project `LICENSE` file (MIT)
- Include the `NOTICE.md` file from the root directory

For more information about Apache License 2.0 compatibility with MIT, see:
https://www.apache.org/licenses/LICENSE-2.0
