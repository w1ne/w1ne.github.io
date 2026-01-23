---
layout: single
title: "LaserFather, Web based, Open Source CAM for Laser Cutting"
blogid: projects
sticky: false
published: true
author: Andrii Shylenko
date: 2026-01-23
tags: [laser, pwa, open source, typescript, react, grbl, linux]
header:
  overlay_filter: 0.5
---

II love my laser cutter, but I honestly hated the software ecosystem that came with it.

Most laser software available today is either prohibitively expensive, locked exclusively to Windows. As a Linux user, I just wanted something that "just works", without Wine, no virtual machines, and no hassle.

So I decided to build **LaserFather**.

### The Concept

LaserFather is a Progressive Web App (PWA) that runs entirely in your browser(e.g. Chrome). It leverages the Web Serial API, which allows Chrome or Edge to talk directly to your machine’s USB port. This means you can connect to your GRBL laser cutter without installing a single piece of native software. It works across Linux, Mac, Windows, Chromebooks, and potentially even Android tablets.

### A Unified Workflow

My main goal was to have universal. Typically, you need one program for design (like Inkscape), another for CAM settings (like LightBurn), and often a third just to stream the G-code.

LaserFather comined this into a single browser tab. You can handle vector design, import images, and define your cutting parameters all in one place. When you are setting power and speed for a vector cut or preparing a raster image, the app generates the G-code and streams it directly to your machine with real-time progress.

### Privacy and Performance

Despite being web-based, privacy is a priority. LaserFather processes everything locally on your computer. Your designs never leave your device, and once the app is loaded, you don't even need an internet connection to keep cutting.

Under the hood, I wrote a custom G-code engine in TypeScript that runs in a Web Worker to ensure the interface stays responsive. It handles travel moves for vectors and manages dithering for image scanning. The UI itself is built with React and Vite for speed, using RxJS to manage data stream between your browser and the laser.

### Open Source

The project is licensed under **CC BY-NC-SA 4.0**, so you are welcome to view the source code, modify it, and learn from it. As well as reques new features.

If you have a GRBL-based laser cutter (like many of the common diode lasers), I’d love for you to give it a try.

**Check out the live app at [laserfather.com](https://laserfather.com) or explore the code on [GitHub](https://github.com/w1ne/Laserfather).**
