// KMEANS
var categories_KMEANS = []
var centroids_KMEANS = []
var nodesUnderCentroid_KMEANS = []
var colors_KMEANS = []

function makeRandomColors_KMEANS() {
	var kValue = document.getElementById("kValue");
	colors_KMEANS = ["#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF"]
	for (var i = 0; i<kValue.value-6; i++) {
		var hex = "0123456789ABCDEF"
		var color = "#";
		for (var j = 0; j<6; j++) {
			color+=hex[Math.floor(Math.random()*16)]
		}
		colors_KMEANS.push(color)
	}
}


function randomizeCentroidLocations_KMEANS() {
	var kValue = document.getElementById("kValue");
	for (var i = 0; i<kValue.value; i++) {
		centroids_KMEANS.push([Math.random(),Math.random()])
	}
}
function drawCentroids_KMEANS() {
	var canvas = document.getElementById("canvas0");
	var ctx = canvas.getContext('2d');
	for (var i = 0; i<centroids_KMEANS.length; i++) {
		var centroid = centroids_KMEANS[i]
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = colors_KMEANS[i];
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
		//ctx.fillRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
		//ctx.strokeRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
	}
}

function assignCategory_KMEANS() {
	if (categories_KMEANS.length == 0) {
		categories_KMEANS = new Array(data.length).fill(-1);
	}
	//console.log("inside assign")
	//console.log(centroids_KMEANS)
	for (var i = 0; i<data.length; i++) {
		var minDist = Number.MAX_VALUE;
		var minCentroid = -1;
		var datapoint = data[i];

		for (var j = 0; j<centroids_KMEANS.length; j++) {
			var centroid = centroids_KMEANS[j]
			var dist = Math.pow((datapoint[0]-centroid[0]),2)+Math.pow((datapoint[1]-centroid[1]),2)
			if (dist < minDist) {
				minDist = dist;
				minCentroid = j;
			}
		}
		//console.log(minCentroid)
		categories_KMEANS[i] = minCentroid
	}
}

function replotData_KMEANS() {
	clearCanvas("canvas0")
	var canvas = document.getElementById("canvas0");
	var ctx = canvas.getContext('2d');

	for (var i = 0; i<data.length; i++) {
		var datapoint = data[i]
		ctx.fillStyle = colors_KMEANS[categories_KMEANS[i]];
		ctx.strokeStyle = "#000000";
		//ctx.fillStyle = "#AACCFF";
		//ctx.strokeStyle = "#3377BB";
		//ctx.fillStyle = "#FFAAAA";
		//ctx.strokeStyle = "#FF5555";
		ctx.lineWidth = 2;
		// x y reversed
		ctx.beginPath();
		ctx.arc(datapoint[0]*canvas.height, canvas.width-datapoint[1]*canvas.width,15,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		//ctx.fillRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
		//ctx.strokeRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
	}
}
function clearCentroidData_KMEANS() {
	centroids_KMEANS = []
	nodesUnderCentroid_KMEANS = []
	//previousCentroids = []
	for (var i = 0; i<kValue.value; i++) {
		centroids_KMEANS.push([0,0])
		nodesUnderCentroid_KMEANS.push(0)
		//previousCentroids.push([])
	}
}

function calcCentroids_KMEANS() {
	clearCentroidData_KMEANS()

	for (var i = 0; i<data.length; i++) {
		datapoint = data[i];
		category = categories_KMEANS[i]
		nodesUnderCentroid_KMEANS[category]++
		centroids_KMEANS[category][0]+=datapoint[0]
		centroids_KMEANS[category][1]+=datapoint[1]
	}
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
