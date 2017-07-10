var app = angular.module('Portfolio', ['ngMaterial']);

// Main controller for cards in the Interests section
app.controller('InterestCtrl', ['$scope', '$http', '$window', 
    function($scope, $http, $window) {

    var win = angular.element($window);

    getWeightData($http, function(err, data) {
        if (err)
            return console.error(err);

        $scope.weightData = data.data;

        setMostRecentWeightValues($scope);
        setWeightTrendValues($scope);
        setWeightLastUpdated($scope);

        drawWeightGraph(data.data);
    });

    getGithubData($http, function(err, data) {
        if (err)
            return console.error(err);
        
        // Change time format from ISO to Date
        data.repos.forEach(function(element) {
            element.created_at = (new Date(element.created_at)).toString(); 
            element.updated_at = (new Date(element.updated_at)).toString(); 
            element.pushed_at = (new Date(element.pushed_at)).toString(); 
        });

        $scope.githubData = data.repos;

        setLastCodeCommits($scope);
    });

    win.bind('resize', function() {

        if ($scope.weightData !== null) 
            drawWeightGraph($scope.weightData);
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
    if (data === null || data === undefined)
        return;

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

// Function to retrieve github data
function getGithubData($http, callback) {
    $http({
        method : 'GET',
        url : serviceUrl + '/api/preview/recentGithubActivity'
    })
    .then(function success(response) {
        return callback(null, response.data);
    }, function error(response) {
        return callback(response);
    });
}

// Function to set last update dates
function setLastCodeCommits($scope) {
    
    var latest = null;
    $scope.githubData.forEach(function(element) {
        if (latest === null) 
            latest = element.pushed_at;
        else {
            if (element.pushed_at > latest) 
                latest = element.pushed_at;
        }
    });

    if (latest !== null) {
        var d = new Date(latest);
        var now = new Date();

        var span = now - d;
        var spanDays = Math.ceil(span / 1000 / 3600 / 24);

        var updateString = 'Last commit was ' + spanDays + ' day';
    
        if (spanDays == 1)
            updateString += ' ago';
        else updateString += 's ago';

        $scope.lastCommit = updateString;
    }
}

// Function to load google chart library after window load
window.onload = function() {
    google.charts.load('current', { packages : ['line', 'corechart'] });
    google.charts.setOnLoadCallback(function() {
        angular.bootstrap(document.body, ['Portfolio']);
    });
};
