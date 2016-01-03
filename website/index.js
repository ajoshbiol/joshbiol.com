/* Start Riot section */

var m_gamesPieChart = {};

function redrawGamesPieChart() {
	m_gamesPieChart['chart'].draw(m_gamesPieChart['data'], 
		m_gamesPieChart['options']);
}

function drawGamesPieChart(games) {
	
	var wins = 0;
	var losses = 0;
	
	for (var i = 0; i < games.length; i++) {
		if (games[i].stats.win)
			wins++;
		else losses++;
	}
	
	var data = google.visualization.arrayToDataTable([
          ['Result', 'Count'],
          ['Wins', wins],
          ['Losses', losses]
        ]);
	var options = {
		legend: { position: 'bottom', alignment: 'center'},
		pieHole: 0.4,
		height: '100%',
  		width: '100%',
		margin: '0 auto',
		chartArea: { width:"100%",height:"70%"}
    };
	
	var chart = new google.visualization.PieChart(document.getElementById('gameResultsPie'));

	chart.draw(data, options);
	
	m_gamesPieChart['options'] = options;
	m_gamesPieChart['data'] = data;
	m_gamesPieChart['chart'] = chart;	
}

function drawGameResults() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// Response received
			
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);
				
				drawGamesPieChart(json['games']);
				
				document.getElementById('leagueMatchHistory').innerHTML = '';
			}
			else {
				document.getElementById("leagueMatchHistory").innerHTML = 
					'Status Code: ' + xhr.status;
			}
		}
		else {
			document.getElementById("leagueMatchHistory").innerHTML = 
				'Loading... Please wait...';
		}
	};
	xhr.open("GET", 'https://joshbiol.com:3000/riot/matchHistory', true);
	xhr.send();
}

function drawRiotData() {
    drawGameResults();
}

/* End Riot section */

/* Start Weight section */

var m_weightChart = {};

function resizeWeightChart() {
	m_weightChart['chart'].draw(m_weightChart['data'], 
		m_weightChart['options']);
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
					'Status Code: ' + xhr.status;
			}
		}
		else {
			document.getElementById("weightDiv").innerHTML = 
				'Loading... Please wait...';
		}
	};
	xhr.open("GET", 'https://joshbiol.com:3000/health/weight/recentWeights', 
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
		width: '100%',
		margin: '0 auto',
		legend: { position: 'none'}
	};
	
	var chart = new google.charts.Line(document.getElementById("weightGoogChartsDiv"));
    chart.draw(data, options);
	
	m_weightChart['options'] = options;
	m_weightChart['data'] = data;
	m_weightChart['chart'] = chart;	
}

function drawWeightData() {
	getWeightData(function(data) {
		// Time to try google charts
		drawWeightChart(data);
		
		document.getElementById("currWeight").innerHTML = 
			data[data.length -1]['weight'];
			
		document.getElementById("diffDays").innerHTML = 
			getDateRange(data).toString();
	});
}

/* End Weight section */


/* Start Home section */

var bShowingHome = false;

function showHome() {
    if (!bShowingHome) {
        loadHome();
    }
}

function loadHomeGraphs() {
    google.load('visualization', '1.1', {packages: ['line'], callback: drawWeightData});
	google.load("visualization", "1", {packages:["corechart"], callback: drawRiotData});
}

function loadHome() {
    var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				
                loadHomeGraphs();
				document.getElementById('contentDiv').innerHTML = xhr.responseText;
                bShowingLogin = false;
                bShowingHome = true; 
			}
			else {
				document.getElementById("contentDiv").innerHTML = 
					'Status Code: ' + xhr.status;
			}
		}
	};
	xhr.open("GET", 'home.html', 
		true);
    xhr.setRequestHeader('Content-type', 'text/html');
	xhr.send();
}
  

/* End Home section */

/* Start Login section */

var bShowingLogin = false;

function loadLogin() {
    var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				
				document.getElementById('contentDiv').innerHTML = xhr.responseText;
                
                bShowingLogin = true;
                bShowingHome = false; 
			}
			else {
				document.getElementById("contentDiv").innerHTML = 
					'Status Code: ' + xhr.status;
			}
		}
	};
	xhr.open("GET", 'login.html', 
		true);
    xhr.setRequestHeader('Content-type', 'text/html');
	xhr.send();
}

/* End Login section */

window.onload = function() {
	loadHome();
    
    var loginLink = document.getElementById("loginLink");
    
    loginLink.onclick = function() {
        if (!bShowingLogin) {
            loadLogin();    
        }
        
        return false;
    }
    
    var brandLink = document.getElementById("brandLink");
    brandLink.onclick = showHome;
    
    var profileLink = document.getElementById("profileLink");
    var healthLink = document.getElementById("healthLink");
    var funLink = document.getElementById("funLink");
    var contactLink = document.getElementById("contactLink");
    
    profileLink.onclick = showHome;
    healthLink.onclick = showHome;
    funLink.onclick = showHome;
    contactLink.onclick = showHome;
}

if (document.addEventListener) {
	window.addEventListener('resize', resizeWeightChart);
	window.addEventListener('resize', redrawGamesPieChart);
}
else if (document.attchEvent) {
	window.attachEvent('onresize', resizeWeightChart);
	window.attachEvent('onresize', redrawGamesPieChart);
}
else {
	window.resize = resizeWeightChart;
	window.resize = redrawGamesPieChart;
}