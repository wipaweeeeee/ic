/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//==============================================================================

// How to load in modules
const Diagnostics = require('Diagnostics');
const Scene = require('Scene');
const Patches = require('Patches');

const Textures = require('Textures');
const Shaders = require('Shaders');
const Materials = require('Materials');
const R = require('Reactive');

var cameraTex;
var imageTex;
var final;

(async function preload() {
  // Locate the material and texture in the Assets
  const [camTex, finalMat] = await Promise.all([
    Textures.findFirst('camTex'),
    Materials.findFirst('red')
  ]);

  const allText = await Promise.all([Textures.getAll()]);

  cameraTex = camTex.signal;
  imageTex = allText[0][2].signal;
  Diagnostics.log(allText[0][2])
  final = finalMat;

})().then(() => {
	const cameraColor = cameraTex;
	const imgColor = imageTex;
	const texcoords = Shaders.vertexAttribute({'variableName': Shaders.VertexAttribute.TEX_COORDS});

	var maxrb = R.max( cameraColor.x, cameraColor.z );
	var k = R.clamp( R.mul( 8.0, ( R.sub (cameraColor.y, maxrb) ) ), 0.0, 1.0);
	var colors = cameraColor;
	var dg = cameraColor.y;
	dg = R.min(cameraColor.y, R.mul(maxrb, 0.8));
	colors = colors.add(R.sub(dg, cameraColor.y));

	let tempVec4 = R.mix(colors, imgColor, k);

	// Set the material you want to apply the shader to below
	final.setTextureSlot("diffuseTexture", tempVec4);
})

// Diagnostics.log("did i do it");






