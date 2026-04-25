---
layout: single
title: "Darktable MCP. Letting Claude Drive Your Photo Library"
blogid: projects
sticky: false
published: true
author: Andrii Shylenko
date: 2026-04-25
tags: [mcp, darktable, python, ai, photography, open source]
header:
  overlay_filter: 0.5
toc: true
toc_label: "Contents"
toc_icon: "camera"
---

I shoot a lot of RAW and darktable is my editor of choice. The problem is the workflow. After a long shoot, I have hundreds of files to triage, rate the keepers, fix the underexposed ones, push the rest into export folders. It is the kind of repetitive task that I'd rather describe in a sentence than click through one by one.

So I built **darktable-mcp**, a Model Context Protocol server that lets Claude (or any MCP-compatible assistant) drive my darktable library directly.

> **Source Code**: [github.com/w1ne/darktable-mcp](https://github.com/w1ne/darktable-mcp)

# What It Does

The server exposes a small, opinionated set of tools to the LLM:

*   `view_photos` — Browse the library with rating and tag filters.
*   `rate_photos` — Apply 1–5 star ratings, single shot or in batch.
*   `import_batch` — Pull files from a directory, optionally recursive.
*   `adjust_exposure` — Bump exposure in EV stops (-5.0 to +5.0).
*   `apply_preset` — Apply named editing presets.
*   `export_images` — Export to JPEG, PNG, or TIFF at a chosen quality.

The interaction looks like this:

> "Claude, rate my landscape photos from last week 4 stars."

> "Adjust exposure +0.5 on all underexposed sunset photos."

> "Import everything from /media/sdcard and organize by date."

# Design Decisions

## 1. Use the Official Lua API

There are plenty of ways to poke at darktable's SQLite library directly. None of them are safe. `darktable-mcp` integrates through darktable's own scripting layer, the same one users already script their own automations with. If darktable's developers say a thing is allowed, the MCP server can do it. Anything else is out of scope.

## 2. Strict Tool Schemas

Every tool is declared with a JSON Schema (rating bounds 1–5, exposure clamped to ±5 EV, format restricted to a known enum). The LLM cannot invent a 9-star rating or an exotic export format. The schema is the contract.

```python
Tool(
    name="adjust_exposure",
    description="Adjust exposure settings for photos",
    inputSchema={
        "type": "object",
        "properties": {
            "exposure_ev": {
                "type": "number",
                "minimum": -5.0,
                "maximum": 5.0,
            },
            # ...
        },
        "required": ["exposure_ev"],
    },
)
```

## 3. Stdio Transport

The server runs over stdio, which is what Claude Desktop expects. No HTTP, no auth headache, no port conflicts. Add it to `~/.claude_desktop_config.json` and it shows up the next time the client starts:

```json
{
  "mcpServers": {
    "darktable": {
      "command": "python",
      "args": ["-m", "darktable_mcp"]
    }
  }
}
```

# Why MCP

Most photo-editing automation tools live in one of two boxes, either a clunky scripting language nobody wants to learn, or a SaaS that uploads your shots to the cloud. MCP gives you a third option, your assistant talks to your local tools, your photos never leave the machine.

This is also why I am keeping the surface small on purpose. Six tools that are well typed and predictable beat sixty that are half-broken.

# Status

The project is in early beta (v0.1.0). The tool schemas are stable, the Lua bridge is being filled in. If you shoot RAW, run darktable on Linux, and want to script your culling workflow with an LLM, I'd love your feedback.

`pip install darktable-mcp`, point your MCP client at it, and let me know what tool you reach for next at andrii@shylenko.com.
