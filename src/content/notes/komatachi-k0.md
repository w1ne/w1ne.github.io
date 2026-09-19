---
title: Komatachi K0. A Robot for Home Chores, Built in Europe
description: Two arms, wheels and a lifting column that reaches from the floor to the top shelf. Show it a chore once and it repeats it. €1,899, made in Europe.
date: '2026-09-19'
tags:
  - robotics
  - home robots
  - hardware
  - Europe
  - LeRobot
featured: false
draft: false
heroImage: /images/notes/komatachi-k0/hero.png
---

I started **Komatachi** this August, after years of checking robot prices and closing the tab. At the bottom there are open kits around €1,000 that assume a workshop and a pile of spare time. At the top, research platforms from €25,000. Nothing in between is a finished robot you can bring home.

So I am building one. The **K0** is a two-arm robot that drives around the house and does chores. [komatachi.com](https://komatachi.com) takes reservations.

# What it does

Dishes go in the cupboard. Laundry goes from the basket to the machine. Toys, shoes and cables get picked up off the floor, and it brings you the thing you left in the other room.

The arms have soft fingers and sense how hard they are gripping, so a glass is safe in them. The lift carries the arms from the floor to a high shelf. It works for hours on a battery, sees with four cameras, and you can watch it and drive it from your phone or laptop. What it learns stays on your computer.

# You teach it by showing it

Hold its arms, do the chore with it once, and it remembers. If it gets it wrong, show it again. There is no programming and no setup.

# How it is built

Two arms on a carriage, riding a self-locking telescopic column. The column started as half a standing desk frame, which is a cheap way to get 640 mm of lift that holds its height with no power. The robot is designed and assembled in Europe.

The software is LeRobot, the open robotics stack, so the K0 learns from demonstrations and shares its format with a large community instead of locking you in. On top of it I wrote a safety layer: it watches how hard each joint is working and stops before anything burns out, and a hardware stop button cuts the motors if the computer freezes.

# Price

€1,899. €199 holds your place in the first batch, and you can ask for it back at any time. Shipping is planned for this autumn.

If you want one, or you want to follow the build, write to [hello@komatachi.com](mailto:hello@komatachi.com).
