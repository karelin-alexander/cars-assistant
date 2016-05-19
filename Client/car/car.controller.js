(function (angular) {
  'use strict';

  angular.module('cars.app').controller('carsCtrl', function ($scope, Cars) {
    Cars.getData().then(function (value) {
      $scope.carsData = value;
    });
  })

})(window.angular);
