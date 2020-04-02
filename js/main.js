var canvas;
var engine;
var scene;
document.addEventListener("DOMContentLoaded", startGame);

function startGame() {
  canvas = document.getElementById("renderCanvas");
  //   canvas.style.width = "3500px";
  //   canvas.style.height = "2100px";
  engine = new BABYLON.Engine(canvas, true);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  scene = createScene();
  engine.runRenderLoop(function() {
    scene.render();
  });
}

var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  // scene.clearColor = new BABYLON.Color3(1, 2, 0.5);
  // scene.ambientColor = new BABYLON.Color3(4, 1, 0);
  // Ground Material
  var ground = BABYLON.Mesh.CreateGround("myGround", 60, 60, 50, scene);
  var mirrorMaterial = new BABYLON.StandardMaterial("mirrorMaterial", scene);
  mirrorMaterial.diffuseColor = new BABYLON.Color3(0.4, 1, 0.4);
  mirrorMaterial.specularColor = new BABYLON.Color3.Black();
  mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture(
    "mirror",
    1024,
    scene,
    true
  );
  mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(
    0,
    -1,
    0,
    -2
  );
  mirrorMaterial.reflectionTexture.level = 0.6; // lvl of reflection
  ground.material = mirrorMaterial;

  // Sphere Generation
  var spheresSkeleton = [...Array(11).keys()];
  var sphereMaterials = [];

  let spheres = spheresSkeleton.map((sphere, index) => {
    sphere = BABYLON.Mesh.CreateSphere("mySphere" + index, 32, 2, scene);
    sphere.position.x = 3 * index - 9;
    sphere.position.y = 2;
    console.log(sphere.position.z)
    sphereMaterials[index] = new BABYLON.StandardMaterial(
      "sphereMaterial" + index,
      scene
    );
    sphere.material = sphereMaterials[index];
    mirrorMaterial.reflectionTexture.renderList.push(sphere);
    return sphere;
  });

  sphereMaterials.forEach((material, index) => {
    material.ambientColor = new BABYLON.Color3(0, 0.5, 0);
    material.diffuseColor = new BABYLON.Color3(index, 0, 0);
    material.specularColor = new BABYLON.Color3(0, 0, index + 1);
    material.specularPower = index;
  });

  // New Universal Camera with Target
  var camera = new BABYLON.UniversalCamera(
    "UniversalCamera",
    new BABYLON.Vector3(0.00014, 21.73716, -56.1449688),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  // scene.onPointerPick = function() {
  //   console.log(camera.position);
  // };

  // Lighting
  var light = new BABYLON.PointLight(
    "myPointLight",
    new BABYLON.Vector3(0, 10, 0),
    scene
  );
  // light.diffuse = new BABYLON.Color3(1,0,0);
  light.intensity = 0.4;
  var counter = 0;
  scene.registerBeforeRender(() => {
    // console.log(spheres)
    spheres.forEach((sphere, index) => {
      // sphere.position.z = Math.sin(counter);
      sphere.position.y += 0.19 *index* Math.sin((index * counter)/2);
      counter += 0.005;
    });
  });
  return scene;
};

// Resize
window.addEventListener("resize", function(camera) {
  engine.resize();
});
