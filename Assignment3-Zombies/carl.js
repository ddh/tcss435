
// find and replace CARL with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()

function CARL(game) {
    this.player = 1;
    this.radius = 10;
    this.rocks = 0;
    this.kills = 0;
    this.name = "Carl!";
    this.color = "Yellow";
    this.cooldown = 0;
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: 0, y: 0 };
};

CARL.prototype = new Entity();
CARL.prototype.constructor = CARL;

// alter the code in this function to create your agent
// you may check the state but do not change the state of these variables:
//    this.rocks
//    this.cooldown
//    this.x
//    this.y
//    this.velocity
//    this.game and any of its properties

// you may access a list of zombies from this.game.zombies
// you may access a list of rocks from this.game.rocks
// you may access a list of players from this.game.players

/*
    Useful things (work in progress):

        Human:
        Is other entity in my L.O.S?:   if(this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius }))


        Rock stuff:
            Amount of rocks in hand:    this.rocks
            Cycling through rocks:      for loop(this.game.rocks.length)
            Rock thrown?:               !ent.thrown
            Marked for removal?:        !ent.removeFromWorld
            Colliding with rock:        game engine determines pickup so ignore it


*/

CARL.prototype.selectAction = function () {

    // Action contains a x & y velocity, whether it is throwing a rock, target DESTINATION of where rock is thrown to
    var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
    var acceleration = 1000000; // Why this acceleration? Does this mean human can change direction on a dime?
    var closest = 1000; // Starting distance of the nearest zombie
    var target = null; // Target destination. Can be an entity or arbitrary on-the-fly created entity {x: , y: , radius: }
    this.visualRadius = 500; // Create a buffer-zone aka line-of-sight

    var cornerRadius = 100;
    var topLeftCorner = {x:0, y:0, radius:cornerRadius};
    var topRightCorner = {x:0, y:800, radius:cornerRadius};

    // For each zombie, calculate how close it is to me.
    // Update my closest variable to the closest zombie and set that zombie as my target entity
    for (var i = 0; i < this.game.zombies.length; i++) {
        var ent = this.game.zombies[i];
        var dist = distance(ent, this);
        // Update closest zombie
        if (dist < closest) {
            closest = dist;
            target = ent;
        }
        // Using my visualRadius (default of 500) determine if a zombie is within this line-of-sight
        // Then change my direction accordingly
        if (this.collide({x: ent.x, y: ent.y, radius: this.visualRadius})) {
            var difX = (ent.x - this.x) / dist;
            var difY = (ent.y - this.y) / dist;
            action.direction.x -= difX * acceleration / (dist * dist); // why dist^2?
            action.direction.y -= difY * acceleration / (dist * dist);
        }
    }

    // FOr each rock in the game, if it's not marked to be removed and if human has less than 2 in hand
    // When the human;s line of sight radius (500) contains the rock (collides),
    for (var i = 0; i < this.game.rocks.length; i++) {
        var ent = this.game.rocks[i];
        if (!ent.removeFromWorld && !ent.thrown && this.rocks < 2 && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                action.direction.x += difX * acceleration / (dist * dist);
                action.direction.y += difY * acceleration / (dist * dist);
            }
        }
    }

    // Try repulsion for the corners
    if(this.collide({x:0,y:0, radius:100}) || this.collide({x:0,y:800, radius:100})||this.collide({x:800,y:0, radius:100})||this.collide({x:800,y:800, radius:100})){
        action.direction.x -= 100 * acceleration / (dist * dist); // why dist^2?
        action.direction.y -= 100 * acceleration / (dist * dist);
    }



    // If this human has a zombie in line of sight ie 'targetted'... throw the rock
    if (target) {
        action.target = target;
        action.throwRock = true;
    }
    return action;
};

// do not change code beyond this point

CARL.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

CARL.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

CARL.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

CARL.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

CARL.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

CARL.prototype.update = function () {
    Entity.prototype.update.call(this);
    // console.log(this.velocity);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    this.action = this.selectAction();
    //if (this.cooldown > 0) console.log(this.action);
    this.velocity.x += this.action.direction.x;
    this.velocity.y += this.action.direction.y;

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

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

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            if (ent.name !== "Zombie" && ent.name !== "Rock") {
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
            if (ent.name === "Rock" && this.rocks < 2) {
                this.rocks++;
                ent.removeFromWorld = true;
            }
        }
    }
    

    if (this.cooldown === 0 && this.action.throwRock && this.rocks > 0) {
        this.cooldown = 1;
        this.rocks--;
        var target = this.action.target;
        var dir = direction(target, this);

        var rock = new Rock(this.game);
        rock.x = this.x + dir.x * (this.radius + rock.radius + 20);
        rock.y = this.y + dir.y * (this.radius + rock.radius + 20);
        rock.velocity.x = dir.x * rock.maxSpeed;
        rock.velocity.y = dir.y * rock.maxSpeed;
        rock.thrown = true;
        rock.thrower = this;
        this.game.addEntity(rock);
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

CARL.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};