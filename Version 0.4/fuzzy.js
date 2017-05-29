// FUZZY
var categories_FUZZY = []
var centroids_FUZZY = []
var nodesUnderCentroid_FUZZY = []
var colors_FUZZY = []

function makeRandomColors_FUZZY() {
	var kValue = document.getElementById("kValue");
	colors_FUZZY = ["#FFFF00","#00FFFF","#FF00FF","#FF0000","#00FF00","#0000FF"]
	for (var i = 0; i<kValue.value-6; i++) {
		var hex = "0123456789ABCDEF"
		var color = "#";
		for (var j = 0; j<6; j++) {
			color+=hex[Math.floor(Math.random()*16)]
		}
		colors_FUZZY.push(color)
	}
}

function randomizeCentroidLocations_FUZZY() {
	//centroids_FUZZY = []
	var kValue = document.getElementById("kValue");
	for (var i = 0; i<kValue.value; i++) {
		centroids_FUZZY.push([Math.random(),Math.random()])
	}
}

function drawCentroids_FUZZY() {
	var canvas = document.getElementById("canvas2");
	var ctx = canvas.getContext('2d');
	for (var i = 0; i<centroids_FUZZY.length; i++) {
		var centroid = centroids_FUZZY[i]
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = colors_FUZZY[i];
		//ctx.fillStyle = "#AACCFF";
		//ctx.strokeStyle = "#3377BB";
		//ctx.fillStyle = "#FFAAAA";
		//ctx.strokeStyle = "#FF5555";
		ctx.lineWidth = 4;
		// x y reversed
		ctx.beginPath();
		ctx.arc(centroid[0]*canvas.height*0.7+canvas.height*0.15, canvas.width*0.7-centroid[1]*canvas.width*0.7+canvas.width*0.15,25,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		//ctx.fillRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
		//ctx.strokeRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
	}
}

function assignCategory_FUZZY() {
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")

	var fuzzyValue = document.getElementById("fuzzyValue")
	if (categories_FUZZY.length == 0) {
		categories_FUZZY = new Array(data.length).fill([]);
		for (var i = 0; i<categories_FUZZY.length; i++) {
			categories_FUZZY[i] = new Array(centroids_FUZZY.length).fill(-1)
		}
	}
	//console.log("before")
	//console.log(categories_FUZZY)
	//console.log(categories_FUZZY)
	//console.log("inside assign")
	//console.log(centroids_KMEANS)
	for (var i = 0; i<data.length; i++) {
		var datapoint = data[i];
		var sum = 0;
		for (var j = 0; j<centroids_FUZZY.length; j++) {
			//console.log(i+" "+j)
			var centroid = centroids_FUZZY[j]
			var dist = Math.pow((datapoint[xaxis.value]-centroid[0]),2)+Math.pow((datapoint[yaxis.value]-centroid[1]),2)
			sum+=dist
			//console.log(dist)
			categories_FUZZY[i][j] = dist
		}
		var newSum = 0;
		for (var j = 0; j<centroids_FUZZY.length; j++) {
			categories_FUZZY[i][j] = Math.pow(sum-categories_FUZZY[i][j],fuzzyValue.value)
			newSum+=categories_FUZZY[i][j]
		}
		for (var j = 0; j<centroids_FUZZY.length; j++) {
			categories_FUZZY[i][j] /= newSum
		}
	}
	//console.log(categories_FUZZY)
	//console.log("after")
	//console.log(categories_FUZZY)
}

function computeColor(indexOfData) {
	var r = 0;
	var g = 0;
	var b = 0;

	for (var i = 0; i<centroids_FUZZY.length; i++) {
		var currentColor = colors_FUZZY[i]
		//console.log(colors_FUZZY[i])
		//console.log(categories_FUZZY)
		r += categories_FUZZY[indexOfData][i]*hexToDec(currentColor.substring(1,3))
		g += categories_FUZZY[indexOfData][i]*hexToDec(currentColor.substring(3,5))
		b += categories_FUZZY[indexOfData][i]*hexToDec(currentColor.substring(5,7))

	}
	var hexR = decToHex(Math.floor(r))
	var hexG = decToHex(Math.floor(g))
	var hexB = decToHex(Math.floor(b))

	return "#"+hexR+hexG+hexB
}

function hexToDec(hex) {
	return parseInt(hex,16);
}

function decToHex(dec) {
	var hex = dec.toString(16)
	if (hex.length < 2) {
		hex = "0"+hex
	}
	return hex
}

function replotData_FUZZY() {
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")

	//console.log(categories_FUZZY)
	clearCanvas("canvas2")
	var canvas = document.getElementById("canvas2");
	var ctx = canvas.getContext('2d');
	//console.log(colors_FUZZY)
	//console.log(centroids_FUZZY)
	for (var i = 0; i<data.length; i++) {
		var datapoint = data[i]
		ctx.fillStyle = computeColor(i);
		//console.log(computeColor(i))
		ctx.strokeStyle = "#000000";
		//ctx.fillStyle = "#AACCFF";
		//ctx.strokeStyle = "#3377BB";
		//ctx.fillStyle = "#FFAAAA";
		//ctx.strokeStyle = "#FF5555";
		ctx.lineWidth = 2;
		// x y reversed
		ctx.beginPath();
		ctx.arc(datapoint[xaxis.value]*canvas.height*0.7+canvas.height*0.15, canvas.width*0.7-datapoint[yaxis.value]*canvas.width*0.7+canvas.width*0.15,15,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		//ctx.fillRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
		//ctx.strokeRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
	}
}

function clearCentroidData_FUZZY() {
	centroids_FUZZY = []
	nodesUnderCentroid_FUZZY = []
	//previousCentroids = []
	for (var i = 0; i<kValue.value; i++) {
		centroids_FUZZY.push([0,0])
		nodesUnderCentroid_FUZZY.push(0)
		//previousCentroids.push([])
	}
}

function calcCentroids_FUZZY() {
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")

	clearCentroidData_FUZZY()

	for (var i = 0; i<data.length; i++) {
		var datapoint = data[i];
		for (var j = 0; j<centroids_FUZZY.length; j++) {
			nodesUnderCentroid_FUZZY[j] += categories_FUZZY[i][j]
			centroids_FUZZY[j][0]+=datapoint[xaxis.value]*categories_FUZZY[i][j]
			centroids_FUZZY[j][1]+=datapoint[yaxis.value]*categories_FUZZY[i][j]
		}
	}
	for (var i = 0; i<centroids_FUZZY.length; i++) {
		if (nodesUnderCentroid_FUZZY[i]==0) {
			centroids_FUZZY[i][0] = Math.random()
			centroids_FUZZY[i][1] = Math.random()
			nodesUnderCentroid_FUZZY[i]++;
		}
		centroids_FUZZY[i][0]/=nodesUnderCentroid_FUZZY[i]
		centroids_FUZZY[i][1]/=nodesUnderCentroid_FUZZY[i]
	}
}

function reset_FUZZY() {
	categories_FUZZY = []
	centroids_FUZZY = []
	nodesUnderCentroid_FUZZY = []
	colors_FUZZY = []
}
