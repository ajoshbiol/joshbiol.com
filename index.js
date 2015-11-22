var champions = {};
var availableChampionLogos = [];

function initAvailableChampionLogos() {
	availableChampionLogos.push('Nautilus');
}

function getChampionsData(callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// Response received
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);
				
				var championString = JSON.stringify(json, null, 2);
				for(var index in json['data']) {
					champions[json['data'][index].id] = json['data'][index].name;
				}
				
				callback(null);
			}
		}
	};
	xhr.open("GET", 'http://45.55.153.9:3000/riot/champions', true);
	xhr.send();
}

function drawMatchResult(gameNum, win, championId) {
	var c = document.getElementById('matchHistCanvas');
	var ctx = c.getContext('2d');
	
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;

	if (win)
		ctx.fillStyle = '#2fe68e';
	else ctx.fillStyle = '#ff3036';
	
	ctx.fillRect(0, c.height / 10 * gameNum, 10, c.height / 10);
	ctx.moveTo(0, c.height / 10 * (gameNum + 1) + 0.5);
	ctx.lineTo(c.width, c.height / 10 * (gameNum + 1) + 0.5);
	ctx.stroke();
	
	if (availableChampionLogos.indexOf(champions[championId]) != -1) {
		var champLogo = new Image();
		
		champLogo.onload = function() {
			
			var logoSideLength;
			if (c.width < c.height)
				logoSideLength = c.width / 10;
			else logoSideLength = c.height / 10;
			
			ctx.drawImage(champLogo, 11, c.height / 10 * gameNum, logoSideLength, 
				logoSideLength);
		};
		champLogo.src = './src/championLogos/' + champions[championId] + '.png';
	}
}

function drawGamesData(games) {
	
	var data = new Array();

	for (var i = 0; i < games.length; i++) {
		var element = games[i];
		
		var gameData = {
			championId: element.championId,
			createDate: element.createDate,
			gameMode: element.gameMode,
			gameType: element.gameType,
			spell1: element.spell1,
			spell2: element.spell2,
			win: element.stats.win,
			kills: element.stats.championsKilled,
			deaths: element.stats.numDeaths,
			assists: element.stats.assists
		}
		
		drawMatchResult(i, gameData.win, gameData.championId);
		
		data.push(JSON.stringify(gameData, null, 2));
	}
	
	return data.join('<br>');	
}


function drawRecentMatches() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// Response received
			
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);
				
				drawGamesData(json['games'])
				
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

function getWeightData(callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);
				
				console.log(JSON.stringify(json, null, 2));
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
	xhr.open("GET", 'http://45.55.153.9:3000/health/weight/recentWeights', true);
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
	console.log('wpd: ' + widthPerDay);

	var heightPerLbs = c.height / diffWeight;
	console.log('hpl: ' + heightPerLbs);		
	
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	
	for (var i = 0; i < data.length; i++) {
		var weight = data[i]['weight'];
		console.log('weight: ' + weight);
		var date = new Date(data[i]['datetime']);
		
		console.log('date: ' + date);
		console.log('least recent ' + leastRecentDate);
		console.log('lowest weight ' + lowestWeight);
		var x = ((date - leastRecentDate) * widthPerDay) / (1000 * 3600 * 24);
		var y = c.height - ((weight - lowestWeight) * heightPerLbs); //+ 
			//(.25 * heightPerLbs));
		
		console.log('x: ' + x + ' y: ' + y);
		
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
		console.log('hey');		
		
		getWeightRange(data, function(diffWeight, highest, lowest) {
			
			console.log(diffWeight);
			// To add a .25lb buffer on each side
			diffWeight += .5;
			
			getDateRange(data, function(diffDays, mostRecentDate, 
				leastRecentDate) {
				
				console.log(diffDays);
				document.getElementById("diffDays").innerHTML = diffDays;
				
				drawWeightDataOnCanvas(data, diffWeight, highest, lowest,
					diffDays, mostRecentDate, leastRecentDate)
			});
		});
	});
}

window.onload = function() {

	drawWeightData();

	getChampionsData(function(err) {
		if (err)
			console.log(err);
		
		initAvailableChampionLogos();
		drawRecentMatches();
	});
}