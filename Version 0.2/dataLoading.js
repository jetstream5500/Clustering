var data = []

$(document).ready(function(){
	$("#dataChoice").change(function(){
		var dataChoice = document.getElementById("dataChoice")
		var uniformInputs = document.getElementById("uniformInputs")
		if (dataChoice.value == 2) {
			uniformInputs.hidden = false
			generateUniformData()
		} else {
			uniformInputs.hidden = true
			if (dataChoice.value == 3) {
				$.get("iris.dat", function(response) {
					response = response.substring(0,response.length-1)
					var irisData = response.split("\n");
					for (var i = 0; i<irisData.length; i++) {
						irisData[i]=irisData[i].split(",");
						irisData[i].pop()
						for (var j = 0; j<irisData[0].length; j++) {
							irisData[i][j] = Number(irisData[i][j])
						}
					}
					normalizeData(irisData)
					data = irisData
					plotData()
				});

			}
		}
	});
});

function generateUniformData() {
	var numNodes = document.getElementById("numNodes");

	data = []
	for (var i = 0; i<numNodes.value; i++) {
		data.push([Math.random(), Math.random()])
	}
	plotData()

}

function normalizeData(dataset) {
	for (var j = 0; j<dataset[0].length; j++) {
		max = Number.MIN_VALUE
		min = Number.MAX_VALUE
		for (var i = 0; i<dataset.length; i++) {
			if (dataset[i][j] < min) {
				min = dataset[i][j]
			}
			if (dataset[i][j] > max) {
				max = dataset[i][j]
			}
		}
		for (var i = 0; i<dataset.length; i++) {
			dataset[i][j] = (dataset[i][j]-min)/(max-min)
		}
	}
}

function clearCanvas(canvasName) {
	var canvas = document.getElementById(canvasName);
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function plotData() {
	for (var i = 0; i<4; i++) {
		clearCanvas("canvas"+i)
		var canvas = document.getElementById("canvas"+i)
		var ctx = canvas.getContext('2d');

		for (var j = 0; j<data.length; j++) {
			var datapoint = data[j]

			ctx.fillStyle = "#AAAAAA";
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
}
function run() {
	// KMEANS
	randomizeCentroidLocations_KMEANS()
	makeRandomColors_KMEANS()
	// HIGH
	makeRandomColors_HIGH()
	assignIndividualCategories_HIGH()
	/*for (var i = 0; i<110; i++) {
		replotData_HIGH()
		mergeCategories_HIGH()
	}*/
	setInterval(function() {
		// KMEANS
		assignCategory_KMEANS()
		replotData_KMEANS()
		calcCentroids_KMEANS()
		drawCentroids_KMEANS()
		// HIGH
		replotData_HIGH()
		mergeCategories_HIGH()
	},100);
}