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

function getWeightRange(data, callback) {
	
	var highest = -1;
	var lowest = -1;
	var curr = null;
	
	for (var i = 0; i < data.length; i++) {
		
		curr = data[i]['weight'];
		
		if (highest == -1)
			highest = curr;
		if (lowest == -1)
			lowest = curr;
		if (curr > highest)
			highest = curr;
		if (curr < lowest)
			lowest = curr;
	}
	
	document.getElementById("currWeight").innerHTML = curr;
	
	return callback(highest - lowest, highest, lowest)
}

function getDateRange(data, callback) {
	
	var mostRecent = new Date(data[data.length -1]['datetime']);
	var leastRecent = new Date(data[0]['datetime']);
	
	var mostRecentTime = mostRecent.getTime();
	var leastRecentTime = leastRecent.getTime();
	var timeDiff = Math.abs(mostRecentTime - leastRecentTime);
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
	
	return callback(diffDays, mostRecent, leastRecent)
}

function drawWeightDataOnCanvas(data, diffWeight, highestWeight, lowestWeight,
	diffDays, mostRecentDate, leastRecentDate) {
	
	var c = document.getElementById('weightCanvas');
	var ctx = c.getContext('2d');

	var widthPerDay = c.width / diffDays;

	var heightPerLbs = c.height / diffWeight;
	
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	
	for (var i = 0; i < data.length; i++) {
		var weight = data[i]['weight'];
		var date = new Date(data[i]['datetime']);
		
		var x = ((date - leastRecentDate) * widthPerDay) / (1000 * 3600 * 24);
		var y = c.height - ((weight - lowestWeight) * heightPerLbs); //+ 
			//(.25 * heightPerLbs));
		
		if (i == 0) {
			ctx.moveTo(x, y);
		}
		else {
			ctx.lineTo(x, y);
			ctx.stroke();
		}
	}
}

function drawWeightData() {
	getWeightData(function(data) {
		// Data is an array of weight records
		
		getWeightRange(data, function(diffWeight, highest, lowest) {
			
			// To add a .25lb buffer on each side
			diffWeight += .5;
			
			getDateRange(data, function(diffDays, mostRecentDate, 
				leastRecentDate) {
				
				document.getElementById("diffDays").innerHTML = diffDays;
				
				drawWeightDataOnCanvas(data, diffWeight, highest, lowest,
					diffDays, mostRecentDate, leastRecentDate)
			});
		});
	});
}

window.onload = function() {

	drawWeightData();	
	drawRiotData();
}