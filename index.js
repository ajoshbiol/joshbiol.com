var champions = {};
var availableChampionLogos = [];

function initAvailableChampionLogos() {
	availableChampionLogos.push('Nautilus');
}

// Fills champions object with data: champion id matched with name
function getChampionsData(callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// Response received
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);
				
				for(var index in json['data']) {
					champions[json['data'][index].id] = 
						json['data'][index].name;
				}
				
				callback(null);
			}
		}
	};
	xhr.open("GET", 'http://45.55.153.9:3000/riot/champions', true);
	xhr.send();
}

function drawGameResultCanvas(games) {
	
	var wins = 0;
	var losses = 0;
	
	for (var i = 0; i < games.length; i++) {
		if (games[i].stats.win)
			wins++;
		else losses++;
	}
	
	var c = document.getElementById('gameResultsCanvas');
	var ctx = c.getContext('2d');
	
	var rectHeight = c.height / 5;
	var rectWidthScalar = c.width / 11;
	
	// Draw wins
	if (wins > 0) {
		ctx.fillStyle = '#2fe68e';
		ctx.fillRect(0, rectHeight, rectWidthScalar * wins, rectHeight);
	}
	
	// Draw losses
	if (losses > 0) {
		ctx.fillStyle = '#ff3036';
		ctx.fillRect(0, rectHeight * 3, rectWidthScalar * losses, rectHeight);
	}
}

function drawGameResults() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// Response received
			
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);
				
				drawGameResultCanvas(json['games']);
				
				document.getElementById('leagueMatchHistory').innerHTML = '';
			}
			else {
				document.getElementById("leagueMatchHistory").innerHTML = 
					'Status Code": ' + xhr.status;
			}
		}
		else {
			document.getElementById("leagueMatchHistory").innerHTML = 
				'Loading... Please wait...';
		}
	};
	xhr.open("GET", 'http://45.55.153.9:3000/riot/matchHistory', true);
	xhr.send();
}

function drawRiotData() {
	getChampionsData(function(err) {
		if (err)
			console.log(err);
		
		initAvailableChampionLogos();
		drawGameResults(function() {
			// Draw current favorite or most played in recent games
		});
	});
}

function getWeightData(callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);
				
				document.getElementById('weightDiv').innerHTML = '';
				callback(json['data']);
			}
			else {
				document.getElementById("weightDiv").innerHTML = 
					'Status Code": ' + xhr.status;
			}
		}
		else {
			document.getElementById("weightDiv").innerHTML = 
				'Loading... Please wait...';
		}
	};
	xhr.open("GET", 'http://45.55.153.9:3000/health/weight/recentWeights', 
		true);
	xhr.send();
}

function getDateRange(data) {
	
	var mostRecent = new Date(data[data.length -1]['datetime']);
	var leastRecent = new Date(data[0]['datetime']);
	
	var mostRecentTime = mostRecent.getTime();
	var leastRecentTime = leastRecent.getTime();
	var timeDiff = Math.abs(mostRecentTime - leastRecentTime);
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
	
	return diffDays
}

function drawWeightChart(weightData) {
	
	var temp = [];
	
	for(var i = 0; i < weightData.length; i++) {
		var date = new Date(weightData[i]['datetime']);
		
		temp[i] = [date,weightData[i]['weight']];
	}
	
	var data = new google.visualization.DataTable();
	data.addColumn('date', 'Date');
	data.addColumn('number', 'Weight');

	data.addRows(temp);
	var options = {
		chart: {
			title: 'Weight',
			subtitle: 'In pounds (lbs)'
		},
		height: 300,
		width: 600,
		legend: { position: 'none'}
	};
	
	var chart = new google.charts.Line(document.getElementById("weightGoogChartsDiv"));
    chart.draw(data, options);
}

function drawWeightData() {
	getWeightData(function(data) {
		// Time to try google charts
		drawWeightChart(data);
		
		document.getElementById("currWeight").innerHTML = 
			data[data.length -1]['weight'];
			
		document.getElementById("diffDays").innerHTML = 
			getDateRange(data);
	});
}

window.onload = function() {
	google.load('visualization', '1.1', {packages: ['line'], callback: drawWeightData});
	drawRiotData();	
}