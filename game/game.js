//set up the canvases
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 360;

var canvas2 = document.getElementById("status");
var stx = canvas2.getContext("2d");
canvas2.width = 180;
canvas2.height = 360;

var size = 16;

//camera
var camera = {
	x : 0,
	y : 0,
	offX : 0,
	offY : 0
};

//KEYS

// directionals
var upKey = 38;     //[Up]
var leftKey = 37;   //[Left]
var rightKey = 39;  //[Rigt]
var downKey = 40;   //[Down]
var moveKeySet = [upKey, leftKey, rightKey, downKey];

// A and b
var a_key = 90;   //[Z]
var b_key = 88;   //[X]
var actionKeySet = [a_key, b_key];

var keys = [];
var canMove = false;

// CHARACTER VARIABLES
var robot = {
	x : 10,
	y: 7,
	char : '@'
}


// location variables

var timeColors = ["#9CC6DE", "#E4C382", "#5860B4", "#1E1A20", "#1E1A20", "#1E1A20", "#5A95B6", "#DAB676"]
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


// MOVE THE ROBOT ON THE MAP
function moveRobot(){
	if(!canMove)
		return;

	if(keys[upKey])
		robot.y--;
	else if(keys[downKey])
		robot.y++;
	else if(keys[leftKey])
		robot.x--;
	else if(keys[rightKey])
		robot.x++;

	canMove = false;
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

	if(map.length != 0 && player.x > ((map[0].length) - ((canvas.width/size)/2)))
		camera.x = (map[0].length * size) - canvas.width;
	else if(player.x < ((canvas.width/size)/2))
		camera.y = 0;
	else
		camera.x = player.x *size - (canvas.width / 2);

	if(map.length != 0 && player.y > ((map.length) - ((canvas.height/size) / 2)))
		camera.y = (map.length * size) - canvas.height;
	else if(player.y < ((canvas.height/size)/2))
		camera.y = 0;
	else
		camera.y = player.y *size - (canvas.height / 2) + (size/2);

	//add offset
	camera.x += camera.offX;
	camera.y += camera.offY;
}



//////////////////  RENDER FUNCTIONS  ////////////////////

// DRAWS ON THE GAME CANVAS
function renderGame(){
	ctx.save();
	//ctx.translate(-camera.x, -camera.y);		//camera
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//background (change with color of day if outdoors)
	let curColor = "#000000";
	if(area == "city")
		curColor = timeColors[Math.floor(steps/stepPerTime) % timeColors.length];
	ctx.fillStyle = curColor
	ctx.fillRect(0,0,canvas.width, canvas.height);
	
	/*   add draw functions here  */
	drawCharacter(robot)

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

function drawCharacter(c){
	ctx.font = (2*size)+"px Proggy";
	ctx.fillStyle = "#ffffff"
	ctx.fillText(c.char, c.x*size,c.y*size);
}


//////////////   GAME LOOP FUNCTIONS   //////////////////

// GAME INITIALIZATION FUNCTION
function init(){

}

// MAIN GAME LOOP
function main(){
	requestAnimationFrame(main);
	canvas.focus();

	//panCamera();

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
		moveRobot();
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