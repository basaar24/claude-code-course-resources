# Commands, Shortcuts & Settings Cheat Sheet

![Cheat sheet](./claude-code-cli-settings-cheat-sheet.jpg)

Claude Code has a long list of supported [CLI commands & flags](https://code.claude.com/docs/en/cli-reference), [shortcuts](https://code.claude.com/docs/en/interactive-mode) and [settings](https://code.claude.com/docs/en/settings).

In my experience, the defaults are fine for most cases, except for permissions (e.g., prevent access to `.env` or similar files) or sandboxing - hence my more detailed coverage in the past videos.

But here's a short list of commands and settings you should be aware of. Many of them were or will be covered in the course lectures, too.

CLI Commands & Flags
For all available commands and flags, see the [official docs](https://code.claude.com/docs/en/cli-reference).

``claude`` / ``claude "my prompt"`` => Start a new Claude Code session, optionally with an initial prompt.

``claude -p "my prompt"`` => Query Claude Code with "my prompt" and quit session once it's done (no ongoing session).

``claude -c`` => Continue most recent session.

``claude --agent DocsExplorer`` => Start a new session with a custom agent (instead of the default one). Custom agents will be covered later in the course.

``claude --allowedTools "Read" "Write"`` => Skip permission confirmation dialog for specified permissions.

``claude --disallowedTools "Write"`` => Disallow certain tools (specified tools are removed from Claude Code's context => it doesn't know about them).

``claude --dangerously-skip-permissions`` => Skip ALL permissions confirmation dialogs. Use with great caution!

``claude --append-system-prompt "Always check if redundant code can be deleted"`` => Append an instruction to the default system prompt. Can be used as session-specific alternative to instructions placed in CLAUDE.MD (CLAUDE.MD will be covered later).

``claude --model opus`` => Sets the default model for the current session. Can be changed in the session via ``/model``, or generally via settings (see below). For valid options, see the [official list](https://code.claude.com/docs/en/model-config#model-aliases).

``claude --permission-mode plan`` => Start in plan mode (default is "default" mode where Claude Code asks for permissions). For available options, see the official list. "Plan" mode will be covered later.

``claude --remote "Add dark mode"`` => Start a remote (web) session (will be covered later in the course).

``claude --system-prompt "You are a React.js expert"`` => Replace the entire default system prompt with a custom one.

## Claude Code Interaction
When inside a Claude Code session, you can use the following shortcuts for additional control. For all available shortcuts and commands, see the [official docs](https://code.claude.com/docs/en/interactive-mode).

``SHIFT + ENTER`` / ``OPTION + ENTER`` / ``CTRL + J`` => Enter new line. Exact command depends on platform and terminal software used.

``SHIFT + TAB`` => Switch through different modes ("default", "write permissions", "plan").

``CTRL + C`` => Cancel current input or generation.

``ESC`` => Cancel current generation (can be used to inject a new prompt into an ongoing task).

``ESC + ESC`` => Restore the code prior to the last action performed by Claude Code.

``OPTION + P`` / ``ALT + P`` => Switch model. Alternative to /model which can be useful if you already entered a prompt.

``ARROW`` keys (left / right / top / down) => Cycle through options or questions (left / right) or past message (up / down).

``CTRL + O`` => Toggle verbose output (more / less details).

``CTRL + B`` => Move task to background. Important: Claude Code also automatically moves tasks (e.g., exploration tasks) to the background and it's typically quite smart about that.

``CTRL + V`` / ``CMD + V`` / ``ALT + V`` => Insert text or image into prompt. The exact shortcut depends on your platform and terminal.

``CTRL + O`` => Toggle verbose output (more / less details).

## Crucial Commands
``/help`` => List available commands and get usage help.

``/model`` => Choose the active model for the current session.

``/clear`` => Clear session context window (i.e., start a new session, effectively).

``/compact`` => Compact (summarize) current session context history and clear it thereafter.

``/config`` => Open interactive settings menu.

``/context`` => View statistics about current context window & context usage.

``/usage`` => View current usage for your active plan (i.e., how much usage remains until the next reset). For more details about plans and usage, see the official help pages.

``/init`` => Analyze project and create initial CLAUDE.MD file (covered later).

``/mcp`` => View and manage installed MCP servers.

``/permissions`` => View and update / change permissions.

``/rewind`` => Rewind (undo) to earlier point in conversation, same as ESC + ESC.

``/statusline`` => Configure the Claude Code status line.

``/teleport`` => Resume a remote Claude Code session (covered later).

## Settings
You can configure (project-specific) settings also interactively via ``/settings``. Or in your global, project-specific or local (non-Git-controlled) ``settings.json`` files (see past lectures).

For all available settings, see the [official docs](https://code.claude.com/docs/en/settings).

``{ "permissions": {...} }`` => Manage permissions for all sessions. See previous lectures and official [permissions settings docs](https://code.claude.com/docs/en/settings#permission-settings).

``{ "model": "opus" }`` => Manage default AI model used for new sessions.

``{ "alwaysThinkingEnabled": true }`` => Whether to enabled "advanced thinking" mode or not. Is on by default. Turning it off will likely yield worse results.

``{ "hooks": {  } }`` => Manage hooks (covered later in the course).

``{ "env": { "IS_DEMO": 1 } }`` => Environment variables that will be applied to every session.