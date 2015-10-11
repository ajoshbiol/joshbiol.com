var showingMatches = false;

function updateRecentMatchesButton() {
	if (!showingMatches) {
		document.getElementById('matchesToggle').innerHTML = "Hide recent matches";
	}
	else {
		document.getElementById('matchesToggle').innerHTML = "Show recent matches";
	}
}

function displayRecentMatches() {
	document.getElementById("leagueMatchHistory").innerHTML = getRecentMatchesHTML();
}

function hideRecentMatches() {
	document.getElementById("leagueMatchHistory").innerHTML = "";
}

function handleRecentMatches() {
	
	if (!showingMatches) {
		displayRecentMatches();
	}
	else {
		hideRecentMatches();
	}
	
	updateRecentMatchesButton();
	
	showingMatches = !showingMatches;
}