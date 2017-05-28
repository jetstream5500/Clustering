// HIGH
var categories_HIGH = []
var centroids_HIGH = []
var colors_HIGH = []
var nodesUnderCategory_HIGH = []

function makeRandomColors_HIGH() {
	colors_HIGH = []
	for (var i = 0; i<data.length; i++) {
		var hex = "0123456789ABCDEF"
		var color = "#";
		for (var j = 0; j<6; j++) {
			color+=hex[Math.floor(Math.random()*16)]
		}
		colors_HIGH.push(color)
	}
}

function assignIndividualCategories_HIGH() {
	for (var i = 0; i<data.length; i++) {
		categories_HIGH[i] = i;
		nodesUnderCategory_HIGH[i] = 1
	}
}

function replotData_HIGH() {
	clearCanvas("canvas1")
	var canvas = document.getElementById("canvas1");
	var ctx = canvas.getContext('2d');

	for (var i = 0; i<data.length; i++) {
		var datapoint = data[i]
		ctx.fillStyle = colors_HIGH[categories_HIGH[i]];
		ctx.strokeStyle = "#000000";
		//ctx.fillStyle = "#AACCFF";
		//ctx.strokeStyle = "#3377BB";
		//ctx.fillStyle = "#FFAAAA";
		//ctx.strokeStyle = "#FF5555";
		ctx.lineWidth = 2;
		// x y reversed
		ctx.beginPath();
		ctx.arc(datapoint[0]*canvas.height, canvas.width-datapoint[1]*canvas.width,12,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		//ctx.fillRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
		//ctx.strokeRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
	}
}

function mergeCategories_HIGH() {
	console.log(nodesUnderCategory_HIGH)
	var minDist = Number.MAX_VALUE
	var cat1 = -1
	var cat2 = -1
	for (var i = 0; i<data.length; i++) {
		var datapoint1 = data[i]
		for (var j = i+1; j<data.length; j++) {
			var datapoint2 = data[j]
			var dist = Math.pow(datapoint1[0]-datapoint2[0],2)+Math.pow(datapoint1[1]-datapoint2[1],2)
			if (dist < minDist && categories_HIGH[i]!=categories_HIGH[j] && (nodesUnderCategory_HIGH[categories_HIGH[i]] < 40 || nodesUnderCategory_HIGH[categories_HIGH[j]] < 40)) {
				minDist = dist
				cat1 = categories_HIGH[i]
				cat2 = categories_HIGH[j]
			}
		}
	}

	for (var i = 0; i<data.length; i++) {
		if (categories_HIGH[i] == cat2) {
			categories_HIGH[i] = cat1
		}
	}
	nodesUnderCategory_HIGH[cat1]+=nodesUnderCategory_HIGH[cat2]
	nodesUnderCategory_HIGH[cat2] = 0
}
