let itemCharKey = {
	'!' : ['beer', 'vodka', 'fireball', 'jaeger', 'jungle juice', 'McD Sprite', 'blue drink', 'water'],
	'%' : ['chips', 'pizza', 'cheetos', 'McD Fries', 'chalupa', 'corndog', 'chicken nugs'],
	'*' : ['greek pin', 'student ID', 'shot glass', 'class ring', 'pencil', 'guitar', 'lampshade', 'house key'],
	'?' : ['phone'],
	'$' : ['money'],
	')' : ['baseball bat', 'fake sword', 'lightsaber'],
	'(' : ['varsity jacket', 'T-shirt', 'toga', 'bra', 'tie']
}

// ADDS AN ITEM AT RANDOM TO A LOCATION
function placeItem(i,map){
	let loc = randomHousePos(map);

	//add normal item
	if(i != '$'){
		let item = itemCharKey[i][Math.floor(Math.random()*itemCharKey[i].length)];
		map[loc[1]][loc[0]] = i
		return {'name': itemCharKey[i], 'symb':i, 'loc':loc};
	}else{
		map[loc[1]][loc[0]] = i;
		return {'name' : 'money', 'symb':'$', 'loc':loc, 'value':Math.floor(Math.random()*1)+19};
	}
}

// ADDS FOOD TO THE FRIDGE
function populateFridge(x){

}

// PLACES ITEMS AROUND A HOUSE
function litterHouse(map, houseType){
	let pickups = ['!','%','*'];
	let n = 1;
	if(houseType == "small_party")
		n = Math.floor(Math.random()*3);
	else if(houseType == "LAN_party")
		n = Math.floor(Math.random()*2);
	else if(houseType == "witch_party")
		n = Math.floor(Math.random()*2);
	else if(houseType == "normal_house")
		n = Math.floor(Math.random()*3);
	else if(houseType == "large_party_(lower)")
		n = Math.floor(Math.random()*4)+1;

	let items = [];
	for(let i=0;i<n;i++){
		items.push(placeItem(pickups[Math.floor(Math.random()*pickups.length)]),map);
	}
	return items;
}





