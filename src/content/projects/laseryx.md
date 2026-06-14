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
featuredNotes:
  - laseryx-release
---

Laseryx runs GRBL laser cutters and engravers from the browser. Design import, cutting parameters, G-code generation, and streaming all live in one place — it's a PWA that talks to the controller over Web Serial, and nothing you make gets uploaded anywhere.

I built it because laser software tends to be expensive, Windows-first, or scattered across several tools, and I wanted something that just worked on Linux. The G-code engine is TypeScript running in a Web Worker.

- [Live app](https://laseryx.com)
- [Repository](https://github.com/w1ne/Laseryx)
