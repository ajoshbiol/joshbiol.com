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
	xhr.open("GET", 'http://localhost:3000/riot/champions', true);
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
	xhr.open("GET", 'http://localhost:3000/riot/matchHistory', true);
	xhr.send();
}

window.onload = function() {
	
	getChampionsData(function(err) {
		if (err)
			console.log(err);
		
		initAvailableChampionLogos();
		drawRecentMatches();
	});
}