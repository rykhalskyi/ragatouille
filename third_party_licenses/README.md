# Third Party Licenses Directory

This directory contains license information for all third-party dependencies used by the Ragatouille project.

## Files in this Directory

### APACHE-2.0.txt
Complete text of the Apache License, Version 2.0. This license is used by many dependencies in this project, including:
- chromadb
- fastembed
- huggingface_hub
- kubernetes
- OpenTelemetry packages
- And many others (see DEPENDENCIES_LICENSES.md for complete list)

### DEPENDENCIES_LICENSES.md
A comprehensive summary of all third-party dependencies organized by license type. This document lists:
- All Apache 2.0 licensed packages (backend)
- All dual-licensed packages (backend)
- All MIT and BSD licensed packages (backend)
- Frontend dependencies overview
- URLs to upstream projects for reference

See also `FRONTEND_LICENSES.md` for detailed frontend-specific information.

### FRONTEND_LICENSES.md
Detailed license information for all Angular, TypeScript, and other frontend dependencies. Covers:
- Angular framework packages (all MIT)
- Playwright and development tools
- RxJS and other utilities
- Transitive dependencies overview
- Frontend-specific compliance guidance

## License Compatibility

The Ragatouille project combines two main license families:

### Your Project: MIT License
- Permissive open source license
- Allows commercial use
- Requires preserving copyright notice

### Dependencies: Primarily Apache 2.0
- Permissive open source license with patent grant
- Allows commercial use
- Requires preserving NOTICE files
- Explicitly compatible with MIT License

**Good news**: MIT and Apache 2.0 are compatible for distribution together. You can redistribute this software commercially as long as you:
1. Keep all license texts
2. Preserve all NOTICE files
3. Don't remove copyright notices

## Distribution Requirements

When you distribute this software (source or binary), include:

```
your-distribution/
├── LICENSE ........................... Your MIT license
├── NOTICE.md ......................... This notice file
└── third_party_licenses/
    ├── APACHE-2.0.txt ............... Apache 2.0 license text
    └── DEPENDENCIES_LICENSES.md ..... Detailed dependency list
```

## Checking Your Distribution

Before releasing a version, verify:

1. ✅ `LICENSE` file is present (MIT)
2. ✅ `NOTICE.md` file is present and current
3. ✅ `third_party_licenses/APACHE-2.0.txt` is present
4. ✅ `third_party_licenses/DEPENDENCIES_LICENSES.md` is up to date
5. ✅ No copyright headers or attribution notices have been removed
6. ✅ Version numbers in DEPENDENCIES_LICENSES.md match your requirements.txt

## Updating This Directory

When you update dependencies:

1. Run this command to regenerate licenses.csv:
   ```bash
   pip-licenses --format=csv --output-file=backend/licenses.csv
   ```

2. Update `DEPENDENCIES_LICENSES.md` with new packages and their licenses

3. Add any new Apache 2.0 licensed packages to the list

4. Commit these changes to version control

## Legal Disclaimer

This directory is provided to help you comply with open source licenses. For questions about legal compliance, please:

- Review the Apache 2.0 license text (APACHE-2.0.txt)
- Check the MIT license in the root LICENSE file
- Review each upstream project's LICENSE file when in doubt
- Consult with your legal team if you have concerns

## Resources

- Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
- MIT License: https://opensource.org/licenses/MIT
- License Compatibility: https://choosealicense.com/
- SPDX License List: https://spdx.org/licenses/

---

**Last updated**: January 2026
