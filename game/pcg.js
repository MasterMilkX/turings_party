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
	'}' : ['mattress'],
	':' : ['toilet'],
	'+' : ['TV', 'computer', 'stereo','keg'],
	'_' : ['couch', 'chair', 'stool'],
	'!' : ['beer', 'vodka', 'fireball', 'jaeger', 'jungle juice', 'McD Sprite', 'blue drink', 'water'],
	'%' : ['chips', 'pizza', 'cheetos', 'McD Fries', 'chalupa'],
	'*' : ['greek pin', 'student ID', 'lucky shot glass'],
	'?' : ['phone'],
	'$' : ['money'],
	')' : ['bat', 'novelty sword', 'lightsaber'],
	'(' : ['varsity jacket', 'T-shirt', 'toga', 'bra', 'tie']
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
function randomHousePos(map){
	//find all floor tiles
	let floor = [];
	for(let r=0;r<map.length;r++){
		for(let c=0;c<map[0].length;c++){
			if(map[r][c] == '.'){
				floor.push([c,r]);		//save as [x,y]
			}	
		}
	}

	return floor[Math.floor(Math.random()*floor.length)];
}

// MAKES A HOUSE
function makeHouseMap(houseType='random'){
	//choose a random house
	let allHouses = ['small_party', 'lan_party', 'witch_party', 'normal_house', 'large_party_lower']
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
		return map;
	}else if(houseType == 'lan_party'){
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
		return map;
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
		return map;
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
		return map;
	}else if(houseType == 'large_party_lower'){
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
		return map;
	}else if(houseType == 'large_party_upper'){
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
		return map;
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
		return map;
	}
}

// CENTER THE GAME SCREEN IF MAP IS TOO SMALL
function padMap(map, w,h){
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

	return newmap;
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