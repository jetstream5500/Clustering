// KMEANS
// Globals
var categories_KMEANS = []
var centroids_KMEANS = []
var nodesUnderCentroid_KMEANS = []
var colors_KMEANS = []

function makeRandomColors_KMEANS() {
	// Generates random colors for k centroids
	var kValue = document.getElementById("kValue");
	// Basic color list
	colors_KMEANS = ["#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF"]
	for (var i = 0; i<kValue.value-6; i++) {
		// Possible hex characters used for color creation
		var hex = "0123456789ABCDEF"
		var color = "#";
		for (var j = 0; j<6; j++) {
			color+=hex[Math.floor(Math.random()*16)]
		}
		colors_KMEANS.push(color)
	}
}

function randomizeCentroidLocations_KMEANS() {
	// Puts each centroid at a random location in the normalized space
	var kValue = document.getElementById("kValue");
	for (var i = 0; i<kValue.value; i++) {
		centroids_KMEANS.push([Math.random(),Math.random()])
	}
}

function drawCentroids_KMEANS() {
	// Painting centroids on the 1st canvas
	var canvas = document.getElementById("canvas0");
	var ctx = canvas.getContext('2d');
	// Loops through each centroid
	for (var i = 0; i<centroids_KMEANS.length; i++) {
		var centroid = centroids_KMEANS[i]
		// Center = black, Outside = Category color
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = colors_KMEANS[i];
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

function assignCategory_KMEANS() {
	// Assigning each node to a cluster / centroid based off its distance (hard assignment)
	// Grabbing dropdowns to determine what attributes are being compared
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	// Checks to see of categories table is empty.  Empty -> Fill with Array of -1 (Ex: [-1,-1,-1])
	if (categories_KMEANS.length == 0) {
		categories_KMEANS = new Array(data.length).fill(-1);
	}
	// Determines closest centroid and assigns nodes to that centroid / cluster
	for (var i = 0; i<data.length; i++) {
		// Closest centroid
		var minDist = Number.MAX_VALUE;
		var minCentroid = -1;
		var datapoint = data[i];
		// Search to find closest centroid
		for (var j = 0; j<centroids_KMEANS.length; j++) {
			var centroid = centroids_KMEANS[j]
			var dist = Math.pow((datapoint[xaxis.value]-centroid[0]),2)+Math.pow((datapoint[yaxis.value]-centroid[1]),2)
			if (dist < minDist) {
				minDist = dist;
				minCentroid = j;
			}
		}
		// Assignment of node to closest cluster
		categories_KMEANS[i] = minCentroid
	}
}

function replotData_KMEANS() {
	// Dropdowns to determine attributes being compared
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	// Resets 1st canvas and prepare for plotting of nodes again
	clearCanvas("canvas0")
	var canvas = document.getElementById("canvas0");
	var ctx = canvas.getContext('2d');
	// Loops through each data point
	for (var i = 0; i<data.length; i++) {
		var datapoint = data[i]
		// Fill = Color based on cluster representation; Stroke = Black
		ctx.fillStyle = colors_KMEANS[categories_KMEANS[i]];
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
function clearCentroidData_KMEANS() {
	// Resets data associated with each centroid
	centroids_KMEANS = []
	nodesUnderCentroid_KMEANS = []
	for (var i = 0; i<kValue.value; i++) {
		centroids_KMEANS.push([0,0])
		nodesUnderCentroid_KMEANS.push(0)
	}
}

function calcCentroids_KMEANS() {
	// Dropdowns to determine attributes being compared
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	// Resets centroid data
	clearCentroidData_KMEANS()
	// Computes centroid: average x/y coordinates
	// Computing sum and tallying nodes (whole numbers)
	for (var i = 0; i<data.length; i++) {
		datapoint = data[i];
		category = categories_KMEANS[i]
		nodesUnderCentroid_KMEANS[category]++
		centroids_KMEANS[category][0]+=datapoint[xaxis.value]
		centroids_KMEANS[category][1]+=datapoint[yaxis.value]
	}
	// Division of sum (if number of nodes = 0 -> place the centroid at a random location)
	for (var i = 0; i<centroids_KMEANS.length; i++) {
		if (nodesUnderCentroid_KMEANS[i]==0) {
			centroids_KMEANS[i][0] = Math.random()
			centroids_KMEANS[i][1] = Math.random()
			nodesUnderCentroid_KMEANS[i]++;
		}
		centroids_KMEANS[i][0]/=nodesUnderCentroid_KMEANS[i]
		centroids_KMEANS[i][1]/=nodesUnderCentroid_KMEANS[i]
	}
}
