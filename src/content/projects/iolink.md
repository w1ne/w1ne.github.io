---
name: iolinki
summary: Hardware-agnostic IO-Link Device stack for Zephyr and bare-metal systems.
status: Open-source/commercial project
repoUrl: https://github.com/w1ne/iolinki
topics:
  - IO-Link
  - Zephyr
  - bare metal
proofPoints:
  - Keeps protocol logic hardware-independent behind a PHY abstraction.
  - Uses a virtual PHY and Python master simulation for CI tests.
  - Targets static allocation and bounded execution for embedded systems.
featuredNotes:
  - iolinki
---

## What it is

iolinki is an IO-Link Device stack designed around hardware independence and testability. It targets Zephyr RTOS and bare-metal embedded systems through a clean PHY abstraction.

## Why it matters

The project focuses on portable protocol behavior, mock-based tests, virtual verification before hardware integration, and static memory for predictable embedded execution.

## Links

- [Repository](https://github.com/w1ne/iolinki)
