var grobjects = grobjects || [];
var tieFighter = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;
    var texture = null;

    tieFighter = function tieFighter(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
        this.orientation = 0;
        this.counter = 0;
        this.counterY = 0;
        this.circleScale = 8;
        this.initY = position[1];
        this.texture = null;
    };

    tieFighter.prototype.init = function(drawingState) {

        var gl=drawingState.gl;

        if (texture == null) {
            this.texture = new Texture("https://farm5.staticflickr.com/4547/27044924709_2874d753c2_b.jpg", gl, 0);
            texture = this.texture;
        }
        else {
            this.texture = texture;
        }

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["rock-vs", "rock-fs"]);
        }
        if (!buffers) {
            var arrays = tieFighter_data["object"];
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            shaderProgram.program.tex = gl.getUniformLocation(shaderProgram.program, "tex");
            gl.useProgram(shaderProgram.program);
            gl.uniform1i(shaderProgram.program.tex, 0);
            initTextureThenDraw(this.texture);
        }
    };
    tieFighter.prototype.draw = function(drawingState) {
        // some basic movements, looking to make better in next part
        if (this.initY === 0) {
            // model for inspection
            this.position[1] = 2;
        }
        else if (this.initY % 2 === 0) {
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
        }
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
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
    tieFighter.prototype.center = function(drawingState) {
        return this.position;
    }

})();

grobjects.push(new tieFighter("tieFighter1",[-3,4,-6],.05));
grobjects.push(new tieFighter("tieFighter2",[-3,-1,-6],.05));
//grobjects.push(new tieFighter("tieFighter",[-3.5,0,3],.05));

