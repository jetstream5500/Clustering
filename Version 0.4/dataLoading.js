var data = []
var looper

$(document).ready(function(){
	$("#dataChoice").change(function(){
		var dataChoice = document.getElementById("dataChoice")
		var generatedInputs = document.getElementById("generatedInputs")
		var realInputs = document.getElementById("realInputs")
		if (dataChoice.value == 2 || dataChoice.value == 3) {
			var xDrop = $('#xaxis')
			var yDrop = $('#yaxis')
			xDrop.empty()
			yDrop.empty()
			xDrop.append("<option value="+0+" selected> Attribute 1</option>")
			yDrop.append("<option value="+1+" selected> Attribute 2</option>")
			generatedInputs.hidden = false
			realInputs.hidden = true
			if (dataChoice.value == 2) {
				generateUniformData()
			} else if (dataChoice.value == 3){
				generateRingedData()
			}
		} else {
			generatedInputs.hidden = true
			realInputs.hidden = false
			if (dataChoice.value == 4){
				$.get("iris.dat", function(response) {
					response = response.substring(0,response.length-1)
					var irisData = response.split("\n");

					var irisHeaders = irisData.splice(0,1)[0].split(",")
					irisHeaders.pop()
					console.log(irisHeaders)
					var xDrop = $('#xaxis')
					var yDrop = $('#yaxis')
					xDrop.empty()
					yDrop.empty()
					for (var i = 0; i<irisHeaders.length; i++) {
						if (i==0) {
							xDrop.append("<option value="+i+" selected>"+irisHeaders[i]+"</option>")
						} else {
							xDrop.append("<option value="+i+">"+irisHeaders[i]+"</option>")
						}
						if (i==1) {
							yDrop.append("<option value="+i+" selected>"+irisHeaders[i]+"</option>")
						} else {
							yDrop.append("<option value="+i+">"+irisHeaders[i]+"</option>")
						}
					}
					//console.log(irisData)



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

function stop() {
	clearInterval(looper)
}
function generateNewData() {
	var dataChoice = document.getElementById("dataChoice")
	if (dataChoice.value == 2) {
		generateUniformData()
	} else if (dataChoice.value == 3){
		generateRingedData()
	}
	clearInterval(looper)
}

function generateUniformData() {
	var numNodes = document.getElementById("numNodes");

	data = []
	for (var i = 0; i<numNodes.value; i++) {
		data.push([Math.random(), Math.random()])
	}
	plotData()

}

function generateRingedData() {
	var numNodes = document.getElementById("numNodes");

	data = []
	for (var i = 0; i<numNodes.value; i++) {
		var radius = Math.random()
		if (radius < 0.3 || radius > 0.6 && radius < 0.7) {
			var radians = Math.random()*2*Math.PI
			var x = Math.cos(radians)/2
			var y = Math.sin(radians)/2
			//console.log(Math.sqrt(x*x+y*y))
			data.push([radius*x+0.5, radius*y+0.5])
		} else {
			i--
		}
	}
	//console.log(data)
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
	ctx.fillStyle="#FFFFFF"; 
	ctx.fillRect(0,0,canvas.width,canvas.height)
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.lineWidth="3";
	ctx.strokeStyle="#CCCCCC"; // Green path
	for (var i = 0; i<=10; i++) {
		ctx.moveTo(canvas.height*0.15,canvas.width*0.15+canvas.width*0.7*i/10);
		ctx.lineTo(canvas.height*0.85,canvas.width*0.15+canvas.width*0.7*i/10);
		ctx.stroke();
		ctx.moveTo(canvas.height*0.15+canvas.height*0.7*i/10,canvas.width*0.15);
		ctx.lineTo(canvas.height*0.15+canvas.height*0.7*i/10,canvas.width*0.85);
		ctx.stroke();
	}
	ctx.fillStyle="#000000"
	ctx.font = "40px Times New Roman";
	ctx.fillText("0",canvas.width*0.15-10,60+canvas.height*0.85);
	ctx.fillText("x",canvas.width*0.50-10,60+canvas.height*0.85);
	ctx.fillText("1",canvas.width*0.85-10,60+canvas.height*0.85);
	ctx.fillText("0",canvas.width*0.15-55,10+canvas.height*0.85);
	ctx.fillText("y",canvas.width*0.15-55,10+canvas.height*0.50);
	ctx.fillText("1",canvas.width*0.15-55,10+canvas.height*0.15);
	/*var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	console.log(xaxis.options[xaxis.value].innerHTML)
	console.log(yaxis.options[yaxis.value].innerHTML)*/
}

function plotData() {
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	for (var i = 0; i<3; i++) {
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
			ctx.arc(datapoint[xaxis.value]*canvas.height*0.7+canvas.height*0.15, canvas.width*0.7-+datapoint[yaxis.value]*canvas.width*0.7+canvas.width*0.15,15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			//ctx.fillRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
			//ctx.strokeRect(scaledLoc.x,scaledLoc.y,pixelSize,pixelSize);
		}
	}
}
function run() {
	var numNodes = document.getElementById("numNodes")
	clearInterval(looper)
	reset_FUZZY()
	// KMEANS
	randomizeCentroidLocations_KMEANS()
	makeRandomColors_KMEANS()
	// HIGH
	makeRandomColors_HIGH()
	assignIndividualCategories_HIGH()
	// FUZZY
	randomizeCentroidLocations_FUZZY()
	makeRandomColors_FUZZY()
	//console.log(centroids_FUZZY)
	//console.log(colors_FUZZY)
	looper = setInterval(function() {
		// KMEANS
		assignCategory_KMEANS()
		replotData_KMEANS()
		calcCentroids_KMEANS()
		drawCentroids_KMEANS()
		// HIGH
		for (var i = 0; i<numNodes.value/10; i++) {
			calcCentroids_HIGH()
			replotData_HIGH()
			drawCentroids_HIGH()
			mergeCategories_HIGH()
		}
		// FUZZY
		assignCategory_FUZZY()
		replotData_FUZZY()
		calcCentroids_FUZZY()
		drawCentroids_FUZZY()
	},100);
}
