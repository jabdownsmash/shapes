
var fogD = 0.0035;

createMenu = function()
{
    var currentSettings = {color:0,shape:0,mutation:0,pulse:0};
    var rows = [];

    var colors = [[0xFFFFFF,0x000000,0x000000],[0xFF3D7F,0x3F284F,0xDAD8A7],[0xCFF09E,0x0B486B,0x3B8686],[0xE97F02,0x7D1550,0x490A3D]]
    var colorObjects = []
    for( var i = 0; i < colors.length; i++)
    {
        var addFunc = function(j)
        {
            colorObjects.push({
                fgColor : colors[j][0],
                mgColor : colors[j][1],
                bgColor : colors[j][2],
                setColors : function(obj){
                    obj.material.color.setHex( colors[j][1] );
                },
                setGlobalColors : function(app){
                    app.scene.fog = new THREE.FogExp2( colors[j][1], fogD);
                    app.renderer.setClearColor( colors[j][2]);
                },
            });
        };
        addFunc(i);
    }
    rows.push(colorObjects);

    var shapes = [new THREE.DodecahedronGeometry( 2 , 2), new THREE.TorusKnotGeometry( 1, .6, 10, 20 ), new THREE.TorusGeometry( 1, .6, 10, 20)];
    var shapeObjects = [];
    for( var i = 0; i < shapes.length; i++)
    {
        var addFunc = function(j)
        {
            shapeObjects.push({
                shape : shapes[j],
                getGeom : function(){
                    return shapes[j].clone();
                },
                setShape : function(obj){
                    obj.obj.geometry = shapes[j].clone();
                    obj.addOriginalVertices();
                    obj.reset();
                }
            })
        };
        addFunc(i);
    }

    rows.push(shapeObjects);

    var mutations = [function(obj){},
            function(obj){
                shapePasses.rotate(1,0,0)(obj);
                shapePasses.quadExpandPass(.5,1,3,0)(obj);
                shapePasses.quadExpandPass(2,.1,2,0)(obj);
                obj.reset();
            },
            function(obj){
                shapePasses.rotate(0,0,1)(obj);
                shapePasses.linearExpandPass(1,-1,3,0)(obj);
                shapePasses.rotate(0,0,-1)(obj);
                obj.reset();
            },
            function(obj){
                shapePasses.spinPass(1)(obj);
                obj.reset();
            }];

    var mutationObjects = []
    for( var i = 0; i < mutations.length; i++)
    {
        var addFunc = function(j)
        {
            mutationObjects.push({
                setMutation : function(obj){
                    mutations[j](obj);
                }
            });
        }
        addFunc(i);
    }

    rows.push(mutationObjects);

    var pulses = [
            [ function(obj){},function(obj){obj.passes.push(motionPasses.expoPass);}],
            [ function(obj){motionPasses.randomizeVertices(.1 + obj.pulseMult/4)(obj);},function(obj){obj.passes.push(motionPasses.expoPass);}],
            [ function(obj){motionPasses.addRandom(.1 + obj.pulseMult/4)(obj);},function(obj){obj.passes.push(motionPasses.springPass);}],
            [ function(obj){shapePasses.rotate(0,0,(.1 + obj.pulseMult/4)*Math.PI)(obj);},function(obj){obj.passes.push(motionPasses.expoPass);}]
        ];

    var pulseObjects = []
    for( var i = 0; i < pulses.length; i++)
    {
        var addFunc = function(j)
        {
            pulseObjects.push({
                setPulse : function(obj){
                    obj.pulseFunc = pulses[j][0];
                    pulses[j][1](obj);
                }
            });
        }
        addFunc(i);
    }

    rows.push(pulseObjects);

    var formatSettings = function(settings)
        {
            var color = 0;
            var shape = 0;
            var mutation = 0;
            var pulse = 0;
            if(!settings)
            {
                settings = {};
            }
            if(!settings.color)
            {
                settings.color = 0;
            }
            if(!settings.shape)
            {
                settings.shape = 0;
            }
            if(!settings.mutation)
            {
                settings.mutation = 0;
            }
            if(!settings.pulse)
            {
                settings.pulse = 0;
            }
            return settings;
        };

    var setSettings = function(obj,settings)
    {
        obj.pulseMult = 0;
        obj.shape = settings.shape;
        if(obj.shape > 0) {obj.pulseMult += 1;}
        obj.color = settings.color;
        if(obj.color > 0) {obj.pulseMult += 1;}
        obj.mutation = settings.mutation;
        if(obj.mutation > 0) {obj.pulseMult += 1;}
        obj.pulse = settings.pulse;
        if(obj.shape > 0) {obj.pulseMult += 1;}

    }

    var menu = {
        rows:rows,
        // triggerMenu: function(menuID,scene,mainObject)
        // {
        // },
        generateObject: function(settings)
            {
                settings = formatSettings(settings);
                var obj = new Bun(rows[1][settings.shape].getGeom(),rows[0][settings.color].fgColor);
                rows[2][settings.mutation].setMutation(obj);
                rows[3][settings.pulse].setPulse(obj);
                setSettings(obj,settings);
                obj.pulseFunc(obj);
                return obj;
            },
        settingsFromObject: function(obj)
            {
                var settings = {}
                settings.shape = obj.shape;
                settings.color = obj.color;
                settings.mutation = obj.mutation;
                settings.pulse = obj.pulse;
                return settings;
            },
        copyObject: function(obj)
            {
                var newObj = this.generateObject(this.settingsFromObject(obj));
                newObj.setTo(obj);
                return newObj; 
            },
        transformTo: function(obj,settings,fog,renderer)
            {
                formatSettings(settings);
                var oldGeom = obj.obj.geometry.clone();
                var other = new Bun(rows[1][obj.shape].getGeom(),rows[0][obj.color].fgColor);
                other.obj.geometry = oldGeom;

                rows[1][settings.shape].setShape(obj);
                // obj.obj.geometry.verticesNeedUpdate = true;

                obj.passes = [];
                rows[2][settings.mutation].setMutation(obj);
                rows[3][settings.pulse].setPulse(obj);
                obj.setTo(other);

                var col = new THREE.Color(rows[0][settings.color].fgColor).getHSL();
                var col2 = obj.obj.material.color.getHSL();
                if((col2.h - col.h) > .5 ){col.h += 1;}
                new TWEEN.Tween(col2)
                    .to({h: col.h, s: col.s, l: col.l}, 200)
                    .onUpdate(
                        function()
                            {
                                obj.obj.material.color.setHSL(this.h, this.s, this.l);
                            })
                    .start();
                if(renderer)
                {
                    var col = new THREE.Color(rows[0][settings.color].bgColor).getHSL();
                    var col2 = renderer.getClearColor().getHSL();
                    if((col2.h - col.h) > .5 ){col.h += 1;}
                    new TWEEN.Tween(col2)
                        .to({h: col.h, s: col.s, l: col.l}, 300)
                        .onUpdate(
                            function()
                                {
                                    var color = new THREE.Color();
                                    color.setHSL(this.h, this.s, this.l);
                                    renderer.setClearColor(color.getHex());
                                })
                        .start();
                }
                if(fog)
                {
                    var col = new THREE.Color(rows[0][settings.color].mgColor).getHSL();
                    var col2 = fog.color.getHSL();
                    if((col2.h - col.h) > .5 ){col.h += 1;}
                    new TWEEN.Tween(col2)
                        .to({h: col.h, s: col.s, l: col.l}, 300)
                        .onUpdate(
                            function()
                                {
                                    var color = new THREE.Color();
                                    fog.color.setHSL(this.h, this.s, this.l);
                                })
                        .start();
                }
                
                setSettings(obj,settings);

            },
        currentSettings: currentSettings,
    }
    return menu;
}