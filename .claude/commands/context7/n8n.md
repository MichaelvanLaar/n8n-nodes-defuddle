---
name: Context7: n8n
description: Pull n8n documentation for context
category: Context7
tags: [context7, n8n, documentation]
---

You are working on an n8n community node project. The user wants additional context from official n8n documentation.

**Task:**
1. Use the Context7 MCP tool to fetch documentation from:
   - https://context7.com/n8n-io/n8n-docs

2. If the user provided a specific topic (e.g., "node development", "credentials", "IExecuteFunctions", "parameters"), focus your query on that topic.

3. If no topic was provided, fetch general n8n documentation that's relevant to the current task or conversation (e.g., community node development, node structure, testing).

4. After retrieving the documentation, briefly summarize what context you've loaded (e.g., "Loaded n8n docs for IExecuteFunctions interface and node parameter definitions").

5. Continue with the original task/conversation using this additional context.

**Context7 Usage:**
- Use `resolve-library-id` to find the correct library ID if needed
- Use `get-library-docs` with the resolved library ID
- Set appropriate token limits based on the scope (5000-10000 tokens for specific topics, 3000-5000 for general context)

**Note:** This command is designed to be used when:
- Developing or maintaining n8n community nodes
- Working with n8n APIs (IExecuteFunctions, INodeType, INodeProperties, etc.)
- Troubleshooting node-related issues
- Implementing node features that need API verification
- Understanding n8n conventions, best practices, or node structure
- Working with credentials, webhooks, or polling triggers
- Checking for API changes or updated patterns
