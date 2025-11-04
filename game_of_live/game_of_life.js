import * as THREE from './js/three.module.js';
import init, { CellID, Grid, GridSimd } from "./pkg/game_of_live.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaa0f0f0);
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(-aspect, aspect, 1.0, -1.0, -10, 10);

camera.left = -aspect;
camera.right = aspect;
camera.top = 1.0;
camera.bottom = -1.0;

camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement);

const SIZE = 64;
const size = SIZE * SIZE;

await init();
const grid = new Grid();

grid.flip_cell(new CellID(0, -1, 64 * 62 + 1));
grid.flip_cell(new CellID(0, -1, 64 * 63));
grid.flip_cell(new CellID(0, 0, 0));
grid.flip_cell(new CellID(0, 0, 1));
grid.flip_cell(new CellID(0, 0, 2));
let update_amount = 0;
let next_update = 0;

const geometry = new THREE.PlaneGeometry(1, 1); // Square plane

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    // update orthographic camera bounds
    camera.left = -aspect;
    camera.right = aspect;
    camera.top = 1.0;
    camera.bottom = -1.0;

    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const mouse = {
    prev_x: 0,
    prev_y: 0,
    x: 0,
    y: 0,
    movement_x: 0,
    movement_y: 0,
    clicked: false,
    pressed: false,
    moved: false,

    down_time: 0,
    threshhold: 300, //100ms to be a hold
};

document.addEventListener("mousemove", (event) => {
    mouse.prev_x = mouse.x;
    mouse.prev_y = mouse.y;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.movement_x = mouse.x - mouse.prev_x;
    mouse.movement_y = mouse.y - mouse.prev_y;

    mouse.moved = true;
});

document.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // left mouse button
        mouse.down_time = Date.now();
        mouse.pressed = true;
    }
});

document.addEventListener('mouseup', (event) => {
    if (event.button === 0) {
        const pressDuration = Date.now() - mouse.down_time;
        if (pressDuration < mouse.threshhold) {
            // Quick click
            mouse.clicked = true;
        }

        mouse.pressed = false;
    }
});

document.addEventListener("wheel", (event) => {
    event.preventDefault();
    const mousePos = getMouseWorldPosition(event);
    const zoomFactor = event.deltaY < 0 ? 1 / 1.1 : 1.1;

    // Adjust camera boundaries
    const newLeft = mousePos.x + (camera.left - mousePos.x) * zoomFactor;
    const newRight = mousePos.x + (camera.right - mousePos.x) * zoomFactor;
    const newTop = mousePos.y + (camera.top - mousePos.y) * zoomFactor;
    const newBottom = mousePos.y + (camera.bottom - mousePos.y) * zoomFactor;

    camera.left = newLeft;
    camera.right = newRight;
    camera.top = newTop;
    camera.bottom = newBottom;

    camera.updateProjectionMatrix();
}, { passive: false });

function getMouseWorldPosition() {
    const placementPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    // Normalize mouse coordinates (-1 to 1)
    let pos = new THREE.Vector2(0.0, 0.0);

    pos.x = (mouse.x / window.innerWidth) * 2 - 1;
    pos.y = -(mouse.y / window.innerHeight) * 2 + 1;

    // Raycast from camera
    raycaster.setFromCamera(pos, camera);

    // Find intersection with z = 0 plane
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(placementPlane, intersectPoint);

    return intersectPoint;
}

const slider = document.getElementById('mySlider');
const valueDisplay = document.getElementById('sliderValue');
let sliderValue = parseFloat(slider.value);

function updateSlider(value) {
    // Clamp between min and max
    sliderValue = Math.min(Math.max(value, parseFloat(slider.min)), parseFloat(slider.max));
    slider.value = sliderValue.toFixed(1);
    valueDisplay.textContent = sliderValue.toFixed(1);
    update_amount = sliderValue;
}

slider.addEventListener('input', () => {
    updateSlider(parseFloat(slider.value));
});

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        grid.update();
    }
});

function animate() {
    let chunks = grid.get_active_chunks();
    let meshes = new Array(chunks.length);

    chunks = grid.get_active_chunks();

    chunks.forEach((chunk, i) => {
        // Fill the data with a pattern (e.g., gradient)

        const data = new Uint8Array(4 * size); // RGBA for each pixel

        for (let i = 0; i < size; i++) {
            const stride = i * 4;

            if (chunk.cell_alive(i)) {
                data[stride] = 0;
                data[stride + 1] = 0;
                data[stride + 2] = 0;
                data[stride + 3] = 255;
            } else {
                data[stride] = 255;
                data[stride + 1] = 255;
                data[stride + 2] = 255;
                data[stride + 3] = 255;
            }
        }

        const texture = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat);
        texture.needsUpdate = true;

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = chunk.get_pos_x() * camera.zoom;
        mesh.position.y = chunk.get_pos_y() * camera.zoom;
        mesh.scale.x = camera.zoom;
        mesh.scale.y = camera.zoom;

        meshes.push(mesh);
        scene.add(mesh);
    });

    renderer.clear();
    renderer.render(scene, camera);

    meshes.forEach((mesh, i) => {
        scene.remove(mesh);
    });

    if (mouse.clicked) {
        const pos = getMouseWorldPosition();
        // pos.x -= 0.5 * camera.zoom;
        // pos.y += 0.5 * camera.zoom;

        if (pos.x < 0) {
            pos.x -= 0.5 * camera.zoom;
        } else {
            pos.x += 0.5 * camera.zoom;
        }
        if (pos.y < 0) {
            pos.y -= 0.5 * camera.zoom;
        } else {
            pos.y += 0.5 * camera.zoom;
        }

        let chunk_pos_x = Math.floor(pos.x);
        let chunk_pos_y = Math.floor(pos.y);
        let index = Math.floor(Math.floor((pos.y - chunk_pos_y) * 100) / 100 * 64) * 64 + Math.floor(Math.floor((pos.x - chunk_pos_x) * 100) / 100 * 64);
        let id = new CellID(pos.x, pos.y, index);

        grid.flip_cell(id);

        mouse.clicked = false;
    }

    if (mouse.pressed && mouse.moved) {
        const deltaX = mouse.movement_x * (camera.right - camera.left) / window.innerWidth;
        const deltaY = mouse.movement_y * (camera.top - camera.bottom) / window.innerHeight;

        camera.left -= deltaX;
        camera.right -= deltaX;
        camera.top += deltaY; // y is inverted
        camera.bottom += deltaY;

        camera.updateProjectionMatrix();
    }

    while (next_update >= 1) {
        grid.update();
        next_update -= 1;
    }

    next_update += update_amount;


    mouse.moved = false;
}

renderer.setAnimationLoop(animate);