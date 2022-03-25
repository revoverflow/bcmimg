const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const BroadcomImage = require('./core/BroadcomImage');

if(args.help || !args.i || !args.o) {
    console.log('Usage: node patch.js -i <originalfirmware.bin> -o <outputfirmware.bin> [-r <rootfs.bin>] [-k <kernel.bin>] [-c <cfe.bin>]');
    process.exit(0);
}

console.log("Broadcom Firmware Patcher\nhttps://github.com/revoverflow/bcmimg\n");

console.log(">>", "Parsing original firmware tag...");

let originalFirmware = fs.readFileSync(args.i);
let parsedFirmware = BroadcomImage.parseImage(originalFirmware);

let parts = {
    cfe: args.c ? fs.readFileSync(args.c) : parsedFirmware.cfe,
    rootfs: args.r ? fs.readFileSync(args.r) : parsedFirmware.rootfs,
    kernel: args.k ? fs.readFileSync(args.k) : parsedFirmware.kernel
}

console.log(">>", "Start patching...");

let patchedFirmware = BroadcomImage.createImage(parsedFirmware, parts.cfe, parts.rootfs, parts.kernel);
fs.writeFileSync(args.o, patchedFirmware);

console.log(">>", "Done!");
console.log("Output file:", args.o);