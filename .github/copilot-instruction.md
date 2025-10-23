```markdown
# GitHub Copilot Instructions — Chat App (Clean Architecture)

Purpose
- Provide explicit, machine-readable instructions and policies for Copilot (or any AI assistant acting as a code reviewer / code helper) when interacting with this repository.
- Ensure Copilot's suggestions and automated changes follow the project's Clean Architecture, testing, linting, and security requirements.

Scope
- These instructions apply when Copilot is asked to:
  - Review diffs or pull requests.
  - Propose patches, create files, or suggest refactors.
  - Generate test cases, Playwright scenarios, or CI config.
  - Auto-fix lint/format issues.
- They do NOT authorize Copilot to merge PRs or push behavioral changes without explicit human approval.

Files to read first (priority)
1. CODE_CONVENTIONS.md (repo root) — coding style, architecture, naming, folder layout.
2. AI_CODE_REVIEW_GUIDELINES.md (repo root) — review checklist, severity levels, comment templates.
3. .github/PULL_REQUEST_TEMPLATE.md — required PR metadata and acceptance criteria.
4. .eslintrc.cjs & .prettierrc — lint/format rules to follow for any code changes.
5. src/ports/** and src/infrastructure/** — I/O boundaries (localStorage, workers, transports).
6. src/tests/** and e2e/** — how tests are organized; use these when proposing new tests.

Behavior & Rules for Copilot
- Prioritize architecture boundaries:
  - Do not introduce domain logic inside UI components.
  - All I/O must go through `ports` and `infrastructure` adapters.
- Use Dependency Injection patterns for repositories/transports; prefer interfaces in `src/ports`.
- Favor TypeScript typed outputs. Avoid using `any` unless a short-term shim is necessary and clearly marked with a TODO comment.
- Respect existing naming conventions and file organization described in CODE_CONVENTIONS.md.
- Always include unit tests (Vitest + RTL) for new logic and Playwright scenarios for integration flows when relevant.
- Accessibility: annotate interactive elements with aria-labels where applicable.

What Copilot may do automatically
- Auto-apply formatting (Prettier) and trivial ESLint --fix fixes on staged files.
- Propose code snippets, test templates, or new files as patch suggestions in PR comments.
- Suggest or generate unit tests and e2e test skeletons, but do not enable/merge them automatically.
- Provide concise PR review comments following the AI_CODE_REVIEW_GUIDELINES.md format: summary, positives, issues (location, severity, suggested fix), tests to add, final verdict.

What Copilot must NOT do automatically
- Do not merge a PR or push behavioral changes that affect architecture or runtime behavior without a human reviewer accepting the PR.
- Do not change CI workflow semantics (e.g., remove checks or disable steps) without explicit human instruction.
- Do not replace secure or sensitive code (authentication/keys) or insert third-party dependencies without a justification note and owner approval.

Auto-fix policy
- Allowed auto-fixes:
  - Prettier formatting changes.
  - ESLint fixes that are non-behavioral (e.g., no-unused-vars removal when safe).
- Disallowed auto-fixes:
  - Any change that alters runtime behavior, data flow, security model, or architecture.
- When proposing a behavioral change, create a suggested code patch and an explanation with risk, tests required, and a human action item.

Review comment format (strict)
- Short summary (1 sentence)
- Positives (1–3 bullets)
- Issues (numbered), each with:
  - Location: file path and function/component
  - Problem: short description
  - Severity: Critical / High / Medium / Low
  - Suggested fix: brief code sketch or steps
- Suggested tests to add (unit / e2e)
- Final verdict: Approve / Request changes (list minimal changes to merge)

Example automated comment snippet
- "Summary: Adds worker transport and scroll-to-message-by-id. Positive: clear separation of UI/usecases. Issues: (1) Missing cleanup for worker listener in ChatContainer (High) — add return cleanup in useEffect. Tests: Add unit test for useChatMessages and Playwright case for scroll-to-id. Verdict: Request changes."

CI & Local checks
- Before proposing changes, ensure the patch respects:
  - npm run lint (ESLint)
  - npm run format:check (Prettier)
  - npm run test:unit (Vitest)
  - npm run test:e2e (Playwright) — if adding e2e tests, they must be stable and fast.
- If you cannot run tests, explicitly note that in the comment and mark the patch as "needs local validation".

Handling incoming messages / transports guidance
- Validate all external payloads before use.
- Do not use dangerouslySetInnerHTML with untrusted content.
- Ensure event listeners (window.postMessage, worker.onmessage) are registered once and cleaned up during unmount.

Escalation rules
- If a suggested change touches >200 lines, complex architecture, or security implications, mark it as "Requires human design review" and provide a short design note.
- For ambiguous requirements, create a short RFC-style comment in PR and request human clarification.

Prompt templates for humans (examples Copilot may suggest)
- "Read CODE_CONVENTIONS.md and AI_CODE_REVIEW_GUIDELINES.md. Review PR #<number>: summarize, list regressions, check ports vs infra usage, and suggest missing tests."
- "Generate a unit test for useChatMessages that verifies: addMessage -> state updated; postMessage handling -> state updated."

Repository file placement
- Place this file at repo root as `copilot-instructions.md` so any GitHub-integrated AI tooling can discover it easily.

Auditability
- Every automated suggestion should include a small rationale and a list of files changed in the suggestion to make review easy.

Versioning
- When updating these instructions, include a one-line changelog header at the top with date and summary.

---
End of Copilot instructions
```