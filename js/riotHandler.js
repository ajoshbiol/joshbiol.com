function buildUrl() {
	return 'https://' + riotRegion + '.api.pvp.net/api/lol/na/v1.3/' + 
		'game/by-summoner/' + mySummonerId + '/recent?api_key=' + riotKey
}

function getSummonerMatches() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// Response received
			
			if (xhr.status === 200) {
				document.getElementById("leagueMatchHistory").innerHTML = 
					xhr.responseText;
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

// Request https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/41798816/recent?api_key=0972299d-4f17-4eb0-bfc9-3849b4acb5aa