const fs = require('fs');
let offset = 0;

function readString(size) {
    let str = firmware.slice(offset, offset + size).toString('utf8');
    offset += size;
    return str;
}

function readByteArray(size) {
    let arr = firmware.slice(offset, offset + size);
    offset += size;
    return arr;
}

function parseTag() {
    let image = {};

    image.tagVersion = readString(4);
    image.company = readString(20);
    image.additional = readString(14);
    image.chipid = readString(6);
    image.boardid = readString(16);
    image.bigendian = readString(2);
    image.imagelength = readString(10);
    image.cfeaddr = readString(12);
    image.cfelen = readString(10);
    image.rootfsaddr = readString(12);
    image.rootfslen = readString(10);
    image.kerneladdr = readString(12);
    image.kernellen = readString(10);
    image.sequence = readString(4);
    image.version = readString(32);
    image.reserved = readByteArray(42);
    image.img_validation_token = readByteArray(20);
    image.tag_validation_token = readByteArray(20);

    return image;
}

let args = process.argv.slice(2);

console.log("Broadcom Firmware Extractor\nhttps://github.com/revoverflow/bcmimg\n");

if(args.length < 1) {
    console.log.log('Usage: node extract.js <firmware.bin>');
    process.exit(1);
}

let firmware = fs.readFileSync(args[0]);

console.log(">>", "Parsing firmware tag...");

let image = parseTag();

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

let cfe = firmware.slice(parseInt(image.cfeaddr), parseInt(image.cfeaddr) + parseInt(image.cfelen));
let rootfs = firmware.slice(parseInt(image.rootfsaddr), parseInt(image.rootfsaddr) + parseInt(image.rootfslen));
let kernel = firmware.slice(parseInt(image.kerneladdr), parseInt(image.kerneladdr) + parseInt(image.kernellen));

try { fs.mkdirSync('extracted'); } catch(e) {}
fs.writeFileSync('extracted/cfe.bin', cfe);
fs.writeFileSync('extracted/rootfs.bin', rootfs);
fs.writeFileSync('extracted/kernel.bin', kernel);