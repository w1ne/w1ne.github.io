---
name: LabWired
order: 1
image: /images/projects/labwired.png
summary: Deterministic firmware simulation for Cortex-M and RISC-V targets, built for CI, local debugging, and AI-assisted firmware work.
status: Open-source project
repoUrl: https://github.com/w1ne/labwired-core
topics:
  - firmware simulation
  - Cortex-M
  - RISC-V
  - CI
  - AI agents
featuredNotes:
  - labwired-core
---

LabWired Core is a Rust engine that boots firmware on a virtual ARM Cortex-M or RISC-V target, with no board plugged in. You hand it an ELF and a bit of YAML describing the peripherals, and it runs the firmware deterministically — same input, same trace, every time.

The reason it exists is that hardware-dependent firmware is painful to put in CI and painful for AI tools to look at. With a virtual target you get reproducible traces and reports, plus the usual GDB and Debug Adapter Protocol access when you want to step through something by hand.

- [Website and docs](https://labwired.com)
- [Repository](https://github.com/w1ne/labwired-core)
