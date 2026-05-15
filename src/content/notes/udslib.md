---
title: UDSLib. Engineered Safety
description: ISO-14229 Unified Diagnostic Services stack focused on safe dispatch, transport boundaries, and debugging tools.
date: '2026-02-05'
tags:
  - UDS
  - ISO-14229
  - automotive
  - embedded
legacyUrl: https://n1n3.net/2026/02/05/udslib.html
featured: true
draft: false
---
Mechanics use Unified Diagnostic Services to talk to cars and vehicles. It is how they read fault codes, update firmware, and recalibrate sensors.

I got familiar with the protocol while working on telematics devices at [Proemion](https://proemion.com). We were updating devices, and I learned that manufacturers care less about following the standard perfectly than about following their tools.

After learning the UDS internals, I built UDSLib to enforce safety by design and release process.

> Source code: [github.com/w1ne/udslib](https://github.com/w1ne/udslib)

# ISO-14229-1 compliance

Getting the error codes right is hard. The standard has strict Negative Response Code priority rules. If a request is wrong for two reasons, such as wrong length and security locked, you must return the specific error code the standard demands.

UDSLib uses a table-driven dispatcher that follows those rules.

| NRC | Meaning |
| --- | --- |
| 0x7F | Service not supported |
| 0x12 | Sub-function not supported |
| 0x13 | Incorrect message length |
| 0x33 | Security access denied |
| 0x22 | Conditions not correct |

# Transport layer, Zephyr vs bare metal

UDS is implemented on top of ISO-TP, which breaks large messages into CAN frames.

UDSLib uses a spliced transport architecture:

- Native mode: on Zephyr, it uses the kernel's native ISO-TP sockets.
- Fallback mode: on bare metal, it uses its own static buffers and supports CAN-FD.

# Tooling ecosystem

You cannot fix what you cannot see, so I built tools around the stack:

- Wireshark dissector: a Lua script that decodes traffic and shows which service logic is executing.
- HTML dashboard: a log analyzer that generates a visual timeline of the session and highlights P2 timer violations and security changes.
- Python bindings: a `ctypes` wrapper used to fuzz-test the parser with malformed packets.

Safety in automotive firmware is about code quality, CI/CD, and architecture. UDSLib enforces those concerns in the stack and the tooling around it.
