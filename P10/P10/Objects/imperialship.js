var grobjects = grobjects || [];
var imperialship = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;
    var bumpMap = null;
    var texture = null;

    imperialship = function imperialship(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
        this.orientation = 0;
        this.counter = 0;
        this.counterY = 0;
        this.circleScale = 8;
        this.bumpMap = null;
        this.initY = position[1];
        this.texture = null;
    };

    imperialship.prototype.init = function(drawingState) {

        var gl=drawingState.gl;

        if (texture == null) {
            this.texture = new Texture("https://farm5.staticflickr.com/4518/38905376372_16b1268381_b.jpg", gl, 0);
            texture = this.texture;
        }
        else {
            this.texture = texture;
        }

        // adding the normal map
        if (bumpMap == null) {
            this.bumpMap = new Texture("https://farm5.staticflickr.com/4585/38905377182_c2cea39dda_b.jpg", gl, 1);
            bumpMap = this.bumpMap;
        }
        else {
            this.bumpMap = bumpMap;
        }

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["rock-vs", "rock-fs"]);
        }
        if (!buffers) {
            var arrays = imperialship_data["object"];
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            shaderProgram.program.normalMap = gl.getUniformLocation(shaderProgram.program, "normalMap");
            shaderProgram.program.tex = gl.getUniformLocation(shaderProgram.program, "tex");
            gl.useProgram(shaderProgram.program);
            gl.uniform1i(shaderProgram.program.normalMap, 1);
            initTextureThenDraw(this.bumpMap);
            gl.uniform1i(shaderProgram.program.tex, 0);
            initTextureThenDraw(this.texture);
        }
    };
    imperialship.prototype.draw = function(drawingState) {
        // some basic movements, looking to make better in next part
        if (this.initY === 15) {
            // floating model
            this.position[1] = this.initY + 2 * Math.cos(this.counterY);
            this.counterY = this.counterY + 0.05;
        }
        /*else if (this.initY % 2 === 0) {
            if (this.counter >= 2 * Math.PI) {
                this.counter = 0;
            }
            if (this.counterY >= 2 * Math.PI) {
                this.counterY = 0;
            }

            this.position[0] = this.circleScale * Math.cos(this.counter);
            this.position[1] = this.initY + 2 * Math.cos(this.counterY);
            this.position[2] = this.circleScale * Math.sin(this.counter);
            this.counter = this.counter + 0.035;
            this.counterY = this.counterY + 0.05;
        }
        else {
            if (this.counter >= 2*Math.PI) {
                this.counter = 0;
            }
            if (this.counterY >= 2*Math.PI) {
                this.counterY = 0;
            }

            this.position[0] = this.circleScale*Math.sin(this.counter);
            this.position[1] = this.initY + 2*Math.cos(this.counterY);
            this.position[2] = this.circleScale*Math.cos(this.counter);
            this.counter = this.counter + 0.020;
            this.counterY = this.counterY + 0.05;
        }*/
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        if (this.initY === 15) {
            // floating model, so rotate to face camera init pos
            twgl.m4.rotateY(modelM, Math.PI, modelM);
            twgl.m4.rotateX(modelM, -Math.PI/7, modelM);
            //twgl.m4.rotateZ(modelM, -Math.PI/7, modelM);
        }
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        console.log();
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            model: modelM, normalM: twgl.m4.transpose(twgl.m4.inverse(modelM))});
        gl.activeTexture(gl.TEXTURE0);
        this.texture.bindTexture();
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    imperialship.prototype.center = function(drawingState) {
        return this.position;
    }

})();

grobjects.push(new imperialship("imperialship",[0,15,-20],1));
grobjects.push(new imperialship("imperialship2",[-15,0,-15],1));

