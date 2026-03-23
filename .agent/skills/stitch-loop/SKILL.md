---
name: stitch-loop
description: Generates an entire multi-page website layout iteratively from a single prompt.
---

# stitch-loop Skill

When the user asks to "use stitch-loop" or "build an entire website", engage in an iterative loop:

1. **Prompt Expansion:** Take the user's initial idea and expand it into a full sitemap (e.g., Home, About, Dashboard, Features).
2. **Batch Generation:** Use `mcp_StitchMCP_generate_screen_from_text` to generate screens for each page one by one. Specify high-quality aesthetics for each page ("dark mode, glass effects, highly polished UI").
3. **Review & Refine:** Present the generated screens to the user.
4. **Implementation:** Once approved, generate the corresponding routing and React components across the multiple pages.
