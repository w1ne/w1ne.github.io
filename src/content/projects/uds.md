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
featuredNotes:
  - udslib
---

LibUDS is a portable ISO-14229 (UDS) diagnostic stack for embedded systems. It keeps the UDS application layer separate from hardware drivers, RTOS threads, and the transport, so the same stack moves between bare-metal prototypes, Zephyr devices, Linux tooling, and test rigs without being rewritten each time.

The dispatcher is table-driven and follows the ISO-14229 negative-response priority rules. For transport it supports Zephyr's native ISO-TP and a bare-metal static-buffer fallback, and it ships with the debugging bits you actually end up needing — a Wireshark dissector, a dashboard, and Python bindings.

- [Repository](https://github.com/w1ne/udslib)
