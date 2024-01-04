import { Car } from './car.js';

import {handleKeydown, handleKeyup, handleWindowResize, getKeysPressed} from './eventHandlers.js';
import {draw} from "./render.js";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const canvasFpsElement: HTMLDivElement = document.getElementById('fpsDisplay') as HTMLDivElement;

const targetFps: number = 60;
const updateInterval: number = 1000 / targetFps;
let lastTime: number = 0;
let frameCount: number = 0;
let lastFpsUpdate: number = 0;

const car: Car = new Car(172, 130);
let currentKeys : String[] = [];

function update(): void {
    currentKeys = getKeysPressed();
    car.update(currentKeys);
    checkBoundaries();

    // reload page on key
    if (currentKeys.includes('KeyR')) {
        window.location.reload();
    }
}

function checkBoundaries(): void {
    // update car position based on canvas boundaries (wrap around)
    if (car.x > canvas.width) {
        car.x = 0;
    } else if (car.x < 0) {
        car.x = canvas.width;
    }

    if (car.y > canvas.height) {
        car.y = 0;
    } else if (car.y < 0) {
        car.y = canvas.height;
    }
}

function gameLoop(timestamp: number): void {
    const elapsed: number = timestamp - lastTime;

    if (elapsed > updateInterval) {
        update();
        draw(car);

        lastTime = timestamp - (elapsed % updateInterval);
        frameCount++;
    }

    calculateAndDisplayFPS(timestamp);
    requestAnimationFrame(gameLoop);
}

function calculateAndDisplayFPS(timestamp: number) {
    // Calculate FPS every second (1000ms)
    const elapsedSinceLastFpsUpdate: number = timestamp - lastFpsUpdate;
    if (elapsedSinceLastFpsUpdate > 1000) {

        // Update FPS display
        if (canvasFpsElement) {
            canvasFpsElement.textContent = `FPS: ${frameCount}`;
        }
        frameCount = 0;

        lastFpsUpdate = timestamp;
    }
}

// Event Handler
window.addEventListener('keydown', handleKeydown);
window.addEventListener('keyup', handleKeyup);
window.addEventListener('resize', (event) => {
    handleWindowResize(event, canvas); // Hier canvas als Argument übergeben
});

function startGameLoop(): void {
    lastTime = performance.now();
    gameLoop(performance.now());
}

function init(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Start the game loop
init();
startGameLoop();