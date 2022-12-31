---
layout: post
title: Unlocking BIOS Supervisor password on Thinkpad T480
blogid: personal
sticky: false
published: false
author: Andrii Shylenko
date: 2022-12-19
featured-image: 2022-12-30-T480-bios-hack	/SuperviserLock.jpg
featured-image-alt: self employed boss cringe
tags: [firmware, hacking, thinkpad, password, bios, soldering, reverse-engineering]
---

Recently I bought an old Thinkpad T480 to do development on in my spare time. It is good machine with fast CPU, swappable batteries and possibility to upgrade to 4K screen and 64GB RAM. My machine was locked down by a "Supervisor Password", which means that it would not allow me to enter BIOS.

# TLDR, give me the instructions!

All content and information on the I website is for informational and educational purposes only.

**THIS PATCHING SOFTWARE IS PROVIDED BY THE AUTHOR ''AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.**

## Tools needed

[soic-8 clip]
	1. Another computer (surprise, surprise).
	2. CH341A/FT2232H (or any other 3.3v SPI programmer) + SOIC8 test clip. 
	If you use CH341A, modify it to work with 3.3 volts. [mod link]
	3. This site to patch your firmware. [patch firmware]

## Procedure

The procedure confirmed to work on all Lenovo Thinkpad laptops up to the 8th generation.
1. Backup your BIOS (Be sure to keep the original version! Save it two times, if you lose you original BIOS, the recovery will be much harder.)
2. Patch firmware;
3. Replace the existing BIOS with the generated patch file by flashing it;
4. Start the system;
5. Press F1 (or any other key that is specific to your machine) to open the BIOS settings;
6. Type any character when you are asked for Supervisor Password;
7. Press enter when it displays Hardware ID;
8. Press space bar twice when asked;
9. Turn off the system;
10. Restore the original BIOS by flashing it to the chip;
11. Revert BIOS settings to factory defaults.

When starting the modified BIOS, it could be necessary to:
 - Keep the anti-tampering button activated all the time(use tape) 
 - Take out the hard disk.

This instruction is based on all the info I have found on the [Badcaps forum and autopatcher script posted there.](https://www.badcaps.net/forum/showthread.php?p=981152), if you have a problem or questiions while patching people will be glad to help!

# Password hacking story

I never buy new laptops, they are expensive and provide very little advance over older generation.
My old 2730p works flawlessly with upgraded 16gb memory and 7-3610QM 4-core socketed CPU. Costed me peanuts, but beats many modern pricey laptops in speed and build quality. Good construction, upgradability and wide selection of ports is what I admire in older laptops. 
It is much more worthwhile to buy used and make repairs whenever possible, rather than opting for the shiny and expensive new models. Repair is one of the way to avoid consumerism.

And here I am, with locked used T480, searching the internet on how to fix it!

The official [Lenovo support page states:](https://support.lenovo.com/us/en/solutions/ht036206-types-of-password-for-thinkpad)

**Reset forgotten supervisor password**
*If you forget your supervisor password, Lenovo cannot reset your password. You must take your computer to a Lenovo Service Provider to have the system board replaced.*

What a waste of time. Replacing a circuit board on a device that is working perfectly. 

## Dumping firmware

**I highly recommend to use clip-on adapter to read the EEPROM.**
**Disconnect all batteries and power before doing any work on the motherboard!**
**Use anti static equipment if possible.**

To unlock the Supervisor password on Lenovo Thinkpad T480, we need to dump the BIOS image from the EEPROM chip first. There are two chips on the board. The chip closest to the USB-C port contains the Thunderbolt controller firmware (which may need an upgrade as well, due to Lenovo Thunderbolt firmware bug, but I am not focusing on it in this post), and the chip closer to the CPU contains the BIOS image.

[image with the motherboard]

The chip is Winbond 25q128jvsq 16384 kB SPI Flash.

[datasheet link]

The pinout is following:
[Image 25q128jvsq pinout]

I have FT2232H development board which can be used as a simple USB to SPI bridge.
The Chinese FT2232H board I have is incorrectly routed, the 5V and 3.3V pins are not connected. I have added two jumper cables as shown on the picture to fix power routing:

[FT2232H volt mod]

Because I did not have a clip, I desoldered Flash and connected it to the FT2232H board manually. 

[picture]

SPI port connection is well described in the [FT2232H SPI appnote](http://www.ftdichip.com/Support/Documents/AppNotes/AN_114_FTDI_Hi_Speed_USB_To_SPI_Example.pdf)

[Image FT2232H pinout]

Connection diagrams:
[Connection Diagram]

I use [flasrom](https://www.flashrom.org/Flashrom) software to communicate with a chip.
Let's read the software from the Flash chip:

```console
andrii@jupiter:~/Projects/T480$ flashrom -p ft2232_spi:type=2232H,port=A -r T480_bios_original_locked.bin
flashrom v1.2
flashrom is free software, get the source code at https://flashrom.org

Using clock_gettime for delay loops (clk_id: 1, resolution: 1ns).
Found Winbond flash chip "W25Q128.V" (16384 kB, SPI) on ft2232_spi.
Reading flash... done.
```

## Firmware analysis

Lets analyze firmware using binwalk:

```console
andrii@jupiter:~/Projects/T480$ binwalk T480_bios_original_locked.bin

DECIMAL    HEXADECIMAL   DESCRIPTION
--------------------------------------------------------------------------------
1635431    0x18F467    mcrypt 2.2 encrypted data, algorithm: blowfish-448, mode: CBC, keymode: 8bit
2371724    0x24308C    Unix path: /home/amt/rtfd/
2385592    0x2466B8    Unix path: /home/policy/cfgmgr
2386780    0x246B5C    Unix path: /home/policy/cfgmgr
7340684    0x70028C    Copyright string: "Copyright IBM Corp. 2001, 2005 All Rights Reserved US Government Users Restricted Rights - Use, duplication or disclosure restri"
7340865    0x700341    Copyright string: "Copyright LENOVO 2005, 2018 All Rights Reserved "
8388608    0x800000    UEFI PI Firmware Volume, volume size: 655360, header size: 0, revision: 0, Variable Storage, GUID: FFF12B8D-7696-4C8B-85A9-2747075B4F50
8390017    0x800581    Certificate in DER format (x509 v3), header length: 4, sequence length: 986
8392386    0x800EC2    Certificate in DER format (x509 v3), header length: 4, sequence length: 942
8393376    0x8012A0    Certificate in DER format (x509 v3), header length: 4, sequence length: 899
8394323    0x801653    Certificate in DER format (x509 v3), header length: 4, sequence length: 1552
8395923    0x801C93    Certificate in DER format (x509 v3), header length: 4, sequence length: 1495
8397536    0x8022E0    Certificate in DER format (x509 v3), header length: 4, sequence length: 937
8398521    0x8026B9    Certificate in DER format (x509 v3), header length: 4, sequence length: 1512
8400150    0x802D16    Certificate in DER format (x509 v3), header length: 4, sequence length: 935
8913167    0x88010F    GIF image data, version "89a", 546 x 114
8919589    0x881A25    Copyright string: "Copyright (C) By Lenovo"
9043968    0x8A0000    UEFI PI Firmware Volume, volume size: 851968, header size: 0, revision: 0, EFI Firmware File System v2, GUID: 8C8CE578-8A3D-4F1C-3599-896185C32DD3
9044088    0x8A0078    LZMA compressed data, properties: 0x5D, dictionary size: 16777216 bytes, uncompressed size: 786448 bytes
9895936    0x970000    UEFI PI Firmware Volume, volume size: 4390912, header size: 0, revision: 0, EFI Firmware File System v2, GUID: 8C8CE578-8A3D-4F1C-3599-896185C32DD3
9896056    0x970078    LZMA compressed data, properties: 0x5D, dictionary size: 16777216 bytes, uncompressed size: 14417936 bytes
13248152   0xCA2698    Certificate in DER format (x509 v3), header length: 4, sequence length: 935
13249147   0xCA2A7B    Certificate in DER format (x509 v3), header length: 4, sequence length: 937
13250132   0xCA2E54    Certificate in DER format (x509 v3), header length: 4, sequence length: 1512
13251704   0xCA3478    Certificate in DER format (x509 v3), header length: 4, sequence length: 942
13252694   0xCA3856    Certificate in DER format (x509 v3), header length: 4, sequence length: 899
13253641   0xCA3C09    Certificate in DER format (x509 v3), header length: 4, sequence length: 1552
13255241   0xCA4249    Certificate in DER format (x509 v3), header length: 4, sequence length: 1495
14286848   0xDA0000    UEFI PI Firmware Volume, volume size: 262144, header size: 96, revision: 0, EFI Firmware File System v2, GUID: 8C8CE578-8A3D-4F1C-3599-896185C32DD3
14287168   0xDA0140    Microsoft executable, portable (PE)
14289856   0xDA0BC0    Microsoft executable, portable (PE)
14313280   0xDA6740    Microsoft executable, portable (PE)
14372303   0xDB4DCF    mcrypt 2.2 encrypted data, algorithm: blowfish-448, mode: CBC, keymode: 8bit
14376216   0xDB5D18    SHA256 hash constants, little endian
14379016   0xDB6808    LZMA compressed data, properties: 0x5D, dictionary size: 16777216 bytes, uncompressed size: 10634 bytes
14385436   0xDB811C    LZMA compressed data, properties: 0x5D, dictionary size: 16777216 bytes, uncompressed size: 151814 bytes
14457804   0xDC9BCC    Microsoft executable, portable (PE)
14461426   0xDCA9F2    Copyright string: "Copyright (C) 2000-2015 Intel Corp. All Rights Reserved."
14465844   0xDCBB34    PC bitmap, Windows 3.x format,, 193 x 58 x 8
14478560   0xDCECE0    Microsoft executable, portable (PE)
14479584   0xDCF0E0    Microsoft executable, portable (PE)
14548992   0xDE0000    UEFI PI Firmware Volume, volume size: 65536, header size: 0, revision: 0, EFI Firmware File System v2, GUID: 8C8CE578-8A3D-4F1C-3599-896185C32DD3
14614528   0xDF0000    UEFI PI Firmware Volume, volume size: 655360, header size: 0, revision: 0, EFI Firmware File System v2, GUID: 8C8CE578-8A3D-4F1C-3599-896185C32DD3
14614624   0xDF0060    Intel x86 or x64 microcode, sig 0x000406e3, pf_mask 0xc0, 2017-08-20, rev 0x00be, size 98304
14712928   0xE08060    Intel x86 or x64 microcode, sig 0x000406e8, pf_mask 0x80, 2016-04-14, rev 0x0026, size 95232
14808160   0xE1F460    Intel x86 or x64 microcode, sig 0x000806e9, pf_mask 0xc0, 2019-09-26, rev 0x00ca, size 100352
14908512   0xE37C60    Intel x86 or x64 microcode, sig 0x000806ea, pf_mask 0xc0, 2019-10-03, rev 0x00ca, size 100352
15335424   0xEA0000    UEFI PI Firmware Volume, volume size: 1310720, header size: 96, revision: 0, EFI Firmware File System v2, GUID: 8C8CE578-8A3D-4F1C-3599-896185C32DD3
15335872   0xEA01C0    Microsoft executable, portable (PE)
15337120   0xEA06A0    Microsoft executable, portable (PE)
15338464   0xEA0BE0    Microsoft executable, portable (PE)
15340064   0xEA1220    Microsoft executable, portable (PE)
15342496   0xEA1BA0    Microsoft executable, portable (PE)
15345120   0xEA25E0    Microsoft executable, portable (PE)
15347104   0xEA2DA0    Microsoft executable, portable (PE)
15358624   0xEA5AA0    Microsoft executable, portable (PE)
15386536   0xEAC7A8    SHA256 hash constants, little endian
15388224   0xEACE40    Microsoft executable, portable (PE)
15389504   0xEAD340    Microsoft executable, portable (PE)
15392832   0xEAE040    Microsoft executable, portable (PE)
15397024   0xEAF0A0    Microsoft executable, portable (PE)
15398720   0xEAF740    Microsoft executable, portable (PE)
15403040   0xEB0820    Microsoft executable, portable (PE)
15416928   0xEB3E60    Microsoft executable, portable (PE)
15430496   0xEB7360    Microsoft executable, portable (PE)
15431872   0xEB78C0    Microsoft executable, portable (PE)
15438560   0xEB92E0    Microsoft executable, portable (PE)
15516896   0xECC4E0    SHA256 hash constants, little endian
15517664   0xECC7E0    Microsoft executable, portable (PE)
15589824   0xEDE1C0    Microsoft executable, portable (PE)
15592896   0xEDEDC0    Microsoft executable, portable (PE)
15626352   0xEE7070    SHA256 hash constants, little endian
15781724   0xF0CF5C    Microsoft executable, portable (PE)
15829664   0xF18AA0    Microsoft executable, portable (PE)
15835168   0xF1A020    Microsoft executable, portable (PE)
16169919   0xF6BBBF    mcrypt 2.2 encrypted data, algorithm: blowfish-448, mode: CBC, keymode: 8bit
16180640   0xF6E5A0    Microsoft executable, portable (PE)
16237415   0xF7C367    mcrypt 2.2 encrypted data, algorithm: blowfish-448, mode: CBC, keymode: 8bit
16241328   0xF7D2B0    SHA256 hash constants, little endian
16246208   0xF7E5C0    Microsoft executable, portable (PE)
16251936   0xF7FC20    Microsoft executable, portable (PE)
16310272   0xF8E000    SHA256 hash constants, little endian
16319008   0xF90220    Microsoft executable, portable (PE)
16324384   0xF91720    Microsoft executable, portable (PE)
16325568   0xF91BC0    Microsoft executable, portable (PE)
16336656   0xF94710    AES S-Box
16341320   0xF95948    SHA256 hash constants, little endian
16343136   0xF96060    Microsoft executable, portable (PE)
16345280   0xF968C0    Microsoft executable, portable (PE)
16359840   0xF9A1A0    Microsoft executable, portable (PE)
16363040   0xF9AE20    Microsoft executable, portable (PE)
16366880   0xF9BD20    Microsoft executable, portable (PE)
16368672   0xF9C420    Microsoft executable, portable (PE)
16370368   0xF9CAC0    Microsoft executable, portable (PE)
16381248   0xF9F540    Microsoft executable, portable (PE)
16392352   0xFA20A0    Microsoft executable, portable (PE)
16403264   0xFA4B40    Microsoft executable, portable (PE)
16406592   0xFA5840    Microsoft executable, portable (PE)
16408896   0xFA6140    Microsoft executable, portable (PE)
16409632   0xFA6420    Microsoft executable, portable (PE)
16410784   0xFA68A0    Microsoft executable, portable (PE)
16412064   0xFA6DA0    Microsoft executable, portable (PE)
16414112   0xFA75A0    Microsoft executable, portable (PE)
16416192   0xFA7DC0    Microsoft executable, portable (PE)
16421920   0xFA9420    Microsoft executable, portable (PE)
16426048   0xFAA440    Microsoft executable, portable (PE)
16429512   0xFAB1C8    SHA256 hash constants, little endian
16430176   0xFAB460    Microsoft executable, portable (PE)
16433208   0xFAC038    SHA256 hash constants, little endian
16433856   0xFAC2C0    Microsoft executable, portable (PE)
16435808   0xFACA60    Microsoft executable, portable (PE)
16450912   0xFB0560    Microsoft executable, portable (PE)
16455424   0xFB1700    Microsoft executable, portable (PE)
16461856   0xFB3020    Microsoft executable, portable (PE)
16464192   0xFB3940    Microsoft executable, portable (PE)
16646144   0xFE0000    UEFI PI Firmware Volume, volume size: 131072, header size: 96, revision: 0, EFI Firmware File System v2, GUID: 8C8CE578-8A3D-4F1C-3599-896185C32DD3
16646432   0xFE0120    Microsoft executable, portable (PE)
16667936   0xFE5520    Microsoft executable, portable (PE)
16758192   0xFFB5B0    Microsoft executable, portable (PE)
```

## Flashing back 

I had been working on the laptop late into the night, trying to re-flash the ROM. 
After soldering wires back and running write command with

```console
andrii@andrii-jupiter:~/Projects/T480$ flashrom -p ft2232_spi:type=2232H,port=A -w T480_bios_original_locked.bin 
```

**there was no response from the chip!**

I touched the ROM, and felt the radiating heat...
I tried to solder chip back, the laptop went completely dark except for the light of the charger indicator. 

Have I doomed the laptop beyond repair?

I began by testing the power, 3.3v and 12v lines, to make sure they were running correctly. 
Once that was established, I hooked up a logic analyzer to find out if the processor was communicating via SPI.

[logic analyzer image]

I was relieved to find that it was only the Flash chip that had an issue and not the whole motherboard.

## Resurrection

The next day I have ordered a bunch of new W25Q128.V chips and SOIC-8 clip-on adapter in the local hobby shop.
After receiving the parts, I quickly exchanged the chip with a new one, hooked up my logic analyzer to verify that the processor was indeed communicating with the flash chip, and then proceeded to re-flash the BIOS image:

```console
andrii@andrii-jupiter:~/Projects/T480$ flashrom -p ft2232_spi:type=2232H,port=A -w T480_biospatched.bin
flashrom v1.2 on Linux 5.15.0-56-generic (x86_64)
flashrom is free software, get the source code at https://flashrom.org
Using clock_gettime for delay loops (clk_id: 1, resolution: 1ns).
Found Winbond flash chip "W25Q128.V" (16384 kB, SPI) on ft2232_spi.
Reading old flash chip contents... done.
Erasing and writing flash chip... done.
Verifying flash... VERIFIED.
```

I started the laptop and pressed F1 to open the BIOS settings (you can find step by step instructions in the beginning of the post). 
A small box with lock appeared. 
[Supervisor pass image]
I typed a random keyboard character as Supervisor password. The screen changed and showed me a Hardware ID.
[HW id image]
I pressed enter, then twice on the space bar as requested by the code, before turning off the system.
[Image press enter]
I restored the original BIOS by flashing it with flashrom, crossed my fingers, and turned the laptop on.

The Supervisor password had been removed!

## Takeaways
1. Be sure to double-check your soldering and connections before powering a device.
2. Chinese development tools may be inexpensive, but they're often subpar—so examine them carefully before using.
3. Keep in mind the time investment when deciding to repair used laptops, as there is usually a hidden cost
involved.

I wrote an automatic patch service for Supervisor passwords in Lenovo laptops.


