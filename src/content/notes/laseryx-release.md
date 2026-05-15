---
title: Laseryx, Web based, Open Source CAM for Laser Cutting
description: Browser-based GRBL laser cutting workflow with local processing, Web Serial, and a TypeScript G-code engine.
date: '2026-01-23'
tags:
  - laser
  - GRBL
  - PWA
  - TypeScript
legacyUrl: https://n1n3.net/2026/01/23/laseryx-release.html
featured: true
draft: false
---
I love my laser cutter, but I hated the software ecosystem around it.

Most laser software is either expensive, locked to Windows, or awkward on Linux. I wanted something that works without Wine, virtual machines, or extra native software. So I decided to build Laseryx.

# The concept

Laseryx is a Progressive Web App that runs in the browser. It uses the Web Serial API, which allows Chrome or Edge to talk directly to a machine over USB.

That means you can connect to a GRBL laser cutter without installing a native control application. It works across Linux, macOS, Windows, Chromebooks, and potentially Android tablets.

# A unified workflow

The goal was a universal workflow. Usually you need one program for design, another for CAM settings, and often a third to stream G-code.

Laseryx combines that into a single browser tab. You can handle vector design, import images, define cutting parameters, generate G-code, and stream it directly to the machine with live progress.

# Privacy and performance

Laseryx processes designs locally on your computer. Your files do not leave the device, and once the app is loaded, you do not need an internet connection to keep cutting.

Under the hood, the project uses a custom G-code engine in TypeScript running in a Web Worker. It handles vector travel moves and dithering for image scanning. The UI is built with React and Vite, with RxJS managing the data stream between the browser and the laser.

# Open source

The project is licensed under CC BY-NC-SA 4.0.

Check out the live app at [laseryx.com](https://laseryx.com) or explore the code on [GitHub](https://github.com/w1ne/Laseryx).
