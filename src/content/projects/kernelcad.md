---
name: kernelCAD
order: 2
image: /images/projects/kernelcad.png
summary: Headless-first CAD platform for AI agents and human visual review.
status: Open-source project
repoUrl: https://github.com/w1ne/kernelCAD-web
topics:
  - CAD
  - AI agents
  - TypeScript
featuredNotes: []
---

kernelCAD is a CAD platform built for AI agents instead of mouse clicks. An agent uses a scriptable API to generate, analyze, and modify 3D geometry, and because the whole model is just code, the output is easy to inspect, test, export, and revise. There's a web viewer on top so a human can actually look at what the agent produced and catch whatever looks wrong.

Under the hood it's OpenCASCADE through Replicad, a TypeScript/Node API, web workers for the heavy geometry, and a React Three Fiber viewer. STEP and STL come straight out of the script.

The code is public: [w1ne/kernelCAD-web](https://github.com/w1ne/kernelCAD-web).
