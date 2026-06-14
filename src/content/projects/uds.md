---
name: LibUDS
order: 4
image: /images/projects/uds.png
summary: Portable ISO-14229 UDS stack for embedded systems.
status: Open-source/commercial project
repoUrl: https://github.com/w1ne/udslib
topics:
  - UDS
  - ISO-14229
  - embedded diagnostics
proofPoints:
  - Table-driven dispatcher follows ISO-14229 negative response priority rules.
  - Supports Zephyr native ISO-TP and bare-metal static-buffer fallback.
  - Includes debugging tools such as a Wireshark dissector, dashboard, and Python bindings.
featuredNotes:
  - udslib
---

## What it is

LibUDS is a portable Unified Diagnostic Services stack for embedded systems. It keeps the UDS application layer independent from hardware drivers, RTOS threads, and proprietary transport implementations.

## Why it matters

That separation makes the stack easier to move between bare metal prototypes, Zephyr-based devices, Linux tools, and test environments.

## Links

- [Repository](https://github.com/w1ne/udslib)
