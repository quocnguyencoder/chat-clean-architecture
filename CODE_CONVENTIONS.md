```markdown
# Code Conventions — Chat App (Vite + React + Ant Design)

Purpose: ensure consistent, readable, testable code that aligns with Clean Architecture and is reviewable by both humans and AI.

1. Project folder structure (recommended)
- src/
  - domain/                 # Entities and pure domain logic
  - usecases/               # Application services (interactors)
  - ports/                  # Interfaces (repositories, transports) used by usecases
  - infrastructure/         # Concrete implementations (LocalStorage, transports, workers)
  - ui/
    - components/           # Presentational (dumb) components
    - containers/           # Connected components that coordinate components + hooks
    - pages/                # Route-level pages
    - hooks/                # Reusable custom hooks
    - styles/               # Theme, Ant Design token overrides, CSS/LESS
  - workers/                # Web worker / transport worker code
  - services/               # Independent services / facades
  - utils/                  # Utility functions (pure)
  - types/                  # Shared TypeScript types
  - tests/                  # Shared test helpers, fixtures, factories
  - main.tsx
  - router.tsx
  - index.css

2. Architectural rules
- Follow Clean Architecture separation: domain <- usecases <- adapters (infrastructure, UI).
- Domain logic must be pure and side-effect free. All I/O (localStorage, network, postMessage) goes through ports/infrastructure adapters.
- Use Dependency Injection: pass repositories/transports into usecases or via context providers.
- Keep UI layer thin: no domain logic in components.

3. Components & React rules
- Use functional components with hooks. No class components.
- Prefer named exports. Default export only for barrels (index.ts).
- Keep props minimal and descriptive. If many props, group them into a single object prop.
- Side effects belong in hooks (useEffect or custom hooks).
- Clean up subscriptions/listeners in useEffect cleanup functions.
- Use React.memo for pure presentational components where helpful.
- Use useCallback/useMemo responsibly to avoid unnecessary recomputation.

4. Naming conventions
- Components & pages: PascalCase (ChatWindow.tsx).
- Hooks: useCamelCase (useChatMessages.ts).
- Folders: kebab-case or lowerCamelCase (choose one and be consistent).
- Types and interfaces: PascalCase (Message, MessageRepository). Don’t use Hungarian prefixes (no IMessage).
- Files: component file names match component name (ChatMessage.tsx).

5. Message type (example)
- Message {
  id: string;           // UUID or unique string
  text: string;
  createdAt: string;    // ISO 8601 timestamp
  sender: 'me' | 'them' | 'system';
  metadata?: Record<string, any>;
}

6. State & storage
- Use local component state for UI-specific state; use context or a small store (e.g., Zustand) for shared state when needed.
- Wrap localStorage access in a repository (e.g., LocalMessageRepository) to allow mocking and swapping.
- For large message sets (>= 200), use virtualization (react-window or equivalent) and batch writes/reads to localStorage.

7. Performance & scalability
- Virtualize long lists (messages > 200).
- Avoid re-rendering the entire list; memoize message items and use stable keys (message.id).
- When saving many messages, write in batches and avoid synchronous blocking operations on the main thread — consider a worker for heavy serialization.

8. Message arrival & transport
- Support two arrival channels:
  - window.postMessage events (external page or iframe)
  - Transport worker (web worker) messages
- Centralize message handling in a service/hook that emits events to UI and persists via repository.
- Ensure listeners are registered once and properly cleaned up.

9. Scroll behavior
- Support scrolling to a message by ID (read from URL param).
- Behavior when id is missing/invalid: show normal view and optionally show toast or no-op.
- Ensure virtualization supports scroll-to-index / scrollIntoView for the message.

10. Accessibility
- Provide aria-label and accessible names for interactive elements (chat input, send button, message list).
- Ensure keyboard navigation focus order is logical.
- Test for screen-reader friendliness where possible.

11. Security
- Treat all incoming messages as untrusted. Don’t dangerously set innerHTML to external content.
- Escape/sanitize any rich content before rendering.

12. Testing
- Unit tests: React Testing Library + Vitest/Jest. Test hooks, usecases, and presentational behavior.
- Integration/E2E: Playwright for flows (send message, receive via postMessage/worker, load 1000 messages, scroll-to-id).
- Mock infrastructure adapters (LocalMessageRepository, Worker) for unit tests.

13. Linting & formatting
- Use ESLint with TypeScript and Prettier integration.
- Add Husky + lint-staged to run tests/linters on pre-commit.
- Do not commit code that fails linting or tests.

14. Commit messages
- Use Conventional Commits: type(scope): subject
  - Examples:
    - feat(chat): add message virtualization
    - fix(worker): unregister event listener on unmount
    - test(chat): add unit tests for scroll-to-id

15. Code review expectations
- Small, focused PRs.
- Include a short PR description with reasoning and acceptance criteria.
- Add test coverage for new features and edge cases.

16. Documentation
- Add README for non-trivial modules (workers, transport).
- Document public hook/usecase APIs and invariants.

17. Edge cases to consider
- Empty message text (trim and validate).
- Duplicate ids.
- Extremely long messages (wrap/ellipsize).
- Offline persistence and recovery.

18. Example third-party libs to consider
- UI: antd
- Virtualization: react-window or @tanstack/react-virtual
- Worker helpers: comlink (optional)
- Small state: Zustand (optional)
```