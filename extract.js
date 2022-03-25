const fs = require('fs');
const BroadcomImage = require('./core/BroadcomImage');

let offset = 0;

let args = process.argv.slice(2);

console.log("Broadcom Firmware Extractor\nhttps://github.com/revoverflow/bcmimg\n");

if(args.length < 1) {
    console.log('Usage: node extract.js <firmware.bin>');
    process.exit(1);
}

let firmware = fs.readFileSync(args[0]);

console.log(">>", "Parsing firmware tag...");

let image = BroadcomImage.parseImage(firmware);

console.log(`\n************************************************
Tag Version: ${image.tagVersion}
Company: ${image.company}
Additional: ${image.additional}
Chip ID: ${image.chipid}
Board ID: ${image.boardid}
Big Endian: ${image.bigendian}
Image Length: ${image.imagelength}
CFE Address: ${image.cfeaddr}
CFE Length: ${image.cfelen}
RootFS Address: ${image.rootfsaddr}
RootFS Length: ${image.rootfslen}
Kernel Address: ${image.kerneladdr}
Kernel Length: ${image.kernellen}
Sequence: ${image.sequence}
Version: ${image.version}
************************************************\n`);

console.log(">>", "Extracting CFE, RootFS and Kernel...");
try { fs.mkdirSync('extracted'); } catch(e) {}
fs.writeFileSync('extracted/cfe.bin', image.cfe);
console.log("CFE extracted to 'extracted/cfe.bin'");
fs.writeFileSync('extracted/rootfs.bin', image.rootfs);
console.log("RootFS extracted to 'extracted/rootfs.bin'");
fs.writeFileSync('extracted/kernel.bin', image.kernel);
console.log("Kernel extracted to 'extracted/kernel.bin'");