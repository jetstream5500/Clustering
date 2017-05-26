var data = []
var centroids = []
//var previousCentroids = []
var nodesUnderCentroid = []
var colors = ["#AAAAAA","#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF"]
var looper

function clearCanvas() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function makeRandomColors(numCategories) {
	colors = ["#AAAAAA","#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF"]
	for (var i = 0; i<numCategories-6; i++) {
		var hex = "0123456789ABCDEF"
		var color = "#";
		for (var j = 0; j<6; j++) {
			color+=hex[Math.floor(Math.random()*16)]
		}
		colors.push(color)
	}
}

function generateData() {
	data = []
	var numNodes = document.getElementById("numNodes");

	for (var i = 0; i<numNodes.value; i++) {
		data.push({x:Math.random(), y:Math.random(),category:0})
	}

	plotData()
}

function plotData() {
	if (centroids.length > colors.length-1) {
		makeRandomColors(document.getElementById("kValue").value)
	}
	clearCanvas()
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');

	for (var i = 0; i<data.length; i++) {
		var datapoint = data[i]
		ctx.fillStyle = colors[datapoint.category];
		ctx.strokeStyle = "#000000";
		//ctx.fillStyle = "#AACCFF";
		//ctx.strokeStyle = "#3377BB";
		//ctx.fillStyle = "#FFAAAA";
		//ctx.strokeStyle = "#FF5555";
		ctx.lineWidth = 2;
		// x y reversed
		ctx.beginPath();
		ctx.arc(datapoint.x*canvas.height, datapoint.y*canvas.width,8,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		//ctx.fillRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
		//ctx.strokeRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
	}
}

function clearCentroidData() {
	centroids = []
	nodesUnderCentroid = []
	//previousCentroids = []
	for (var i = 0; i<kValue.value; i++) {
		centroids.push({x:0,y:0})
		nodesUnderCentroid.push(0)
		//previousCentroids.push([])
	}
}

function assignCategory() {
	var kValue = document.getElementById("kValue");

	clearCentroidData()

	makeRandomColors(kValue.value)

	for (var i = 0; i<data.length; i++) {
		data[i].category = Math.floor(Math.random()*kValue.value+1);
	}

	plotData()
	calcCentroid()
	drawCentroid()

	console.log(colors)
}

function run() {
	var timeBetween = document.getElementById("time")

	looper = setInterval(function() {
		reassignCategory()
		plotData()
		calcCentroid()
		drawCentroid()
	},timeBetween.value);
}

/*function isNotChangingCentroids() {
	var stopping = true
	for (var i = 0; i<centroids.length; i++) {
		var centroid = centroids[i]
		var previousCentroid = previousCentroids[i][previousCentroids[i].length-1]
		if (centroid.x!=previousCentroid.x || centroid.y!=previousCentroid.y) {
			stopping = false
		}
	}
	return stopping
}*/

function stopKMeans() {
	clearInterval(looper)
	console.log("hi")
}
function calcCentroid() {
	/*if (isNotChangingCentroids()) {
		stopKMeans()
	}*/

	clearCentroidData()
	for (var i = 0; i<data.length; i++) {
		datapoint = data[i];
		nodesUnderCentroid[datapoint.category-1]++
		centroids[datapoint.category-1].x+=datapoint.x
		centroids[datapoint.category-1].y+=datapoint.y
	}
	for (var i = 0; i<centroids.length; i++) {
		if (nodesUnderCentroid[i]==0) {
			centroids[i].x = Math.random()
			centroids[i].y = Math.random()
			nodesUnderCentroid[i]++;
		}
		centroids[i].x/=nodesUnderCentroid[i]
		centroids[i].y/=nodesUnderCentroid[i]
	}
}

function drawCentroid() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');

	for (var i = 0; i<centroids.length; i++) {
		var centroid = centroids[i]
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = colors[i+1];
		//ctx.fillStyle = "#AACCFF";
		//ctx.strokeStyle = "#3377BB";
		//ctx.fillStyle = "#FFAAAA";
		//ctx.strokeStyle = "#FF5555";
		ctx.lineWidth = 4;
		// x y reversed
		ctx.beginPath();
		ctx.arc(centroid.x*canvas.height, centroid.y*canvas.width,20,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		//ctx.fillRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
		//ctx.strokeRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
	}
}

function reassignCategory() {
	for (var i = 0; i<data.length; i++) {
		var minDist = Number.MAX_VALUE;
		var minCentroid = -1;
		var datapoint = data[i];

		for (var j = 0; j<centroids.length; j++) {
			var centroid = centroids[j]
			var dist = Math.pow((datapoint.x-centroid.x),4)+Math.pow((datapoint.y-centroid.y),4)
			if (dist < minDist) {
				minDist = dist;
				minCentroid = j;
			}
		}

		datapoint.category = minCentroid+1
	}
}
