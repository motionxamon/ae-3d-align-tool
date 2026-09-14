const fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.resolve(__dirname, '..');
const w=28,h=24,pixels=Buffer.alloc(h*(w*4+1));
function rect(x,y,width,height) {
    for(let j=y;j<y+height;j++)for(let i=x;i<x+width;i++) {
        const offset=j*(w*4+1)+1+i*4;
        pixels.set([185,185,185,255],offset);
    }
}
rect(13,2,2,5);rect(13,17,2,5);rect(3,11,5,2);rect(20,11,5,2);
rect(10,8,8,8);rect(9,9,10,6);
function chunk(type,data){const t=Buffer.from(type),body=Buffer.concat([t,data]);let crc=0xffffffff;for(const b of body){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}const size=Buffer.alloc(4),sum=Buffer.alloc(4);size.writeUInt32BE(data.length);sum.writeUInt32BE((crc^0xffffffff)>>>0);return Buffer.concat([size,body,sum]);}
const header=Buffer.alloc(13);header.writeUInt32BE(w);header.writeUInt32BE(h,4);header[8]=8;header[9]=6;
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',zlib.deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]);
fs.mkdirSync(path.join(root,'tests/artifacts'),{recursive:true});
fs.writeFileSync(path.join(root,'tests/artifacts/align_center.png'),png);
const file=path.join(root,'AE_3D_Align_Tool.jsx');let code=fs.readFileSync(file,'utf8');
code=code.replace(/^        align_center: "iVB[^\n]*\n/m,'');
code=code.replace('var EMBEDDED_ICONS = {','var EMBEDDED_ICONS = {\n        align_center: "'+png.toString('base64')+'",');
fs.writeFileSync(file,code);
