angular.module('starter.services',['ngResource'])
//factory example using resources
.factory('User', function($resource, $http) {
   return $resource('http://floating-tor-67033.herokuapp.com/users/:id', {id: "@id"});
})

//send post to login route, which will return a user object
.factory('LoggedInUser', function($resource, $http) {
   return $resource('http://floating-tor-67033.herokuapp.com/login/:id', {id: "@id"});
})

.factory('Role', function($resource, $http) {
    return $resource('http://floating-tor-67033.herokuapp.com/roles/:id', {id: "@id"});
})

.factory('Genre', function($resource, $http){
  return $resource('http://floating-tor-67033.herokuapp.com/genres/:id', {id: "@id"});
})

.service('BlankService', [function(){
}]);