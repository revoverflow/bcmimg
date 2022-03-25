function readString(firmware, offset, size) {
    let str = firmware.slice(offset, offset + size).toString('utf8');
    offset += size;
    return str;
}

function readByteArray(firmware, offset, size) {
    let arr = firmware.slice(offset, offset + size);
    offset += size;
    return arr;
}

class BroadcomImage {

    static parseImage(firmware) {
        let image = {};
        let offset = 0;

        image.tagVersion = readString(firmware, offset, 4);
        offset += 4;
        image.company = readString(firmware, offset, 20);
        offset += 20;
        image.additional = readString(firmware, offset, 14);
        offset += 14;
        image.chipid = readString(firmware, offset, 6);
        offset += 6;
        image.boardid = readString(firmware, offset, 16);
        offset += 16;
        image.bigendian = readString(firmware, offset, 2);
        offset += 2;
        image.imagelength = readString(firmware, offset, 10);
        offset += 10;
        image.cfeaddr = readString(firmware, offset, 12);
        offset += 12;
        image.cfelen = readString(firmware, offset, 10);
        offset += 10;
        image.rootfsaddr = readString(firmware, offset, 12);
        offset += 12;
        image.rootfslen = readString(firmware, offset, 10);
        offset += 10;
        image.kerneladdr = readString(firmware, offset, 12);
        offset += 12;
        image.kernellen = readString(firmware, offset, 10);
        offset += 10;
        image.sequence = readString(firmware, offset, 4);
        offset += 4;
        image.version = readString(firmware, offset, 32);
        offset += 32;
        image.reserved = readByteArray(firmware, offset, 42);
        offset += 42;
        image.img_validation_token = readByteArray(firmware, offset, 20);
        offset += 20;
        image.tag_validation_token = readByteArray(firmware, offset, 20);

        image.rootfs = firmware.slice(parseInt(image.rootfsaddr), parseInt(image.rootfsaddr) + parseInt(image.rootfslen));
        image.kernel = firmware.slice(parseInt(image.kerneladdr), parseInt(image.kerneladdr) + parseInt(image.kernellen));
        image.cfe = firmware.slice(parseInt(image.cfeaddr), parseInt(image.cfeaddr) + parseInt(image.cfelen));

        return image;
    }

    static createImage(tag, cfe, rootfs, kernel) {
        let firmware = Buffer.alloc(256);
        let offset = 0;

        firmware.write(tag.tagVersion, offset, 4);
        offset += 4;
        firmware.write(tag.company, offset, 20);
        offset += 20;
        firmware.write(tag.additional, offset, 14);
        offset += 14;
        firmware.write(tag.chipid, offset, 6);
        offset += 6;
        firmware.write(tag.boardid, offset, 16);
        offset += 16;
        firmware.write(tag.bigendian, offset, 2);
        offset += 2;
        firmware.write(tag.imagelength, offset, 10);
        offset += 10;
        firmware.write("256", offset, 12);
        offset += 12;
        firmware.write(cfe.length.toString(), offset, 10);
        offset += 10;
        firmware.write((256+cfe.length).toString(), offset, 12);
        offset += 12;
        firmware.write(rootfs.length.toString(), offset, 10);
        offset += 10;
        firmware.write((256+cfe.length+rootfs.length).toString(), offset, 12);
        offset += 12;
        firmware.write(kernel.length.toString(), offset, 10);
        offset += 10;
        firmware.write(tag.sequence, offset, 4);
        offset += 4;
        firmware.write(tag.version, offset, 32);
        offset += 32;
        tag.reserved.copy(firmware, offset, 0, 42);
        offset += 42;
        tag.img_validation_token.copy(firmware, offset, 0, 20);
        offset += 20;
        tag.tag_validation_token.copy(firmware, offset, 0, 20);
        offset += 20;

        firmware = Buffer.concat([firmware, cfe, rootfs, kernel]);

        return firmware;
    }

}

module.exports = BroadcomImage;