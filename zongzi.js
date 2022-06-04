// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();


// GLTF loader
const gltfLoader = new THREE.GLTFLoader();

/**
 * Model
 */

let star, asteroids;
gltfLoader.load("./glb/zongziStar.glb", async (gltf) => {

	star = await gltf.scene.children.find((child) => child.name === 'zongziStar');
	asteroids = await gltf.scene.children.find((child) => child.name === 'asteroids');

	console.log(star, asteroids.name, 'inner')

	scene.add(gltf.scene);

	animate();
});

// Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);



/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = -4;
camera.position.y = 2;
camera.position.z = -16;
scene.add(camera);

// Controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

// Don't go below the ground
controls.maxPolarAngle = Math.PI / 2 - 0.1;


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;


const geometry = new THREE.BufferGeometry() // 几何体
const vertices = [] // 保存变量（x，y，z） - 用于设置 geometry 的位置！
const size = 100

// 散布于空中的点 - 尘埃效果！
for (let i = 0; i < 2000; i++) {
	const x = (Math.random() * size + Math.random() * size) / 2 - size / 2
	const y = (Math.random() * size + Math.random() * size) / 2 - size / 2
	const z = (Math.random() * size + Math.random() * size) / 2 - size / 2
	vertices.push(x, y, z)
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)) // 几何
material = new THREE.PointsMaterial({ // 材质（点材质）
	size: 0.08,
	color: 0xffffff,
})
const particles = new THREE.Points(geometry, material) // 创建图形 （几何 + 材质）
scene.add(particles) // 添加进场景！

/**
 * Animate
 */

const animate = () => {
	// Update controls
	controls.update();

	rotate();

	// Render
	renderer.render(scene, camera);

	window.requestAnimationFrame(animate);
};

function rotate() {
	asteroids.rotation.z += 0.002;
	star.rotation.x += 0.002;
	star.rotation.y += 0.002;

	particles.rotation.y -= 0.002;
}
