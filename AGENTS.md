<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Memory Rules
- When the user issues `/remember save`, the agent must summarize all recent changes and update the `memory.md` file.
- When the user issues `/remember restore`, the agent must read the `memory.md` file to restore context.
