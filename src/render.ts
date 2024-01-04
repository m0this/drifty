import {Car} from "./car";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
const carImage: HTMLImageElement = document.getElementById('carImage') as HTMLImageElement;

const tireWidth: number = 6;
const tireHeight: number = 13;
const tireCornerRadius: number = 3;
const carLength: number = 58;
const carWidth: number = 33;

function drawBackground(): void {
    // Draw the ground
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /*
    Draw road on the left side
    */
    // Left lane marking
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#eee";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(10, canvas.height);
    ctx.stroke();

    // right lane marking
    ctx.strokeStyle = "#eee";
    ctx.beginPath();
    ctx.moveTo(90, 0);
    ctx.lineTo(90, canvas.height);
    ctx.stroke();

    // middle dotted lines
    ctx.save();
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;
    ctx.setLineDash([40, 30]);
    ctx.beginPath();
    ctx.moveTo(50,canvas.height);
    ctx.lineTo(50,0);
    ctx.stroke();
    ctx.restore();


    // Draw parking spaces
    let i: number = 100;

    while (i <= canvas.height) {
        ctx.strokeStyle = "#eee";
        const spaceWidth = 40; // parking space width
        let y: number = 150;

        // white parking space lines
        while (y < canvas.width) {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(y+2, i-60);
            ctx.lineTo(y+2, i+60);
            ctx.stroke();
            y = y+spaceWidth;
        }

        // yellow middle lines
        ctx.strokeStyle = '#fa1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width, i);
        ctx.lineTo(150, i);
        ctx.stroke();

        i += 230;
    }
}

function drawTires(car: Car): void {
    const rotation: number = car.angle + (Math.PI / 2);
    const steeringAngle: number = car.steeringAngle * (Math.PI / 180);

    const x = (xOffset: number, yOffset: number) => car.x + xOffset * Math.cos(car.angle) - yOffset * Math.sin(car.angle);
    const y = (xOffset: number, yOffset: number) => car.y + xOffset * Math.sin(car.angle) + yOffset * Math.cos(car.angle);


    drawTire(x(+14, +12), y(+14, +12), rotation+steeringAngle);
    drawTire(x(-14, +12), y(-14, +12), rotation);
    drawTire(x(+14, -12), y(+14, -12), rotation+steeringAngle);
    drawTire(x(-14, -12), y(-14, -12), rotation);
}

function drawTire(x: number, y: number, rotation: number): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    let w: number = tireWidth/2;
    let h: number = tireHeight / 2;

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(-w + tireCornerRadius, -h);
    ctx.arcTo( w, -h, w, -h + tireCornerRadius, tireCornerRadius);
    ctx.arcTo( w,  h,w - tireCornerRadius, h, tireCornerRadius);
    ctx.arcTo(-w,  h, -w, h - tireCornerRadius, tireCornerRadius);
    ctx.arcTo(-w, -h,-w + tireCornerRadius, -h, tireCornerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawCar(car: Car ): void {
    drawTires(car);

    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(Math.PI);
    ctx.rotate(car.angle);
    ctx.drawImage(carImage, -carLength/2, -carWidth/2, carLength, carWidth);
    ctx.restore();
}

export function draw(car: Car): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

    drawBackground();
    drawCar(car);
}