class CannonBall {
  constructor(x, y) {
    var options = {
      isStatic: true
    };
    this.r = 30;
    this.body = Bodies.circle(x, y, this.r, options);
    this.image = loadImage("./assets/cannonball.png");
    World.add(world, this.body);
    this.trajectory = []
  }
  remove(index) {
    Matter.Body.setVelocity(this.body, { x: 0, y: 0 })
    setTimeout(() => {
      Matter.World.remove(world, this.body);
      delete balls[index]
    }, 2000)

  }
  shoot() {
    var newAngle = cannon.angle - 28;
    newAngle = newAngle * (3.14 / 180)
    var velocity = p5.Vector.fromAngle(newAngle);
    velocity.mult(0.5);
    Matter.Body.setStatic(this.body, false);
    Matter.Body.setVelocity(this.body, {
      x: velocity.x * (180 / 3.14), y: velocity.y * (180 / 3.14)
    });
  }

  display() {
    var pos = this.body.position;
    push();
    imageMode(CENTER);
    image(this.image, pos.x, pos.y, this.r, this.r);
    pop();
    if (this.body.velocity.x > 0 && pos.x > 10) {
      var position1 = [pos.x, pos.y]
      this.trajectory.push(position1)
    }
    for (let index = 0; index < this.trajectory.length; index++) {
      image(this.image, this.trajectory[index][0], this.trajectory[index][1], 5, 5)
    }
  }
}

