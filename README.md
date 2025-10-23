```markdown
# Chat App — Clean Architecture (Vite + React + Ant Design)

This repository is a starter scaffold for a chat application implemented with Vite, React, TypeScript, and Ant Design, organized according to Clean Architecture principles. It is designed for development, review, and automated assistance by AI (Copilot / code-review bots) while remaining easy for humans to extend and maintain.

## Project summary

- Purpose: provide a well-structured, testable chat app reference that demonstrates:
  - Clean separation of domain, use cases, ports (interfaces), and infrastructure.
  - A chat UI (mocked data persisted in localStorage) supporting send/display messages.
  - Message arrival via window.postMessage and a transport worker.
  - Handling large message volumes (e.g., 1,000 messages) via virtualization.
  - Scroll-to-message behavior based on message ID passed from the URL.
- Audience: frontend engineers building chat-like UIs, teams experimenting with Clean Architecture, and AI-assisted code generation & review tools.

## Core features

- Chat UI with a left navigation (conversation list) and main message area.
- Send and display messages (local mock + persistence).
- Receive messages through:
  - window.postMessage
  - Transport worker (web worker)
- Dual display update: incoming messages appear in both main message list and left nav.
- Large dataset handling through virtualization (recommended libraries included).
- Scroll-to-message-by-id: reads messageId from the URL and scrolls the viewport to that message when possible.

## Architectural overview

- Clean Architecture layering:
  - src/domain: pure domain entities and business rules.
  - src/usecases: application services (interactors) implementing business flows.
  - src/ports: interfaces for repositories and transports (dependency inversion).
  - src/infrastructure: concrete adapters (LocalStorage repository, worker transport).
  - src/ui: React components, containers, hooks and pages (thin presentation layer).
  - src/workers: web worker code for transport or heavy tasks.
  - src/tests & e2e: shared test helpers and Playwright scenarios.
- I/O and side effects are isolated in ports/infrastructure to make domain logic pure and easily testable.

## Folder structure (top-level important paths)

- src/
  - domain/
  - usecases/
  - ports/
  - infrastructure/
  - ui/
    - components/
    - containers/
    - hooks/
    - pages/
  - workers/
  - types/
  - utils/
  - tests/
- e2e/ (Playwright tests)
- CODE_CONVENTIONS.md
- AI_CODE_REVIEW_GUIDELINES.md
- copilot-instructions.md
- .github/ (PR template, CI workflows)

## Getting started (local)

Prerequisites: Node.js (>= 18 recommended), npm

1. Install
   - npm ci
2. Run dev server
   - npm run dev
3. Build for production
   - npm run build
4. Preview production build
   - npm run preview

## Linting & formatting

- ESLint + TypeScript + recommended plugins.
- Prettier configuration provided.
- Run:
  - npm run lint
  - npm run format
- Husky + lint-staged run auto-fixes on commit (configured via package.json).

## Tests

- Unit tests: Vitest + React Testing Library
  - npm run test:unit
  - npm run test:unit:watch
- E2E tests: Playwright (integration scenarios)
  - Install browsers: npx playwright install --with-deps
  - Run: npm run test:e2e
- Tests should mock infrastructure (repositories, workers) in unit tests and use seeded localStorage for deterministic e2e flows.

## CI

- GitHub Actions workflow runs on pull requests:
  - npm ci
  - npm run lint
  - npm run test:unit
  - Playwright browsers installed and npm run test:e2e
- CI status must pass before merging.

## Developer guidelines & conventions

- See CODE_CONVENTIONS.md (root) for naming, component rules, dependency injection and architecture conventions.
- I/O must go through src/ports and src/infrastructure to maintain testability.
- Keep components thin; place business logic in usecases or hooks.
- Virtualize long message lists (recommended threshold: >200 messages).
- Clean up all event listeners (window.postMessage, worker.onmessage) in useEffect cleanup.

## AI & review artifacts

- This repository includes files the AI should consult before making suggestions:
  - CODE_CONVENTIONS.md — coding conventions and architecture patterns.
  - AI_CODE_REVIEW_GUIDELINES.md — review checklist, severity levels and comment format.
  - copilot-instructions.md — explicit instructions for Copilot/AI assistants about allowed auto-fixes, escalation, and review rules.
- Place these files at the repository root so automated tools and reviewers can discover the policies.

## Pull request expectations

- Use conventional commits in PR titles (e.g., feat(chat): implement scroll-to-message).
- Include description, acceptance criteria and checklist in PR body (.github/PULL_REQUEST_TEMPLATE.md).
- Small, focused PRs are preferred. Provide unit tests for all new logic and stable e2e tests for flows that touch user-visible behavior.

## Contributing

- Fork the repository, create a feature branch, and open a PR against main.
- Run lint and tests locally before pushing.
- Maintain test coverage for business-critical flows (message arrival, persistence, scroll-to-id, large dataset handling).

## Troubleshooting & notes

- If virtualization or scroll-to-index behaves unexpectedly, ensure the virtualizer is initialized after data load and that scroll operations are performed once the DOM node for the target exists.
- For deterministic e2e testing of large datasets, seed localStorage with a stable dataset before loading the page.
- Validate and parse payloads from postMessage / worker and log malformed messages for debugging.

## License

- Repository is provided as a starter template. Add your project's license information here.
```
