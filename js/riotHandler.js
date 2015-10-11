function buildUrl() {
	return 'https://' + riotRegion + '.api.pvp.net/api/lol/na/v1.3/' + 
		'game/by-summoner/' + mySummonerId + '/recent?api_key=' + riotKey
}

function getSummonerMatches() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", buildUrl(), false);
	xhr.send();
	
	return xhr.responseText;
}

// Request https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/41798816/recent?api_key=0972299d-4f17-4eb0-bfc9-3849b4acb5aa
function getRecentMatchesHTML() {
	
	var resHtml = getSummonerMatches();
	
	return resHtml;
}