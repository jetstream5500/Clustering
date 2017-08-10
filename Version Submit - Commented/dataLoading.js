// Globals
var data = []
var looper

// JQuery used to update dropdowns containing attributes of the data
$(document).ready(function(){
	$("#dataChoice").change(function(){
		var dataChoice = document.getElementById("dataChoice")
		var generatedInputs = document.getElementById("generatedInputs")
		var realInputs = document.getElementById("realInputs")
		if (dataChoice.value == 2 || dataChoice.value == 3) {
			// Generated data sets
			// Fills dropdowns with  values and names of arbitrary attributes given data sets are generated(1/2)
			var xDrop = $('#xaxis')
			var yDrop = $('#yaxis')
			xDrop.empty()
			yDrop.empty()
			xDrop.append("<option value="+0+" selected> Attribute 1</option>")
			yDrop.append("<option value="+1+" selected> Attribute 2</option>")
			// hides and shows the options associated with generated input and data file inputs
			generatedInputs.hidden = false
			realInputs.hidden = true
			if (dataChoice.value == 2) {
				// data generation
				generateUniformData()
			} else if (dataChoice.value == 3){
				// data generation
				generateRingedData()
			}
		} else {
			// Non generated data sets
			// hides and shows the options associated with generated input and data file inputs
			generatedInputs.hidden = true
			realInputs.hidden = false
			if (dataChoice.value == 4){
				// fetches the local iris.dat file (should be converted to using input tag)
				$.get("iris.dat", function(response) {
					// Parses dataset so it is purely the quantitative values
					response = response.substring(0,response.length-1)
					var irisData = response.split("\n");
					// Gets names of attributes (top of file) / CSV
					var irisHeaders = irisData.splice(0,1)[0].split(",")
					irisHeaders.pop()
					console.log(irisHeaders)
					// Plugs attributes into dropdown to choose from
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
					// Continues to parse the dataset so it is purely quantitative values
					for (var i = 0; i<irisData.length; i++) {
						irisData[i]=irisData[i].split(",");
						irisData[i].pop()
						for (var j = 0; j<irisData[0].length; j++) {
							irisData[i][j] = Number(irisData[i][j])
						}
					}
					// normalization
					normalizeData(irisData)
					data = irisData
					// plotting
					plotData()
				});
			}
		}
	});
});

function stop() {
	// Stops interval running the simulations
	clearInterval(looper)
}
function generateNewData() {
	// Button that generates new data after dropdown has already been selected
	var dataChoice = document.getElementById("dataChoice")
	if (dataChoice.value == 2) {
		generateUniformData()
	} else if (dataChoice.value == 3){
		generateRingedData()
	}
	clearInterval(looper)
}

function generateUniformData() {
	// Generates uniform data
	var numNodes = document.getElementById("numNodes");

	data = []
	for (var i = 0; i<numNodes.value; i++) {
		data.push([Math.random(), Math.random()])
	}
	plotData()
}

function generateRingedData() {
	// Generates ringed data
	var numNodes = document.getElementById("numNodes");

	data = []
	for (var i = 0; i<numNodes.value; i++) {
		var radius = Math.random()
		// checks to make sure node is either in the ring or dot (distance from center)
		if (radius < 0.3 || radius > 0.6 && radius < 0.7) {
			var radians = Math.random()*2*Math.PI
			var x = Math.cos(radians)/2
			var y = Math.sin(radians)/2
			data.push([radius*x+0.5, radius*y+0.5])
		} else {
			i--
		}
	}
	plotData()
}

function normalizeData(dataset) {
	// Normalization of the dataset: (data-min)/(max-min)
	for (var j = 0; j<dataset[0].length; j++) {
		// Determines Max and Min first
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
		// Adjusts based on maxs and mins
		for (var i = 0; i<dataset.length; i++) {
			dataset[i][j] = (dataset[i][j]-min)/(max-min)
		}
	}
}

function clearCanvas(canvasName) {
	// Basic setup function for the canvas
	var canvas = document.getElementById(canvasName);
	var ctx = canvas.getContext('2d');
	// Paints the entire canvas white (clearRect for alpha=0)
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0,0,canvas.width,canvas.height)
	// Gridline Drawing (#Gridlines = 10).  15% of canvas on all sides is saved for labels
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
	// Text Drawing: Types out axis labels (x,y) and the range: [0,1]
	ctx.fillStyle="#000000"
	ctx.font = "40px Times New Roman";
	ctx.fillText("0",canvas.width*0.15-10,60+canvas.height*0.85);
	ctx.fillText("x",canvas.width*0.50-10,60+canvas.height*0.85);
	ctx.fillText("1",canvas.width*0.85-10,60+canvas.height*0.85);
	ctx.fillText("0",canvas.width*0.15-55,10+canvas.height*0.85);
	ctx.fillText("y",canvas.width*0.15-55,10+canvas.height*0.50);
	ctx.fillText("1",canvas.width*0.15-55,10+canvas.height*0.15);
}

function plotData() {
	// Plots the data set as grey points on each canvas
	var xaxis = document.getElementById("xaxis")
	var yaxis = document.getElementById("yaxis")
	// Loops through canvas #
	for (var i = 0; i<3; i++) {
		clearCanvas("canvas"+i)
		var canvas = document.getElementById("canvas"+i)
		var ctx = canvas.getContext('2d');
		// Loops through every data point
		for (var j = 0; j<data.length; j++) {
			var datapoint = data[j]
			// Grey color
			ctx.fillStyle = "#AAAAAA";
			ctx.strokeStyle = "#000000";
			// Line Width
			ctx.lineWidth = 2;
			// Note: height & width Reversed
			// Only 70% of canvas is used for plotting.  Note: "canvas.width-..." in the second point.
			// Radius = 15
			ctx.beginPath();
			ctx.arc(datapoint[xaxis.value]*canvas.height*0.7+canvas.height*0.15, canvas.width*0.7-+datapoint[yaxis.value]*canvas.width*0.7+canvas.width*0.15,15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
	}
}
function run() {
	// Starts visualizations
	var numNodes = document.getElementById("numNodes")
	clearInterval(looper)
	reset_FUZZY()
	// KMEANS Setup
	randomizeCentroidLocations_KMEANS()
	makeRandomColors_KMEANS()
	// HIGH Setup
	makeRandomColors_HIGH()
	assignIndividualCategories_HIGH()
	// FUZZY Setup
	randomizeCentroidLocations_FUZZY()
	makeRandomColors_FUZZY()
	// Begins Iterations (100 ms at the bottom of the interval = time between iterations)
	looper = setInterval(function() {
		// KMEANS Process
		assignCategory_KMEANS()
		replotData_KMEANS()
		calcCentroids_KMEANS()
		drawCentroids_KMEANS()
		// HIGH Process (Loop to speed up / finished after 10 iterations but slows down other programs)
		for (var i = 0; i<numNodes.value/10; i++) {
			calcCentroids_HIGH()
			replotData_HIGH()
			drawCentroids_HIGH()
			mergeCategories_HIGH()
		}
		// FUZZY Process
		assignCategory_FUZZY()
		replotData_FUZZY()
		calcCentroids_FUZZY()
		drawCentroids_FUZZY()
	},100);
}
