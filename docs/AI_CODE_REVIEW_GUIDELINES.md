```markdown
# AI Code Review Guidelines — Chat App

Purpose: provide a structured checklist, prompts and example outputs so an AI reviewer can give useful, actionable feedback for PRs related to the chat application.

1. Start of review: quick summary

- Summarize the PR intent in 1–2 sentences.
- List the main files changed and which layers they touch (domain, usecase, infra, UI).

2. High-level checks

- Build and tests:
  - Does the change break the build?
  - Do unit and integration tests pass (if included)?
- Architecture boundaries:
  - Domain logic must not depend on UI or infrastructure.
  - I/O should be performed through ports/infrastructure adapters.
- Types (TypeScript):
  - Avoid unnecessary any.
  - Public APIs should have explicit types where helpful.
- Security:
  - Sanitize or escape external input before rendering.
- Accessibility:
  - Inputs, buttons, and key interactive controls should have accessible names/labels.
- Performance:
  - Lists of messages must be virtualized for large sets.
  - Heavy serialization/deserialization should not block the main thread.

3. Specific feature checks for chat app

- Message arrival:
  - Verify handlers for window.postMessage and worker messages are present.
  - Ensure listeners are registered once and cleaned up on unmount.
  - Confirm message parsing has validation and error handling.
- Dual display:
  - Verify new messages are reflected in both the main chat area and left navigation (derived state or shared store).
- Persistence:
  - LocalStorage access must be wrapped by a repository for testability.
  - Check batching/serialization strategies for many messages.
- Scroll to message by ID:
  - Confirm URL param handling and fallback when ID not found.
  - Check virtualization integration for scroll-to-index behavior.
- Large dataset:
  - Validate memory usage & render performance for 1,000+ messages.

4. Checklist (yes/no style)

- [ ] Build passes
- [ ] Lint passes and formatting correct
- [ ] Domain logic is pure
- [ ] Ports/interfaces used for I/O
- [ ] useEffect subscriptions cleaned up
- [ ] Worker and postMessage both supported & tested
- [ ] Virtualization exists for long lists
- [ ] Scroll-to-id implemented & tested
- [ ] LocalStorage access abstracted via repository
- [ ] Unit tests added for core logic
- [ ] E2E/Playwright test scenarios included

5. Severity & suggested remediation format
   For each issue found, provide:

- Location: file and approximate line range or function name.
- Problem: short description.
- Severity: Critical / High / Medium / Low.
- Suggested fix: brief code sketch or textual instructions.

6. Automated fixes policy

- Formatting and trivial lint fixes: OK to auto-suggest or auto-apply (prettier, eslint --fix).
- Behavioral or architectural changes: propose code and rationale, but do not auto-apply without human approval.
- For refactors larger than ~200 LOC, require a design note and human reviewer sign-off.

7. Example AI prompts for reviewing a PR

- "Summarize this PR and list potential regressions or breaking changes."
- "Verify domain logic does not access localStorage or window directly. If it does, list files and suggest refactor."
- "Check that worker message handling properly validates incoming data and cleans up listeners."
- "List missing tests and provide sample unit test cases for critical flows."

8. Example unit tests the AI should request or suggest

- useChatMessages hook:
  - When a message is added via addMessage(), it appears in returned state.
  - When messages are loaded from repository, the hook returns them and preserves order.
- MessageRepository:
  - Persists and retrieves messages reliably for small and large sets.
- Scroll-to-id behavior:
  - When URL has messageId param, the chat scrolls to that message; when missing, nothing breaks.

9. Example Playwright scenarios (text-based test cases)

- Send message flow:
  - Open chat page, type message, click send — message appears in main area and left nav.
- Receive via postMessage:
  - Simulate window.postMessage({ type: 'new-message', payload: {...} }) and verify UI updates.
- Receive via worker:
  - Simulate worker posting message and verify UI updates.
- Large message load:
  - Preload 1,000 messages in repository/localStorage, open chat, verify virtualization renders and UI remains responsive.
- Scroll-to-id:
  - Navigate to /chat?messageId=<id> and verify the message is brought into view.

10. How the AI should produce its review response

- Format:
  - Short summary (1–2 lines)
  - Positive notes (what's good)
  - Issues found (numbered list with location, problem, severity, suggested fix)
  - Suggested tests to add (unit + e2e)
  - Final verdict: Approve / Request changes (if request changes, list minimal changes required)
- Be concise but actionable. Include code snippets when they clarify the fix.

11. When the AI should escalate to a human

- Architectural decisions that impact many modules (e.g., switching state management approach).
- Complex security concerns or unclear requirements.
- Large refactors (> ~200 LOC) or critical production bugs.

12. Running the local checks (commands)

- Install: npm install
- Lint: npm run lint
- Format check: npm run format:check
- Unit tests: npm run test:unit
- E2E (Playwright): npm run test:e2e

13. Sample automated summary comment an AI could post on a PR
    "Summary: Adds worker transport and scroll-to-message-by-id. Positive: clear separation of UI and usecases. Issues: missing cleanup for worker event listener (high), no tests for scroll-to-id (medium). Suggested fixes: add cleanup in useEffect, add unit test for hook, and add Playwright scenario for scroll-to-id. Recommend changes required before merge."
```
