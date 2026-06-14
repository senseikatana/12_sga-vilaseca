# 🚀 Commit Mode

Professional Git commit generator following Conventional Commits specification.

## Description

This custom mode helps you create professional, standardized git commits in English. It analyzes your changes and generates appropriate commit messages following the Conventional Commits specification.

## Features

- ✅ Analyzes git changes automatically
- ✅ Generates professional commit messages in English
- ✅ Follows Conventional Commits specification
- ✅ Never pushes without explicit permission
- ✅ Shows git status after committing
- ✅ Supports all conventional commit types

## Usage

### Activate the mode

```bash
# In Bob Shell
> /commit
```

Or switch to it:

```bash
> !commit
```

### Generate a commit

Simply ask Bob to create a commit:

```bash
> Create a commit for my changes
> Make a commit
> Commit these changes
```

Bob will:
1. Check `git status`
2. Analyze `git diff`
3. Generate appropriate commit message
4. Execute the commit
5. Show the result with `git status`
6. Ask if you want to push

## Conventional Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, etc)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Build system or dependency changes
- **ci**: CI configuration changes
- **chore**: Other changes

## Examples

### Simple feature
```
feat(auth): Add JWT token validation middleware
```

### Bug fix with body
```
fix(api): Resolve CORS issue in production environment

The CORS middleware was not properly configured for production
domains. Updated the allowed origins list to include the
production frontend URL.
```

### Breaking change
```
feat(api)!: Change user authentication endpoint structure

BREAKING CHANGE: The /auth/login endpoint now returns a different
response structure. Update client applications accordingly.
```

## Rules

1. ✅ Commits are created automatically
2. ✅ Messages are always in English
3. ✅ Follows imperative mood ("Add" not "Added")
4. ✅ Subject line under 72 characters
5. ✅ No period at end of subject
6. ❌ NEVER pushes without permission

## Safety

This mode will **NEVER** push to remote repositories without your explicit permission. After committing, it will always ask if you want to push.

## Tips

- Stage your changes before asking for a commit (`git add`)
- For complex changes, Bob will add a detailed body
- You can request specific commit types: "Create a fix commit"
- Review the generated message before it's committed
