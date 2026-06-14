---
name: Laseryx
image: /images/projects/laseryx.png
summary: Browser-based GRBL control for laser cutters and engravers.
status: Open-source project
repoUrl: https://github.com/w1ne/Laseryx
topics:
  - GRBL
  - laser control
  - browser tooling
proofPoints:
  - Runs as a browser PWA and talks to GRBL controllers through Web Serial.
  - Generates and streams G-code locally without uploading designs.
  - Uses a TypeScript G-code engine in a Web Worker.
featuredNotes:
  - laseryx-release
---

## What it is

Laseryx is a browser-based CAM and control project for GRBL laser cutters and engravers. It combines design import, cutting parameters, G-code generation, and streaming into one browser workflow.

## Why it matters

Laser cutter software is often expensive, Windows-first, or split across several tools. Laseryx keeps the workflow local and browser-based so it works cleanly on Linux and other platforms.

## Links

- [Live app](https://laseryx.com)
- [Repository](https://github.com/w1ne/Laseryx)
