# Code Style and Best Practices

This document outlines the coding standards and best practices for the RAGatouille frontend application, which is built with Angular and TypeScript.

---

# Foundational Principles

This project adheres to established software engineering principles to ensure the codebase is robust, maintainable, and scalable.

*   **SOLID:** Applied through Angular's architecture (Dependency Injection, Component-based structure).
*   **KISS (Keep It Simple, Stupid):** Prefer simple, straightforward solutions over complex ones.
*   **YAGNI (You Ain't Gonna Need It):** Do not add functionality until it is deemed necessary.
*   **DRY (Don't Repeat Yourself):** Avoid duplicating code. Use services for shared logic and variables for shared values.

---

# Specific Guidelines

## Use Standalone Components

**Problem:**
In older Angular versions, `NgModule` was required for every feature, leading to boilerplate and tight coupling.

**Recommendation:**
Use Angular's standalone components, directives, and pipes. This simplifies the architecture by allowing components to manage their own dependencies directly.

```typescript
// Good: Standalone component with direct dependency imports
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-simple-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule], // Dependencies are declared here
  template: `<button mat-raised-button>Click me</button>`,
})
export class SimpleButtonComponent {}
```

**Rationale:**
Reduces boilerplate, improves modularity, and makes components more reusable and easier to reason about.

---

## Centralize Global Styles and Variables

**Problem:**
Hardcoding values like colors, fonts, or layout sizes across multiple component stylesheets makes maintenance difficult and leads to an inconsistent UI.

**Recommendation:**
Define shared styles and variables in a central location.

1.  **Define CSS variables** in `src/styles.scss` for global values.
    ```scss
    // src/styles.scss
    :root {
      --primary-color: #3f51b5;
      --topbar-height: 64px;
    }
    ```
2.  **Use the variables** in component stylesheets.
    ```scss
    // some-component.scss
    .header {
      background-color: var(--primary-color);
      height: var(--topbar-height);
    }
    ```

**Rationale:**
Follows the DRY principle. Ensures a consistent look and feel and makes rebranding or theme adjustments simple by changing values in a single file.

---

## Manage RxJS Subscriptions

**Problem:**
Failing to unsubscribe from RxJS Observables in components can lead to memory leaks and unexpected behavior when the component is destroyed.

**Recommendation:**
Use the `@ngneat/until-destroy` library to automatically manage subscription cleanup.

1.  **Add the `@UntilDestroy()` decorator** to your component.
2.  **Pipe the `untilDestroyed(this)`** operator onto your subscription.

```typescript
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
// ...

@UntilDestroy()
@Component(...)
export class MyComponent implements OnInit, OnDestroy {
  ngOnInit() {
    myObservable$
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        // ...
      });
  }
}
```

**Rationale:**
This provides a clean, declarative way to handle unsubscriptions, reducing boilerplate (`ngOnDestroy`) and preventing memory leaks.

---

## Use Type-Safe Forms

**Problem:**
Using non-typed `FormGroup` or `FormControl` can lead to runtime errors and makes it difficult to reason about the form's data structure.

**Recommendation:**
Use Angular's typed forms to define the shape of the form data.

```typescript
// Good: Typed form group
import { FormControl, FormGroup } from '@angular/forms';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

const loginForm = new FormGroup<LoginForm>({
  email: new FormControl(''),
  password: new FormControl(''),
});

const emailValue = loginForm.value.email; // Type is string | undefined
```

**Rationale:**
Improves developer experience with autocompletion and compile-time checks, reducing the risk of bugs related to form controls and their values.
