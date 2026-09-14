const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
let code=fs.readFileSync('AE_3D_Align_Tool.jsx','utf8').replace(/^#target.*$/m,'');
const names=['flattenMask','maskGeometry','setRawPositionValue','solveTargets','distributeGaps','decodeBase64'];
code=code.replace('    var panel = createUI(thisObj);','globalThis.api={'+names.join(',')+'};return; var panel = createUI(thisObj);');
const modes={NONE:0,ADD:1,SUBTRACT:2,INTERSECT:3,LIGHTEN:4,DARKEN:5,DIFFERENCE:6};
const context={MaskMode:modes};vm.createContext(context);vm.runInContext(code,context);const a=context.api;
let count=0;function test(name,f){f();console.log('PASS '+name);count++;}
function shape(vertices,out){return {closed:true,vertices,inTangents:vertices.map(()=>[0,0]),outTangents:out||vertices.map(()=>[0,0])};}
function box(x,y,w,h){return shape([[x,y],[x+w,y],[x+w,y+h],[x,y+h]]);}
function mask(s,mode=modes.ADD,extra={}){return {maskMode:mode,...extra,property(n){return {valueAtTime(){return n==='ADBE Mask Shape'?s:n==='ADBE Mask Opacity'?100:extra.expansion||0;}}}};}
function layer(masks){return {containingComp:{time:0},sourceRectAtTime:()=>({left:0,top:0,width:500,height:500}),property:()=>({numProperties:masks.length,property:i=>masks[i-1]})};}
function extent(points){return [Math.min(...points.map(p=>p[0])),Math.max(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[1]))];}
test('Bezier handles excluded from actual contour',()=>{const s=shape([[0,0],[100,0],[100,100],[0,100]],[[0,200],[0,0],[0,0],[0,0]]);assert(Math.abs(extent(a.maskGeometry(layer([mask(s)])))[3]-100)<0.1);});
test('Intersect is not union',()=>assert.deepStrictEqual(extent(a.maskGeometry(layer([mask(box(0,0,80,100)),mask(box(40,0,100,100),modes.INTERSECT)]))),[40,80,0,100]));
test('Subtract trims external edge',()=>assert.deepStrictEqual(extent(a.maskGeometry(layer([mask(box(0,0,40,500),modes.SUBTRACT)]))),[40,500,0,500]));
test('Inverted Add uses complement',()=>assert.deepStrictEqual(extent(a.maskGeometry(layer([mask(box(0,0,40,500),modes.ADD,{inverted:true})]))),[40,500,0,500]));
test('Expansion changes contour',()=>assert.deepStrictEqual(extent(a.maskGeometry(layer([mask(box(100,100,100,100),modes.ADD,{expansion:10})]))),[90,210,90,210]));
test('Disjoint intersection is empty',()=>assert.strictEqual(a.maskGeometry(layer([mask(box(0,0,50,50)),mask(box(100,100,50,50),modes.INTERSECT)])).length,0));
test('First active intersect after None',()=>assert.deepStrictEqual(extent(a.maskGeometry(layer([mask(box(0,0,50,50),modes.NONE),mask(box(100,100,50,50),modes.INTERSECT)]))),[100,150,100,150]));
test('Expression-only write does not add key',()=>{let wrote=false;a.setRawPositionValue({numKeys:0,isTimeVarying:true,setValue(){wrote=true;},setValueAtTime(){throw Error('extra key');}},[1,2],1);assert(wrote);});
test('Existing key updated without insert',()=>{let wrote=false;a.setRawPositionValue({numKeys:2,nearestKeyIndex:()=>1,keyTime:()=>1,setValueAtKey(){wrote=true;},setValueAtTime(){throw Error('extra key');}},[1,2],1);assert(wrote);});
test('New time inserts key',()=>{let wrote=false;a.setRawPositionValue({numKeys:2,nearestKeyIndex:()=>1,keyTime:()=>0,setValueAtTime(){wrote=true;}},[1,2],1);assert(wrote);});
test('All embedded icons decode to PNG',()=>{const icons=[...code.matchAll(/^        \w+: "(iVB[^"\n]+)"/gm)];assert.strictEqual(icons.length,13);for(const m of icons)assert(Buffer.from(a.decodeBase64(m[1]),'binary').equals(Buffer.from(m[1],'base64')));});
console.log(count+' checks passed');
