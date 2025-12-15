# Test Generation for GitHub Copilot

> Generate comprehensive unit tests from your code

## Prompt

```
// Generate tests for this function/component
// Framework: [Jest/Vitest/React Testing Library]
// Include:
// - Happy path tests
// - Edge cases (null, undefined, empty)
// - Error scenarios
// - Async behavior if applicable
// - Mock external dependencies

// Example test structure:
describe('[FunctionName]', () => {
  describe('when given valid input', () => {
    it('should return expected output', () => {})
  })
  
  describe('when given invalid input', () => {
    it('should throw/return error', () => {})
  })
  
  describe('edge cases', () => {
    it('should handle empty input', () => {})
    it('should handle null/undefined', () => {})
  })
})
```

## Usage

- **Best for:** GitHub Copilot
- **Category:** Testing
- **Difficulty:** Beginner

## Tips

- Place this comment above your function
- Copilot will generate test scaffolding
- Tab through suggestions to accept
- Works best in .test.ts files

## Author

- [Lovable Directory](https://lovable.directory)
