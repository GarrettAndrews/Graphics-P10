var grobjects = grobjects || [];
var earth2 = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;
    var texture = null;

    earth2 = function earth2(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
        this.orientation = 0;
        this.counter = 0;
        this.counterY = 0;
        this.circleScale = 8;
        this.initX = position[0];
        this.initY = position[1];
        this.initZ = position[2];
        this.texture = null;
    };

    earth2.prototype.init = function(drawingState) {

        var gl=drawingState.gl;

        if (texture == null) {
            this.texture = new Texture("https://farm5.staticflickr.com/4573/26548725309_8ee24aff5a_z.jpg", gl, 0);
            texture = this.texture;
        }
        else {
            this.texture = texture;
        }

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["rock-vs", "rock-fs"]);
        }
        if (!buffers) {
            var arrays = rocks_01_data["rock_01"];
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            shaderProgram.program.tex = gl.getUniformLocation(shaderProgram.program, "tex");
            gl.useProgram(shaderProgram.program);
            gl.uniform1i(shaderProgram.program.tex, 0);
            initTextureThenDraw(this.texture);
        }
    };
    earth2.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        if (this.counter >= 2*Math.PI) {
            this.counter = 0;
        }
        twgl.m4.rotateY(modelM, this.counter, modelM);
        this.position[0] = -this.initX*Math.cos(this.counter)+this.initZ*Math.sin(this.counter);
        this.position[2] = -this.initZ*Math.cos(-this.counter)-this.initX*Math.sin(-this.counter);
        this.counter += 0.05;
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
    earth2.prototype.center = function(drawingState) {
        return this.position;
    }

})();

grobjects.push(new earth2("strange purple rock",[0,0.2,3],.01));

