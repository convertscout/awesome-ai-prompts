# Multi-modal Code Analysis

> Analyze screenshots, diagrams, and code together with Gemini

## Prompt

```
Analyze this [screenshot/diagram/mockup] and help me:

## If UI Screenshot:
1. Identify all UI components visible
2. Suggest React component structure
3. Recommend Tailwind classes for styling
4. Note any accessibility concerns
5. Provide implementation code

## If Architecture Diagram:
1. List all services/components shown
2. Identify data flow patterns
3. Suggest implementation approach
4. Note potential bottlenecks
5. Recommend technologies for each part

## If Error Screenshot:
1. Parse the error message
2. Identify the root cause
3. Suggest debugging steps
4. Provide fix code

## If Database Schema:
1. Validate relationships
2. Suggest indexes
3. Note normalization issues
4. Provide SQL/TypeScript types

Output format:
### Analysis
### Recommendations
### Code Implementation
```

## Usage

- **Best for:** Google Gemini
- **Category:** Analysis
- **Difficulty:** Intermediate

## Tips

- Gemini excels at image + text understanding
- Upload high-resolution screenshots
- Be specific about your tech stack
- Ask follow-up questions for details

## Author

- [Lovable Directory](https://lovable.directory)
