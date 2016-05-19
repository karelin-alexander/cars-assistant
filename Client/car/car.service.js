(function (angular) {
  'use strict';

  angular.module('cars.app')

  .service('Cars', function ($http) {
    this.getData = function () {
      return $http.get('http://192.168.1.38:3000/api/carData').then(function (response) {
        return response.data;
      });
    };
  })
})(window.angular);
