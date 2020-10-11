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
var collidable = ['#','=',']','+', '|', ' ']
collidable.push.apply(collidable,Object.values(boxConv))


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
	

	console.log(w + " x " + h);

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

	return floor[Math.floor(Math.random()*floor.length)];
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
				return [r,c];
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