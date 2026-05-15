---
title: Darktable MCP. Letting Claude Drive Your Photo Library
description: MCP server that exposes darktable photo workflows to local AI assistants through strict tools and schemas.
date: '2026-04-25'
tags:
  - MCP
  - darktable
  - AI
  - photography
legacyUrl: https://n1n3.net/2026/04/25/darktable-mcp.html
featured: true
draft: false
---
I shoot a lot of RAW and darktable is my editor of choice. The problem is the workflow. After a long shoot, there are hundreds of files to triage, rate, adjust, and export.

That is the kind of repetitive task I would rather describe in a sentence than click through one by one. So I built darktable-mcp, a Model Context Protocol server that lets Claude or any MCP-compatible assistant drive my darktable library directly.

> Source code: [github.com/w1ne/darktable-mcp](https://github.com/w1ne/darktable-mcp)

# What it does

The server exposes a small, opinionated set of tools to the LLM:

- `view_photos`: browse the library with rating and tag filters.
- `rate_photos`: apply 1-5 star ratings, single shot or in batch.
- `import_batch`: pull files from a directory, optionally recursive.
- `adjust_exposure`: bump exposure in EV stops.
- `apply_preset`: apply named editing presets.
- `export_images`: export to JPEG, PNG, or TIFF.

The interaction looks like this:

> Claude, rate my landscape photos from last week 4 stars.

> Adjust exposure +0.5 on all underexposed sunset photos.

> Import everything from `/media/sdcard` and organize by date.

# Design decisions

## Use the official Lua API

There are plenty of ways to poke at darktable's SQLite library directly. None of them are safe. darktable-mcp integrates through darktable's own scripting layer, the same one users already script with.

If darktable's developers say a thing is allowed, the MCP server can do it. Anything else is out of scope.

## Strict tool schemas

Every tool is declared with a JSON Schema. Rating bounds, exposure limits, and export formats are explicit. The model cannot invent a 9-star rating or an unsupported image format. The schema is the contract.

## Stdio transport

The server runs over stdio, which is what Claude Desktop expects. There is no HTTP server, auth setup, or port conflict.

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

Most photo-editing automation tools are either scripting languages few people want to learn or cloud services that upload your photos. MCP gives you a third option: your assistant talks to local tools, and your photos stay on your machine.

That is why the surface is intentionally small. Six well-typed, predictable tools beat sixty half-broken ones.
