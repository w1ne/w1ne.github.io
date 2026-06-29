---
name: iolinki
order: 3
image: /images/projects/iolink.png
summary: Hardware-agnostic IO-Link Device and Master stacks for Zephyr, bare-metal systems, and simulation.
status: Open-source/commercial project
repoUrl: https://github.com/w1ne/iolinki
topics:
  - IO-Link
  - Zephyr
  - bare metal
  - master stack
featuredNotes:
  - iolinki
---

iolinki now covers both sides of an IO-Link link: the original hardware-agnostic Device stack and a separate portable Master stack. The Device stack targets Zephyr and bare-metal systems; the Master stack lives in its own repository and drives startup, preoperate, cyclic process data, ISDU services, diagnostics, and multi-port controller flows.

The split is intentional. `iolinki` remains the device-oriented stack, while `iolinki-master` owns the master API and implementation. They share only narrow protocol helpers where it makes sense, so device firmware can be tested against a real master stack without folding both roles into one global API.

Both stacks stick to static allocation and bounded execution, which is what you want on constrained embedded targets where surprises at runtime are not welcome.

- [Repository](https://github.com/w1ne/iolinki)
- [Master repository](https://github.com/w1ne/iolinki-master)
