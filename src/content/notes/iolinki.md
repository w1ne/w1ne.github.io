---
title: iolinki. Hardware-Agnostic IO-Link Stack
description: Hardware-agnostic IO-Link stack with virtual PHY testing, static memory, and Zephyr integration.
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
I developed IO-Link devices when I was working at [ifm](https://www.ifm.com). I still remember crafting IODDs by hand, and I wondered how hard it would be to build a stack for it myself.

The industrial automation world is standardizing on IO-Link, IEC 61131-9. There were no open-source, full-featured IO-Link stacks to support that work. So I built iolinki to prove that an industrial bus stack can be modern, testable, and decoupled from hardware.

> Source code: [github.com/w1ne/iolinki](https://github.com/w1ne/iolinki)

# Key architecture decisions

## Hardware independence

iolinki takes a pure abstraction approach. No hardware-specific code lives in the stack.

The stack talks to hardware through `iolink_phy_api_t`, a structure of function pointers:

```c
typedef struct {
    int (*init)(void);
    int (*set_mode)(iolink_mode_t mode);
    int (*send_byte)(uint8_t byte);
    int (*read_byte)(uint8_t *byte);
    // ...
} iolink_phy_api_t;
```

This boundary means protocol logic cannot access hardware registers. It also makes simulation practical.

## Test-driven development

iolinki was developed with a virtual PHY that pipes data to a Python-based IO-Link master simulation in `tools/virtual_master`.

That lets the project run automated conformance tests in CI without real hardware connected.

## Conformance coverage

The project validates against IO-Link V1.1.5 requirements:

- State machine transitions from Startup to Preoperate to Operate.
- Timing, including cycle times and wake-up pulses, measured in simulation.
- ISDU coverage for mandatory indices.
- Error injection for CRC errors and timeouts.

## Zero dynamic memory

iolinki uses static allocation:

- No `malloc` or `free`.
- Bounded execution in the `iolink_process()` loop.

## Zephyr RTOS integration

The core can run bare metal, and the project also integrates with Zephyr:

- Zephyr logging for transparent debugging.
- Zephyr shell commands for stack status and statistics.

# Technical deep dive

The heart of the stack is the Data Link Layer state machine. It handles M-Sequence exchange through startup, preoperate, and operate phases.

That transition logic is tricky because IO-Link has strict timing requirements. iolinki uses unit tests for the state machine with `cmocka` to cover edge cases such as a master dropping out mid-handshake.
