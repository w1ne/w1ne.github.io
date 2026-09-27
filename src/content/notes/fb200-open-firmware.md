---
title: Open firmware for my bass pedal
description: I wrote open-source firmware for the FLAMMA FB200 bass pedal. It sounds like the stock firmware and updates from the browser.
date: '2026-09-27'
tags:
  - bass
  - embedded
  - DSP
  - reverse engineering
featured: true
draft: false
heroImage: /images/projects/fb200.jpg
---

I play bass. My practice pedal is a FLAMMA FB200: small, battery powered, with amp models, cabinets, effects, a tuner and a drum machine. It is a good pedal. But its firmware is closed, and I wanted to change things.

So I wrote new firmware for it. It is open source: [github.com/w1ne/fb200-tools](https://github.com/w1ne/fb200-tools).

<video src="/images/projects/fb200-demo.mp4" controls playsinline preload="metadata" style="width:100%;max-width:540px"></video>

### What it does

- **It sounds like the stock pedal.** I ported every effect: noise gate, compressor, 10 amps with tone stack, 10 cabinets, 12 modulations, 5 reverbs. I checked each one against the stock code, run in an emulator. The amp and tone stack match bit for bit. The rest match within -105 dB.
- **Your presets stay.** It reads and writes the stock preset format, and the official app still works.
- **Drums and tuner** work like the stock ones. The drums are now in the USB recording too, and I can change the rhythm, tempo and level while I play: hold A and turn a knob.
- **The display says what happens.** Turn a knob and the display shows its name and value.
- **Updates over USB.** No button combo. If the firmware crashes, a small recovery program keeps USB alive and saves a crash report.

### How it works

The pedal has an NXP i.MX RT1052 (Cortex-M7, 600 MHz). I never opened it: everything goes over USB. The boot has two stages. The vendor bootloader stays untouched, so holding A+D at power-on always brings back the official updater. After it comes a small recovery program, then the application.

The audio code uses [CMSIS-DSP](https://github.com/ARM-software/CMSIS-DSP), and USB uses [TinyUSB](https://github.com/hathach/tinyusb). The amp models, cabinet IRs and drum rhythms belong to FLAMMA, so the project does not ship them. The first install reads them from your own copy of the official firmware file and stores them in a separate area of the pedal's flash. Later updates do not need that file.

### Try it

Open [the web updater](https://w1ne.github.io/fb200-tools/flash.html) in Chrome or Edge on Windows, macOS or Linux. It takes the latest release and guides you step by step. There is also a command-line tool.

Flashing custom firmware is at your own risk. This is a community project. It is not made or supported by FLAMMA.

If it is useful to you, you can [buy me a coffee](https://buymeacoffee.com/3qutj2ucoq).
