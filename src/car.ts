export class Car {
    readonly MAX_SPEED: number = 100;
    readonly MAX_SPEED_REVERSE: number = -30;
    readonly FRICTION: number = 0.001;
    readonly ACCELERATION_FACTOR: number = 0.8;
    readonly DECELERATION_FACTOR: number = 1.3;
    readonly STEERING_FACTOR: number = 3;
    readonly MAX_STEERING_ANGLE: number = 30;
    readonly MAX_TURN_RATE: number = 2.5;
    readonly SPEED_SCALE_FACTOR: number = 0.09;

    x: number;
    y: number;
    angle: number;
    speed: number;
    steeringAngle: number;

    // helper variables for reverse driving
    isReversing: boolean = false;
    reverseStartTime: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.angle = Math.PI / 2;
        this.speed = 0;
        this.steeringAngle = 0;
    }

    update(keysPressed: String[]): void {
        if (keysPressed.includes('ArrowUp')) {
            this.accelerate();
        }

        if (keysPressed.includes('ArrowDown')) {
            if (this.speed > 0) {
                this.deceleration();
            } else {
                this.reverse();
            }
        }

        if (keysPressed.includes('ArrowLeft')) {
            this.steerLeft();
        } else if (keysPressed.includes('ArrowRight')) {
            this.steerRight();
        } else if (!keysPressed.includes('ArrowLeft') && !keysPressed.includes('ArrowRight')) {
            this.returnSteeringToNeutral();
        }

        if (keysPressed.includes('Space') && this.speed !== 0) {
            this.handBrake();
        }

        this.move();
    }

    accelerate(): void {
        if (this.speed < this.MAX_SPEED) {
            this.speed += this.ACCELERATION_FACTOR;
        } else {
            this.speed = this.MAX_SPEED;
        }
    }

    deceleration(): void {
        if (this.speed > 0) {
            this.speed -= this.DECELERATION_FACTOR;
        } else if (this.speed < 0) {
            this.speed += this.DECELERATION_FACTOR;
        }

        if (Math.abs(this.speed) <= this.DECELERATION_FACTOR) {
            this.speed = 0;
        }
    }

    handBrake(): void {
        this.deceleration();
    }


    reverse(): void {
        // add a small delay to drive backwards
        if (!this.isReversing) {
            this.reverseStartTime = performance.now();
            this.isReversing = true;
        }

        let elapsedTime: number = performance.now() - this.reverseStartTime;
        if (elapsedTime >= 500) {
            if (this.speed > this.MAX_SPEED_REVERSE) {
                this.speed -= this.ACCELERATION_FACTOR;
            } else {
                this.speed = this.MAX_SPEED_REVERSE;
            }
        }
    }


    steerLeft(): void {
        if (this.steeringAngle > (-this.MAX_STEERING_ANGLE)) {
            this.steeringAngle += -this.STEERING_FACTOR;
        } else {
            this.steeringAngle = -this.MAX_STEERING_ANGLE;
        }
    }

    steerRight() {
        if (this.steeringAngle < this.MAX_STEERING_ANGLE) {
            this.steeringAngle += this.STEERING_FACTOR;
        } else {
            this.steeringAngle = this.MAX_STEERING_ANGLE;
        }
    }

    returnSteeringToNeutral(): void {
        if (this.steeringAngle !== 0) {
            const sign: number = this.steeringAngle > 0 ? -1 : 1; // Determine the direction to reduce the angle
            this.steeringAngle += this.STEERING_FACTOR * sign;

            if (Math.abs(this.steeringAngle) < 0.15) {
                this.steeringAngle = 0;
            }
        }
    }

    move(): void {
        if (this.speed > 0) {
            this.isReversing = false;
        }

        // add friction
        this.speed -= this.speed * this.FRICTION;

        // calculate angle
        let steeringAngleRad: number = this.steeringAngle * (Math.PI / 180);
        let turnRate: number = steeringAngleRad * (this.speed / this.MAX_SPEED) * this.SPEED_SCALE_FACTOR * this.MAX_TURN_RATE;
        this.angle += turnRate;

        // calculate speed and new position
        const speedX: number = (this.speed * this.SPEED_SCALE_FACTOR) * Math.cos(this.angle);
        const speedY: number = (this.speed * this.SPEED_SCALE_FACTOR) * Math.sin(this.angle);

        this.x += speedX;
        this.y += speedY;

    }
}