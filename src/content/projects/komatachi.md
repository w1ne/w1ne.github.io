---
name: Komatachi K0
order: 5
summary: Affordable dual-arm mobile robot with a 640 mm self-locking lift, built in Europe. LeRobot-native, target price €1,899 as a kit.
status: Prototype in build
topics:
  - robotics
  - LeRobot
  - hardware
  - Europe
featuredNotes:
  - komatachi-k0
---

Komatachi K0 is a two-arm mobile manipulator designed for the home and built in Europe. Both arms ride a carriage on a 640 mm self-locking telescopic column, so the working height covers everything from the floor to a high shelf. The base is differential drive, the computer is a Raspberry Pi 4, and inference runs off-board.

The K0 is a LeRobot robot: it registers as robot type `komatachi_k0` and works with LeRobot's calibrate, teleoperate, record and train commands unchanged. On top of that, Komatachi adds a safety layer that LeRobot does not have. It reads servo current every control loop to catch a stalled joint before the gear train strips, senses grip force, and provides a hardware E-stop that opens a motor-power contactor.

It is sold as a kit at a target price of €1,899 ex-VAT, with €199 refundable reservations. The prototype is under construction, and every unmeasured figure is labelled a target specification.

- [Website and reservations](https://komatachi.com)
- [Komatachi K0 article](/notes/komatachi-k0/)
