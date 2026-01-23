---
layout: single
title: "LaserFather: Linux-first, Open Source Web CAM for Laser Cutting"
blogid: projects
sticky: false
published: true
author: Andrii Shylenko
date: 2026-01-23
tags: [laser, pwa, open source, typescript, react, grbl, linux]
header:
  overlay_filter: 0.5
---

I love my laser cutter, but I hated the software ecosystem. 

Most laser software is either expensive, Windows-only, or requires installing questionable drivers that mess up my system. As a Linux user, I wanted something that "just works"—no Wine, no VMs, no headaches.

So I built **LaserFather**.

# What is it?

[LaserFather](https://laserfather.com) is a **Progressive Web App (PWA)** that runs entirely in your browser. It combines vector design, G-code generation, and direct machine control into one seamless workflow.

Because it uses the modern **Web Serial API**, it can connect directly to your laser cutter (GRBL) via USB from Chrome or Edge, without installing *any* native software.

# Key Features

## 1. Zero Installation
Open [laserfather.com](https://laserfather.com), click "Connect", and you're ready. It works on Linux, Mac, Windows, Chromebooks, and potentially even Android tablets (with OTG).

## 2. Offline Capable
Privacy matters. LaserFather processes everything locally in your browser. Your designs never leave your computer, and once the app is loaded, you don't even need an internet connection.

## 3. Integrated Workflow
Usually, you need:
1.  **Inkscape/Illustrator** for design.
2.  **LaserGRBL/LightBurn** for CAM (settings).
3.  **Sender** software to stream G-code.

LaserFather puts this all in one tab:
*   **Design**: Import SVG/Images, add text, basic shapes.
*   **CAM**: Set power, speed, output mode (Vector/Raster) per layer.
*   **Control**: Stream G-code directly to the machine with real-time progress.

## 4. Smart G-code Generation
I wrote a custom G-code engine in TypeScript that runs in a Web Worker. It handles:
*   **Vector paths**: Optimized travel moves.
*   **Raster images**: Converts PNG/JPG to scanlines with dithering support.
*   **Safety**: Automatic bounds checking.

# Under the Hood

The project is built with a modern stack:
*   **React** for the UI.
*   **TypeScript** for type safety (crucial for coordinate math).
*   **Vite** for lightning-fast builds.
*   **RxJS** for managing the complex state of the machine connection stream.

The source code is **Open Source (CC BY-NC-SA 4.0)**, meaning you can view, modify, and learn from it.

# Try it out

*   **Live App**: [laserfather.com](https://laserfather.com)
*   **Source Code**: [github.com/w1ne/Laserfather](https://github.com/w1ne/Laserfather)

If you have a GRBL-based laser cutter (like many diode lasers), give it a spin and let me know what you think!
