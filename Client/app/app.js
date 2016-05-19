(function (angular) {
  'use strict';

  var app = angular.module('ionicApp', ['ionic', 'cars.app', 'ngRoute']);

  app.controller('MainCtrl', function ($scope) {

    $scope.isdiplay = false;
    $scope.showSearch = function() {
      $scope.isdiplay = !$scope.isdiplay;
    };

    $scope.toggleModel = {
      data_auto: true,
      save_pass: true,
      view_pass: false
    };

    $scope.clientSideList = [
      {text: "$ USD", value: "1"},
      {text: "€ EUR", value: "0.9"},
      {text: "P RUB", value: "61"},
      {text: "б.р BLR", value: "19214"}
    ];

    $scope.colorSideList = [
      {text: "Red", value: "assertive"},
      {text: "Blue ", value: "positive"},
      {text: "Gren ", value: "balanced"},
      {text: "Dark", value: "dark"}
    ];

    $scope.data = {
      clientSide: '1'
    };

    $scope.color_data = {
      color: 'positive'
    };
  });

  app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'car/views/login.html',
      controller: 'LoginCtrl'
    });

    $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'car/views/register.html',
      controller: 'RegisterCtrl'
    });

    $stateProvider.state('inside', {
      url: '/inside',
      templateUrl: 'car/views/inside.html',
      controller: 'InsideCtrl'
    });

    $stateProvider.state('setting', {
      url: "/setting",
      templateUrl: 'car/views/setting.html'
    });

    $stateProvider.state('main', {
      url: "/main",
      templateUrl: 'car/views/main.html'
    });

    $stateProvider.state('mainAuth', {
      url: "/main-auth",
      templateUrl: 'car/views/mainAuth.html'
    });

    $stateProvider.state('buy', {
      url: "/buy",
      templateUrl: 'car/views/buy.html'
    });

    $stateProvider.state('sale', {
      url: "/sale",
      templateUrl: 'car/views/sale.html'
    });

    $stateProvider.state('profile', {
      url: "/profile",
      templateUrl: 'car/views/profile.html'
    });

    $urlRouterProvider.otherwise('/main');
  });

})(window.angular);
