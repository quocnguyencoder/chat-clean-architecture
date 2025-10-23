# PR Title (conventional commits): e.g. feat(chat): add scroll-to-message-by-id

## Summary
- Short description of change (1-2 sentences).
- Which requirement(s) this PR addresses.

## Acceptance criteria
- [ ] Chat UI shows new message in main area and left nav.
- [ ] Message arrival via postMessage and worker are both handled.
- [ ] Scroll-to-message-by-id works.
- [ ] Large message set handled (virtualized / responsive).
- [ ] Unit tests added for core logic.
- [ ] Playwright test cases added or updated.

## Checklist for reviewers / AI
- Run lint & tests locally or rely on CI:
  - npm run lint
  - npm run test:unit
  - npm run test:e2e
- Use AI_CODE_REVIEW_GUIDELINES.md (repo root) as review policy.
- When leaving comments, include file path + short remediation steps.

## Notes
Add any design notes, tradeoffs, or special instructions here.