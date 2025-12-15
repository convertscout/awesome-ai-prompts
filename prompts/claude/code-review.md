# Code Review Assistant

> Thorough code review prompts for identifying issues and improvements

## Prompt

```
Review this code with focus on:

## 1. Correctness
- Logic errors or edge cases
- Null/undefined handling
- Race conditions in async code

## 2. Security
- Input validation
- SQL injection risks
- XSS vulnerabilities
- Exposed secrets

## 3. Performance
- Unnecessary re-renders
- Missing memoization
- N+1 query patterns
- Large bundle imports

## 4. Maintainability
- Code duplication
- Complex conditionals
- Missing types
- Poor naming

## 5. Best Practices
- Error handling
- Accessibility
- Testing coverage
- Documentation

Format response as:
### Critical Issues 🔴
### Warnings 🟡
### Suggestions 🟢
### Positive Notes ✅
```

## Usage

- **Best for:** Claude
- **Category:** Code Quality
- **Difficulty:** Beginner

## Tips

- Paste your code after this prompt
- Works best with complete files or functions
- Ask follow-up questions for specific fixes

## Author

- [Lovable Directory](https://lovable.directory)
