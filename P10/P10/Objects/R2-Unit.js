var grobjects = grobjects || [];
var R2 = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;
    var texture = null;

    R2 = function R2(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
        this.orientation = 0;
        this.counterR = 0;
        this.counterR2 = 0;
        this.counterP = 0;
        this.rotating = 0;
        this.initY = position[1];
        this.texture = null;
    };

    R2.prototype.init = function(drawingState) {

        var gl=drawingState.gl;

        if (texture == null) {
            this.texture = new Texture("https://farm5.staticflickr.com/4558/27242439119_87a98bd794_b.jpg", gl, 0);
            texture = this.texture;
        }
        else {
            this.texture = texture;
        }

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["rock-vs", "rock-fs"]);
        }
        if (!buffers) {
            var arrays = R2Mesh_data["object"];
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            shaderProgram.program.tex = gl.getUniformLocation(shaderProgram.program, "tex");
            gl.useProgram(shaderProgram.program);
            gl.uniform1i(shaderProgram.program.tex, 0);
            initTextureThenDraw(this.texture);
        }
    };
    R2.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        if (this.counterR >= 2*Math.PI) {
            // save memory in the long run
            this.counterR = 0;
        }
        twgl.m4.rotateY(modelM, -Math.PI/2+this.counterR, modelM);
        if (this.position[0] >= 3 && this.counterP === 1 && this.rotating !== 1) {
            this.counterP = 0;
            this.rotating = 1;
        }
        else if (this.position[0] <= -2 && this.counterP === 0 && this.rotating !== 1) {
            this.counterP = 1;
            this.rotating = 1;
        }
        if (this.counterP === 1 && this.rotating !== 1) {
            this.position[0] += 0.08;
        }
        else if (this.rotating !== 1) {
            this.position[0] -= 0.08;
        }
        else {
            if (this.counterR2 >= Math.PI) {
                this.rotating = 0;
                this.counterR2 = 0;
            }
            else {
                this.counterR2 += Math.PI/30;
                this.counterR += Math.PI/30;
            }
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
    R2.prototype.center = function(drawingState) {
        return this.position;
    }

})();

grobjects.push(new R2("R2-Unit",[0,1.35,4],.15));
