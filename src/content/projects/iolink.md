---
name: iolinki
order: 3
image: /images/projects/iolink.png
summary: Hardware-agnostic IO-Link Device stack for Zephyr and bare-metal systems.
status: Open-source/commercial project
repoUrl: https://github.com/w1ne/iolinki
topics:
  - IO-Link
  - Zephyr
  - bare metal
featuredNotes:
  - iolinki
---

iolinki is an IO-Link Device stack built around hardware independence and testability, targeting Zephyr and bare-metal systems. The protocol logic sits behind a PHY abstraction, so the same code runs against real hardware or a virtual PHY — which means I can test it in CI against a Python master simulation before any silicon is involved.

It sticks to static allocation and bounded execution, which is what you want on a constrained embedded target where surprises at runtime are not welcome.

- [Repository](https://github.com/w1ne/iolinki)
