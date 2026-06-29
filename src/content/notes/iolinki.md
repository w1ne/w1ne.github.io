---
title: iolinki. Hardware-Agnostic IO-Link Device and Master Stacks
description: Hardware-agnostic IO-Link device and master stacks with virtual PHY testing, static memory, and Zephyr integration.
date: '2026-02-05'
tags:
  - IO-Link
  - industrial automation
  - embedded
  - Zephyr
legacyUrl: https://n1n3.net/2026/02/05/iolinki.html
featured: true
draft: false
---

I developed IO-Link devices when I was working at [IFM](https://www.ifm.com/). I still remember crafting IODDs by hand. And I was wondering how hard will it be to build a stack for it by myself? The industrial automation world is standardizing on IO-Link (IEC 61131-9). Yet, there were no open-source full-featured IO-Link stacks to support it. So here it is.

I built **iolinki** to prove that an industrial bus stack can and SHOULD be modern, testable, and completely decoupled from hardware. It started as the device side of the link; there is now also a separate **iolinki-master** stack for the master side.

> **Source Code**: [github.com/w1ne/iolinki](https://github.com/w1ne/iolinki)
> **Master Stack**: [github.com/w1ne/iolinki-master](https://github.com/w1ne/iolinki-master)

# Two Stacks, One Protocol Boundary

`iolinki` remains the IO-Link **Device** stack. It is the code that runs in sensor or actuator firmware, exposes process data, serves mandatory parameters, raises events, and integrates with Zephyr or bare-metal applications through a PHY abstraction.

`iolinki-master` is the IO-Link **Master** stack. It is a separate C library with an instance-based API for master ports and multi-port controllers. It drives wake-up, startup, preoperate, cyclic process-data exchange, ISDU reads and writes, SIO DI/DQ modes, timing, diagnostics, and device-info validation.

Keeping these roles split matters. The device stack has a simple `iolink_init()` / `iolink_process()` shape for embedded firmware. The master stack needs caller-owned port/controller instances, stricter scheduling, diagnostics, and explicit port modes. They share narrow protocol helpers such as CRC and frame encode/decode, but the master is not bolted into the device API.

# Key Architecture Decisions

## 1. Hardware Independence

Both stacks take an approach of **Pure Abstraction**. No hardware specific code is in the protocol core.

The stack interacts with the hardware *solely* through a `iolink_phy_api_t` structure of function pointers.

```c
typedef struct {
    int (*init)(void);
    int (*set_mode)(iolink_mode_t mode);
    int (*send_byte)(uint8_t byte);
    int (*read_byte)(uint8_t *byte);
    // ...
} iolink_phy_api_t;
```

This boundary means the protocol logic cannot access hardware registers. Because of that, we can implement the best solution to fast and safe development, **Simulation**.

## 2. Test-Driven Development (TDD)

We use the PHY in Linux as an interface between the IO-Link device and master sides. `iolinki` was first developed using a **Virtual PHY** that pipes data to a Python-based IO-Link Master simulation (`tools/virtual_master`). With `iolinki-master`, the same style of test can exercise the device stack against a real C master implementation too.

This allows us to run **automated conformance tests** in a CI/CD pipeline (GitHub Actions) without a single piece of real hardware connected.

### Conformance Coverage
We validate against IO-Link V1.1.5 specification requirements.
*   **State Machine**
    All transitions (Startup → Preoperate → Operate).
*   **Timing**
    Cycle times and wake-up pulses measured to microsecond precision in simulation.
*   **ISDU**
    Mandatory identity and service paths on the device side, plus master-side read/write APIs and verification flows.
*   **Error Injection**
    We inject CRC errors and timeouts to verify the stack's recovery logic.

## 3. Zero dynamic memory safety

`iolinki` and `iolinki-master` use **static memory allocation**.
*   **No `malloc`/`free`**. All buffers are allocated at compile time.
*   **Deterministic Execution**. The device `iolink_process()` loop and the master tick/process APIs are designed around bounded work. This makes them safe for real-time control loops.

## 4. Zephyr RTOS Integration

While the core runs bare-metal, `iolinki` can be used on Zephyr.
*   **Logging**. Uses Zephyr's logging subsystem for transparent debugging.
*   **Shell**. Exposes stack status and statistics via the Zephyr console.

# Technical Deep Dive

The heart of the stack is the Data Link Layer (DLL) state machine. It handles "M-Sequence" exchange.

1.  **STARTUP** The stack waits for the Wake-Up pulse (WURQ).
2.  **PREOPERATE** The Master requests parameters (MinCycleTime, FrameCapability) at 230.4 kbaud (COM3) or lower.
3.  **OPERATE** The stack enters the cyclic Process Data (PD) exchange.

This transition logic is tricky due to strict timing requirements (e.g., specific response windows). We use unit-testing for the state machine with `cmocka` to ensure that edge cases—like a Master dropping out mid-handshake—are handled correctly.

`iolinki` uses modern software engineering standards such CI/CD, TDD, and modular architecture. The goal is not only to build IO-Link devices, but to test full IO-Link conversations where a real device stack talks to a real master stack before any silicon is involved. If you want to build a sensor, actuator, or master-side tool, find me at andrii@shylenko.com.
