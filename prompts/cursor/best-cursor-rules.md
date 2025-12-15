# Best Cursor Rules for AI Coding

> Top 10 guidelines for maximizing productivity with Cursor IDE in 2025

## Prompt

```
Based on analysis of 100+ rules from PromptHub and GitHub repos:

Modular Code: "Prefer functional components; break into <300-line files with named exports."

Error Handling: "Wrap async calls in try-catch; surface user-friendly messages via toast."

TypeScript: "Use strict mode; define explicit interfaces for all props and API responses."

Testing: "Co-locate .test files; aim for >80% coverage on business logic."

Comments: "Explain the 'why', not the 'what'. Use JSDoc for public APIs."

State Management: "Colocate state; lift only when 2+ siblings need it. Prefer React Query for server state."

Performance: "Lazy-load routes; memoize expensive computations; virtualize long lists."

Accessibility: "Semantic HTML first; ARIA only when necessary; test with screen reader."

Security: "Sanitize inputs; use parameterized queries; never trust client data."

Git Hygiene: "Atomic commits; conventional commit messages; squash before merge."
```

## Usage

- **Best for:** Cursor IDE
- **Category:** Best Practices
- **Difficulty:** Intermediate

## Tips

- Add this to your `.cursorrules` file in the project root
- Cursor will use these guidelines for all AI suggestions
- Customize rules based on your tech stack

## Author

- [Lovable Directory](https://lovable.directory)
