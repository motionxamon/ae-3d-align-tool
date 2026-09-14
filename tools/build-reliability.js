const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'AE_3D_Align_Tool.jsx');
let code = fs.readFileSync(file, 'utf8');
for (const name of ['cornerExpr','getSourceBounds','getMaskBounds','getLayerMaskPoints','isBoundsMask','localPointExpr','formatNumber','intersectBounds','getRawPositionValueAtTime','getPositionValueWithExpressionDisabled','getMovingLayersForAlign','getSelectedCamera']) {
    code = code.replace(new RegExp('^    function ' + name + '\\([^]*?^    \\}\\r?\\n', 'm'), '');
}
const fixes = fs.readFileSync(path.join(root, 'src/reliability.jsxinc'), 'utf8');
for (const match of fixes.matchAll(/^    function (\w+)\([^]*?^    \}/gm)) {
    const name = match[1];
    const pattern = new RegExp('^    function ' + name + '\\([^]*?^    \\}', 'm');
    if (pattern.test(code)) code = code.replace(pattern, () => match[0]);
    else code = code.replace('    var panel = createUI(thisObj);', match[0] + '\n\n    var panel = createUI(thisObj);');
}
const vendor = fs.readFileSync(path.join(root, 'vendor/clipper.js'), 'utf8');
const notice = fs.readFileSync(path.join(root, 'vendor/NOTICE.txt'), 'utf8');
const bundled = '    // BEGIN CLIPPER BUNDLE\n/*\n' + notice + '\n*/\n    var ClipperLib = (function () {\n        var module = {exports:{}};\n' + vendor + '\n        return module.exports;\n    })();\n    // END CLIPPER BUNDLE';
if (code.includes('    // BEGIN CLIPPER BUNDLE')) code = code.replace(/    \/\/ BEGIN CLIPPER BUNDLE[^]*?    \/\/ END CLIPPER BUNDLE/, () => bundled);
else code = code.replace('    var panel = createUI(thisObj);', bundled + '\n\n    var panel = createUI(thisObj);');
fs.writeFileSync(file, code);
