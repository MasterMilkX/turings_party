//set ascii values

var floor = "."
var wall = "#";
var outside_door = "/";
var close_door = '^';
var open_door = '`';
var stairs_up = "<";
var stairs_down = ">";

let houseCharKey = {
	']' : ['fridge', 'cauldron'],
	'=' : ['table', 'counter'],
	'}' : ['bed'],
	':' : ['toilet'],
	'+' : ['TV', 'computer', 'stereo','keg'],
	'_' : ['couch', 'chair', 'stool'],
	'!' : ['beer', 'vodka', 'fireball', 'jaeger', 'jungle juice', 'McD Sprite', 'blue drink', 'water'],
	'%' : ['chips', 'pizza', 'cheetos', 'McD Fries', 'chalupa', 'corndog', 'chicken nugs'],
	'*' : ['greek pin', 'student ID', 'shot glass', 'class ring', 'pencil', 'guitar', 'lampshade', 'house key'],
	'?' : ['phone'],
	'$' : ['money'],
	')' : ['baseball bat', 'fake sword', 'lightsaber'],
	'(' : ['varsity jacket', 'T-shirt', 'toga', 'bra', 'tie']
}

//makes objects
function furniture(name,x,y){
	this.name = name;
	this.x=x;
	this.y=y;
	this.txt="";
	this.c = objColor(name);
	this.interSet = assignFurnInteract(name);
}
// OBJECT INTERACTION EFFECT
function interact(prob, statFX, text){
	this.prob = prob;
	this.statFX = statFX;
	this.text = text;
}	

// GIVE ASSIGNMENT OF FURNITURE INTERACTIONS
function assignFurnInteract(name){
	let i = {}
	if(name == 'table'){
		i[1] = [new interact(0.45,[0,0,2,1,0,0], 'You won!'),
					new interact(0.35, [0,-1,0,0,0,0], 'You lost...'),
					new interact(0.2,[0,0,-1,-1,0,0], 'Party foul!')];
		i[2] = [new interact(0.5, [0,-1,0,-1,0,0], 'You lost...'),
					new interact(0.5, [0,2,0,1,0,0], 'You win!')];
		i[3] = [new interact(0.25, [0,0,1,1,0,0], "Dare: You did a fuckin' flip!"),
					new interact(0.25, [0,-1,0,1,0,-1], "Dare: You chugged some mystery liquid!"),
					new interact(0.25, [0,0,0,1,0,2], "Dare: You said no to drugs!"),
					new interact(0.25, [0,0,0,-2,0,0], "Truth: You said you're a robot...")];
		
		i['opt'] = "1) Beer Pong  2) Drinking race  3) T or D";
	}else if(name == 'computer'){
		i[1] = [new interact(0.2, [0,0,1,0,1,0],"Learned basic physics!"),
					new interact(0.2, [0,0,0,2,0,0], "Learned how to socialize!"),
					new interact(0.2, [0,0,0,0,2,0], "Watched a TED Talk!"),
					new interact(0.4, [0,0,0,0,-1,0], "Watched meme compilations...")];
		i[2] = [new interact(1.0, [2,0,0,0,0,-2], "You smashed the computer...")];
		i['opt'] = "1) Internet  2) Smash it!";
	}else if(name == 'tv'){
		i[1] = [new interact(0.5, [0,0,0,0,-1,0], "It's just static..."),
					new interact(0.5, [0,0,0,0,1,0], "A Netflix show is on...")];
		i[2] = [new interact(0.5, [0,0,1,0,0,0], "You won Rainbow Road!"),
				new interact(0.5, [0,-1,0,0,0,0], "You drove off Rainbow Road..."),
				];
		i['opt'] = "1) Watch TV  2) Play Drunk Mario Kart";
	}else if(name == 'stereo'){
		i[1] = [new interact(1.0, [0,0,0,-1,0,0], "You change the song...")];
		i['opt'] = "1) Change the song"
	}else if(name == 'keg'){
		i[1] = [new interact(0.8, [0,2,0,0,0,0], "Chug successful!"),
				new interact(0.2, [0,-3,0,0,0,0], "You puked and short-circuited...")]
		i['opt'] = "1) Chug"
	}

	return i;
}




let boxConv = {
	'#   ' : 9589,	//only top
	' #  ' : 9591,	//only bottom
	'  # ' : 9588,	//only left
	'   #' : 9590, 	//only right
	' # #' : 9484,	//left top corner
	' ## ' : 9488,	//right top corner
	'#  #' : 9492,	//left bottom corner
	'# # ' : 9496,	//right bottom corner
	'  ##' : 9472,	//hor straight
	'##  ' : 9474,	//ver straight
	'## #' : 9500,  //t right
	'### ' : 9508,	//t left
	' ###' : 9516,	//t bottom
	'# ##' : 9524,	//t top
	'####' : 9532	//plus
}
var collidable = ['#','=',']','+', '|']
collidable.push.apply(collidable,Object.values(boxConv))


// CHECKS IF AN ELEMENT IS IN AN ARRAY
function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}

// MAKES INITIAL MAP
function initMap(wRange, hRange, randomDim=false){
	return blankMap(wRange,hRange,randomDim);
}

// MAKES AN EMPTY MAP
function blankMap(wRange, hRange, randomDim=false){
	//define map size
	var w = wRange;
	var h = hRange;

	if(randomDim){
		w = (Math.floor(Math.random() * (wRange[1]-wRange[0]))+wRange[0]);
		h = (Math.floor(Math.random() * (hRange[1]-hRange[0]))+hRange[0]);
	}
	

	//console.log(w + " x " + h);

	//make map with borders and floor
	var m = []
	for(var r=0;r<h;r++){
		var l = []
		for(var c=0;c<w;c++){
			if(r == 0 || c == 0 || c == w-1 || r == h-1)
				l.push(wall)
			else
				l.push(floor);
		}
		m.push(l);
	}
	return m;
}



// RETURNS A RANDOM MAP POSITION
function randomMapPos(w,h,ox=0,oy=0){
	return [Math.floor(Math.random()*(w-1))+1, Math.floor(Math.random()*(h-1)+1)];
}

// RETURNS A RANDOM HOUSE POSITION BASED ON FLOOR TILES
function randomHousePos(map, exclusions=[],char='.'){
	//find all floor tiles
	let floor = [];
	for(let r=0;r<map.length;r++){
		for(let c=0;c<map[0].length;c++){
			if(map[r][c] == char && !inArr(exclusions,c+"-"+r)){
				floor.push([c,r]);		//save as [x,y]
			}	
		}
	}
	if(floor.length > 0)
		return floor[Math.floor(Math.random()*floor.length)];
	else
		return []
}

// MAKES A HOUSE
function makeHouseMap(houseType='random'){
	//choose a random house
	let allHouses = ['small_party', 'LAN_party', 'witch_party', 'normal_house', 'large_party_(lower)']
	if(houseType == 'random')
		houseType = allHouses[Math.floor(Math.random()*allHouses.length)];


	if(houseType == 'small_party'){
		let map = [
		['#','#','#','#','#','#','#','#'],
		['#',']','.','.','.','.','_','#'],
		['#','.','.','.','.','+','_','#'],
		['#','.','=','=','.','.','_','#'],
		['#','.','.','.','.','.','.','#'],
		['#','`','#','.','.','.','.','#'],
		['#',':','#','+','.','.','.','#'],
		['#','#','#','#','#','/','#','#']
		]
		let house_objs = [
			new furniture('fridge', 1,1),
			new furniture('tv', 5,2),
			new furniture('couch', 6,1),
			new furniture('couch', 6,2),
			new furniture('couch', 6,3),
			new furniture('toilet', 1,6),
			new furniture('table', 2,3),
			new furniture('table', 3,3),
			new furniture('stereo', 3,6)
		]
		return {'htype': houseType.replace(/_/g," "), 'map':map, 'objs':house_objs};
	}else if(houseType == 'LAN_party'){
		let map = [
		['#','#','#','#','#','#','#','#'],
		['#',']',']','.','.','=','=','#'],
		['#','.','.','.','.','.','.','#'],
		['#','+','_','.','.','_','+','#'],
		['#','.','.','.','.','.','.','#'],
		['#','+','_','.','.','_','+','#'],
		['#','.','.','.','.','.','.','#'],
		['#','+','_','.','.','_','+','#'],
		['#','.','.','.','.','.','.','#'],
		['#','/','#','#','#','#','#','#']
		]
		let house_objs = [
			new furniture('fridge', 1,1),
			new furniture('fridge', 2,1),
			new furniture('table', 5,1),
			new furniture('table', 6,1),
			new furniture('computer', 1,3),
			new furniture('computer', 1,5),
			new furniture('computer', 1,7),
			new furniture('computer', 6,3),
			new furniture('computer', 6,5),
			new furniture('computer', 6,7),
			new furniture('stool', 2,3),
			new furniture('stool', 2,5),
			new furniture('stool', 2,7),
			new furniture('stool', 5,3),
			new furniture('stool', 5,5),
			new furniture('stool', 5,7)
		]
		return {'htype': houseType.replace(/_/g," "), 'map':map, 'objs':house_objs};
	}else if(houseType == 'witch_party'){
		let map = [
		['#','#','#','#','#','#','#','#','#'],
		['#',']','_','.','^','.','_',']','#'],
		['#','.','.','.','#','.','.','.','#'],
		['#','.','.','.','#','.','.','.','#'],
		['#','^','#','#','#','#','#','^','#'],
		['#','.','.','.','#','.','.','.','#'],
		['#','.','.','.','#','.','.','.','#'],
		['#',']','_','.','.','.','_',']','#'],
		['#','#','#','#','/','#','#','#','#']
		]
		let house_objs = [
			new furniture('cauldron', 1,1),
			new furniture('cauldron', 7,1),
			new furniture('cauldron', 1,7),
			new furniture('cauldron', 7,7),
			new furniture('stool', 2,1),
			new furniture('stool', 6,1),
			new furniture('stool', 2,7),
			new furniture('stool', 6,7)
		]
		return {'htype': houseType.replace(/_/g," "), 'map':map, 'objs':house_objs};
	}else if(houseType == 'normal_house'){
		let map = [
		['#','#','#','#','#','#','#','#'],
		['#',']','.','#','.','}','}','#'],
		['#','.','.','#','.','.','.','#'],
		['#','.','#','#','^','#','#','#'],
		['#','.','.','.','.','.','.','#'],
		['#','+','_','.','=','=','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','#','#','#','#','#','/','#']
		]
		let house_objs = [
			new furniture('fridge', 1,1),
			new furniture('bed', 5,1),
			new furniture('bed', 6,1),
			new furniture('tv', 1,5),
			new furniture('couch', 2,5),
			new furniture('table', 4,5),
			new furniture('table', 5,5)
		]
		return {'htype': houseType.replace(/_/g," "), 'map':map, 'objs':house_objs};
	}else if(houseType == 'large_party_(lower)'){
		let map = [
		['#','#','#','#','#','#','#','#','#','#','#','#','#'],
		['#','_','_','_','.','+','#','.','.','.','.','.','#'],
		['#','_','.','.','.','.','#','.','=','=','=','.','#'],
		['#','_','.','+','.','.','#','.','=','=','=','.','#'],
		['#','.','.','.','.','.','#','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','.','.','.','.','.','#'],
		['#','#','.','=','=','.','.','.','.','.','.',']','#'],
		['#','<','.','=','=','.','#','.','.','.','.',']','#'],
		['#','.','.','=','=','.','#','.','.','.','.','.','#'],
		['#','.','.','=','=','.','#','.','+','+','.',']','#'],
		['#','.','.','.','.','.','#','.','.','.','.',']','#'],
		['#','/','/','#','#','#','#','#','#','#','#','#','#']
		]
		let house_objs = [
			//first room
			new furniture('couch', 1,1),
			new furniture('couch', 2,1),
			new furniture('couch', 3,1),
			new furniture('couch', 1,2),
			new furniture('couch', 1,3),
			new furniture('tv', 3,3),
			new furniture('stereo', 5,1),
			new furniture('table', 3,6),
			new furniture('table', 4,6),
			new furniture('table', 3,7),
			new furniture('table', 4,7),
			new furniture('table', 3,8),
			new furniture('table', 4,8),
			new furniture('table', 3,9),
			new furniture('table', 4,9),
			//second room
			new furniture('table', 8,2),
			new furniture('table', 8,3),
			new furniture('table', 9,2),
			new furniture('table', 9,3),
			new furniture('table', 10,2),
			new furniture('table', 10,3),
			new furniture('keg', 8,9),
			new furniture('keg', 9,9),
			new furniture('fridge', 11,6),
			new furniture('fridge', 11,7),
			new furniture('fridge', 11,9),
			new furniture('fridge', 11,10)
		]
		return {'htype': houseType.replace(/_/g," "), 'map':map, 'objs':house_objs};
	}else if(houseType == 'large_party_(upper)'){
		let map = [
		['#','#','#','#','#','#','#','#','#','#','#','#','#'],
		['#','.','}','.','#','.','}','.','#','.','}','.','#'],
		['#','.','}','.','#','.','}','.','#','.','}','.','#'],
		['#','.','.','.','#','.','.','.','#','.','.','.','#'],
		['#','.','.','.','#','.','.','.','#','.','.','.','#'],
		['#','#','^','#','#','#','^','#','#','#','^','#','#'],
		['#','.','.','.','.','.','.','.','.','.','.','.','#'],
		['#','>','.','.','.','.','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','#','#','.','#','#','.','#'],
		['#','.','.','.','.','.','#','.','.','#','.','.','#'],
		['#','.','.','.','.','.','#',':','.','#',':','.','#'],
		['#','#','#','#','#','#','#','#','#','#','#','#','#']
		]
		let house_objs = [
			new furniture('bed', 2,1),
			new furniture('bed', 2,2),
			new furniture('bed', 6,1),
			new furniture('bed', 6,2),
			new furniture('bed', 10,1),
			new furniture('bed', 10,2),
			new furniture('toilet', 10,10),
			new furniture('toilet', 7,10)
		]
		return {'htype': houseType.replace(/_/g," "), 'map':map, 'objs':house_objs};
	}else{	//blank 8x8 map
		let map = [
		['#','#','#','#','#','#','#','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','#','#','/','/','#','#','#']
		]
		let house_objs = []
		return {'htype': houseType.replace(/_/g," "), 'map':map, 'objs':house_objs};
	}
}

// CENTER THE GAME SCREEN IF MAP IS TOO SMALL
function padMap(mapset, w,h){
	let map = mapset['map'];
	if(map.length >= h || map[0].length >= w){
		w = map[0].length+4;
		h = map.length+4;
	}

	w = ((w-map[0].length) % 2 == 0 ? w : w+1)
	h = ((h-map.length) % 2 == 0 ? h : h+1)
		

	let newmap = [];

	//make an empty map first
	for(let r=0;r<h;r++){
		let row = []
		for(let c=0;c<w;c++){
			row.push(" ");
		}
		newmap.push(row);
	}

	//get offset
	let ox = Math.floor((w - map[0].length)/2);
	let oy = Math.floor((h - map.length)/2);

	//add the map
	for(let r=0;r<map.length;r++){
		for(let c=0;c<map[0].length;c++){
			newmap[r+oy][c+ox] = map[r][c];
		}
	}

	//offset all of the objects as well
	let objs = mapset['objs'];
	for(let o=0;o<objs.length;o++){
		objs[o].x += ox;
		objs[o].y += oy;
	}

	return {'htype': mapset['htype'], 'map' : newmap, 'objs' : objs};
}

// CONVERTS A MAP WITH HASH CHARACTERS TO UNICODE BOX CHARACTERS
function map2Box(m){

	let m2 = [];
	for(let r=0;r<m.length;r++){
		let row = [];
		for(let c=0;c<m[0].length;c++){
			if(m[r][c] != '#')
				row.push(m[r][c]);
			else{
				//get neighbors
				let n = '';
				n += ((r > 0) && (m[r-1][c] == '#') ? '#' : ' ');
				n += ((r < m.length-1) && (m[r+1][c] == '#') ? '#' : ' ');
				n += ((c > 0) && (m[r][c-1] == '#') ? '#' : ' ');
				n += ((c < m[0].length-1) && (m[r][c+1] == '#') ? '#' : ' ');

				row.push(boxConv[n]);
			}
		}
		m2.push(row)
	}
	return m2;
}

// FIND ALL OF THE DOORS ON A GIVEN MAP
function findDoor(map){
	for(let r=0;r<map.length;r++){
		for(let c=0;c<map[0].length;c++){
			if(map[r][c] == '/'){
				return [c,r];
			}
		}
	}
}

function objColor(name){
	if(name == 'stool')
		return '#9D6505';
	else if(name == 'fridge')
		return '#E2E2E2';
	else if(name == 'couch')
		return '#193F8C'
	else if(name == 'table')
		return '#FF0B01'
	else if(name == 'cauldron')
		return '#525252';
	else if(name == 'tv')
		return '#BB49BE'
	else if(name == 'stereo')
		return '#253CFF';
	else if(name == 'computer')
		return '#C8E6ED';
	else if(name == 'bed')
		return '#EDF0DC';
	else if(name == 'keg')
		return '#B48B14'
	else if(name == 'toilet')
		return '#A0C4AE'
	else
		return '#ffffff';
}



///////   OVERWORLD FUNCTIONS   ///////
function baseOverworld(start_side=""){
	let m = blankMap([20,30], [20,30], true);
	let dir = ["north", "south", "west", "east"];
	let newdir = []
	if(start_side != "")
		newdir.push.apply(newdir,dir.splice(dir.indexOf(start_side),1));

	newdir.push.apply(newdir,dir.splice(Math.floor(Math.random()*dir.length),1));

	if(Math.random() < 0.3)
		newdir.push.apply(newdir,dir.splice(Math.floor(Math.random()*dir.length),1));
	if(Math.random() < 0.1)
		newdir.push.apply(newdir,dir.splice(Math.floor(Math.random()*dir.length),1));

	makeRoadDir(m,newdir);

	
	return m
}

// ADDS MAIN ROADS TO A MAP
function makeRoadDir(map, dirSet){
	let mx = Math.floor(map[0].length/2);
	let my = Math.floor(map.length/2);

	//make a box in the center point
	for(let y=-2;y<=2;y++){
		for(let x=-2;x<=2;x++){
			let c = ' '
			if(y == -2 || y == 2)
				c = 9548;
			if(x == -2 || x == 2)
				c = 9550;
			map[my+y][mx+x] = c;
		}
	}

	//add directional roads accordingly
	if(inArr(dirSet,'north')){
		for(let y=my-2;y>=0;y--){
			for(let w=-2;w<=2;w++){	
				let c = ' '
				if(w == 0 && y%3 == 0)			//marker line (white rectangle)
					c = 9647;
				else if(w == -2 || w == 2)		//sidewalk (dottod line)
					c = 9550;

				map[y][mx+w] = c;
			}
		}
	}if(inArr(dirSet,'south')){
		for(let y=my+2;y<map.length;y++){
			for(let w=-2;w<=2;w++){		
				let c = ' '
				if(w == 0 && y%3 == 0)			//marker line (white rectangle)
					c = 9647;
				else if(w == -2 || w == 2)		//sidewalk (dottod line)
					c = 9550;
				
				map[y][mx+w] = c;
			}
		}
	}if(inArr(dirSet,'east')){
		for(let x=mx+2;x<map[0].length;x++){
			for(let w=-2;w<=2;w++){		
				let c = ' '
				if(w == 0 && x%3 == 0)			//marker line (white rectangle)
					c = 9645;
				else if(w == -2 || w == 2)		//sidewalk (dottod line)
					c = 9548;

				map[my+w][x] = c;
			}
		}
	}if(inArr(dirSet, 'west')){
		for(let x=mx-2;x>=0;x--){
			for(let w=-2;w<=2;w++){		
				let c = ' '
				if(w == 0 && x%3 == 0)			//marker line (white rectangle)
					c = 9645;
				else if(w == -2 || w == 2)		//sidewalk (dottod line)
					c = 9548;

				map[my+w][x] = c;
			}
		}
	}

}


// ADDS BUILDINGS TO THE MAP IN OPEN AREAS
function makeBuildings(map,range=[3,10]){
	let small = [['#','#','#','#'],
				['#',' ',' ','#'],
				['#',' ',' ','#'],
				['#','/','#','#']]
	let small2 = [['#','#','#','#'],
				['#',' ',' ','#'],
				['#',' ',' ','#'],
				['#','#','/','#']]
	let large = [['#','#','#','#','#','#','#'],
				['#',' ',' ',' ',' ',' ','#'],
				['#',' ',' ',' ',' ',' ','#'],
				['#',' ',' ',' ',' ',' ','#'],
				['#','/','#','#','#','#','#']]
	let office_building = [['#','#','#','#','#','#'],
						  ['#',' ',' ',' ',' ','#'],
						  ['#',' ',' ',' ',' ','#'],
						  ['#','#','#','#','|','#']]
	let skyscraper = [['#','#','#','#','#','#','#'],
						  ['#',' ',' ',' ',' ',' ','#'],
						  ['#',' ',' ',' ',' ',' ','#'],
						  ['#',' ',' ',' ',' ',' ','#'],
						  ['#',' ',' ',' ',' ',' ','#'],
						  ['#',' ',' ',' ',' ',' ','#'],
						  ['#','#','#','|','#','#','#']]

	let bar_store = [['#','#','#'],['#','_','#'],['=','=','=']]


	let all_buildings = {
		'small' : [[4,4],small],
		'small2' : [[4,4],small2],
		'large' : [[7,5],large],
		'office_building' : [[6,4],office_building],
		'skyscraper' : [[7,7], skyscraper],
		'bar' : [[3,3], bar_store],
		'store' : [[3,3], bar_store]
	}

	let numBuildings = Math.floor(Math.random()*(range[1]-range[0]))+range[0];
	let buildSets = Object.keys(all_buildings);

	let doorset = [];
	for(let b=0;b<numBuildings;b++){
		let buildName = buildSets[Math.floor(Math.random()*buildSets.length)];
		let door = placeBuilding(map, all_buildings[buildName]);
		if(door.length > 0){
			doorset.push([door,buildName])
		}
	}
	return doorset;

}

// FINDS A SUITABLE LOCATION ON THE MAP FOR THE GIVEN DIMENSIONS
function placeBuilding(map, build){
	let lim = 50;
	let dim = build[0];
	let arch = build[1];

	for(let i=0;i<lim;i++){
		//get random top left corner point to place
		let x = Math.floor(Math.random()*(map[0].length-dim[0]-2))+1;
		let y = Math.floor(Math.random()*(map.length-dim[1]-2))+1;

		//check from that point on
		let badPt = false;
		for(let a=0;a<dim[0]+2;a++){
			for(let b=0;b<dim[1]+2;b++){
				if(map[y+b][x+a] != "."){
					badPt = true;
					break;
				}	
			}
			if(badPt)
				break;
		}

		//allow building to be made at location
		if(!badPt){

			arch = map2Box(arch);		//convert

			let door = [];
			for(let a=0;a<dim[0];a++){
				for(let b=0;b<dim[1];b++){
					map[y+b+1][x+a+1] = arch[b][a];
					if(arch[b][a] == '/')
						door = [x+a+1,y+b+1];
				}
			}
			return door;
		}
	}

	return [];
}

//generate the overworld map
function makeOverworld(start_side="", buildRange=[3,7]){
	let m = baseOverworld(start_side);
	let doorSet = makeBuildings(m,buildRange);
	return {'map': m, 'doors': doorSet};
}


function overworldDat(od){
	this.overDir = od;
	this.houses = {};
	this.map = [];
	this.doors = [];
}