//set ascii values

var floor = "."
var wall = "#";
var door = "/";
var stairs_up = "<";
var stairs_down = ">";
var collidable = [wall]


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
function randomMapPos(w,h){
	return [Math.floor(Math.random()*(w-1))+1, Math.floor(Math.random()*(h-1)+1)];
}