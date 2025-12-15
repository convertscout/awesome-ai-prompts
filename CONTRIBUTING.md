# Contributing to Awesome AI Coding Prompts

Thank you for your interest in contributing! This project thrives on community contributions.

## How to Add a Prompt

### Option 1: Quick Add (via GitHub Web UI)

1. **Fork** this repository
2. Navigate to the appropriate folder in `prompts/`
3. Click **"Add file"** → **"Create new file"**
4. Name your file: `your-prompt-name.md`
5. Use the template below
6. Click **"Commit new file"**
7. Click **"Create Pull Request"**

### Option 2: Local Development

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/awesome-ai-prompts.git
cd awesome-ai-prompts

# Create a branch
git checkout -b add-my-prompt

# Add your prompt file
# Edit README.md to add entry to the table

# Commit and push
git add .
git commit -m "Add: [prompt name] for [tool]"
git push origin add-my-prompt

# Open a Pull Request
```

## Prompt Template

Use this template for new prompts:

```markdown
# [Prompt Title]

> Brief description of what this prompt does

## Prompt

\`\`\`
[Your prompt content here]
\`\`\`

## Usage

- **Best for:** [Tool name - Cursor, Claude, ChatGPT, etc.]
- **Category:** [auth, ui, api, etc.]
- **Difficulty:** [Beginner, Intermediate, Advanced]

## Example Output

[Optional: Show what the AI generates with this prompt]

## Tips

- [Any tips for getting best results]

## Author

- [@your-github-username](https://github.com/your-username)
```

## Folder Structure

```
prompts/
├── cursor/          # Cursor IDE specific
├── lovable/         # Lovable app builder
├── claude/          # Claude by Anthropic
├── chatgpt/         # ChatGPT / OpenAI
├── copilot/         # GitHub Copilot
├── gemini/          # Google Gemini
├── auth/            # Authentication prompts
├── ui/              # UI/UX prompts
├── api/             # API & backend prompts
└── performance/     # Optimization prompts
```

## Guidelines

### Do's ✅

- Write clear, tested prompts
- Include example usage
- Add appropriate tags
- Keep prompts focused on one task
- Test with the target AI tool

### Don'ts ❌

- Don't submit duplicate prompts
- Don't include API keys or secrets
- Don't submit low-effort or generic prompts
- Don't promote specific products/services

## Pull Request Checklist

- [ ] Prompt file created in correct folder
- [ ] Used the prompt template
- [ ] Added entry to README.md table
- [ ] Tested the prompt with the target AI tool
- [ ] No sensitive data included

## Questions?

Open an [issue](https://github.com/YOUR_USERNAME/awesome-ai-prompts/issues) or visit [lovable.directory](https://lovable.directory).

---

Thanks for contributing! ⭐
