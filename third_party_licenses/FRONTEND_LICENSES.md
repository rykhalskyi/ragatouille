# Frontend Dependencies - License Summary

## Project License
- **Ragatouille Frontend** - MIT License

## Direct Dependencies - Licenses

### Angular Core (MIT License)
Angular is licensed under the MIT License, which is compatible with your project's MIT license.

- **@angular/animations** (20.3.12) - MIT - https://angular.io
- **@angular/cdk** (20.2.13) - MIT - https://github.com/angular/components
- **@angular/common** (20.3.12) - MIT - https://angular.io
- **@angular/compiler** (20.3.12) - MIT - https://angular.io
- **@angular/core** (20.3.12) - MIT - https://angular.io
- **@angular/forms** (20.3.12) - MIT - https://angular.io
- **@angular/material** (20.2.13) - MIT - https://material.angular.io
- **@angular/platform-browser** (20.3.12) - MIT - https://angular.io
- **@angular/platform-browser-dynamic** (20.3.12) - MIT - https://angular.io
- **@angular/router** (20.3.12) - MIT - https://angular.io

### Testing & Development Tools (MIT License)
- **@playwright/test** (1.56.1) - Apache-2.0 - https://playwright.dev
- **playwright** (1.56.1) - Apache-2.0 - https://playwright.dev
- **@angular/cli** (20.3.10) - MIT - https://github.com/angular/angular-cli
- **@angular-devkit/build-angular** (20.3.10) - MIT - https://github.com/angular/angular-cli
- **@angular/compiler-cli** (20.3.12) - MIT - https://angular.io
- **typescript** (5.8.0) - Apache-2.0 - https://www.typescriptlang.org

### Utilities (MIT License)
- **rxjs** (7.8.0) - Apache-2.0 - https://github.com/ReactiveX/rxjs
- **@ngneat/until-destroy** (10.0.0) - MIT - https://github.com/ngneat/until-destroy
- **tslib** (2.3.0) - 0BSD - https://github.com/Microsoft/tslib
- **zone.js** (0.15.0) - MIT - https://github.com/angular/zone.js

## License Summary

### MIT Licensed (Compatible with Your Project)
- Angular framework (all packages)
- @ngneat/until-destroy
- zone.js

### Apache 2.0 Licensed (Requires APACHE-2.0 Text)
- Playwright (testing tool - dev only)
- TypeScript (compiler - dev only)
- RxJS (reactive library)

### Other Permissive Licenses
- tslib (0BSD - highly permissive)

## Important Notes

1. **No Breaking License Incompatibilities**
   - All frontend dependencies use MIT or Apache 2.0
   - Both are compatible with your project's MIT license
   - No GPL or restrictive licenses present

2. **Apache 2.0 Dependencies for Frontend**
   - Playwright is an Apache 2.0 licensed testing tool
   - TypeScript compiler is Apache 2.0 licensed
   - RxJS is Apache 2.0 licensed
   - Your existing `third_party_licenses/APACHE-2.0.txt` covers these

3. **Development vs. Production**
   - Playwright and TypeScript are dev dependencies
   - They don't need to be distributed with production builds
   - However, if you distribute source code, include their licenses

## Distribution Recommendations

For **production builds** (generated JavaScript):
- Licenses are minimal - Angular's MIT is the primary concern
- Include your root LICENSE file

For **source code distribution**:
- Include the existing `third_party_licenses/APACHE-2.0.txt` (covers RxJS, TypeScript, Playwright)
- Include `third_party_licenses/DEPENDENCIES_LICENSES.md`
- Reference this file in documentation

## Transitive Dependencies

The packages listed above have their own dependencies. Key ones to be aware of:

### TypeScript Dependencies
- **rollup** (various versions) - MIT
- **esbuild** - MIT
- Various webpack/build tools - MIT

### Angular Dependencies (Automatically Installed)
- **@angular/localize** - MIT
- **rxjs** - Apache-2.0 (already listed)
- Various build tools - MIT

### RxJS Dependencies
- Minimal internal dependencies, all MIT/compatible

## Verification

To generate an up-to-date list of all transitive dependencies and their licenses, run:

```bash
cd /home/jaro/Source/ragatouille/frontend

# Install dependencies first
npm install

# Generate detailed license report
npm list --all --depth=999 | grep -E "^[^─]|└──" > npm-dependencies.txt

# Or use npm-check-licenses if installed globally
npm-check-licenses
```

## Updating Frontend Dependencies

When you update frontend dependencies:

1. Review the new package's license on npmjs.com
2. If adding Apache 2.0 licensed packages, ensure they're documented
3. Update this file with any new Apache 2.0 packages
4. Run `npm audit` to check for security and license issues
5. Commit changes to version control

## Frontend License Compliance

✅ **Your frontend is compliant** with the following distributions:

- **Open source distribution**: Include all license files
- **Commercial distribution**: Include all license files (all are permissive)
- **SaaS/Cloud service**: No distribution concerns (licenses only apply to redistribution)
- **Docker container**: Include license files in the image

---

**Last updated**: January 2026
