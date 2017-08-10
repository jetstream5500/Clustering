// HIGH
// Globals
var categories_HIGH = []
var centroids_HIGH = []
var colors_HIGH = []
var nodesUnderCentroid_HIGH = []


function makeRandomColors_HIGH() {
	// Generates random colors for each data point (starts with every data point being a cluster)
	colors_HIGH = []
	for (var i = 0; i<data.length; i++) {
		// Possible hex characters used for color creation
		var hex = "0123456789ABCDEF"
		var color = "#";
		for (var j = 0; j<6; j++) {
			color+=hex[Math.floor(Math.random()*16)]
		}
		colors_HIGH.push(color)
	}
}

function assignIndividualCategories_HIGH() {
	// Assigns each data point initially to its own cluster (ith data point -> ith cluster)
	for (var i = 0; i<data.length; i++) {
		categories_HIGH[i] = i;
	}
}

function clearCentroidData_HIGH() {
	// Resets data associated with each centroid
	centroids_HIGH = []
	nodesUnderCentroid_HIGH = []
	for (var i = 0; i<data.length; i++) {
		centroids_HIGH.push([0,0])
		nodesUnderCentroid_HIGH.push(0)
	}
}

function calcCentroids_HIGH() {
	// Dropdowns to determine attributes being compared
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	// Resets centroid data
	clearCentroidData_HIGH()
	// Computes centroid: average x/y coordinates
	// Computing sum and tallying nodes (fractional)
	for (var i = 0; i<data.length; i++) {
		datapoint = data[i];
		category = categories_HIGH[i]
		nodesUnderCentroid_HIGH[category]++
		centroids_HIGH[category][0]+=datapoint[xaxis.value]
		centroids_HIGH[category][1]+=datapoint[yaxis.value]
	}
	// Division of sum (if number of nodes = 0 then cluster was eliminated -> set centroid location to (-1,-1))
	for (var i = 0; i<centroids_HIGH.length; i++) {
		if (nodesUnderCentroid_HIGH[i]==0) {
			centroids_HIGH[i][0] = -1
			centroids_HIGH[i][1] = -1
		} else {
			centroids_HIGH[i][0]/=nodesUnderCentroid_HIGH[i]
			centroids_HIGH[i][1]/=nodesUnderCentroid_HIGH[i]
		}
	}
}

function drawCentroids_HIGH() {
	// Painting centroids on the 2rd canvas
	var canvas = document.getElementById("canvas1");
	var ctx = canvas.getContext('2d');
	// Loops through each centroid
	for (var i = 0; i<centroids_HIGH.length; i++) {
		var centroid = centroids_HIGH[i]
		// Checks to see if cluster was eliminated
		if (centroid[0] >= 0) {
			// Center = black, Outside = Category color
			ctx.fillStyle = "#000000";
			ctx.strokeStyle = colors_HIGH[i];
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
}

function replotData_HIGH() {
	// Dropdowns to determine attributes being compared
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	// Resets 2nd canvas and prepare for plotting of nodes again
	clearCanvas("canvas1")
	var canvas = document.getElementById("canvas1");
	var ctx = canvas.getContext('2d');
	// Loops through each data point
	for (var i = 0; i<data.length; i++) {
		var datapoint = data[i]
		// Fill = Color based on cluster representation; Stroke = Black
		ctx.fillStyle = colors_HIGH[categories_HIGH[i]];
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

function mergeCategories_HIGH() {
	// Dropdowns to determine attributes being compared
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	// Determine user input size to which 2 clusters can not merge (15 -> 15 cannot join with 15 but a 20 and 14 can)
	var maxMergeSize = document.getElementById("maxMergeSize");
	// Determins which 2 clusters are closest (single linkage - 2 closest datum)
	var minDist = Number.MAX_VALUE
	var cat1 = -1
	var cat2 = -1
	for (var i = 0; i<data.length; i++) {
		var datapoint1 = data[i]
		for (var j = i+1; j<data.length; j++) {
			var datapoint2 = data[j]
			var dist = Math.pow(datapoint1[xaxis.value]-datapoint2[xaxis.value],2)+Math.pow(datapoint1[yaxis.value]-datapoint2[yaxis.value],2)
			if (dist < minDist && categories_HIGH[i]!=categories_HIGH[j] && (nodesUnderCentroid_HIGH[categories_HIGH[i]] < data.length*maxMergeSize.value || nodesUnderCentroid_HIGH[categories_HIGH[j]] < data.length*maxMergeSize.value)) {
				minDist = dist
				cat1 = categories_HIGH[i]
				cat2 = categories_HIGH[j]
			}
		}
	}
	// Put all nodes in one cluster into the other to which its merging with
	for (var i = 0; i<data.length; i++) {
		if (categories_HIGH[i] == cat2) {
			categories_HIGH[i] = cat1
		}
	}
}
