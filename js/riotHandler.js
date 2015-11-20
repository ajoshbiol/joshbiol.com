function buildUrl() {
	return 'https://' + riotRegion + '.api.pvp.net/api/lol/na/v1.3/' + 
		'game/by-summoner/' + mySummonerId + '/recent?api_key=' + riotKey
}

// What do I want?
// Champion
// spell 1, spell 2
// Game mode
// Game type
// Stats: Win
// Stats: kills
// Stats: deaths
// Stats: assists

function getGamesData(games, callback) {
	
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
		
		drawMatchResult(i, gameData.win);
		
		data.push(JSON.stringify(gameData, null, 2));
	}
	
	console.log(data.join('\n'))

	return data.join('<br>');	
}

function getSummonerMatches() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// Response received
			
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);
				var matches = JSON.stringify(json, null, 2);
				
				document.getElementById('leagueMatchHistory').innerHTML = getGamesData(json['games']);
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
	xhr.open("GET", buildUrl(), true);
	xhr.send();
}