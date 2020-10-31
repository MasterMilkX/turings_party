let itemCharKey = {
	'!' : ['beer', 'vodka', 'fireball', 'jaeger', 'jungle juice', 'McD Sprite', 'blue drink', 'water', 'tequila', 'baha blast'],
	'%' : ['chips', 'pizza', 'cheetos', 'McD Fries', 'taco', 'corndog', 'chicken nugs'],
	'*' : ['greek pin', 'student ID', 'shot glass', 'class ring', 'pencil', 'guitar', 'lampshade', 'house key'],
	'?' : ['phone'],
	'$' : ['money'],
	')' : ['baseball bat', 'fake sword', 'lightsaber'],
	'(' : ['varsity jacket', 'T-shirt', 'toga', 'bra', 'tie']
}

//return an item color
function itemColor(i){
	//brown
	if(i == 'beer' || i == 'tequila' || i == 'chicken nugs' || i == 'baseball bat' || i == 'fake sword' || i == 'house key' || i == 'guitar')
		return '#B48B14';
	//white
	else if(i == 'vodka' || i == 'McD Sprite' || i == 'water' || i == 'shot glass' || i == 'phone' || i == 'T-shirt' || i == 'toga')
		return '#eeeeee';
	//yellow
	else if(i == 'chips' || i == 'taco' || i == 'pencil' || i == 'varsity jacket' || i == 'lampshade' || i == 'student id')
		return '#FFDF00';
	//orange
	else if(i == 'cheetos' || i == 'pizza' || i == 'corndog')
		return '#FF7200';
	//red
	else if(i == 'fireball' || i == 'tie' || i == 'bra' || i == 'lightsaber')
		return '#ff0000';
	//blue
	else if(i == 'blue drink' || i == 'baha blast' || i == 'class ring')
		return '#0000ff';
	//green
	else if(i == 'jaeger' || i == 'jungle juice' || i == 'money' || i == 'greek pin')
		return '#00ff00';
	// ????
	else
		return '#EA00FF';
}

// ADDS AN ITEM AT RANDOM TO A LOCATION
function placeItem(i,map,exclusions=[]){
	let loc = randomHousePos(map,exclusions);

	//add normal item
	if(i != '$'){
		let item = itemCharKey[i][Math.floor(Math.random()*itemCharKey[i].length)];
		map[loc[1]][loc[0]] = i
		return {'name': item, 'symb':i, 'loc':loc};
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
	let exclusions = [];
	for(let i=0;i<n;i++){
		items.push(placeItem(pickups[Math.floor(Math.random()*pickups.length)],map,exclusions));
		exclusions.push(items[i].loc);
	}
	return items;
}





