---
title: Komatachi K0. An Affordable Dual-Arm Robot, Built in Europe
description: Two arms on a lifting column, LeRobot-native software, and a €1,899 target price as a kit. Five weeks in, here is what runs and what does not.
date: '2026-09-19'
tags:
  - robotics
  - LeRobot
  - embedded
  - hardware
  - Europe
featured: false
draft: false
---

I started **Komatachi** in the middle of August, after years of checking robot prices and closing the tab. At the bottom there are open kits around €1,000 that assume a workshop and some LeRobot experience. At the top, research platforms from €25,000. A robot that reaches the floor and the top shelf, that a normal person can buy, run and repair, does not exist at a price I can pay.

So I am building one. The first machine is the **K0**, and [komatachi.com](https://komatachi.com) has the price and the reservation form.

# What the K0 is

Two arms on a shared carriage. The carriage rides a 640 mm telescopic column, so the design goal is a working range from the floor to a high shelf, around 1.4 m. The base is differential drive with hub motors, the computer is a Raspberry Pi 4, and the pack is 12.8 V LiFePO4. Nothing has been measured yet, and the site marks every unmeasured figure as a target specification. That label stays there until someone measures it.

| | |
| --- | --- |
| Arms | 2 × SO-101 follower, 6 DoF + gripper each |
| Lift | 640 mm self-locking column |
| Base | differential drive, hub motors |
| Compute | Raspberry Pi 4, 4 cameras |
| Power | 12.8 V LiFePO4 |
| Target price | €1,899 ex-VAT, sold as a kit |
| Status | prototype in build |

The base architecture is XLeRobot v0.4.0. The lift and the modified arms are the K0 additions.

# The robot is a LeRobot robot

`komatachi_k0` is a LeRobot robot type, so the stock commands work:

```sh
lerobot-calibrate   --robot.type=komatachi_k0 ...
lerobot-teleoperate --robot.type=komatachi_k0 ...
lerobot-record      --robot.type=komatachi_k0 ...
```

Calibration, the servo bus, cameras, dataset recording and training are LeRobot's, unchanged. Every demonstration recorded on the K0 lands in the same format as every other LeRobot robot, which matters more than any feature I could write myself.

What I did write is the safety layer, because LeRobot has a specific gap. Its `get_observation()` reads `Present_Position` and nothing else, so a stalled joint is invisible to it, and the STS3215's plastic gear train strips in seconds under a sustained stall. Four Python files watch `Present_Current` on every loop, drop torque when a joint stops moving while current stays high, and measure grip force instead of guessing it.

The E-stop is hardware: a latching mushroom button that opens a motor-power contactor. If the Pi hangs, the button still cuts the motors.

The stack has 60 passing tests and one skipped when LeRobot is absent. All of them run on synthetic readings. None has talked to a servo. The first bench session exists to turn the assumptions into measurements.

# Two decisions that shaped the design

## The lift came out of a standing desk

A 640 mm self-locking telescopic column is half of a dual-motor standing desk frame. One frame has two columns, so the lift comes to about €97 per robot and one order builds two of them. Self-locking matters for safety as much as for power: cut the electricity and the column holds position instead of dropping both arms. The trade is that discarding the stock controller also discarded the manual lowering release, and that is now on the open list.

## The arm grew one axis

The stock SO-101 has five joints plus a gripper, and three of the five are parallel pitches. The tool can move in a plane but cannot yaw out of it, so picking a mug off the floor at an angle is out of reach. The K0 arm adds a forearm roll between the elbow and the wrist.

I did not choose the location on taste. I sampled around 260,000 poses, binned the tool centre into 50 mm cells, and counted the distinct tool orientations each cell could reach. An upper-arm roll wins across the whole workspace, but it turns redundant with the shoulder pan exactly when the upper arm hangs vertical, which is the floor-pick pose. The forearm roll adds 68% more reachable floor cells than the stock arm.

# What does not exist yet

No K0 has been assembled. The arm servos are not bought, and the drive and lift electronics wait on measurements of the frame: motor voltage under load, stall current, Hall pulses per millimetre. The stall thresholds in the code are derived estimates that no servo has confirmed. There is no lidar in V0 and no wheel odometry.

# What happens next

Buy the servos. Meter the frame, because the drive and lift electronics wait on real numbers. Then put the protection stack in front of one real arm and re-derive every threshold from measurements instead of estimates. After that, the first ten units, then a batch of fifty.

Reservations are €199, and you can ask for the money back at any time. I am not promising a delivery date. There is a target, and there are gates the prototype has to pass before the date means anything.

If you build robots, or you want one of these, write to [hello@komatachi.com](mailto:hello@komatachi.com).
