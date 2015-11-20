function buildUrl() {
	return 'https://' + riotRegion + '.api.pvp.net/api/lol/na/v1.3/' + 
		'game/by-summoner/' + mySummonerId + '/recent?api_key=' + riotKey
}

function getGamesData(games, callback) {
	
	if (games.length > 0) {
		games.forEach(function(element) {
			console.log(element);
		});
	}
}

function getSummonerMatches() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// Response received
			
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);
				var matches = JSON.stringify(json, null, 2);
				
				console.log(json.hasOwnProperty('games'));
				
				
				getGamesData(json['games']);
				
				//console.log(matches);
				
				document.getElementById("leagueMatchHistory").innerHTML = 
					matches;
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