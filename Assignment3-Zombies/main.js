
// GameBoard code below

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Returns a magnitude vector in given direction x,y by dividing by distance between a,b
function direction(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if(dist > 0) return { x: dx / dist, y: dy / dist }; else return {x:0,y:0};
}

function randomInt(n) {
    return Math.floor(Math.random() * n);
}

// Has speed, thrown-state:boolean, velocity vector:x,y
function Rock(game) {
    this.player = 1; 
    this.radius = 4;
    this.name = "Rock";
    this.color = "Gray";
    this.maxSpeed = 200;
    this.thrown = false;

    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: 0, y: 0 };

};

Rock.prototype = new Entity();
Rock.prototype.constructor = Rock;

Rock.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Rock.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Rock.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Rock.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Rock.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Rock.prototype.update = function () {
    Entity.prototype.update.call(this);
    //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
    }

// Wow what is all of this?
    var chasing = false;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && ent.name === "Rock" && this.thrown && ent.thrown && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x) / dist;
            var difY = (this.y - ent.y) / dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
        }
    }

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Rock.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};


function Zombie(game, clone) {
    this.player = 1;
    this.radius = 10;
    this.visualRadius = 500;
    this.name = "Zombie";
    this.color = "Red";
    this.maxSpeed = minSpeed + (maxSpeed - minSpeed) * Math.random();


// What is clone? Is that when a zombie infects a human?
    if (!clone) {
        Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
    } else {
        if (clone.x < 0) clone.x = 0;
        if (clone.y < 0) clone.y = 0;
        if (clone.x > 800) clone.x = 800;
        if (clone.y > 800) clone.y = 800;
        if (clone.x > 0 && clone.y > 0 && clone.x < 800 && clone.y < 800) {
            Entity.call(this, game, clone.x, clone.y);
        } else {
            Entity.call(this, game, 400, 400);
        }
    }
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Zombie.prototype = new Entity();
Zombie.prototype.constructor = Zombie;

Zombie.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Zombie.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Zombie.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Zombie.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Zombie.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Zombie.prototype.update = function () {
    Entity.prototype.update.call(this);
 //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    var chasing = false;

    // For each entity in the game
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];

        // On collision with another entity...
        if (ent !== this && this.collide(ent)) {

            // If collided with a zombie...
            if (ent.name === "Zombie") {
                var temp = { x: this.velocity.x, y: this.velocity.y };

                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
                var difX = (this.x - ent.x) / dist;
                var difY = (this.y - ent.y) / dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.velocity.x = ent.velocity.x * friction;
                this.velocity.y = ent.velocity.y * friction;
                ent.velocity.x = temp.x * friction;
                ent.velocity.y = temp.y * friction;
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                ent.x += ent.velocity.x * this.game.clockTick;
                ent.y += ent.velocity.y * this.game.clockTick;
            }
            // If collided with a human agent...
            // When the zombie infects a human...print human's #kills thus far
            // and clone a new zombie using the human.
            // Mark the human to be removed from the world.
            if (ent.name !== "Zombie" && ent.name !== "Rock" && !ent.removeFromWorld) {
                ent.removeFromWorld = true;
                console.log(ent.name + " kills: " + ent.kills);
                var newZombie = new Zombie(this.game, ent);
                this.game.addEntity(newZombie);
            }

            // When a zombie collides with a rock and if the rock is being thrown
            if (ent.name === "Rock" && ent.thrown) {
                this.removeFromWorld = true; // Erase the zombie from the field
                ent.thrown = false; // Rock is no longer being thrown.
                ent.velocity.x = 0; // Rock has no velocity anymore.
                ent.velocity.y = 0; // Rock has no velocity anymore.
                ent.thrower.kills++; // thrower is the entity that threw the rock, give it a point for killing
            }
        }
        var acceleration = 1000000; // Not sure what acceleration does

        // If entity is a human (not collided with) and within zombie's line-of-sight...
        // Set zombie to be chasing the human
        if (ent.name !== "Zombie" && ent.name !== "Rock" && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (dist > this.radius + ent.radius + 2) { // What's the +2 for???
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist * dist);
                this.velocity.y += difY * acceleration / (dist * dist);
            }
            chasing = true;
        }

        
    }

    // Zombie clustering and mobbing behavior:

    // If this zombie is currently not chasing a human...
    if (!chasing) {
        // Pick a random zombie and determine distance from it
        ent = this.game.zombies[randomInt(this.game.zombies.length)];
        var dist = distance(this, ent);

        // If the distance between this zombie and the other zombie...
        if (dist > this.radius + ent.radius + 2) { // What's the +2 for???
            var difX = (ent.x - this.x) / dist; // Get unit vector pointed towards the other zombie
            var difY = (ent.y - this.y) / dist; // Get unit vector pointed towards the other zombie
            this.velocity.x += difX * acceleration / (dist * dist); // Why divide by dist*dist??
            this.velocity.y += difY * acceleration / (dist * dist);

        }

    }

    // Determine the new speed of this zombie
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y); // Pythag
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Zombie.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};

function Player(game) {
    this.player = 1;
    this.radius = 10;
    this.rocks = 0;
    this.kills = 0;
    this.visualRadius = 500;
    this.name = "Player 1";
    this.color = "White";
    this.cooldown = 0;
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

// the "main" code begins here
var friction = 1; // Default friction
var maxSpeed = 100; // Default 100
var minSpeed = 5; // Default 5

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var numZombies = 1; // Default 1 zombie
    var numPlayers = 6; // Default 6 players
    var numRocks = 12; // Default was 12 rocks

    var gameEngine = new GameEngine();
    var circle;
    for (var i = 0; i < numPlayers; i++) {
        circle = new CARL(gameEngine);
        gameEngine.addEntity(circle);
    }
    
    for (var i = 0; i < numZombies; i++) {
        circle = new Zombie(gameEngine);
        gameEngine.addEntity(circle);
    }

    for (var i = 0; i < numRocks; i++) {
        circle = new Rock(gameEngine);
        gameEngine.addEntity(circle);
    }
    gameEngine.init(ctx);
    gameEngine.start();
});
