---
title: Dia Health One. Computing a Glucose-Responsive Insulin
description: A non-clinical research venture rebuilding the published evidence for the glucose-sensitive insulin NNC2215 and its interaction with paracetamol glucuronide.
date: '2026-10-30'
tags:
  - biotech
  - computational chemistry
  - insulin
  - drug discovery
  - Dia Health One
featured: false
draft: true
heroImage: /images/notes/dia-health-one/hero.png
---

Insulin that switches off before blood sugar goes too low is one of the field's oldest goals. Hypoglycemia is what limits how aggressively you can dose, and it is the reason the problem is still open.

I am CTO of **Dia Health One**, a computational insulin discovery company working on that problem from the chemistry side. [diahealth.one](https://www.diahealth.one) is live. This note is what the team has actually computed so far.

# The two papers

A 2024 preclinical study reported **NNC2215**, a glucose-sensitive insulin. It is a macrocycle that binds a glucoside depending on glucose, so the molecule gains receptor affinity as sugar rises.

A 2026 study then reported that paracetamol glucuronide (PaG), a common metabolite, interacts with NNC2215 in experimental measurements. If that holds, a design has to account for it. That is the question we work on.

# What we have run so far

We work from published data and public model files. Every result ships with the input files, the script, and the run record, so anyone can rerun it.

We rechecked all 30 NNC2215 glucose-response values from the paper's Figure 3d against the publisher workbook. The paired fold changes come out at 3.2× and 12.5×, the same as the paper reports. An exploratory fit to those points gives an EC50 around 13 mmol/L, but three experiments do not pin down a reliable midpoint, so we report the fit with that limit instead of as a threshold.

The publisher's open and closed NNC2215 models match each other on sequence, backbone, disulfides, and the linker records, after two atom-name fixes. These are model-built coordinates, not an experimentally solved structure.

We also built a PaG-only solvated system and ran it as a short compatibility check, and timed a generic protein on a free cloud GPU to see how the engine behaves. Neither of those touches the target complex.

# Where it stands

The study's original starting coordinates are not public, so the published simulation cannot be rerun exactly. The conjugate's chemistry is not settled yet, which means bond orders, protonation, and force-field parameters are still open. No NNC2215-PaG binding simulation has run. The authors of the 2026 paper conclude that NNC2215 itself is not a viable candidate because of the PaG interaction, so our work so far is about what a successor would have to satisfy.

We stop before any long production run until the chemistry and the compute are sorted.

# The team

Dia Health One is **Patrik Pallagi** (CEO), **Ádám Ürmös** (CSO), and me (CTO). The research is non-clinical. Nothing here is a therapy, a dose, or advice for patients.

- [Website](https://www.diahealth.one)
- [Research demo](https://www.diahealth.one/research/)
