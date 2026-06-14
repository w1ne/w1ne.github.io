---
name: kernelCAD
image: /images/projects/kernelcad.png
summary: Headless-first CAD platform for AI agents and human visual review.
status: Open-source project
repoUrl: https://github.com/w1ne/kernelCAD-web
topics:
  - CAD
  - AI agents
  - TypeScript
proofPoints:
  - Scriptable geometry generation with OpenCASCADE.
  - Visual debugger for reviewing generated 3D models.
  - STEP/STL export from deterministic code.
featuredNotes: []
---

## What it is

kernelCAD is a headless-first CAD platform for AI agents. Agents use a scriptable API to generate, analyze, and modify 3D geometry, while humans can review the output in a web-based visual debugger.

## Why it matters

The project treats CAD as deterministic code first, not manual clicking. That makes generated geometry easier to inspect, test, export, and revise.

## Technical judgment

The platform is built around OpenCASCADE via Replicad, with a TypeScript/Node API, web workers, and a React Three Fiber viewer.

## Code and related work

The public repository is linked from this page: [w1ne/kernelCAD-web](https://github.com/w1ne/kernelCAD-web).
