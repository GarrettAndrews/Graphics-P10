
function Texture(src, gl, textureNum) {
    this.src = src;
    this.image = new Image();
    this.texture = gl.createTexture();
    this.gl = gl;
    this.textureNum = textureNum;
}

Texture.prototype.bindTexture = function() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
};

function setActiveTexture(texture, gl) {
    if (texture === 0) {
        gl.activeTexture(gl.TEXTURE0);
    }
    else if (texture === 1) {
        gl.activeTexture(gl.TEXTURE1);
    }
    else if (texture === 2) {
        gl.activeTexture(gl.TEXTURE2);
    }
    else if (texture === 3) {
        gl.activeTexture(gl.TEXTURE3);
    }
}

function initTextureThenDraw(texture)
{
	setActiveTexture(texture.textureNum, texture.gl);
	texture.gl.bindTexture(texture.gl.TEXTURE_2D, texture.texture);
	texture.gl.texImage2D(texture.gl.TEXTURE_2D, 0, texture.gl.RGBA, 1, 1, 0, texture.gl.RGBA, texture.gl.UNSIGNED_BYTE, null);
	texture.image.onload = function() { LoadTexture(texture.texture, texture.image, texture.gl, texture.textureNum) };
	texture.image.crossOrigin = "anonymous";
	texture.image.src = texture.src;
}

function LoadTexture(texture, image, gl, textureNum) {
        setActiveTexture(textureNum, gl);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
}