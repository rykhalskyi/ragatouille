# Technology Stack

## Project Type
This project is a single-page web application (SPA) that provides a frontend interface for the RAGatouille service.

## Core Technologies

### Primary Language(s)
- **Language**: TypeScript (~5.8.0)
- **Runtime/Compiler**: Angular CLI (^20.3.10)

### Key Dependencies/Libraries
- **Angular**: ^20.3.12 (Core framework for building the application)
- **Angular Material**: ^20.2.13 (UI component library)
- **RxJS**: ~7.8.0 (Reactive programming library for handling asynchronous operations)
- **@ngneat/until-destroy**: ^10.0.0 (Handles subscription cleanup automatically)

### Application Architecture
The application follows a client-server architecture. It is a standalone SPA that communicates with a backend API.

### Data Storage (if applicable)
- The frontend does not have its own data storage. It retrieves all data from the backend API.

### External Integrations (if applicable)
- **APIs**: Communicates with the RAGatouille backend API. The API endpoint is configurable.

## Development Environment

### Build & Development Tools
- **Build System**: Angular CLI (`ng build`, `ng serve`) orchestrated via npm scripts.
- **Package Management**: npm
- **Development workflow**: The development server supports hot reloading (`ng serve`).

### Code Quality Tools
- **Static Analysis**: TypeScript compiler with strict settings.
- **Formatting**: `.editorconfig` enforces basic styling.
- **Testing Framework**: Playwright (^1.56.1) for end-to-end testing.

### Version Control & Collaboration
- **VCS**: Git

## Deployment & Distribution (if applicable)
- **Target Platform(s)**: The application is deployed via Docker.
- **Distribution Method**: A multi-stage `Dockerfile` builds the application and serves it using an Nginx web server.
- **Installation Requirements**: Docker is required for deployment.
- **Update Mechanism**: Updates are delivered by rebuilding and deploying the Docker image.

## Technical Requirements & Constraints

### Compatibility Requirements  
- **Platform Support**: Runs in any modern web browser that supports Angular 20. The development and deployment environment is based on Node.js 20 and Docker.
- **Dependency Versions**: Key dependencies are managed in `package.json`.

### Security & Compliance
- **Security Requirements**: The application relies on the security of the backend API. The `apiUrl` is injected at build time.
