var app = angular.module('Portfolio', ['ngMaterial']);

// Main controller for cards in the Interests section
app.controller('InterestCtrl', ['$scope', '$http', '$window', 
    function($scope, $http, $window) {

    var win = angular.element($window);

    getLoLData($http, function(err, data) {
        if (err)
            return console.error(err);
        $scope.lolData = data;

        setMostRecentGameResults($scope);
        drawLoLWinDonut(data.games);
    });

    getWeightData($http, function(err, data) {
        if (err)
            return console.error(err);

        $scope.weightData = data.data;

        setMostRecentWeightValues($scope);
        setWeightTrendValues($scope);
        setWeightLastUpdated($scope);

        drawWeightGraph(data.data);
    });

    win.bind('resize', function() {

        if ($scope.weightData !== null) 
            drawWeightGraph($scope.weightData);

        if ($scope.lolData !== null) 
            drawLoLWinDonut($scope.lolData.games);
    });
}]);

// Function to set string to be displayed in Weight card header
// text subheader
function setWeightLastUpdated($scope) {

    var mostRecent = $scope.weightData[$scope.weightData.length - 1];
    var mrDate = new Date(mostRecent.datetime);
    var now = new Date();

    var span = now - mrDate;
    var spanDays = Math.ceil(span / 1000 / 3600 / 24);

    var updateString = 'Updated ' + spanDays + ' day';
    
    if (spanDays == 1)
        updateString += ' ago';
    else updateString += 's ago';

    $scope.weightLastUpdated = updateString;
}

// Function to set string to be displayed in Weight card title text subheader
function setWeightTrendValues($scope) {
    var leastRecent = $scope.weightData[0];
    var mostRecent = $scope.weightData[$scope.weightData.length - 1];

    var mrDate = new Date(mostRecent.datetime);
    var lrDate = new Date(leastRecent.datetime);

    var span = mrDate - lrDate;
    var spanDays = Math.ceil(span / 1000 / 3600 / 24);

    var mrWeight = mostRecent.weight;
    var lrWeight = leastRecent.weight;

    var weightDiff = Math.ceil(mrWeight - lrWeight);

    var trend;

    if (weightDiff > 0)
        trend = 'Gained ';
    else trend = 'Lost ';
    
    $scope.weightTrend = trend + Math.abs(weightDiff) + 
        ' lbs over a span of ' + spanDays + ' days';
}

// Function to set values to Weight variables
function setMostRecentWeightValues($scope) {
    // mr = most recent
    var mrData = $scope.weightData[$scope.weightData.length - 1];

    var d = new Date(mrData.datetime);
    $scope.mrWeighingDate = getMonthName(d.getMonth()) + ' ' + 
        d.getDate() + ', ' + d.getFullYear();
    $scope.mrWeight = mrData.weight;
}

// Function to retrieve appropriate month name from month integer
function getMonthName(iMonth) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return monthNames[iMonth];
}

// Function to retrieve most recent weight data
function getWeightData($http, callback) {
    $http({
        method : 'GET',
        url : serviceUrl + '/api/preview/recentWeights'
    })
    .then(function success(response) {
        return callback(null, response.data); 
    }, function error(response) {
        return callback(response);
    });
}

// Function to draw line chart displaying change in weight over time
function drawWeightGraph(data) {
    var temp = [];

    data.forEach(function(entry) {
        var date = new Date(entry.datetime);
        temp.push([date, entry.weight]);
    });

    var table = new google.visualization.DataTable();
    table.addColumn('date', 'Date');
    table.addColumn('number', 'Weight');
    table.addRows(temp);

    var options = {
        chart : {
            title : 'Weight',
            subtitle : 'In pounds (lbs)'
        },
        legend : { position : 'none' },
        width : '100%',
        margin : '0 auto'
    };

    var chart = new google.charts.Line(document.getElementById("weightChart"));
    chart.draw(table, options);
}

// Function to retrieve League of Legeds recent match history data
function getLoLData($http, callback) {
    $http({
        method : 'GET',
        url : serviceUrl + '/api/preview/matchHistory'
    })
    .then(function success(response) {
        return callback(null, response.data);
    }, function error(response) {
        return callback(response);
    });
}

// Function to set most recent game results
function setMostRecentGameResults($scope) {

    var mrGame = $scope.lolData.games[0];

    var result;
    if (mrGame.stats.win)
        result = ' win';
    else result = ' loss';

    var d = new Date(mrGame.createDate); 
    $scope.mostRecentLoLResult = 'Last game played on ' + 
        getMonthName(d.getMonth()) + ' ' + d.getDate() + 
        ', ' + d.getFullYear() + ' resulted in a ' + result;

    
    var now = new Date();

    var span = now - d;
    var spanDays = Math.ceil(span / 1000 / 3600 / 24);

    var updateString = 'Updated ' + spanDays + ' day';
    
    if (spanDays == 1)
        updateString += ' ago';
    else updateString += 's ago';

    $scope.lolLastUpdate = updateString;
}

// Function to draw a donut graph of match history result
function drawLoLWinDonut(data) {
    var wins = 0;
    var losses = 0;

    data.forEach(function(entry) {
        if (entry.stats.win)
            wins++;
        else losses++;
    });

    var table = google.visualization.arrayToDataTable(
        [['Result', 'Count'], ['Wins', wins], ['Losses', losses]]
    );

    var options = {
        legend : {
            position : 'bottom',
            alignment : 'center'
        },
        pieHole : 0.4,
        height : '100%',
        weight : '100%',
        margin : '0 auto',
        chartArea : {
            width : '100%',
            height : '70%'
        }
    };

    var chart = new google.visualization.PieChart(
        document.getElementById('winsChart'));

    chart.draw(table, options);
}

// Function to load google chart library after window load
window.onload = function() {
    google.charts.load('current', { packages : ['line', 'corechart'] });
};
