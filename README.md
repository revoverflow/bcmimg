# Broadcom Image Toolkit

Some scripts to manipulate Broadcom Images for CFE Bootloader used in many modems/routers !

### Firmware extraction

Extract CFE/RootFS/Kernel from firmware image :

```bash
node extract.js firmware.bin
```

The script outputs parsed tag (header) data to console.

The firmware will be extracted to ./extracted dir.

### Firmware patching

Patch CFE/RootFS/Kernel from original firmware image :

```bash
node patch.js -i firmware.bin -o firmware_patched.bin -r newrootfs.bin -k newkernel.bin -c newcfe.bin
```

Command line parameters :

``` 
-i : Original firmware path
-o : Output firmware path
-r : RootFS path (optional)
-k : Kernel path (optional)
-c : CFE path (optional)
```

**Make sure you know what you're doing when flashing a custom firmware !**