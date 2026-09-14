#target aftereffects
(function () {
    var root = new File($.fileName).parent.parent;
    var file = new File(root.fsName + '/AE_3D_Align_Tool.jsx');
    file.open('r');var code=file.read();file.close();
    code=code.replace(/^#target.*$/m,'');
    code=code.replace('    var panel = createUI(thisObj);', '$.global.alignTest={createUI:createUI,runAlign:runAlign,runDistribute:runDistribute,maskGeometry:maskGeometry,makeEvaluator:makeEvaluator,getLayerBounds:getLayerBounds,moveLayerByCompDelta:moveLayerByCompDelta,solveTargets:solveTargets};return; var panel = createUI(thisObj);');
    code=code.replace(/alert\(/g,'$.global.alignTestAlert(');
    var errors=[],results=[],comp=null,previous=app.project?app.project.activeItem:null;
    $.global.alignTestAlert=function(message){errors.push(String(message));};
    function check(ok,message){if(!ok)throw new Error(message);}
    function near(a,b){return Math.abs(a-b)<0.3;}
    function test(name,fn){try{errors=[];fn();check(!errors.length,errors.join('; '));results.push('PASS '+name);}catch(e){results.push('FAIL '+name+': '+e.toString()+' line '+e.line+' errors '+errors.join('; '));}}
    function pos(layer){return layer.property('ADBE Transform Group').property('ADBE Position');}
    function solid(name,x,y){var l=comp.layers.addSolid([1,1,1],name,100,100,1);pos(l).setValue([x,y]);return l;}
    function select(layers){for(var i=1;i<=comp.numLayers;i++)comp.layer(i).selected=false;for(i=0;i<layers.length;i++)layers[i].selected=true;}
    function mask(layer,vertices,mode){var m=layer.property('ADBE Mask Parade').addProperty('ADBE Mask Atom'),s=new Shape();s.vertices=vertices;s.closed=true;var ts=[];for(var i=0;i<vertices.length;i++)ts.push([0,0]);s.inTangents=ts;s.outTangents=ts;m.property('ADBE Mask Shape').setValue(s);m.maskMode=mode;return m;}
    function bounds(layer){var e=alignTest.makeEvaluator(comp);try{return alignTest.getLayerBounds(layer,e);}finally{e.remove();}}
    try {
        eval(code);
        if(!app.project)app.newProject();
        comp=app.project.items.addComp('__ALIGN_REGRESSION__',800,600,1,10,25);comp.openInViewer();comp.time=1;
        var a=solid('A',100,100),b=solid('B',300,200),c=solid('C',600,300);
        test('single center',function(){
            select([a]);
            alignTest.runAlign('center',0,false);
            var bb=bounds(a);
            check(near(bb.hcenter,400)&&near(bb.vcenter,300),'not centered '+bb.hcenter+','+bb.vcenter);
        });
        test('group center keeps offsets',function(){pos(a).setValue([100,100]);pos(b).setValue([300,200]);select([a,b]);alignTest.runAlign('center',0,true);check(near(pos(b).value[0]-pos(a).value[0],200),'spacing changed');var x=bounds(a),y=bounds(b);check(near((x.left+y.right)/2,400),'group not centered');});
        test('expression does not create keys',function(){pos(a).expression='value + [10,20]';select([a]);alignTest.runAlign('center',1,false);check(pos(a).numKeys===0,'extra key');check(near(bounds(a).hcenter,400),'expression not centered');pos(a).expression='';});
        test('keyframe at current time only',function(){pos(a).setValueAtTime(0,[100,100]);pos(a).setValueAtTime(2,[500,300]);select([a]);alignTest.runAlign('center',1,false);check(pos(a).numKeys===3,'wrong key count');check(pos(a).keyValue(1)[0]===100&&pos(a).keyValue(3)[0]===500,'neighbor values changed');while(pos(a).numKeys)pos(a).removeKey(pos(a).numKeys);});
        test('parent and child center',function(){b.parent=a;select([a,b]);alignTest.runAlign('center',1,false);check(near(bounds(a).hcenter,400)&&near(bounds(b).hcenter,400),'parent/child mismatch');b.parent=null;});
        test('failed probe restores value',function(){var original=pos(a).value,n=0,e={point:function(){if(++n===2)throw new Error('probe');return [0,0];}};try{alignTest.moveLayerByCompDelta(a,10,0,e);}catch(err){}check(near(pos(a).value[0],original[0])&&pos(a).numKeys===0,'probe was not restored');});
        test('failed probe restores Bezier settings',function(){var l=solid('Bezier test',100,100),p=pos(l);try{p.setValueAtTime(0,[100,100]);p.setValueAtTime(2,[500,300]);p.setInterpolationTypeAtKey(1,KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.BEZIER);p.setTemporalEaseAtKey(1,[new KeyframeEase(12,60)],[new KeyframeEase(15,70)]);var zero=p.keyInSpatialTangent(1),out=p.keyOutSpatialTangent(1);out[0]=30;out[1]=40;p.setSpatialTangentsAtKey(1,zero,out);var n=0;try{alignTest.moveLayerByCompDelta(l,10,0,{point:function(){if(++n===2)throw new Error('probe');return [0,0];}});}catch(err){}check(p.numKeys===2,'extra key');check(near(p.keyOutTemporalEase(1)[0].influence,70),'ease changed');check(near(p.keyOutSpatialTangent(1)[0],30),'tangent changed');}finally{l.remove();}});
        test('whole operation rolls back earlier moved layers',function(){pos(b).expression='[100,100]';var before=pos(a).value;select([a,b]);alignTest.runAlign('center',1,false);check(errors.length===1,'missing failure');errors=[];check(near(pos(a).value[0],before[0]),'partial move retained');pos(b).expression='';});
        test('fixed expression rolls back',function(){pos(a).expression='[100,100]';var v=pos(a).valueAtTime(1,true);select([a]);alignTest.runAlign('center',1,false);check(errors.length===1,'missing error');errors=[];check(pos(a).numKeys===0&&near(pos(a).valueAtTime(1,true)[0],v[0]),'rollback failed');pos(a).expression='';});
        test('intersect masks',function(){mask(c,[[0,0],[80,0],[80,100],[0,100]],MaskMode.ADD);mask(c,[[40,0],[100,0],[100,100],[40,100]],MaskMode.INTERSECT);var pts=alignTest.maskGeometry(c),lo=1e9,hi=-1e9;for(var i=0;i<pts.length;i++){lo=Math.min(lo,pts[i][0]);hi=Math.max(hi,pts[i][0]);}check(near(lo,40)&&near(hi,80),'wrong intersect');});
        test('curved mask extrema',function(){var l=solid('curve',100,100),m=mask(l,[[0,0],[100,0],[100,100],[0,100]],MaskMode.ADD);var sh=m.property('ADBE Mask Shape').value;sh.outTangents=[[0,200],[0,0],[0,0],[0,0]];m.property('ADBE Mask Shape').setValue(sh);var pts=alignTest.maskGeometry(l),max=-1e9;for(var i=0;i<pts.length;i++)max=Math.max(max,pts[i][1]);check(near(max,100),'handles treated as edges');l.remove();});
        test('subtract inverted and expansion',function(){var l=solid('masks',100,100),m=mask(l,[[0,0],[40,0],[40,100],[0,100]],MaskMode.SUBTRACT);function left(){var pts=alignTest.maskGeometry(l),min=1e9;for(var i=0;i<pts.length;i++)min=Math.min(min,pts[i][0]);return min;}check(near(left(),40),'subtract');m.maskMode=MaskMode.ADD;m.inverted=true;check(near(left(),40),'invert');m.inverted=false;m.property('ADBE Mask Offset').setValue(10);var pts=alignTest.maskGeometry(l),max=-1e9;for(var i=0;i<pts.length;i++)max=Math.max(max,pts[i][0]);check(near(max,50),'expansion');l.remove();});
        test('gap spacing',function(){select([a,b,c]);pos(a).setValue([100,300]);pos(b).setValue([300,300]);pos(c).setValue([600,300]);alignTest.runDistribute('hcenter',0);var x=bounds(a),y=bounds(b),z=bounds(c);check(near(y.left-x.right,z.left-y.right),'unequal gaps');});
        test('selected camera distribute restores camera states',function(){a.threeDLayer=true;b.threeDLayer=true;c.threeDLayer=true;var cam=comp.layers.addCamera('Test camera',[400,300]);var cam2=comp.layers.addCamera('Other camera',[400,300]);cam.enabled=false;select([a,b,c,cam]);alignTest.runDistribute('hcenter',4);check(!cam.enabled&&cam2.enabled,'camera switches not restored');});
        test('perspective gaps with oblique camera',function(){var cam=comp.activeCamera;pos(cam).setValue([1000,300,-1200]);pos(a).setValue([100,300,0]);pos(b).setValue([350,300,100]);pos(c).setValue([650,300,-100]);select([a,b,c]);alignTest.runDistribute('hcenter',0);var bs=[bounds(a),bounds(b),bounds(c)];bs.sort(function(x,y){return x.left-y.left;});check(near(bs[1].left-bs[0].right,bs[2].left-bs[1].right),'unequal perspective gaps');check(pos(a).value[2]===0&&pos(b).value[2]===100&&pos(c).value[2]===-100,'Z changed');});
        test('perspective group center',function(){var dx=bounds(b).hcenter-bounds(a).hcenter;select([a,b,c]);alignTest.runAlign('center',0,true);var bs=[bounds(a),bounds(b),bounds(c)],lo=1e9,hi=-1e9;for(var i=0;i<bs.length;i++){lo=Math.min(lo,bs[i].left);hi=Math.max(hi,bs[i].right);}check(near((lo+hi)/2,400),'group not centered');check(near(bounds(b).hcenter-bounds(a).hcenter,dx),'center offsets changed');});
        test('camera out of range rejects and restores',function(){var cam=comp.activeCamera;cam.inPoint=2;select([a,b,c,cam]);var before=pos(a).value;alignTest.runDistribute('hcenter',4);check(errors.length===1,'missing camera error');errors=[];check(near(pos(a).value[0],before[0]),'moved on camera error');cam.inPoint=0;});
        test('native panel builds 13 clickable controls',function(){var win=alignTest.createUI(null),count=0,center=false;function visit(control){if(control.onClick){count++;if(control.helpTip.indexOf('Center X/Y')===0)center=true;}if(control.children)for(var i=0;i<control.children.length;i++)visit(control.children[i]);}visit(win);check(count===13&&center,'missing center control');win.close();});
    } catch(e){results.push('FATAL '+e.toString()+' line '+e.line);}
    finally {
        if(comp)comp.remove();
        if(previous && previous instanceof CompItem)previous.openInViewer();
        var out=new File(root.fsName+'/tests/artifacts/ae-results.txt');out.encoding='UTF-8';out.open('w');out.write(results.join('\n'));out.close();
        delete $.global.alignTest;delete $.global.alignTestAlert;
    }
})();
