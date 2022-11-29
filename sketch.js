const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var balls = []
var boats = []
var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var cannonBall;
var boat
var boatAnimation = []
var boatSpriteData, boatSpriteSheet
function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpriteData = loadJSON("./assets/Boat.json")
  boatSpriteSheet = loadImage("./assets/Boat.png")
  GroundMusic = loadSound("./assets/Boat_Animation/assets_background_music.mp3")
  WaterSplash = loadSound("./assets/Boat_Animation/assets_cannon_water.mp3")
  CannonBlast = loadSound("./assets/Boat_Animation/assets_cannon_water.mp3")
  PirateLaugh = loadSound("./assets/Boat_Animation/assets_pirate_laugh.mp3")
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES);
  angle = 15;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);
  cannon = new Cannon(180, 110, 130, 100, angle);
  cannonBall = new CannonBall(cannon.x, cannon.y);
  var boatFrames = boatSpriteData.frames
  console.log(boatSpriteData.frames)
  for (let index = 0; index < boatFrames.length; index++) {
    var pos = boatFrames[index].frame
    var IMG = boatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h)
    boatAnimation.push(IMG)
  }
  // boat = new Boat(width - 40, height - 60, 170, 170, -80)
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);
GroundMusic.play()
GroundMusic.setVolume(0.000)
  Engine.update(engine);

  push();
  fill("brown");
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, width * 2, 1);
  pop();

  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  cannon.display();
  showboats()

  //Matter.Body.setVelocity(boat.body, { x: -0.9, y: 0.0 })
  //boat.show()
  //  cannonBall.display();
  for (var index = 0; index < balls.length; index++) {
    showCannonBalls(balls[index], index)
    collisionBoat(index)
  }
}


function keyPressed() {
  if (keyCode === 32) {
    var cBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cBall)
    //cBall.shoot();
  }
}
function keyReleased() {
  if (keyCode === 32) {
    balls[balls.length - 1].shoot();
  }
}



function showCannonBalls(ball, index) {
  if (ball) {
    ball.display()
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      WaterSplash.play()
      WaterSplash.setVolume(0.05)
      ball.remove(index)
    }
  }

}
var GameisOver = false
function showboats() {
  if (boats.length > 0) {

    if (boats[boats.length - 1] === undefined || boats[boats.length - 1].body.position.x < width - 300) {
      var positions = [-40, -60, -70, -90, -30]
      var position = random(positions)
      var boat = new Boat(width - 40, height - 60, 170, 170, -80, boatAnimation)
      boats.push(boat)

    }

    for (let index = 0; index < boats.length; index++) {
      if (boats[index]) {
        Matter.Body.setVelocity(boats[index].body, { x: -0.9, y: 0.0 })
        boats[index].show()
        boats[index].animate()
        var collision = Matter.SAT.collides(tower, boats[index].body)
        if (collision.collided && !boats[index].isBroken) {
          GameisOver = true
          GameOver()
        }

      }


    }
  }
  else {
    var boat = new Boat(width - 40, height - 60, 170, 170, -80, boatAnimation)
    boats.push(boat)
  }


}



function collisionBoat(index1) {
  for (let index = 0; index < boats.length; index++) {
    if (balls[index1] !== undefined && boats[index] !== undefined) {
      var collision = Matter.SAT.collides(balls[index1].body, boats[index].body)
      if (collision.collided) {
        boats[index].remove(index)
        Matter.World.remove(world, balls[index1].body);
        delete balls[index1]
      }

    }


  }


}



function GameOver() {
  swal(
    { title: `Game Over!!!`, text: "Thanks for playing!!", imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
     imageSize: "150x150",
     confirmButtonText: "Play Again" }
  ),function (isConfirm){
if(isConfirm){
  location.reload()
}
   
  }
}