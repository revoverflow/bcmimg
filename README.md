# Broadcom Image Toolkit

Some scripts to manipulate Broadcom Images for CFE Bootloader used in many modems/routers !

### Firmware extraction

Extract CFE/RootFS/Kernel from firmware image :

```
node extract.js firmware.bin
```

The script outputs parsed tag (header) data to console.

The firmware will be extracted to ./extracted dir.