# StormRadar VirtualBox ISO

This folder builds a bootable Debian live ISO that launches StormRadar in a full-screen browser kiosk. It is designed to be built inside a Linux VirtualBox VM and does not install anything on the Windows host.

## Build inside the Linux VM

Install Debian or Ubuntu in VirtualBox with at least 4 GB RAM, 2 CPUs, and 12 GB free disk space. Copy the complete `OS` folder into that VM, then run:

```bash
sudo apt update
sudo apt install live-build chromium openbox lightdm xserver-xorg
chmod +x bootable/build-iso.sh
./bootable/build-iso.sh
```

The generated file will be:

```text
bootable/stormradar-live.iso
```

Attach that ISO to a new VirtualBox Linux 64-bit VM and boot it. This project cannot generate the binary ISO on the current Windows machine because WSL and ISO build tools are not installed. The build downloads Debian packages, so the Linux VM needs internet access.