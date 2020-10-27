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

// Option select keys
var num_key_set = [49,50,51,52,53,54];
var inOpt = false;

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
	other : null,
	item : null,
	socialAct : {},

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
var curItems = [];


// MAP VARIABLES
var map = []
var map_obj = [];
var world_doors = [];
var overworldPos = [];

var savedOverWorld = {};
var savedHouses = {};


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

// COPIES A 2D ARRAY
function copy2d(arr){
	return arr.map(a => a.slice());
}


////////////////   KEYBOARD FUNCTIONS  //////////////////


// KEY EVENTS
var keyTick = 0;
var kt = null; 

function anyKey(){
	return anyMoveKey()
}

// CHECK IF ANY DIRECTIONAL KEY IS HELD DOWN
function anyMoveKey(){
	return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}


/////////////   COLLISION FUNCTIONS   ////////////////

// CHECK COLLISION WITH ANYTHING
function collide(x,y){
	return mapCollide(x,y) || !noChar(x,y);
}

// CHECK IF COLLIDED WITH A MAP OBJECT
function mapCollide(x,y){
	return x < 0 || y < 0 || x >= map[0].length || y >= map.length || inArr(collidable, map[y][x])
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

	if(inOpt){
		inOpt = false;
		newTxt("Nevermind...");
	}

	//see if touching anything
	if(keys[upKey]){
		robot.obj = touchObj(robot.x,robot.y-1);
		robot.other = touchPer(robot.x,robot.y-1);
	}
	if(keys[downKey]){
		robot.obj = touchObj(robot.x,robot.y+1);
		robot.other = touchPer(robot.x,robot.y+1);
	}
	if(keys[leftKey]){
		robot.obj = touchObj(robot.x-1,robot.y);
		robot.other = touchPer(robot.x-1,robot.y);
	}
	if(keys[rightKey]){
		robot.obj = touchObj(robot.x+1,robot.y);
		robot.other = touchPer(robot.x+1,robot.y);
	}
	

	if(keys[upKey] && !collide(robot.x, robot.y-1))
		robot.y--;
	else if(keys[downKey] && !collide(robot.x, robot.y+1))
		robot.y++;
	else if(keys[leftKey] && !collide(robot.x-1, robot.y))
		robot.x--;
	else if(keys[rightKey] && !collide(robot.x+1, robot.y))
		robot.x++;

	//see if on something
	robot.item = touchItem(robot.x,robot.y)

	//check if entering door
	if(map[robot.y][robot.x] == '/'){
		enterDoor();
	}

	
	let obj = robot.obj;
	let other = robot.other;
	let item = robot.item;


	//check for any objects
	if(obj != null && !inArr(['_',':','}'], map[obj.y][obj.x])){
		if(!('opt' in obj.interSet))
			newTxt((obj.txt == "" ? ("It's a " + obj.name + "!") : obj.txt));
		else{
			inOpt = true;
			newTxt("What do you want to do?\n" + obj.interSet['opt']);
		}	

	}
	//check for people
	else if(other != null){
		let t1 = "";
		let t2 = "";
		//show character information based on stats
		let mon_name = monsterCharMap[other.char];
		mon_name = mon_name.charAt(0).toUpperCase() + mon_name.slice(1);

		if(robot.stats['int'] == 0)
			t1 = "???: " + monIntro[other.char];
		else if(robot.stats['int'] < 10)
			t1 = mon_name + ": " + monIntro[other.char];
		else
			t1 = mon_name + " (" + showHighStat(other) + "): " + monIntro[other.char];
		
		//show options based on stats
		let i = 1;

		//fight
		if(robot.stats['str'] == 0){
			//do nothing
		}else if(robot.stats['str'] >= 10){
			t2 += i + ") Punch ";
			robot.socialAct[i] = 'punch';
			i++;
		}else if(robot.stats['str'] >= 5){
			t2 += i + ") Push ";
			robot.socialAct[i] = 'push';
			i++;
		}

		//cool wave
		if(robot.stats['dex'] == 0){
			//do nothing
		}else if(robot.stats['dex'] >= 15){
			t2 += i + ") Finger Guns ";
			robot.socialAct[i] = 'finger guns';
			i++;
		}else if(robot.stats['dex'] >= 5){
			t2 += i + ") Wave ";
			robot.socialAct[i] = 'wave';
			i++;
		}


		//flirt
		if(robot.stats['cha'] == 0){
			//do nothing
		}else if(robot.stats['cha'] >= 13){
			t2 += i + ") Flirt ";
			robot.socialAct[i] = 'flirt';
			i++;
		}else if(robot.stats['cha'] >= 5){
			t2 += i + ") Talk ";
			robot.socialAct[i] = 'talk';
			i++;
		}

		//give item or ask question
		if(robot.stats['wis'] == 0){
			//do nothing
		}else if(robot.stats['wis'] >= 12 && (robot.drink.length > 0 || robot.food.length > 0)){
			t2 += i + ") Give item ";
			robot.socialAct[i] = 'give';
			i++;
		}else if(robot.stats['wis'] >= 7){
			t2 += i + ") Ask Question ";
			robot.socialAct[i] = 'ask';
			i++;
		}

		//options available
		if(t2 != "")
			inOpt = true;

		newTxt(t1+"\n"+t2);

	}
	//check if ontop of item
	else if(item != null){
		inOpt = true;
		if(robot.stats['int'] <= 5)
			newTxt("You stepped on a thing. Pick it up?\n1) Pick it up  2) Leave it");
		else if(robot.stats['int'] <= 10){
			let c = {"!": 'a drink', '%': 'a snack', '*':'something interesting'}
			newTxt("You stepped " + c[item['symb']] + ". Pick it up?\n1) Pick it up  2) Leave it");
		}else{
			newTxt("You stepped on " + item['name'] + ". Pick it up?\n1) Pick it up  2) Leave it");
		}
	}

	canMove = false;
		
		
}		

// SELECT AN OPTION FOR THE ROBOT TO ACT WITH FOR AN OBJECT
function objSelectOption(num){
	if(!inOpt)
		return;

	//escape options 
	if(!(num in robot.obj.interSet)){
		newTxt("Nevermind...");
		robot.obj = null;
		inOpt = false;

		return;
	}

	//otherwise apply change based on probability
	let s = robot.obj.interSet[num];
	let r = Math.random();
	let p = [];
	for(let a=0;a<s.length;a++){
		p.push(s[a].prob);
	}
	//choose random event
	let curP = 0;
	for(let a=0;a<p.length;a++){
		//match
		if(r < (curP + p[a])){
			newTxt(s[a].text);
			addStats(robot, s[a].statFX);
			renderStatus();
			robot.obj = null;
			inOpt = false;
			return;
		}
		//continue
		else{
			curP += p[a];
		}
	}

	//should never reach but just in case
	newTxt("Nevermind...");
	robot.obj = null;
	inOpt = false;
}

function perSelectOption(num){
	if(!inOpt)
		return;

	//escape options 
	if(!(num in robot.socialAct)){
		newTxt("Nevermind...");
		robot.other = null;
		inOpt = false;

		return;
	}

	let a = robot.socialAct[num];

	if(a == 'push'){
		if(robot.other.mode != 'str'){
			newTxt("'Hey watch it!'");
			robot.other = null;
			inOpt = false;

			return;
		}else{
			newTxt("'Oh you wanna fight?!'");
			addStats(robot, [0,0,0,0,0,-1]);
			robot.other = null;
			inOpt = false;

			return;
		}
	}else if(a == 'punch'){
		//PLACEHOLDER
		let money = Math.floor(Math.random()*20)+1;
		newTxt("You knocked them out cold!\nGot $" + money + "!");
		addStats(robot, [1,0,0,0,0,0]);
		robot.money += money;
		robot.other = null;
		inOpt = false;

		return;
	}else if(a == 'talk'){
		if(robot.other.mode != 'cha'){
			newTxt(monIntro[robot.other.char]);
			robot.other = null;
			inOpt = false;
			
			return;
		}else{
			newTxt("'Oh yeah?'");
			robot.other = null;
			inOpt = false;
			addStats(robot, [0,0,0,(Math.random() > 0.75 ? 1 : 0),0,0]);
			
			return;
		}
	}else if(a == 'flirt'){
		if(robot.other.mode != 'cha'){
			newTxt("'...?'");
			addStats(robot, [0,0,0,0,0,-1]);
			robot.other = null;
			inOpt = false;

			return;
		}else{
			newTxt("'Ooo aren't you a sweet talker~'");
			addStats(robot, [0,0,0,(Math.random() < 0.5 ? 1 : 0),0,0]);
			robot.other = null;
			inOpt = false;

			return;
		}
	}else if(a == 'wave'){
		newTxt("They wave back and smile!");
		robot.other = null;
		inOpt = false;

		return;
	}else if(a == 'finger guns'){
		let r = (Math.random() > 0.25 ? 1 : 0);
		addStats(robot, [0,0,0,r,0,0]);
		if(r)
			newTxt("They are in awe of your coolness!");
		else
			newTxt("They look uneasy...");
		robot.other = null;
		inOpt = false;

		return;
	}else if(a == 'give'){
		let i = Math.floor(Math.random()*robot.drink.length);
		newTxt("You give them a " + robot.drink[i] + "!\n'Hey thanks dude!'");
		addStats(robot [0,0,0,3,0,0]);
		robot.drink.splice(i,1);
		robot.other = null;
		inOpt = false;

		return;
	}else if(a == 'ask'){
		newTxt("'IDK jack shit my dude...'");
		robot.other = null;
		inOpt = false;
		return;
	}
}

// PICK IT UP BITCH
function itemSelectOption(num){
	if(!inOpt)
		return;
	if(num == 1){
		if(robot.item['symb'] == "!" && robot.drinks.length < 4)
			robot.drinks.push(robot.item['name']);
		else if(robot.item['symb'] == '%' && robot.food.length < 4)
			robot.food.push(robot.item['name']);
		else if(robot.item['symb'] == '')

		robot.item = null;
	}

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

// INTERACT WITH A PERSON
function touchPer(x,y){
	for(let p=0;p<curMonsters.length;p++){
		let per = curMonsters[p];
		if(per.x == x && per.y == y){
			return per;
		}
	}
	return null;
}

// INTERAT WITH ITEMS
function touchItem(x,y){
	for(let i=0;i<curItems.length;i++){
		let item = curItems[i];
		if(item['loc'][0] == x && item['loc'][1] == y)
			return item;
	}
	return null;
}

// ADD NEW TEXT TO THE LOG
function newTxt(txt){
	allTxt.push(curTxt);
	curTxt = txt;
	renderText();
	renderStatus();	//just in case
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
	let t = curTxt.split("\n");
	ttx.fillText(t[0], 10, 24);
	if(t.length > 1)
		ttx.fillText(t[1], 10, 48);

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
	//gotoHouse("random");
	newOverworld();
	renderStatus();
	renderText();
}

// MAKE A NEW SCREEN FOR A HOUSE
function newHouse(house,loc){
	//make a new house
	let mset = padMap(makeHouseMap(house),Math.floor(canvas.width/size),Math.floor(canvas.height/size));
	map = map2Box(mset['map'])
	map_obj = mset['objs'];

	//freeze the camera if house is small
	if((map[0].length-1) <= Math.floor(canvas.width/size) && (map.length-1) <= Math.floor(canvas.height/size))
		freezeCamera = true;
	else
		freezeCamera = false;

	panCamera();

	//get robot position
	let enterPos = findDoor(map);
	robot.x = enterPos[0];
	robot.y = enterPos[1]-1;	//place above the door

	world_doors = [[enterPos,"overworld"]];

	//make monsters in the house (placeholder)
	let nofloor = [robot.x+"-"+robot.y]
	curMonsters = monsterHouse(mset, nofloor);

	curTxt = "Entered a " + mset['htype'] + "!";

	//save data
	savedHouses[loc] = {'map':copy2d(map), 'objs':map_obj.slice(), 'monsters':curMonsters.slice()};
}
// USE THE SAME HOUSE AS SAVED BEFORE
function gotoHouse(hset){
	map = map2Box(hset['map'])
	map_obj = hset['objs'];
	curMonsters = hset['monsters'];

	//freeze the camera if house is small
	if((map[0].length-1) <= Math.floor(canvas.width/size) && (map.length-1) <= Math.floor(canvas.height/size))
		freezeCamera = true;
	else
		freezeCamera = false;
	panCamera();

	//get robot position
	let enterPos = findDoor(map);
	robot.x = enterPos[0];
	robot.y = enterPos[1]-1;	//place above the door

	world_doors = [[enterPos,"overworld"]];

	curTxt = "Guess who's back! Back again!";
}

// MAKE NEW SCREEN FOR OVERWORLD
function newOverworld(side=""){
	let mset = makeOverworld(side,[4,10]);
	map = map2Box(mset['map']);
	world_doors = mset['doors'];
	map_obj = [];

	//place robot at center
	robot.x = Math.floor(map[0].length/2);
	robot.y = Math.floor(map.length/2);

	freezeCamera = false;
	panCamera();

	//add monsters
	let nofloor = [robot.x+"-"+robot.y];
	curMonsters = monsterWorld(map,nofloor);

	curTxt = "Hello PARTY World!";

	robot.stats['int'] = 10;

	savedOverWorld = copy2d(map);
}
// USE SAVED OVERWORLD
function gotoOverworld(){
	map = savedOverWorld['map'];
	world_doors = savedOverWorld['doors']
	map_obj = [];

	freezeCamera = false;
	panCamera();


	robot.x = overworldPos[0];
	robot.y = overworldPos[1];

	let nofloor = [robot.x+"-"+robot.y];
	curMonsters = monsterWorld(map,nofloor);

	curTxt = "Back at it again PARTY World!";

	robot.stats['int'] = 10;
}

function enterDoor(){
	for(let d=0;d<world_doors.length;d++){
		let p = world_doors[d][0];
		//console.log(p + " " + robot.x + "," + robot.y)
		if(p[0] == robot.x && p[1] == robot.y){
			let envName = world_doors[d][1];
			//assume overworld was already generated upon starting the game
			if(envName == 'overworld'){		
				gotoOverworld();
			}
			//enter house
			else{
				overworldPos = [robot.x, robot.y+1];
				savedOverWorld = {'map':copy2d(map),'doors':copy2d(world_doors)}

				let loc = (robot.x+"-"+robot.y);
				//console.log("house partay!");

				//load old house
				if(loc in savedHouses){
					gotoHouse(savedHouses[loc]);
				}//generate new house
				else{
					if(envName == 'small' || envName == 'small2'){
						let h = ['small_party','LAN_party','normal_house','witch_party']
						newHouse(h[Math.floor(Math.random()*h.length)],loc);
					}else if(envName == 'large'){
						newHouse('large_party_(lower)',loc)
					}
				}
			}
		}
	}
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
	}else if(inArr(num_key_set, e.keyCode) && inOpt){
		if(robot.obj != null)
			objSelectOption(e.keyCode - 48);
		else if(robot.other != null)
			perSelectOption(e.keyCode - 48);
	}
});

// CHECK FOR KEY RELEASED
document.body.addEventListener("keyup", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = false;
		canMove = true;
	}else if(inArr(num_key_set, e.keyCode)){
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