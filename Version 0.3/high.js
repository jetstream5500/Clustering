// HIGH
var categories_HIGH = []
var centroids_HIGH = []
var colors_HIGH = []
var nodesUnderCentroid_HIGH = []

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
		//nodesUnderCategory_HIGH[i] = 1
		//centroids_HIGH[i] = data[i]
	}
}
function clearCentroidData_HIGH() {
	centroids_HIGH = []
	nodesUnderCentroid_HIGH = []
	//previousCentroids = []
	for (var i = 0; i<data.length; i++) {
		centroids_HIGH.push([0,0])
		nodesUnderCentroid_HIGH.push(0)
		//previousCentroids.push([])
	}
}

function calcCentroids_HIGH() {
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")

	clearCentroidData_HIGH()

	for (var i = 0; i<data.length; i++) {
		datapoint = data[i];
		category = categories_HIGH[i]
		nodesUnderCentroid_HIGH[category]++
		centroids_HIGH[category][0]+=datapoint[xaxis.value]
		centroids_HIGH[category][1]+=datapoint[yaxis.value]
	}
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
	var canvas = document.getElementById("canvas1");
	var ctx = canvas.getContext('2d');
	for (var i = 0; i<centroids_HIGH.length; i++) {
		var centroid = centroids_HIGH[i]
		if (centroid[0] >= 0) {
			ctx.fillStyle = "#000000";
			ctx.strokeStyle = colors_HIGH[i];
			//ctx.fillStyle = "#AACCFF";
			//ctx.strokeStyle = "#3377BB";
			//ctx.fillStyle = "#FFAAAA";
			//ctx.strokeStyle = "#FF5555";
			ctx.lineWidth = 4;
			// x y reversed
			ctx.beginPath();
			ctx.arc(centroid[0]*canvas.height, canvas.width-centroid[1]*canvas.width,25,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}

		//ctx.fillRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
		//ctx.strokeRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
	}
}

function replotData_HIGH() {
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")

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
		ctx.arc(datapoint[xaxis.value]*canvas.height, canvas.width-datapoint[yaxis.value]*canvas.width,15,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		//ctx.fillRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
		//ctx.strokeRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
	}
}

function mergeCategories_HIGH() {
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")

	var maxMergeSize = document.getElementById("maxMergeSize");
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

	for (var i = 0; i<data.length; i++) {
		if (categories_HIGH[i] == cat2) {
			categories_HIGH[i] = cat1
		}
	}
}
