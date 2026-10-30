---
title: Dia Health One. Computing a Safer Glucose-Responsive Insulin
description: A non-clinical research venture reanalysing the glucose-sensitive insulin NNC2215 and its paracetamol-glucuronide interaction, with every claim reproducible from published data.
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

Hypoglycemia is the dose-limiting risk of insulin therapy. Insulin that switches off before blood glucose goes low is one of the field's long-standing goals. I am CTO of **Dia Health One**, a computational insulin discovery venture working on that problem from the chemistry side rather than the clinic.

[diahealth.one](https://www.diahealth.one) is live. This note is about what the team has actually computed so far, and where the evidence stops.

# The starting point

A 2024 preclinical paper reported **NNC2215**, a glucose-sensitive insulin: a macrocycle that binds a glucoside in a way that depends on glucose, so the molecule gains receptor affinity as glucose rises. A 2026 study then reported that **paracetamol glucuronide (PaG)** interacts with NNC2215 in experimental measurements.

That second result matters. If a common metabolite shifts the switch, the design needs to account for it. So the research question is narrow and testable: can we rebuild the published evidence from the source data, and what does it say about the conjugate's chemistry.

# What we have done

We work only from published data and public model files. Each result ships with the input checksums, the script, and the run record, so anyone can rerun it.

- **Reran the source data.** All 30 NNC2215 glucose-response values from the paper's Figure 3d were rechecked against the publisher workbook. The paired fold changes reproduce the paper's rounded 3.2× and 12.5×.
- **Fit the response curve.** An exploratory shared-slope Hill fit gives an EC50 of about 13 mmol/L. Resampling the three experiments shows the available points do not pin down a reliable midpoint, so the fit is reported with that limit rather than as a threshold.
- **Audited the public structures.** The publisher's open and closed NNC2215 models match on sequence, backbone, disulfides, and the linker records, after two documented atom-name reconciliations. These are model-built coordinates, not an experimentally solved switch.
- **Set up the chemistry for PaG.** A PaG-only explicit-water system was built and run as short compatibility replicas, with net charge −1. This validates the ligand, not the conjugate.
- **Benchmarked the engine.** A generic protein system was timed on a free cloud GPU as a throughput check. It is not target-system performance and not a binding calculation.

# Where the evidence stops

The honest part. The original molecular dynamics cannot be rerun exactly, because the study's starting coordinates are not public. The nonstandard conjugate chemistry — bond orders, protonation, charges, force-field parameters — is not yet validated. No NNC2215–PaG binding simulation has run. The authors of the 2026 paper conclude NNC2215 itself is not a viable therapeutic candidate because of the PaG interaction; our work so far only frames what a successor design would need to satisfy.

We hold to a rule: report what is reproducible, name what is not, and stop before any long production run until the chemistry and compute are settled.

# The team

Dia Health One is **Patrik Pallagi** (CEO), **Ádám Ürmös** (CSO), and me (CTO). The research is non-clinical. Nothing here is a therapy, a dose, or a patient recommendation.

- [Website](https://www.diahealth.one)
- [Research demo](https://www.diahealth.one/research/)
