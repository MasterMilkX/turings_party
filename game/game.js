//set up the canvases
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 360;

var canvas2 = document.getElementById("status");
var stx = canvas2.getContext("2d");
canvas2.width = 180;
canvas2.height = 360;

var canvas3 = document.getElementById("text_update");
var ttx = canvas3.getContext("2d");
canvas3.width = 600;
canvas3.height = 64;

var size = 32;
var game_font = 'Proggy';

//camera
var camera = {
	x : 0,
	y : 0,
	offX : -size/2,
	offY : -size*(3.0/4.0)
};
var freezeCamera = false;

//KEYS

// directionals
var upKey = 38;     //[Up]
var leftKey = 37;   //[Left]
var rightKey = 39;  //[Rigt]
var downKey = 40;   //[Down]
var waitKey = 83;	//[S]
var moveKeySet = [upKey, leftKey, rightKey, downKey, waitKey];

// A and b
var a_key = 90;   //[Z]
var b_key = 88;   //[X]
var actionKeySet = [a_key, b_key];

var keys = [];
var canMove = true;

// CHARACTER VARIABLES
var modes = ['neu', 'str', 'con', 'dex', 'cha', 'int', 'wis']

var modeColors = {
	'neu': '#ffffff', 
	'str':'#ff0000', 
	'con':'#FF7200', 
	'dex': '#00ff00',
	'cha':'#FFDF00',
	'int':'#0000ff',
	'wis':'#EA00FF'
}

// robot player
var robot = {
	x : 4,
	y: 4,
	char : '@',

	//interaction
	mode : 'neutral',
	obj : null,

	//stats
	stats : {
		'str' : 0,
		'con' : 0,
		'dex' : 0,
		'cha' : 0,
		'int' : 0,
		'wis' : 0
	},

	//inventory
	armor : 'none',
	weapon : 'none',
	money : 0,
	food : [],
	drink : [],
	items : []
}

var curMonsters = [];


// MAP VARIABLES
var map = []
var map_obj = [];


// location variables

var timeColors = ["#1E1A20"]
//var timeColors = ["#9CC6DE", "#E4C382", "#5860B4", "#1E1A20", "#1E1A20", "#1E1A20", "#5A95B6", "#DAB676"]
var steps = 0;
var stepPerTime = 20;

var area = "city";

// text variables
var curTxt = "";
var allTxt = [];

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

// CHECK COLLISION WITH ANYTHING
function collide(x,y){
	return mapCollide(x,y) || !noChar(x,y);
}

// CHECK IF COLLIDED WITH A MAP OBJECT
function mapCollide(x,y){
	return x < 0 || y < 0 || x > map[0].length || y > map.length || inArr(collidable, map[y][x])
}


// CHECK IF A CHARACTER IS AT THAT SPACE ON THE MAP
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


//////////////    PLAYER FUNCTIONS   /////////////////

// NEXT ROGUELIKE STEP
function nextStep(){
	//allow a step to be taken
	if(canMove){
		steps++;
		clearTxt();

		//allow characters to move around
		for(let c=0;c<curMonsters.length;c++)
			drunkAI(curMonsters[c]);

		moveRobot();
	}
}

// MOVE THE ROBOT ON THE MAP
function moveRobot(){
	if(!canMove)
		return;

	//see if touching anything
	if(keys[upKey])
		robot.obj = touchObj(robot.x,robot.y-1);
	if(keys[downKey])
		robot.obj = touchObj(robot.x,robot.y+1);
	if(keys[leftKey])
		robot.obj = touchObj(robot.x-1,robot.y);
	if(keys[rightKey])
		robot.obj = touchObj(robot.x+1,robot.y);
	

	if(keys[upKey] && !collide(robot.x, robot.y-1))
		robot.y--;
	else if(keys[downKey] && !collide(robot.x, robot.y+1))
		robot.y++;
	else if(keys[leftKey] && !collide(robot.x-1, robot.y))
		robot.x--;
	else if(keys[rightKey] && !collide(robot.x+1, robot.y))
		robot.x++;

	//check for any objects
	let obj = robot.obj;
	if(obj != null && !inArr(['_',':','}'], map[obj.y][obj.x])){
		newTxt((obj.txt == "" ? ("It's a " + obj.name + "!") : obj.txt));
	}

	canMove = false;
}		


///////////////////  AI FUNCTIONS  /////////////////////

// AI WITH DRUNKARD'S WALK MOVEMENT ALGORITHM
function drunkAI(ai){
	if(ai.move != 'drunk' || Math.random() < 0.6)
		return;

	var possMoves = ["none", "left", "right", "up", "down"];

	//remove illegal moves
	
	if(collide(ai.x,ai.y-1))
		possMoves.splice(possMoves.indexOf("up"),1);
	if(collide(ai.x,ai.y+1))
		possMoves.splice(possMoves.indexOf("down"),1);
	if(collide(ai.x-1,ai.y))
		possMoves.splice(possMoves.indexOf("left"),1);
	if(collide(ai.x+1,ai.y))
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

//////////   INTERACTION + TEXT FUNCTIONS  ////////////



// INTERACT WITH AN OBJECT
function touchObj(x,y){
	for(let o=0;o<map_obj.length;o++){
		let f = map_obj[o];
		if(f.x == x && f.y == y)
			return f;
	}
	return null;
}

// ADD NEW TEXT TO THE LOG
function newTxt(txt){
	allTxt.push(curTxt);
	curTxt = txt;
	renderText();
}

function clearTxt(){
	curTxt = "";
	renderText();
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
	drawCharacter(robot,true)
	for(let m=0;m<curMonsters.length;m++){
		drawCharacter(curMonsters[m]);
	}

	ctx.restore();
}

// DRAWS ON THE STATUS CANVAS
function renderStatus(){
	stx.save();
	stx.clearRect(0,0, canvas2.width, canvas2.height);

	//stx.fillStyle = "#4C5377";
	stx.fillStyle = "#000000";
	stx.fillRect(0,0,canvas2.width, canvas2.height);

	/* add draw function here */

	stx.fillStyle = '#ffffff';

	//draw robot stats
	let mid = canvas2.width/2;
	stx.font = '24px Proggy';
	stx.textAlign = "center";
	stx.fillText("-- STATS --", mid, 20);

	stx.font = '16px Proggy';
	stx.textAlign = "right";
	stx.fillStyle = modeColors['str'];
	stx.fillText("STR: " + robot.stats['str'], mid-20, 42);
	stx.fillStyle = modeColors['con'];
	stx.fillText("CON: " + robot.stats['con'], mid-20, 62);
	stx.fillStyle = modeColors['dex'];
	stx.fillText("DEX: " + robot.stats['dex'], mid-20, 82);
	stx.textAlign = "left"
	stx.fillStyle = modeColors['cha'];
	stx.fillText("CHA: " + robot.stats['cha'], mid+20, 42);
	stx.fillStyle = modeColors['int'];
	stx.fillText("INT: " + robot.stats['int'], mid+20, 62);
	stx.fillStyle = modeColors['wis'];
	stx.fillText("WIS: " + robot.stats['wis'], mid+20, 82);

	stx.fillStyle = "#ffffff";
	stx.fillRect(0,100,canvas2.width,2)

	//inventory
	stx.font = '24px Proggy';
	stx.fillStyle = '#ffffff';
	stx.textAlign = "center";
	stx.fillText("-- INVENTORY --", mid, 125);

	stx.font = '16px Proggy';
	stx.textAlign = "left";
	stx.fillText("ARMOR  : " + robot.armor, 12, 150);
	stx.fillText("WEAPON : " + robot.weapon, 12, 170);
	stx.fillText("MONEY  : $" + robot.money, 12, 190);

	//array items
	stx.font = '16px Proggy';
	stx.textAlign = 'center';
	stx.fillText("FOOD: ", mid, 210);
	stx.fillText("DRINKS: ", mid, 260);
	stx.fillText("ITEMS: ", mid, 310);


	//brackets
	stx.font = '45px Courier';
	stx.fillText("[     ]", mid, 240);
	stx.fillText("[     ]", mid, 290);
	stx.fillText("[     ]", mid, 340);

	//actual items
	stx.font = '14px Proggy';
	for(let i=0;i<robot.food.length;i++){
		let side = (i%2 == 0 ? 15 : canvas2.width-15);
		stx.textAlign = (side == 15 ? 'left' : 'right');
		stx.fillText(robot.food[i],side,225+((i>1)*15));
	}
	for(let i=0;i<robot.drink.length;i++){
		let side = (i%2 == 0 ? 15 : canvas2.width-15);
		stx.textAlign = (side == 15 ? 'left' : 'right');
		stx.fillText(robot.drink[i],side,275+((i>1)*15));
	}
	for(let i=0;i<robot.items.length;i++){
		let side = (i%2 == 0 ? 15 : canvas2.width-15);
		stx.textAlign = (side == 15 ? 'left' : 'right');
		stx.fillText(robot.items[i],side,325+((i>1)*15));
	}

	stx.restore();
}

// SHOW THE TEXT UPDATES
function renderText(){
	ttx.save();
	ttx.clearRect(0,0, canvas3.width, canvas3.height);

	//ttx.fillStyle = "#4C5377";
	ttx.fillStyle = "#000000";
	ttx.fillRect(0,0,canvas3.width, canvas3.height);

	/* add draw function here */
	
	ttx.font = '30px Proggy';
	ttx.fillStyle = '#ffffff';
	//ttx.fillText(String.fromCharCode(9590) + String.fromCharCode(9472) + String.fromCharCode(9488), 10, 20);
	ttx.fillText(curTxt, 10, 24);

	ttx.restore();
}

// UPDATE RENDER FOR BOTH CANVASES
function render(){
	renderGame();
	//renderStatus();
	//renderText();
}

// draw the character (robot or monster) on the game screen
function drawCharacter(c,backlit=false){
	ctx.font = size+"px " + game_font;
	ctx.fillStyle = modeColors[c.mode];
	ctx.textAlign = "center";
	if(!backlit)
		ctx.fillText(c.char, c.x*size,c.y*size);
	else{
		ctx.fillRect(c.x*size-size/2,c.y*size-size*(3.0/4.0),size,size);
		ctx.fillStyle = "#000";
		ctx.fillText(c.char, c.x*size,c.y*size);
	}
}

// draw the map
function drawMap(){
	if(map.length == 0)		//nothing to draw so don't bother
		return;

	ctx.font = (size)+"px " + game_font;
	//ctx.font = (size+12)+"px Proggy";
	ctx.fillStyle = "#cdcdcd";
	ctx.textAlign = "center";
	for(let r=0;r<map.length;r++){
		for(let c=0;c<map[0].length;c++){
			if(noChar(c,r)){
				let m = map[r][c];
				ctx.fillText((Number.isInteger(m) ? String.fromCharCode(m) : m), c*size, r*size);
			}
		}
	}

	//draw objects with color
	for(let i=0;i<map_obj.length;i++){
		let o = map_obj[i];
		ctx.fillStyle = o.c;
		ctx.fillText(map[o.y][o.x],o.x*size,o.y*size);
	}
	
	ctx.fillStyle = '#ffffff';
}

//////////////   GAME LOOP FUNCTIONS   //////////////////

// GAME INITIALIZATION FUNCTION
function init(){
	//map = initMap(20,20);
	gotoHouse("random");
	renderStatus();
	renderText();
}

// MAKE A NEW SCREEN FOR A HOUSE
function gotoHouse(house){
	//make a new house
	let mset = padMap(makeHouseMap(house),Math.floor(canvas.width/size),Math.floor(canvas.height/size));
	map = map2Box(mset['map'])
	map_obj = mset['objs'];

	//freeze the camera if house is small
	if((map[0].length-1) <= Math.floor(canvas.width/size) && (map.length-1) <= Math.floor(canvas.height/size))
		freezeCamera = true;
	else
		freezeCamera = false;

	//get robot position
	let enterPos = findDoor(map);
	robot.x = enterPos[1];
	robot.y = enterPos[0]-1;	//place above the door

	//make monsters in the house (placeholder)
	let nofloor = [robot.x+"-"+robot.y]
	curMonsters = monsterHouse(mset, nofloor);

	curTxt = "Entered a " + mset['htype'] + "!";
}

// MAIN GAME LOOP
function main(){
	requestAnimationFrame(main);
	canvas.focus();

	if(!freezeCamera)
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