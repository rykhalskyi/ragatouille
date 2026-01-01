# Project Structure

## Directory Organization

```
frontend/
├───.design-specs/        # Documentation files
├───dist/                 # Build output
├───e2e/                  # End-to-end tests (Playwright)
├───node_modules/         # Project dependencies
├───public/               # Static assets (e.g. favicon)
├───src/                  # Main source code
│   ├───app/              # Core application code
│   │   ├───client/       # Auto-generated API client
│   │   ├───components/   # Shared UI components (by feature)
│   │   └───services/     # Shared application services
│   ├───assets/           # Application-specific static assets
│   ├───environments/     # Environment-specific configuration
│   └───styles/           # Global styles and variables
├───.gitignore            # Git ignore rules
├───angular.json          # Angular workspace configuration
├───Dockerfile            # Docker build definition
├───package.json          # npm dependencies and scripts
└───tsconfig.json         # TypeScript compiler configuration
```

## Naming Conventions

### Files
- **Components**: `[name].component.ts` (e.g., `collections-list.component.ts`)
- **Services**: `[name].service.ts` (e.g., `settings.service.ts`)
- **Models**: `PascalCase.ts` (e.g., `Collection.ts`) - typically part of the generated client
- **Tests**: `[name].spec.ts` (e.g., `full-scenario.spec.ts`)

### Code
- **Classes/Types/Interfaces**: `PascalCase` (e.g., `CollectionsListComponent`, `Collection`)
- **Functions/Methods**: `camelCase` (e.g., `fetchCollections`)
- **Constants**: `camelCase` or `UPPER_SNAKE_CASE` (depends on scope)
- **Variables**: `camelCase` (e.g., `collections`)

## Import Patterns

### Import Order
A consistent import order is followed to improve readability:
1.  `@angular/*` core/platform imports
2.  `@angular/material` component imports
3.  Other external dependencies (e.g., `rxjs`, `@ngneat/until-destroy`)
4.  Internal application services and components
5.  Internal models/types from the generated client

### Module/Package Organization
- The project uses standalone components, so there is no `app.module.ts`. Dependencies are imported directly into components.
- The backend API client is generated and located under `src/app/client`. It should not be manually edited.
- Feature-specific components are organized into their own directories (e.g., `src/app/collections-list`).

## Code Structure Patterns

### Component Organization
```typescript
// 1. Imports
import { Component, OnInit } from '@angular/core';
// ... other imports

// 2. @Component Decorator
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [...],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss'
})
// 3. Class Definition
export class FeatureComponent implements OnInit {
  // 4. Public and private properties
  public data: any[];
  private service: MyService;

  // 5. Constructor for dependency injection
  constructor(service: MyService) {
    this.service = service;
  }

  // 6. Lifecycle hooks (ngOnInit, ngOnDestroy, etc.)
  ngOnInit(): void {
    // ...
  }

  // 7. Public methods (event handlers, etc.)
  onButtonClick(): void {
    // ...
  }

  // 8. Private helper methods
  private helperFunction(): void {
    // ...
  }
}
```

## Code Organization Principles
1.  **Single Responsibility**: Each component has a clear purpose (e.g., displaying a list, handling a form). Services encapsulate specific functionalities (e.g., API calls, state management).
2.  **Modularity**: Standalone components promote modularity. Features are self-contained.
3.  **Testability**: Code is structured to be testable, with dependencies injected via the constructor. E2E tests cover user workflows.
4.  **Consistency**: The structure and naming conventions are applied consistently across the project, following Angular best practices.

## Module Boundaries
- The primary boundary is between the frontend application and the backend API.
- The auto-generated API client (`src/app/client`) acts as a strict data layer, separating API communication from the presentation logic in the components.
- Components are loosely coupled and communicate via services or routing.