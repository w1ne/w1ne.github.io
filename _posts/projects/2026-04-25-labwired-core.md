---
layout: single
title: "LabWired Core. Deterministic Firmware Simulation for Cortex-M and RISC-V"
blogid: projects
sticky: false
published: true
author: Andrii Shylenko
date: 2026-04-25
tags: [rust, firmware, simulation, cortex-m, risc-v, embedded, ci/cd, open source]
header:
  overlay_filter: 0.5
toc: true
toc_label: "Contents"
toc_icon: "microchip"
---

Every embedded project I have consulted on hits the same wall. The hardware shows up late. The first prototypes are fragile. CI cannot test firmware in PRs because there is no board attached. So debugging an I2C timing bug means somebody hooks up a logic analyzer at their desk, writes a Confluence page, and the rest of the team waits.

I have wanted to fix that workflow for years. **LabWired Core** is my answer, a deterministic, headless firmware simulator that runs in `cargo test`, in CI, and inside VS Code.

> **Source Code**: [github.com/w1ne/labwired-core](https://github.com/w1ne/labwired-core)

# What It Is

LabWired Core is a Rust execution engine that boots an ELF binary on a virtual ARM Cortex-M or RISC-V target, drives the peripherals declared in YAML, and produces a bit-exact, reproducible trace.

```sh
labwired test --script examples/ci/uart-ok.yaml --output-dir results
```

The same engine runs three roles:

*   **Local dev**: single-step in VS Code via DAP, or `gdb-multiarch` over RSP.
*   **CI gate**: JSON/JUnit reports on every PR, no hardware required.
*   **Catalog validation**: full sweep across supported boards to verify ISA and peripheral coverage.

# Architecture Decisions

## 1. CPU as a Trait, Bus as a Trait

The execution loop is generic over a `Cpu` trait. Adding a new architecture means implementing `reset` and `step`, not patching the engine.

```rust
pub trait Cpu {
    fn reset(&mut self, bus: &mut dyn Bus) -> SimResult<()>;
    fn step(
        &mut self,
        bus: &mut dyn Bus,
        observers: &[Arc<dyn SimulationObserver>],
        config: &SimulationConfig,
    ) -> SimResult<()>;
}
```

Today the project ships a Thumb-2 decoder (ARMv7-M) and an RV32I core. Adding ARMv8-M or RV32IMAC is a localized job inside that crate, the rest of the engine doesn't move.

## 2. Peripherals as MMIO + `tick`

Peripherals implement a single trait, read, write, tick. The CPU is never allowed to mutate a peripheral mid-instruction. This is what makes the engine *deterministic*, same ELF + same YAML + same input = byte-identical trace.

```rust
pub trait Peripheral {
    fn read(&self, offset: u64) -> SimResult<u8>;
    fn write(&mut self, offset: u64, value: u8) -> SimResult<()>;
    fn tick(&mut self) -> PeripheralTickResult;
}
```

Peripherals are described in YAML, not C glue:

```yaml
# system.yaml
external_devices:
  - id: "temp_sensor"
    type: "tmp102"
    connection: "i2c1"
    config:
      i2c_address: 0x48
```

That short file is enough to wire a TMP102 sensor onto an STM32F103's I2C1 in simulation. The firmware uses standard RCC/GPIO/I2C registers, the bus routes the access to the virtual TMP102 model.

## 3. Two Speed Modes

For autonomous fuzzing and large CI matrices, raw cycles-per-second matters. For real-time firmware, *cycle accuracy* matters. LabWired exposes both via `SimulationConfig`:

*   **Fast mode**: instruction decode cache, multi-byte bus fast-path, batched peripheral ticks. Good for property-based tests and replays.
*   **Strict mode**: `peripheral_tick_interval = 1`, caches off. Good for verifying timing-sensitive drivers.

## 4. Standard Debug Protocols, No Lock-In

The engine speaks two debugger protocols out of the box:

*   **GDB Remote Serial Protocol** via the `labwired-gdbstub` crate, so any `gdb-multiarch` setup attaches with no special tooling.
*   **Debug Adapter Protocol** via `labwired-dap`, so VS Code gets a first-class experience, registers, call stack, breakpoints, and a custom telemetry stream for cycle/MIPS counters.

If you outgrow LabWired, your debug workflow stays.

# Why This Matters

The firmware industry still treats simulation as a poor cousin of hardware-in-the-loop. But every other branch of software has spent the last decade building deterministic local tooling so CI can catch bugs before they reach a human. LabWired Core is the same idea applied to MCU firmware, bit-identical, headless, scriptable.

The roadmap is public, multicore, fault-injection API, and ISO 26262 tool-qualification readiness. If you build firmware and would like to stop waiting for boards, the install is one line:

```sh
curl -fsSL https://labwired.com/install.sh | sh
```

If you want to onboard a board, port a peripheral, or just compare notes, find me at andrii@shylenko.com.
