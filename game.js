//creating the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function(){
	bgReady = true;
};
bgImage.src = "images/bg.gif";

//player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function(){
	playerReady = true;
};
playerImage.src = "images/player.png";

//cat image
var catReady = false;
var catImage = new Image();
catImage.onload = function(){
	catReady = true;
};
catImage.src = "images/cat.png";

//adding another cat
var cat2Ready = false;
var cat2Image = new Image();
cat2Image.onload = function(){
	cat2Ready = true;
};
cat2Image.src = "images/cat2.png";

//Game objects
var player = {
	speed: 256, //movement in pixels per second
	x: canvas.width/2,
	y: canvas.height/2
};

var cat = {//numbers should keep cats from being cut off on the edge
	x: 32 + (Math.random() * (canvas.width - 64)),
	y: 32 + (Math.random() * (canvas.height - 64)),
	speed: 192,
	vx: 48,
	vy: 48
};

var cat2 = {
	x: 32 + (Math.random() * (canvas.width - 64)),
	y: 32 + (Math.random() * (canvas.height - 64)),
	speed: 192,
	vx: 48,
	vy: 48
};

var catsCaught = 0;

//keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e){
	delete keysDown[e.keyCode];
}, false);

function animate(){
	cat.x += (cat.vx / cat.speed);
	cat.y += (cat.vy / cat.speed);
	
	//bounce off walls
	if (cat.x + 32 > canvas.width || cat.x < 0) {
		cat.vx *= -1;
	};
	if (cat.y + 32 > canvas.height || cat.y < 0) {
		cat.vy *= -1;
	};

	cat2.x -= (cat2.vx / cat2.speed);
	cat2.y += (cat2.vy / cat2.speed);
	if (cat2.x + 32 > canvas.width || cat2.x < 0) {
		cat2.vx *= -1;
	};
	if (cat2.y + 32 > canvas.height || cat2.y < 0) {
		cat2.vy *= -1;
	};

	//avoid player
	if (player.x <= (cat.x + 33)
		&& cat.x <= (player.x +33)
		&& player.y <= (cat.y + 33)
		&& cat.y <= (player.y + 33)) {
			cat.vy = (cat.vy * (-1));
			cat.vx = (cat.vx * (-1));
	};
	if (player.x <= (cat2.x + 33)
		&& cat2.x <= (player.x +33)
		&& player.y <= (cat2.y + 33)
		&& cat2.y <= (player.y + 33)) {
			cat2.vy *= -1;
			cat2.vx *= -1;
	};	
};

//update game objects
var update = function(modifier){
	if(38 in keysDown){ //38 = up button
		player.y -= player.speed * modifier;
		//but what if the player goes off screen?
		if(player.y <0){
			player.y =0;
		}
	}
	if(40 in keysDown){//down
		player.y += player.speed * modifier;
		if (player.y > 448) {
			player.y =448;
		};
	}
	if (37 in keysDown) {//left
		player.x -= player.speed * modifier;
		if (player.x < 0) {
			player.x =0;
		};
	}
	if (39 in keysDown) {//right
		player.x += player.speed *modifier;
		if (player.x > 480) {
			player.x = 480;
		};
	}

	//check if they are touching/caught
	if (
		player.x <= (cat.x + 32)
		&& cat.x <= (player.x +32)
		&& player.y <= (cat.y + 32)
		&& cat.y <= (player.y + 32)
		) {//only this cat's position is randomized if caught
			cat.x = 32 + (Math.random() * (canvas.width - 64));
			cat.y = 32 + (Math.random() *(canvas.height - 64));
			++catsCaught;
		}
	else if	(
		player.x <= (cat2.x + 32)
		&& cat2.x <= (player.x +32)
		&& player.y <= (cat2.y + 32)
		&& cat2.y <= (player.y + 32)
		) {
			cat2.x = 32 + (Math.random() * (canvas.width - 64));
			cat2.y = 32 + (Math.random() *(canvas.height - 64));
			++catsCaught;
		}
};

//draws everything
var render = function(){
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}

	if (catReady) {
		ctx.drawImage(catImage, cat.x, cat.y);
	}
	if(cat2Ready){
		ctx.drawImage(cat2Image, cat2.x, cat2.y)
	}

	//score
	ctx.fillStyle = "rgb(3, 86, 105)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Cats captured: " + catsCaught, 140, 400);
};

//end the game
var time = 0;
var end = function(mod){
	time += mod;
	var timeLeft =(10 - time).toFixed(1);
	ctx.fillStyle = "rgb(3, 86, 105)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Time left: " + timeLeft, 140, 440);
	if (timeLeft <= 0) {
		clearInterval(interval);
	};
};

//the main game loop
var main = function(){
	var now = Date.now();
	var delta = now - then;

	update(delta/1000);
	render();
	end(delta/1000);
	animate();
	then = now;
};

//playing the game
var then = Date.now();
var interval = setInterval(main, 1); //executes as fast a possible

