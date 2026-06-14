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
proofPoints:
  - Boots ELF firmware on virtual ARM Cortex-M or RISC-V targets.
  - Runs headless in CI and produces reproducible traces.
  - Exposes standard GDB and Debug Adapter Protocol workflows.
featuredNotes:
  - labwired-core
---

## What it is

LabWired Core is a Rust execution engine for deterministic firmware simulation. It boots an ELF on a virtual target, drives peripherals from YAML, and makes firmware behavior reproducible without a physical board attached.

## Why it matters

Hardware-dependent firmware work is hard to put in CI and hard for AI tools to inspect. LabWired gives both engineers and agents a repeatable execution environment with traces, reports, and debugger access.

## Links

- [Website and docs](https://labwired.com)
- [Repository](https://github.com/w1ne/labwired-core)
