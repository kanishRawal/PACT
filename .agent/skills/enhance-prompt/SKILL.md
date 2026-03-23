---
name: enhance-prompt
description: Refines general UI prompts into more specific, Stitch-optimized design instructions.
---

# enhance-prompt Skill

When the user gives a vague design prompt (e.g., "Make a login page"), use this skill before passing it to `mcp_StitchMCP_generate_screen_from_text`.

## Enhancement Checklist:
1. **Mood & Vibe:** Add specific adjectives (e.g., "modern, sleek, dark premium aesthetic, minimalist").
2. **Color Profile:** Suggest specific palettes (e.g., "monochrome with neon blue accents").
3. **Layout Patterns:** Specify structural details ("split view with an illustration on the left and login form on the right").
4. **Interaction Hints:** Include notes about animations ("soft glassmorphism blur, subtle hover elevation on buttons").
5. Output the enhanced prompt back to the user or directly use it with the Stitch tools for a better result.
