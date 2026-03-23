---
name: shadcn-ui
description: Guidance and integration for building React applications utilizing shadcn/ui.
---

# shadcn-ui Skill

Use this skill when combining Stitch designs with `shadcn/ui` components.

1. When writing code based on Stitch screens, prefer using pre-existing `shadcn/ui` components from the user's project (`components/ui`).
2. Map the Stitch design tokens to standard Tailwind utility classes utilized by shadcn (like `bg-primary`, `text-muted-foreground`, `ring-offset-background`).
3. If a component is missing, run `npx shadcn-ui@latest add [component]` via a terminal command with the user's permission to install it.
4. Construct complex pages by composing these primitives rather than writing custom CSS from scratch whenever possible.
