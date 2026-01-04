# 🤝 Contributing Guide

Thanks for helping improve **Property Listing Frontend**!

## Branching

- `main` → production-ready
- `dev` → integration branch
- `feature/<name>` → feature branches

## Commits (Conventional Commits)

- `feat: add property filters`
- `fix: correct card spacing`
- `chore: update deps`

## Code Style

- TypeScript everywhere (typed props & state)
- TailwindCSS for styles
- Zustand for global state in `/store`
- Lint/format before PR:

```bash
npm run lint && npm run format
```

## Pull Requests

- Small, focused PRs
- Describe changes clearly
- Include screenshots for UI changes
- Ensure `build`, `typecheck`, and `lint` pass

## Testing

(Add tests when applicable)

```bash
npm run test
```
