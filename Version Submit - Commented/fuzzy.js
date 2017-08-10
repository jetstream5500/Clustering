// FUZZY
// Globals
var categories_FUZZY = []
var centroids_FUZZY = []
var nodesUnderCentroid_FUZZY = []
var colors_FUZZY = []

function makeRandomColors_FUZZY() {
	// Generates random colors for k centroids
	var kValue = document.getElementById("kValue");
	// Basic color list
	colors_FUZZY = ["#FFFF00","#00FFFF","#FF00FF","#FF0000","#00FF00","#0000FF"]
	for (var i = 0; i<kValue.value-6; i++) {
		// Possible hex characters used for color creation
		var hex = "0123456789ABCDEF"
		var color = "#";
		for (var j = 0; j<6; j++) {
			color+=hex[Math.floor(Math.random()*16)]
		}
		colors_FUZZY.push(color)
	}
}

function randomizeCentroidLocations_FUZZY() {
	// Puts each centroid at a random location in the normalized space
	var kValue = document.getElementById("kValue");
	for (var i = 0; i<kValue.value; i++) {
		centroids_FUZZY.push([Math.random(),Math.random()])
	}
}

function drawCentroids_FUZZY() {
	// Painting centroids on the 3rd canvas
	var canvas = document.getElementById("canvas2");
	var ctx = canvas.getContext('2d');
	// Loops through each centroid
	for (var i = 0; i<centroids_FUZZY.length; i++) {
		var centroid = centroids_FUZZY[i]
		// Center = black, Outside = Category color
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = colors_FUZZY[i];
		// Line width = 4
		ctx.lineWidth = 4;
		// Note: height & width Reversed
		// Only 70% of canvas is used for plotting.  Note: "canvas.width-..." in the second point.
		// Radius = 25
		ctx.beginPath();
		ctx.arc(centroid[0]*canvas.height*0.7+canvas.height*0.15, canvas.width*0.7-centroid[1]*canvas.width*0.7+canvas.width*0.15,25,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
}

function assignCategory_FUZZY() {
	// Assigning each node to a cluster / centroid based off its distance (fractional representation)
	// Grabbing dropdowns to determine what attributes are being compared
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	// Gets # of Centroids
	var fuzzyValue = document.getElementById("fuzzyValue")
	// Checks to see of categories table is empty.  Empty -> Fill with Arrays of -1 (Ex: [[-1,-1,],[-1,-1],[-1,-1]])
	if (categories_FUZZY.length == 0) {
		categories_FUZZY = new Array(data.length).fill([]);
		for (var i = 0; i<categories_FUZZY.length; i++) {
			categories_FUZZY[i] = new Array(centroids_FUZZY.length).fill(-1)
		}
	}
	// Converts distances from centroids to actual percentages
	for (var i = 0; i<data.length; i++) {
		// Loops through the data and finds distance from each centroid and the sum of distances -> (0.1, 0.2, 0.3)
		var datapoint = data[i];
		var sum = 0;
		for (var j = 0; j<centroids_FUZZY.length; j++) {
			var centroid = centroids_FUZZY[j]
			var dist = Math.pow((datapoint[xaxis.value]-centroid[0]),2)+Math.pow((datapoint[yaxis.value]-centroid[1]),2)
			sum+=dist
			categories_FUZZY[i][j] = dist
		}
		// Subtracts the sum from each respective distance -> (0.5, 0.4, 0.3)
		// Computes Percentage -> 0.5^k/(0.5^k+0.4^k+0.3^k).  K is given by the user as degree of fuzziness
		var newSum = 0;
		for (var j = 0; j<centroids_FUZZY.length; j++) {
			categories_FUZZY[i][j] = Math.pow(sum-categories_FUZZY[i][j],fuzzyValue.value)
			newSum+=categories_FUZZY[i][j]
		}
		for (var j = 0; j<centroids_FUZZY.length; j++) {
			categories_FUZZY[i][j] /= newSum
		}
	}
}

function computeColor(indexOfData) {
	// Determines the color to paint a node based on its fractional representation under each cluster
	var r = 0;
	var g = 0;
	var b = 0;
	// Computes weighted average of r,g,b values in dec (hex first converted to dec) based on representation
	for (var i = 0; i<centroids_FUZZY.length; i++) {
		var currentColor = colors_FUZZY[i]
		r += categories_FUZZY[indexOfData][i]*hexToDec(currentColor.substring(1,3))
		g += categories_FUZZY[indexOfData][i]*hexToDec(currentColor.substring(3,5))
		b += categories_FUZZY[indexOfData][i]*hexToDec(currentColor.substring(5,7))

	}
	// Converts dec back to hex
	var hexR = decToHex(Math.floor(r))
	var hexG = decToHex(Math.floor(g))
	var hexB = decToHex(Math.floor(b))
	return "#"+hexR+hexG+hexB
}

function hexToDec(hex) {
	// Converts hex to dec
	return parseInt(hex,16);
}

function decToHex(dec) {
	// Converts dec to hex string.  If the hex is one character long an extra character is added
	var hex = dec.toString(16)
	if (hex.length < 2) {
		hex = "0"+hex
	}
	return hex
}

function replotData_FUZZY() {
	// Dropdowns to determine attributes being compared
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	// Resets 3rd canvas and prepare for plotting of nodes again
	clearCanvas("canvas2")
	var canvas = document.getElementById("canvas2");
	var ctx = canvas.getContext('2d');
	// Loops through each data point
	for (var i = 0; i<data.length; i++) {
		var datapoint = data[i]
		// Fill = Color based on cluster representation; Stroke = Black
		ctx.fillStyle = computeColor(i);
		ctx.strokeStyle = "#000000";
		// Line width = 2
		ctx.lineWidth = 2;
		// Note: height & width Reversed
		// Only 70% of canvas is used for plotting.  Note: "canvas.width-..." in the second point.
		// Radius = 15
		ctx.beginPath();
		ctx.arc(datapoint[xaxis.value]*canvas.height*0.7+canvas.height*0.15, canvas.width*0.7-datapoint[yaxis.value]*canvas.width*0.7+canvas.width*0.15,15,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
}

function clearCentroidData_FUZZY() {
	// Resets data associated with each centroid
	centroids_FUZZY = []
	nodesUnderCentroid_FUZZY = []
	for (var i = 0; i<kValue.value; i++) {
		centroids_FUZZY.push([0,0])
		nodesUnderCentroid_FUZZY.push(0)
	}
}

function calcCentroids_FUZZY() {
	// Dropdowns to determine attributes being compared
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	// Resets centroid data
	clearCentroidData_FUZZY()
	// Computes centroid: average x/y coordinates
	// Computing sum and tallying nodes (fractional)
	for (var i = 0; i<data.length; i++) {
		var datapoint = data[i];
		for (var j = 0; j<centroids_FUZZY.length; j++) {
			nodesUnderCentroid_FUZZY[j] += categories_FUZZY[i][j]
			centroids_FUZZY[j][0]+=datapoint[xaxis.value]*categories_FUZZY[i][j]
			centroids_FUZZY[j][1]+=datapoint[yaxis.value]*categories_FUZZY[i][j]
		}
	}
	// Division of sum
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
	// Resets globals associated with the FUZZY algorithm
	categories_FUZZY = []
	centroids_FUZZY = []
	nodesUnderCentroid_FUZZY = []
	colors_FUZZY = []
}
