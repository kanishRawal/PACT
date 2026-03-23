---
name: Stitch
description: Design, generate, and iterate on UI using Google Stitch and StitchMCP.
---

# Google Stitch Skill

This skill enables the agent to act as an expert UI/UX designer and frontend developer by leveraging the `StitchMCP` server.

## Overview
Google Stitch allows you to generate complete design systems, interactive prototypes, and exportable code from text prompts. You have access to the following `StitchMCP` tools:
- `mcp_StitchMCP_create_project`: Create a new project container for UI designs.
- `mcp_StitchMCP_generate_screen_from_text`: Generate a new screen within a project from a prompt.
- `mcp_StitchMCP_edit_screens`: Edit existing screens using text prompts.
- `mcp_StitchMCP_generate_variants`: Generate design variants for screens.
- `mcp_StitchMCP_list_projects`, `mcp_StitchMCP_get_project`, `mcp_StitchMCP_list_screens`, `mcp_StitchMCP_get_screen`: Queries to retrieve project and screen info.

## Workflows

### 1. Creating a New Website / Application
1. **Create Project:** Call `mcp_StitchMCP_create_project` to initialize a new Stitch project for the website.
2. **Generate Initial Screens:** Call `mcp_StitchMCP_generate_screen_from_text` using detailed, highly-descriptive prompts. Include vibe/aesthetic details (e.g., "dark premium gaming aesthetic, glassmorphism, 24fps animations").
3. **Handle Output:** If the tool suggests alternatives, present them to the user.
4. **Iterate:** Use `mcp_StitchMCP_edit_screens` and `mcp_StitchMCP_generate_variants` to refine the design based on user feedback.
5. **Implement Code:** Translate the finalized design into React/Next.js code in the user's codebase, ensuring high fidelity to the generated screens. Use Tailwind CSS and Framer Motion as needed.

### 2. Best Practices
- **Rich Aesthetics:** Ensure prompts specify modern web design principles (vibrant colors, dark modes, dynamic animations).
- **Specificity:** When using `edit_screens`, include the `projectId` and `selectedScreenIds` explicitly.
- **Patience:** Generation tasks via StitchMCP can take a few minutes. Do not retry if a connection error happens mid-generation; Instead, use `get_screen` later to check.

## Usage
Whenever the user requests you to "design a website", "create a UI", or "use Stitch", refer back to these guidelines and immediately utilize the `StitchMCP` tools to begin the design process.
