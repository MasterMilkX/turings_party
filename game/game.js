//set up the canvases
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 360;

var canvas2 = document.getElementById("status");
var stx = canvas2.getContext("2d");
canvas2.width = 180;
canvas2.height = 360;

var size = 24;

//camera
var camera = {
	x : 0,
	y : 0,
	offX : -size/2,
	offY : -size
};

//KEYS

// directionals
var upKey = 38;     //[Up]
var leftKey = 37;   //[Left]
var rightKey = 39;  //[Rigt]
var downKey = 40;   //[Down]
var waitKey = 83;	//[S]
var moveKeySet = [upKey, leftKey, rightKey, downKey];

// A and b
var a_key = 90;   //[Z]
var b_key = 88;   //[X]
var actionKeySet = [a_key, b_key];

var keys = [];
var canMove = false;

// CHARACTER VARIABLES
var modes = ['neutral', 'strength', 'constitution', 'dexterity', 'charisma', 'intelligence', 'wisdom']

var modeColors = {
	'neutral': '#ffffff', 
	'strength':'#ff0000', 
	'constitution':'#FF7200', 
	'dexterity': '#00ff00',
	'charisma':'#FFDF00',
	'intelligence':'#0000ff',
	'wisdom':'#EA00FF'
}

// robot player
var robot = {
	x : 4,
	y: 4,
	char : '@',
	mode : 'neutral',

	//stats
	stats : {
		'str' : 0,
		'con' : 0,
		'dex' : 0,
		'cha' : 0,
		'int' : 0,
		'wis' : 0
	}
}

var curMonsters = [];


// MAP VARIABLES
var map = []



// location variables

var timeColors = ["#1E1A20"]
//var timeColors = ["#9CC6DE", "#E4C382", "#5860B4", "#1E1A20", "#1E1A20", "#1E1A20", "#5A95B6", "#DAB676"]
var steps = 0;
var stepPerTime = 20;

var area = "city";

//////////////////    GENERIC FUNCTIONS   ///////////////


// CHECKS IF AN ELEMENT IS IN AN ARRAY
function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}


////////////////   KEYBOARD FUNCTIONS  //////////////////


// KEY EVENTS
var keyTick = 0;
var kt = null; 

function anyKey(){
	return anyMoveKey() || anyActionKey();
}

// CHECK IF ANY DIRECTIONAL KEY IS HELD DOWN
function anyMoveKey(){
	return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}

function anyActionKey(){
	return (keys[a_key] || keys[b_key]);
}

/////////////   COLLISION FUNCTIONS   ////////////////


function collide(x,y){
	return mapCollide(x,y) && noChar(x,y);
}
function mapCollide(x,y){
	return x > map[0].length || y > map.length || inArr(map[y][x], collidable)
}

//////////////    PLAYER FUNCTIONS   /////////////////

// NEXT ROGUELIKE STEP
function nextStep(){
	steps++;

	if(canMove){
		for(let c=0;c<curMonsters.length;c++)
			drunkAI(curMonsters[c]);
	}
	moveRobot();
}

// MOVE THE ROBOT ON THE MAP
function moveRobot(){
	if(!canMove)
		return;

	if(keys[upKey] && !collide(robot.x, robot.y-1))
		robot.y--;
	else if(keys[downKey] && !collide(robot.x, robot.y+1))
		robot.y++;
	else if(keys[leftKey] && !collide(robot.x-1, robot.y))
		robot.x--;
	else if(keys[rightKey] && !collide(robot.x+1, robot.y))
		robot.x++;

	canMove = false;
}		


///////////////////  AI FUNCTIONS  /////////////////////

// AI WITH DRUNKARD'S WALK MOVEMENT ALGORITHM
function drunkAI(ai){
	if(Math.random() < 0.6)
		return;

	var possMoves = ["none", "left", "right", "up", "down"];

	//remove illegal moves
	
	if(inArr(map[ai.y-1][ai.x], collidable))
		possMoves.splice(possMoves.indexOf("up"),1);
	if(inArr(map[ai.y+1][ai.x], collidable))
		possMoves.splice(possMoves.indexOf("down"),1);
	if(inArr(map[ai.y][ai.x-1], collidable))
		possMoves.splice(possMoves.indexOf("left"),1);
	if(inArr(map[ai.y][ai.x+1], collidable))
		possMoves.splice(possMoves.indexOf("right"),1);
	

	var randomMove = possMoves[Math.floor(Math.random()*possMoves.length)];

	if(randomMove == "none")
		return;
	else if(randomMove == "left")
		ai.x--;
	else if(randomMove == "right")
		ai.x++;
	else if(randomMove == "up")
		ai.y--;
	else if(randomMove == "down")
		ai.y++;
}


////////////////   CAMERA FUNCTIONS   /////////////////

// IF WITHIN THE GAME BOUNDS
function withinBounds(x,y){
	var xBound = (x >= Math.floor(camera.x / size) - 1) && (x <= Math.floor(camera.x / size) + (canvas.width / size));
	return xBound;
}

// HAVE THE CAMERA FOLLOW THE PLAYER
function panCamera(){
	camera.x = 0;
	camera.y = 0;

	if(map.length != 0 && robot.x > ((map[0].length) - ((canvas.width/size)/2)))
		camera.x = (map[0].length * size) - canvas.width;
	else if(robot.x < ((canvas.width/size)/2))
		camera.y = 0;
	else
		camera.x = robot.x *size - (canvas.width / 2);

	if(map.length != 0 && robot.y > ((map.length) - ((canvas.height/size) / 2)))
		camera.y = (map.length * size) - canvas.height;
	else if(robot.y < ((canvas.height/size)/2))
		camera.y = 0;
	else
		camera.y = robot.y *size - (canvas.height / 2) + (size/2);

	//add offset
	camera.x += camera.offX;
	camera.y += camera.offY;
}



//////////////////  RENDER FUNCTIONS  ////////////////////

// DRAWS ON THE GAME CANVAS
function renderGame(){
	ctx.save();
	ctx.translate(-camera.x, -camera.y);		//camera
	ctx.clearRect(camera.x, camera.y, canvas.width, canvas.height);
	
	//background (change with color of day if outdoors)
	let curColor = "#000000";
	if(area == "city")
		curColor = timeColors[Math.floor(steps/stepPerTime) % timeColors.length];
	ctx.fillStyle = curColor
	ctx.fillRect(camera.x,camera.y,canvas.width, canvas.height);
	
	/*   add draw functions here  */
	drawMap();
	drawCharacter(robot)
	for(let m=0;m<curMonsters.length;m++){
		drawCharacter(curMonsters[m]);
	}

	ctx.restore();
}

// DRAWS ON THE STATUS CANVAS
function renderStatus(){
	stx.save();
	stx.clearRect(0,0, canvas2.width, canvas2.height);

	stx.fillStyle = "#4C5377";
	stx.fillRect(0,0,canvas2.width, canvas2.height);

	/* add draw function here */

	stx.restore();
}

// UPDATE RENDER FOR BOTH CANVASES
function render(){
	renderGame();
	renderStatus();
}

// draw the character (robot or monster) on the game screen
function drawCharacter(c){
	ctx.font = size+"px Proggy";
	ctx.fillStyle = modeColors[c.mode];
	ctx.textAlign = "center";
	ctx.fillText(c.char, c.x*size,c.y*size);
}

// draw the map
function drawMap(){
	if(map.length == 0)		//nothing to draw so don't bother
		return;

	ctx.font = size+"px Proggy";
	ctx.fillStyle = "#cdcdcd";
	ctx.textAlign = "center";
	for(let r=0;r<map.length;r++){
		for(let c=0;c<map[0].length;c++){
			if(noChar(c,r))
				ctx.fillText(map[r][c], c*size, r*size);
		}
	}
	
}

// check if a character is at that space on the map
function noChar(x,y){
	if(robot.x == x && robot.y == y)
		return false;

	//check for enemies and items
	for(let m=0;m<curMonsters.length;m++){
		let mon = curMonsters[m];
		if(mon.x == x && mon.y == y)
			return false;
	}

	return true;
}


//////////////   GAME LOOP FUNCTIONS   //////////////////

// GAME INITIALIZATION FUNCTION
function init(){
	map = initMap(20,20);
}

// MAIN GAME LOOP
function main(){
	requestAnimationFrame(main);
	canvas.focus();

	panCamera();

	render();

	//keyboard ticks
	var akey = anyKey();
	if(akey && kt == 0){
		kt = setInterval(function(){keyTick+=1}, 75);
	}else if(!akey){
		clearInterval(kt);
		kt = 0;
		keyTick=0;
	}

	//debug
	var settings = "debug here";

	//document.getElementById('debug').innerHTML = settings;
}


/////////////////   HTML5 FUNCTIONS  //////////////////

// DETERMINE IF VALUD KEY TO PRESS
document.body.addEventListener("keydown", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = true;
		nextStep();
	}else if(inArr(actionKeySet, e.keyCode)){
		keys[e.keyCode] = true;
	}
});

// CHECK FOR KEY RELEASED
document.body.addEventListener("keyup", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = false;
		canMove = true;
	}else if(inArr(actionKeySet, e.keyCode)){
		keys[e.keyCode] = false;
	}
});

// PREVENT SCROLLING WITH THE GAME
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)){
        e.preventDefault();
    }
}, false);


main();