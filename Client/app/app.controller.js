(function (angular) {
  'use strict';

  angular.module('ionicApp')

  .controller('displayElemCtrl', function ($scope, TagMenu) {
    $scope.tagsHeader = TagMenu.getTags();
  })

  .controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
    $scope.user = {
      name: '',
      password: ''
    };

    $scope.login = function() {
      AuthService.login($scope.user).then(function(msg) {
        $state.go('inside');
      }, function(errMsg) {
        var alertPopup = $ionicPopup.alert({
          title: 'Ошибка аутентификации!',
          template: errMsg
        });
      });
    };
  })

  .controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
    $scope.user = {
      name: '',
      password: ''
    };

    $scope.signup = function() {
      AuthService.register($scope.user).then(function(msg) {
        $state.go('login');
        var alertPopup = $ionicPopup.alert({
          title: '',
          template: msg
        });
      }, function(errMsg) {
        var alertPopup = $ionicPopup.alert({
          title: '',
          template: errMsg
        });
      });
    };
  })

  .controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
    $scope.destroySession = function() {
      AuthService.logout();
    };

    $scope.getInfo = function() {
      $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
        $scope.memberinfo = result.data.msg;
        $scope.userInfo = result.data.name;
      });
    };

    $scope.logout = function() {
      AuthService.logout();
      $state.go('login');
    };
  })

  .controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      AuthService.logout();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Сессия прервана!',
        template: 'К сожалению, Вы должны войти снова'
      });
    });
  });

})(window.angular);
