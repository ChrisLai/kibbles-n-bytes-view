var nibblebyte = angular.module('nibblebyte', ['ui.bootstrap', 'ngRoute']);

nibblebyte.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: 'partials/main.html'
        })
        .when('/settings',{
            templateUrl: 'partials/settings.html'
        });
}]);

nibblebyte.factory('feederFactory', function($http){
    var factory = {};

    var feeder=[
        {name: 'Harsh Sharma', date: 1428785374000},
        {name: 'Eric Yaleman', date: 1428740201000},
        {name: 'Ben Kapp', date: 1428740201000},
        {name: 'Nick Miller', date: 1428657401000}
    ];


    factory.getFeeder = function(){
        //Http Reuqest is returned here
        return feeder;
    }

    return factory;
});

nibblebyte.filter('lastFed', function () {
    return function (items, date) {

        var diff;
        if(date === 'today'){
            diff = 0;
        }
        else if(date === 'yesterday'){
            diff = 1;
        }
        else if(date === 'twoDayAgo'){
            diff = 2;
        }

        var currentTime = moment();
        currentTime.set('hour', 23);
        currentTime.set('minute', 59);
        currentTime.set('second', 59);
        currentTime.set('millisecond', 999);

        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (currentTime.diff(item.date, 'days') === diff) {
                filtered.push(item);
            }
        }
        return filtered;
    };
});

nibblebyte.controller('feederController', function($scope, feederFactory){
    $scope.feeder = [];

    init();

    $scope.currentTime = moment(1428740201000).fromNow();
    $scope.currentFeeder = findMostCurrentFeeder();
    $scope.currentFeederAgoTime = moment($scope.value.currentFeeder['date']).fromNow().split(' ');

    if($scope.currentFeederAgoTime[0] == 'a' || $scope.currentFeederAgoTime[0] == 'an'){
        $scope.currentFeederAgoTime[0] = '1';
    }

    //Find the most recenter feeder by 'date' and return that object
    function findMostCurrentFeeder() {
        var result = null;
        for (var i = 0; i < $scope.feeder.length; i++) {
            var user = $scope.feeder[i];
            if (result == null || user.date > result.date) {
                result = user;
            }
        }
        return result;
    }

    function init(){
        $scope.feeder = feederFactory.getFeeder();
    }

});

nibblebyte.controller('TimepickerDemoCtrl', function ($scope, $log, $http) {
    $scope.mytime = new Date();
    $scope.mytitle = "";
    $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.ismeridian = true;

    $scope.changed = function () {
        $log.log('Time changed to: ' + $scope.mytime);
    };

    $scope.submit = function(){
        //console.log($scope.mytitle, $scope.mytime);
        $.ajax({
            method: "POST",
            url: "http://kibblesnbytes.mybluemix.net/timers",
            data: { name: $scope.mytitle, timer: $scope.mytime }
        })
        .done(function( msg ) {
            alert( "Time submited: " + msg );
        });
    };

});

nibblebyte.controller('settingController', ['$scope', function($scope, $http) {


    $scope.checkPost = function(checked, personName){
        //$http({
        //    method: 'POST',
        //    url: "http://kibblesnbytes.mybluemix.net/text",
        //    data: $.param({"name": name,"wantText": checked}),
        //    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        //});

        $.ajax({
            method: "POST",
            url: "http://kibblesnbytes.mybluemix.net/text",
            data: { name: personName, wantText: checked }
        })
        .done(function( msg ) {
            alert( "Chcked in: " + msg );
        });
    };

}]);


