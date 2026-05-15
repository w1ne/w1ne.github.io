---
title: LabWired Core. Deterministic Firmware Simulation for Cortex-M and RISC-V
description: Deterministic, headless firmware simulation for Cortex-M and RISC-V firmware that runs in cargo test, CI, and VS Code.
date: '2026-04-25'
tags:
  - rust
  - embedded
  - firmware
  - simulation
  - LabWired
legacyUrl: https://n1n3.net/2026/04/25/labwired-core.html
featured: true
draft: false
---
Every embedded project I have consulted on hits the same wall. The hardware shows up late. The first prototypes are fragile. CI cannot test firmware in PRs because there is no board attached.

I have wanted to fix that workflow for years. LabWired Core is my answer, a deterministic, headless firmware simulator that runs in `cargo test`, in CI, and inside VS Code.

> Website and docs: [labwired.com](https://labwired.com)
>
> Source code: [github.com/w1ne/labwired-core](https://github.com/w1ne/labwired-core)

# What it is

LabWired Core is a Rust execution engine that boots an ELF binary on a virtual ARM Cortex-M or RISC-V target, drives the peripherals declared in YAML, and produces a bit-exact, reproducible trace.

```sh
labwired test --script examples/ci/uart-ok.yaml --output-dir results
```

The same engine runs three roles:

- Local development: single-step in VS Code via DAP, or `gdb-multiarch` over RSP.
- CI gate: JSON/JUnit reports on every PR, no hardware required.
- Catalog validation: full sweep across supported boards to verify ISA and peripheral coverage.

# Architecture decisions

## CPU as a trait, bus as a trait

The execution loop is generic over a `Cpu` trait. Adding a new architecture means implementing `reset` and `step`, not patching the engine.

Today the project ships a Thumb-2 decoder for ARMv7-M and an RV32I core. Adding ARMv8-M or RV32IMAC is localized inside that crate; the rest of the engine does not move.

## Peripherals as MMIO plus `tick`

Peripherals implement a single trait: read, write, tick. The CPU is never allowed to mutate a peripheral mid-instruction. This is what makes the engine deterministic: same ELF, same YAML, same input, byte-identical trace.

Peripherals are described in YAML, not C glue:

```yaml
external_devices:
  - id: "temp_sensor"
    type: "tmp102"
    connection: "i2c1"
    config:
      i2c_address: 0x48
```

That short file is enough to wire a TMP102 sensor onto an STM32F103's I2C1 in simulation.

## Two speed modes

For autonomous fuzzing and large CI matrices, raw cycles-per-second matters. For real-time firmware, cycle accuracy matters. LabWired exposes both through `SimulationConfig`.

- Fast mode: instruction decode cache, multi-byte bus fast-path, batched peripheral ticks.
- Strict mode: `peripheral_tick_interval = 1`, caches off.

## Standard debug protocols, no lock-in

The engine speaks two debugger protocols out of the box:

- GDB Remote Serial Protocol via the `labwired-gdbstub` crate.
- Debug Adapter Protocol via `labwired-dap`.

# Why this matters

The firmware industry still treats simulation as a poor cousin of hardware-in-the-loop. LabWired Core applies deterministic local tooling to MCU firmware: bit-identical, headless, and scriptable.

```sh
curl -fsSL https://labwired.com/install.sh | sh
```
