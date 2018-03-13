var grobjects = grobjects || [];
var earth = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;
    var texture = null;
    var bumpMap2 = null;

    earth = function earth(name, position, size, color) {
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
        this.bumpMap2 = null;
    };

    earth.prototype.init = function(drawingState) {

        var gl=drawingState.gl;

        if (texture == null) {
            this.texture = new Texture("https://farm5.staticflickr.com/4521/27240291229_c90dde9215_b.jpg", gl, 0);
            texture = this.texture;
        }
        else {
            this.texture = texture;
        }

        // adding the normal map
        if (bumpMap2 == null) {
            this.bumpMap2 = new Texture("https://farm5.staticflickr.com/4530/25147126358_b675b6ca61_b.jpg", gl, 1);
            bumpMap2 = this.bumpMap2;
        }
        else {
            this.bumpMap2 = bumpMap2;
        }

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["rock-vs", "rock-fs"]);
        }
        if (!buffers) {
            var arrays = Earth_Mesh_data["object"];
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            shaderProgram.program.normalMap = gl.getUniformLocation(shaderProgram.program, "normalMap");
            shaderProgram.program.tex = gl.getUniformLocation(shaderProgram.program, "tex");
            gl.useProgram(shaderProgram.program);
            gl.uniform1i(shaderProgram.program.normalMap, 1);
            initTextureThenDraw(this.bumpMap2);
            gl.uniform1i(shaderProgram.program.tex, 0);
            initTextureThenDraw(this.texture);
        }
    };
    earth.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.rotateY(modelM, this.counter, modelM);
        this.counter += 0.01;
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
        gl.activeTexture(gl.TEXTURE1);
        this.bumpMap2.bindTexture();
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    earth.prototype.center = function(drawingState) {
        return this.position;
    }

})();

grobjects.push(new earth("moon",[10,0,-15],2.5));

