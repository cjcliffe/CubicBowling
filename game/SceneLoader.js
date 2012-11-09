 function SceneLoader(sceneFile) {
    this.scene = CubicVR.loadCollada(sceneFile,"./images/");

    this.pinShape = null;

    this.ball = null;
    this.rigidBall = null;

    this.pins = [];
    this.rigidPins = [];    
}

SceneLoader.prototype = {
    getBall: function() {
        return this.ball;       
    },
    
    getRigidBall: function() {
        return this.rigidBall;  
    },

    getScene: function() {
        return this.scene;
    },
    
    getPins: function() {
        return this.pins;        
    },
    
    getRigidPins: function() {
        return this.rigidPins;
    },
    
    setupRigidBody: function(physics) {
        var i;
        var sceneObjs = this.scene.sceneObjects;

        this.pinShape = new CubicVR.CollisionMap();

        for (i = 0; i < sceneObjs.length; i++) {
            var sceneObj = sceneObjs[i];
            var objMesh = sceneObj.getMesh();

            if (objMesh) {
                if (objMesh.name === "CollisionCube-mesh") {
                    if (sceneObj.name.substr(0,7) === "pinBody") {
                        this.pinShape.addShape({
                            type: "cylinder",
                            size: sceneObj.scale,
                            position: CubicVR.vec3.subtract(sceneObj.position,[0,0.580,0])
                        });

                        this.scene.removeSceneObject(sceneObj);
                        i--;
                    } else {            
                        var body = new CubicVR.RigidBody(sceneObj,{
                            type: "static",
                            mass: 0,
                            margin: 0,
                            collision: {
                                type: "box",
                                size: sceneObj.scale
                            }
                        });

                        physics.bind(body);
                        this.scene.removeSceneObject(sceneObj);
                        i--;
                    }
                }
            }
            if (objMesh.name === "BowlingBall-mesh") {
                var body = new CubicVR.RigidBody(sceneObj,{
                            type: "dynamic",
                            mass: 6.5,
                            margin: 0,
                            collision: {
                                type: "sphere",
                                radius: sceneObj.scale[0]/2
                            }
                        });

                        physics.bind(body);
                        this.ball = sceneObj;
                        this.rigidBall = body;
            }
            if (sceneObj.name === "LaneModel") {
                sceneObj.shadowCast = false;
            }
       }

        
        for (i = 1; i <= 10; i++) {
            var sceneObj = this.scene.getSceneObject("Pin_"+i);
            this.pins[i-1] = sceneObj;
            var pin = new CubicVR.RigidBody(sceneObj,{
                            type: "dynamic",
                            mass: 1.5310,
                            margin: 0,
                            collision: this.pinShape
                        });

            physics.bind(pin);
            this.rigidPins[i-1] = pin;
        }
    }
}
