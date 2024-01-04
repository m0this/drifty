const keysToTrack: Set<string> = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyR']);
const keysPressed: Set<string> = new Set();

export function handleKeydown(event: KeyboardEvent): void {
    if (keysToTrack.has(event.code)) {
        keysPressed.add(event.code);
    }
}

export function handleKeyup(event: KeyboardEvent): void {
    if (keysToTrack.has(event.code)) {
        keysPressed.delete(event.code);
    }
}

export function handleWindowResize(canvas : HTMLCanvasElement): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

export function getKeysPressed(): string[] {
    return Array.from(keysPressed);
}