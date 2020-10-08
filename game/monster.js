// "MONSTER" CHARACTERS OBJECT CREATION FUNCTION
function monster(x,y,char,mode='neutral'){
	this.x = x;
	this.y = y;
	this.char = char;
	this.mode = mode;

	//stats
	this.stats = {
		str : 0,
		con : 0,
		dex : 0,
		cha : 0,
		int : 0,
		wis : 0
	};
}

// ASCII CHARACTER TO MONSTER NAME MAP
let monsterCharMap = {
	'F' : 'frat boy',
	'S' : 'sorority girl',
	'C' : 'store clerk',
	'r' : 'street rat',
	'p' : 'pigeon',
	'D' : 'delivery guy',
	'B' : 'bartender',
	't' : 'cat',
	'N' : 'nerd',
	'T' : 'toga guy',
	'g' : 'pig',
	'W' : 'witch',
	'l' : 'gremlin',
	'O' : 'student', 		
	'A' : 'adult', 		
	'&' : 'creature of the night', 
	'u' : 'possum',
	'r' : 'raccoon',
	'E' : 'alien'
}

// RETURNS THE ASCII CHARACTER BASED ON THE NAME
function getCharRep(name){return Object.keys(monsterCharMap).find(key => monsterCharMap[key] === name);}

// CREATES A SPECIFIC MONSTER
function makeMonster(name='random'){
	//pick random monster
	if(name == 'random'){
		let ac = Object.keys(monsterCharMap);
		name = monsterCharMap[ac[Math.floor(Math.random()*ac.length)]];
	}

	//make specific monster
	let mon = new monster(-1,-1, getCharRep(name));

	//give character specific stats

	return mon;

}

// RANDOM DnD STAT ROLLER
// ASSIGNS POINTS BASED ON ORDERING OF PRIORITY FOR STATS
function statRoller(rpg_class){
	//4d6 drop lowest then assign based on class
	let statSel = [];
	for(let s=0;s<6;s++){
		statSel.push(roll4d6());
	}

	//reorder the stats - str, con, dex, cha, int, wis
	let statOrder = [0,0,0,0,0,0];
	let high = -1;		//best stat
	let low = -1;		//worst stat
	if(rpg_class == 'fighter'){
		high = 0;
		low = 4;
	}else if(rpg_class == 'wizard'){
		high = 4;
		low = 0
	}else if(rpg_class == 'rogue'){
		high = 2;
		low = 3;
	}else if(rpg_class == 'bard'){
		high = 3;
		low = 5;
	}else if(rpg_class == 'ranger'){
		high = 5;
		low = 1;
	}else if(rpg_class == 'barbarian'){
		high = 1;
		low = 2;
	}else{		//random - default
		high = Math.floor(Math.random()*5)+1;
		low = Math.floor(Math.random()*5)+1;
		while(low == high){low = Math.floor(Math.random()*5)+1;}
	}


	//set the stats
	statOrder[high] = Math.max(...statSel);
	statOrder[low] = Math.min(...statSel);

	statSel.splice(statSel.indexOf(Math.max(...statSel)),1);
	statSel.splice(statSel.indexOf(Math.min(...statSel)),1);

	//pick random for the rest
	let j = 0;
	for(let i=0;i<6;i++){
		if(statOrder[i] != 0){
			continue;
		}
		let rs = Math.floor(Math.random()*statSel.length);
		statOrder[i] = statSel[rs];
		statSel.splice(rs,1);
	}

	return statOrder;
}

// ROLL 4D6 DROP THE LOWEST
function roll4d6(){
	let d = [];
	for(let i=0;i<4;i++){
		d.push(Math.floor(Math.random()*5)+1);
	}

	//drop lowest
	d.splice(d.indexOf(Math.min(...d)),1);

	//sum
	let t = 0;
	for(let j=0;j<3;j++){
		t += d[j];
	}
	return t;
}