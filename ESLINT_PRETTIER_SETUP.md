# ESLint and Prettier Setup Guide

This project is configured with ESLint and Prettier for code quality and formatting, along with Husky for pre-commit hooks.

## What's Configured

### ESLint

- TypeScript support with `@typescript-eslint`
- React and React Hooks linting
- JSX accessibility rules (`jsx-a11y`)
- Import order enforcement
- Code quality rules (no console warnings, prefer const, etc.)
- Prettier integration

### Prettier

- Consistent code formatting
- Single quotes for strings
- Semicolons enforced
- 2-space indentation
- Line width of 80 characters

### Husky + lint-staged

- Pre-commit hooks that run linting and formatting
- Only processes staged files for performance
- Prevents commits with linting errors

## Available Scripts

```bash
# Lint all TypeScript files
npm run lint

# Lint and auto-fix issues
npm run lint:fix

# Format all source files
npm run format

# Check if files are properly formatted
npm run format:check

# Type check without emitting files
npm run type-check
```

## Pre-commit Hook

The pre-commit hook automatically runs:

1. ESLint with auto-fix on staged `.ts` and `.tsx` files
2. Prettier formatting on staged files

If there are unfixable linting errors, the commit will be blocked.

## VS Code Integration

The project includes VS Code settings that:

- Format on save with Prettier
- Run ESLint auto-fix on save
- Organize imports automatically
- Show ESLint problems in the Problems panel

### Recommended Extensions

Install these VS Code extensions for the best experience:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- TypeScript Next (`ms-vscode.vscode-typescript-next`)

## Configuration Files

- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to ignore for formatting
- `.husky/pre-commit` - Pre-commit hook script
- `.vscode/settings.json` - VS Code editor settings
- `package.json` - lint-staged configuration

## Troubleshooting

### Linting Errors

If you see linting errors:

1. Try running `npm run lint:fix` to auto-fix issues
2. For unfixable errors, manually address them
3. You can temporarily disable specific rules with `// eslint-disable-next-line rule-name`

### Formatting Issues

If formatting seems inconsistent:

1. Run `npm run format` to format all files
2. Check that VS Code is using Prettier as the default formatter
3. Ensure the Prettier extension is installed and enabled

### Pre-commit Hook Not Running

If the pre-commit hook isn't working:

1. Ensure Husky is installed: `npm run prepare`
2. Check that `.husky/pre-commit` file exists and is executable
3. Verify `lint-staged` configuration in `package.json`

## Customization

To modify linting rules, edit `eslint.config.js`.
To change formatting options, edit `.prettierrc`.
To adjust pre-commit behavior, modify the `lint-staged` section in `package.json`.
