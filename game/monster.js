// "MONSTER" CHARACTERS OBJECT CREATION FUNCTION
function monster(x,y,char,mode='neu'){
	this.x = x;
	this.y = y;
	this.char = char;
	this.mode = mode;
	this.move = 'drunk';

	//stats
	this.stats = {
		'str' : 0,
		'con' : 0,
		'dex' : 0,
		'cha' : 0,
		'int' : 0,
		'wis' : 0
	};

	this.dialogue = [""];
}

// ASCII CHARACTER TO MONSTER NAME MAP
let monsterCharMap = {
	'F' : 'frat boy',
	'S' : 'sorority girl',
	'L' : 'store clerk',
	'e' : 'street rat',
	'g' : 'pigeon',
	'D' : 'delivery guy',
	'B' : 'bartender',
	'c' : 'cat',
	'N' : 'nerd',
	'T' : 'toga guy',
	'p' : 'pig',
	'W' : 'witch',
	'm' : 'gremlin',
	'O' : 'student', 		
	'A' : 'adult', 		
	'&' : 'creature of the night', 
	'u' : 'possum',
	'r' : 'raccoon',
	'E' : 'alien',
	'@' : 'robot'
}

let monIntro = {
	'F' : 'Yo bro!',
	'S' : 'Heyy~',
	'L' : "What d'you want?",
	'e' : '*squeek*',
	'g' : '*coo*',
	'D' : 'Delivery?',
	'B' : "What're you havin'",
	'c' : '*meow*',
	'N' : 'H-Hi?',
	'T' : 'YEEEEAAAHHH!',
	'p' : '*oink*',
	'W' : 'Hehehehee!',
	'm' : '*muttering*',
	'O' : 'Hi...',
	'A' : 'Hello!',
	'&' : 'Hm...',
	'u' : '*scree*',
	'r' : '...',
	'E' : 'Greetings',
	'@' : '48 65 6c 6c 6f 21'
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
	if(inArr(['frat boy', 'toga guy'], name)){
		assignStats(mon, statRoller('fighter'));
		mon.mode = 'str'
	}
	else if(inArr(['nerd','store clerk','alien'], name)){
		assignStats(mon, statRoller('wizard'));
		mon.mode = 'int';
	}else if(inArr(['gremlin','creature of the night','raccoon'], name)){	
		assignStats(mon, statRoller('rogue'));
		mon.mode = 'dex';
	}else if(inArr(['sorority girl','bartender','cat'], name)){
		assignStats(mon, statRoller('bard'));
		mon.mode = 'cha';
	}
	else if(inArr(['witch','delivery guy'], name)){
		assignStats(mon, statRoller('ranger'));
		mon.mode = 'wis';
	}
	else if(inArr(['street rat','pigeon','pig','possum'], name)){
		assignStats(mon, statRoller('druid'))
		mon.mode = 'con';
	}
	else{
		assignStats(mon, statRoller('random'))
		mon.mode = 'neu';
	}

	return mon;

}

function makeMonsterPlus(name,map,excl=[],placeTile='.'){
	let mon = makeMonster(name);
	let pos = randomHousePos(map,excl,placeTile);
	mon.x = pos[0];
	mon.y = pos[1];
	return mon;
}

// ASSIGNS A STAT LIST TO A CHARACTER
function assignStats(char,statList){
	//apply
	let st = ['str', 'con', 'dex', 'cha', 'int', 'wis'];
	for(let s=0;s<st.length;s++){
		char.stats[st[s]] = statList[s];
	}
}

// ADD VALUE MODIFIER TO STATS
function addStats(char,statList){
	//apply
	let st = ['str', 'con', 'dex', 'cha', 'int', 'wis'];
	for(let s=0;s<st.length;s++){
		char.stats[st[s]] += statList[s];

		//add cap
		if(char.stats[st[s]] > 20)
			char.stats[st[s]] = 20;
		else if(char.stats[st[s]] < 0)
			char.stats[st[s]] = 0
	}
}

// LIST THE STATS OF A CHARACTER
function showStats(char){
	let st = ['str', 'con', 'dex', 'cha', 'int', 'wis'];
	let o = "";
	for(let s=0;s<st.length;s++){
		o += (st[s].toUpperCase()) + ": " + char.stats[st[s]] + " "
	}
	return o.trim();
}

// SHOW THE HIGHEST STAT OF A CHARACTER
function showHighStat(char){
	return char.mode.toUpperCase() + ": " + (char.mode in char.stats ? char.stats[char.mode] : 0);
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
	}else if(rpg_class == 'druid'){
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

// ADD MONSTERS TO HOUSE BASED ON TYPE
function monsterHouse(house,excl=[]){
	let mons = [];

	if(house['htype'] == 'LAN party'){
		//add nerds at computers
		for(let i=0;i<4;i++){
			let mon = makeMonsterPlus('nerd',house['map'],excl,'_');
			excl.push(mon.x+"-"+mon.y);
			mon.move = 'idle';		//sit at computer
			mons.push(mon);
		}
	}
	else if(house['htype'] == 'small party'){
		//add students
		for(let i=0;i<6;i++){
			let m = 'student';
			if(Math.random() <= 0.2)
				m = 'robot';
			let mon = makeMonsterPlus(m,house['map'],excl);
			excl.push(mon.x+"-"+mon.y);
			mons.push(mon);
		}

		//maybe add an alien
		if(Math.random() <= 0.1){
			mons.push(makeMonsterPlus('alien',house['map'],excl));
		}
	}

	else if(house['htype'] == 'normal house'){
		//add 2 adults, students, or aliens
		let enc = Math.random();
		let m = '';
		if(enc <= 0.45)
			m = 'adult';
		else if(enc <= 0.9)
			m = 'student';
		else
			m = 'alien';
		for(let i=0;i<2;i++){
			let mon = makeMonsterPlus(m,house['map'],excl);
			excl.push(mon.x+"-"+mon.y);
			mons.push(mon);
		}

		//maybe a rat or gremlin
		enc = Math.random();
		if(enc <= 0.2){
			mons.push(makeMonsterPlus('street rat',house['map'],excl));
		}else if(enc <= 0.25){
			mons.push(makeMonsterPlus('gremlin',house['map'],excl));
		}
	}
	else if(house['htype'] == 'witch party'){
		//add witches at cauldrons
		for(let i=0;i<4;i++){
			let mon = makeMonsterPlus('witch',house['map'],excl,'_');
			excl.push(mon.x+"-"+mon.y);
			mon.move = 'idle';		//sit at computer
			mons.push(mon);
		}
		//add other monsters?
		let enc = Math.random();
		if(enc <= 0.5){
			mons.push(makeMonsterPlus('cat',house['map'],excl));
		}else if(enc <= 0.6){
			mons.push(makeMonsterPlus('street rat',house['map'],excl));
		}else if(enc <= 0.65){
			mons.push(makeMonsterPlus('gremlin',house['map'],excl));
		}
	}

	else if(house['htype'] == 'large party (lower)'){
		let enc = Math.random();
		let beerPongPos = [[5,7],[6,7],[5,12],[6,12],[9,4],[9,5],[13,4],[13,5]];
		if(enc <= 0.4){		//greek party
			for(let i=0;i<12;i++){
				let m = '';
				let c = Math.random();
				if(c <= 0.45)
					m = 'frat boy';
				else if(c <= 0.9)
					m = 'sorority girl';
				else
					m = 'toga guy';

				let mon = makeMonsterPlus(m,house['map'],excl);

				//randomly change location (couch or table)
				c = Math.random();
				if(c <= 0.2){	//sit on couch
					let p = randomHousePos(map, excl, '_');
					mon.x = p[0];
					mon.y = p[1];
					mon.move = 'idle';
				}else if(c <= 0.45 && beerPongPos.length > 0){
					let pi = Math.floor(Math.random()*beerPongPos.length);
					mon.x = beerPongPos[pi][0];
					mon.y = beerPongPos[pi][1];
					beerPongPos.splice(pi,1);		//remove from spots
					mon.move = 'idle'
				}
				excl.push(mon.x+"-"+mon.y);

				//extra stat boost for toga guy
				if(m == 'toga guy'){
					mon.stats['str']+=2;	
					mon.stats['con']+=2;
				}
				mons.push(mon);
			}

			//maybe add a pig for fun
			if(Math.random() <= 0.4){
				mons.push(makeMonsterPlus('pig',house['map'],excl));
			}
		}else{		//regular college party
			for(let i=0;i<12;i++){
				let m = '';
				let c = Math.random();
				if(c <= 0.6)
					m = 'student';
				else if(c <= 0.7)
					m = 'frat boy';
				else if(c <= 0.8)
					m = 'sorority girl';
				else if(c <= 0.9)
					m = 'nerd';
				else
					m = 'alien';

				let mon = makeMonsterPlus(m,house['map'],excl);
				//randomly change location (couch or table)
				c = Math.random();
				if(c <= 0.2){	//sit on couch
					let p = randomHousePos(map, excl, '_');
					mon.x = p[0];
					mon.y = p[1];
					mon.move = 'idle';
				}else if(c <= 0.45 && beerPongPos.length > 0){
					let pi = Math.floor(Math.random()*beerPongPos.length);
					mon.x = beerPongPos[pi][0];
					mon.y = beerPongPos[pi][1];
					beerPongPos.splice(pi,1);		//remove from spots
					mon.move = 'idle'
				}
				excl.push(mon.x+"-"+mon.y);
				mons.push(mon);
			}
		}
	}


	return mons;
}

// POPULATE OVERWORLD WITH MONSTERS
function monsterWorld(map,excl=[],range=[5,15]){
	let mons = [];
	let numMon = Math.floor(Math.random()*(range[1]-range[0])) + range[0];
	let percMon = Math.floor(Math.random()*numMon)+1;

	let outMon = ['e','g','D','c','&','r','u'].map(x => monsterCharMap[x]);		//overworld-outdoor based monsters
	let anyMon = Object.values(monsterCharMap);
	anyMon.splice(anyMon.indexOf("bartender"),1);
	anyMon.splice(anyMon.indexOf("store clerk"),1);

	//outdoor monsters only
	for(let m=0;m<percMon;m++){
		let c = outMon[Math.floor(Math.random()*outMon.length)];
		let mon = makeMonsterPlus(c,map,excl);
		excl.push(mon.x+"-"+mon.y);
		mons.push(mon);
	}

	//any monster
	for(let m=0;m<percMon;m++){
		let c = anyMon[Math.floor(Math.random()*anyMon.length)];
		let mon = makeMonsterPlus(c,map,excl);
		excl.push(mon.x+"-"+mon.y);
		mons.push(mon);
	}

	//add store clerk or bartender
	let vendors = [];
	for(let r=0;r<map.length;r++){
		for(let c=0;c<map[0].length;c++){
			if(map[r][c] == '_'){
				vendors.push([c,r]);		//save as [x,y]
			}	
		}
	}
	for(let v=0;v<vendors.length;v++){
		let mon = makeMonster(monsterCharMap[(Math.random() < 0.5 ? 'S' : 'B')]);
		mon.x = vendors[v][0];
		mon.y = vendors[v][1];
		mon.move = 'idle';
		mons.push(mon);
	}


	return mons;
}