angular.module('starter.controllers',[])
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


})//

.controller('homeCtrl', function($scope, $ionicModal, $http, $state) {
  // Form data for the login modal
  $scope.registerData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalOne = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeRegister = function() {
    $scope.modalOne.hide();
  };

  // Open the login modal
  $scope.register = function() {
    $scope.modalOne.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doRegister = function(form){
    var data = { zipcode: form.zip.$modelValue, username: form.username.$modelValue, password: form.password.$modelValue}
    console.log(data);

    $http({url:"http://floating-tor-67033.herokuapp.com/users",
           method: 'POST',
           data: { zipcode: form.zip.$modelValue, username: form.username.$modelValue, password: form.password.$modelValue}}).success(function(response){
      window.localStorage['id'] = response.id;
      $state.go('app.profile');
      $scope.closeRegister();
    }).error(function(errorData){
      console.log(errorData);
    })
    // window.localStorage['user_id'] = "1"
    // console.log('an attempt was made.')
    // $http.get(`http://localhost:3000/users/${window.localStorage['user_id']}`).then(function(response){
    //   console.log(response.data.id)
    // })
  };

   // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(form){
    var data = { username: form.username.$modelValue, password: form.password.$modelValue}
    console.log(data);

    $http({url:"http://floating-tor-67033.herokuapp.com/login",
           method: 'POST',
           data: { username: form.username.$modelValue, password: form.password.$modelValue}}).success(function(response){
      window.localStorage['id'] = response.id;
      $state.go('app.profile');
      $scope.closeLogin();
    }).error(function(errorData){
      console.log(errorData);
    })
    // window.localStorage['user_id'] = "1"
    // console.log('an attempt was made.')
    // $http.get(`http://localhost:3000/users/${window.localStorage['user_id']}`).then(function(response){
    //   console.log(response.data.id)
    // })
  };

})

.controller('picksCtrl', function($scope, $http, User, Pick) {
  $scope.$on('$ionicView.enter', function(e){
    var userId = window.localStorage['id'];
    $scope.picks = Pick.query({id: userId});
  });
})//

.controller('profileCtrl', function($scope, $resource, $http, ArtistRole, Genre, User, LoggedInUser) {
  //TO DO: Put in correct variables to get user data from form
  $scope.$on('$ionicView.enter', function(e){
    var userId = window.localStorage['id'];
    $scope.user = User.get({id: userId});
    $scope.roles = ArtistRole.query({id: userId});
    //in following line, changed to GenreSelection and added user id
    $scope.genres = GenreSelection.query({id: userId});
    // console.log($scope.roles);
  });

  $scope.doConnect = function() {
    var userId = window.localStorage['id'];
    window.open(`https://floating-tor-67033.herokuapp.com/soundcloud/connect/${userId}`, '_system')
  };

  $scope.doOpen = function(linkUrl) {
    window.open(linkUrl, '_system')
  };
})//


.controller('editProfileCtrl', function($state, $scope, $http, Role, Genre, User, LoggedInUser) {
  $scope.$on('$ionicView.enter', function(e){
    $scope.responseMsg = "";
    var userId = window.localStorage['id'];
    $scope.user = User.get({id: userId});
    $scope.roles = Role.query();
    $scope.genres = Genre.query();

    //When "edit my role" or "edit my searched roles" is clicked
    //route to those forms
    $scope.getEditMyRolesForm = function(){
      // window.localStorage['id'] = response.id;
      $state.go('app.edit-my-roles');
    };//edit

    $scope.getEditSearchedRolesForm = function(){
      // window.localStorage['id'] = response.id;
      $state.go('app.edit-search-roles');
    };//edit searched

    $scope.doEditProfile = function(form){
      var edits = { username: form.username.$modelValue, zipcode: form.zipcode.$modelValue, description: form.description.$modelValue}
      console.log(edits);

      var userId = window.localStorage['id'];

     User.update({id: userId}, edits)
        .$promise.then(function(response){
          // console.log(response.status);
          $scope.responseMsg = response.status;
        }, function(error){
            $scope.responseMsg = error.status;
        });

      //when user leaves edit-profile view, reset form
      //  $scope.$on("$destroy", function(){
      //   // $state.go("app.edit-profile", {}, {reload:true});
      //   $ionicHistory.clearCache();
      //   $scope.responseMsg = "";
      //   // .then(function(){ $state.go('app.fooState') });
      // });
    };//doEditProfile()
  });//scope.on
})//


.controller('editMyRolesCtrl', function($state, $scope, $http, Role, ArtistRole) { //, filterFilter) {

  // $scope.compare = function(role) {
  //   if (filterFilter($scope.myRoles, {
  //     id: role.id
  //   }).length > 0 ) {
  //     return true;
  //   }
  // }
  $scope.$on('$ionicView.enter', function(e){
    var userId = window.localStorage['id'];
    // $scope.myRoles = ArtistRole.query({id: userId});
    // console.log($scope.myRoles);
    $scope.roles = Role.query();

    $scope.cancelMyRoles = function() {
      $state.go('app.edit-profile');
    }

    $scope.saveMyRoles = function(form) {
      $http({url:`http://floating-tor-67033.herokuapp.com/users/${userId}/roles`,
               method: 'delete'
             })
      var saveData = {};
      for (var role of $scope.roles) {
        if (role.checked === true) {
          saveData['id'] = role.id;

          console.log(saveData['id']);

          $http({url:`http://floating-tor-67033.herokuapp.com/users/${userId}/roles/${saveData['id']}`,
                 method: 'PUT'
               }).success(function(response){
            $state.go('app.edit-profile');
          }).error(function(errorData){
            // console.log(errorData);
          })
        }
      }
    }
  })
})//

.controller('editSearchRolesCtrl', function($state, $scope, $http, Role, SearchRole) { //, filterFilter) {

  // $scope.compare = function(role) {
  //   if (filterFilter($scope.searchRoles, {
  //     id: role.id
  //   }).length > 0 ) {
  //     return true
  //   }
  // }

  $scope.$on('$ionicView.enter', function(e){
    var userId = window.localStorage['id'];
    // $scope.myRoles = SearchRole.query({id: userId});
    // console.log($scope.myRoles);
    $scope.roles = Role.query();

    $scope.cancelSearchedRoles = function() {
      $state.go('app.edit-profile');
    }

    $scope.saveSearchedRoles = function(form) {
      $http({url:`http://floating-tor-67033.herokuapp.com/users/${userId}/searched_roles`,
               method: 'delete'
             })
      var saveData = {};
      for (var role of $scope.roles) {
        if (role.checked === true) {
          saveData['id'] = role.id;

          console.log(saveData['id']);

          $http({url:`http://floating-tor-67033.herokuapp.com/users/${userId}/searched_roles/${saveData['id']}`,
                 method: 'PUT'
               }).success(function(response){
            $state.go('app.edit-profile');
          }).error(function(errorData){
            // console.log(errorData);
          })
        }
      }
    }
  })
})//

.controller('editMyGenresCtrl', function($state, $scope, $http, Genre, ArtistGenre) {
  $scope.$on('$ionicView.enter', function(e){
    var userId = window.localStorage['id'];
    $scope.myGenres = ArtistGenre.query({id: userId});
    $scope.genres = Genre.query();

    $scope.cancelMyGenres = function() {
      $state.go('app.edit-profile');
    }

    $scope.saveMyGenres = function(form) {
      $http({url:`http://floating-tor-67033.herokuapp.com/users/${userId}/genres`,
               method: 'delete'
             })
      var saveData = {};
      for (var genre of $scope.genres) {
        if (genre.checked === true) {
          saveData['id'] = genre.id;

          console.log(saveData['id']);

          $http({url:`http://floating-tor-67033.herokuapp.com/users/${userId}/genres/${saveData['id']}`,
                 method: 'PUT'
               }).success(function(response){
            $state.go('app.edit-profile');
            // $scope.closeRegister();
          }).error(function(errorData){
            // console.log(errorData);
          })
        }
      }
    }
  })
})//

.controller('editSearchGenresCtrl', function($state, $scope, $http, Genre, SearchGenre) {
  $scope.$on('$ionicView.enter', function(e){
    var userId = window.localStorage['id'];
    $scope.searchGenres = SearchGenre.query({id: userId});
    $scope.genres = Genre.query();

    $scope.cancelSearchGenres = function() {
      $state.go('app.edit-profile');
    }

    $scope.saveSearchGenres = function(form) {
      $http({url:`http://floating-tor-67033.herokuapp.com/users/${userId}/genres`,
               method: 'delete'
             })
      var saveData = {};
      for (var genre of $scope.genres) {
        if (genre.checked === true) {
          saveData['id'] = genre.id;

          console.log(saveData['id']);

          $http({url:`http://floating-tor-67033.herokuapp.com/users/${userId}/genres/${saveData['id']}`,
                 method: 'PUT'
               }).success(function(response){
            $state.go('app.edit-profile');
            // $scope.closeRegister();
          }).error(function(errorData){
            // console.log(errorData);
          })
        }
      }
    }
  })
})//

.controller('startPickingCtrl', function($scope) {
  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    // data.slider is the instance of Swiper
    $scope.slider = data.slider;
  });

  $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    console.log('Slide change is beginning');
  });

  $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
    // note: the indexes are 0-based
    $scope.activeIndex = data.activeIndex;
    $scope.previousIndex = data.previousIndex;
  });
})//

//factory example using resources
.controller('rolesCtrl', function($scope, Role) {
  //get all roles
  // $scope.roles = Role.query();
  // console.log($scope.roles);
  // //get one roll
  // $scope.role = Role.query({id: 1});
  // console.log($scope.role);
})//

//Cards Controller - Start Picking
.controller('CardsCtrl', function ($scope, $http, $ionicLoading, $ionicSideMenuDelegate, TDCardDelegate, SearchRole) {
  $scope.$on('$ionicView.enter', function(e){
    console.log('CARDS CTRL');
    $ionicSideMenuDelegate.canDragContent(false);
    // var cardTypes = [];
    // $http.get('https://randomuser.me/api/?results=5').success(function (response) {
    //     angular.forEach(response.results, function (famous) {
    //       cardTypes.push(famous);
    //       console.log(JSON.stringify(famous));
    //     });
    //     $ionicLoading.hide();
    //   }).error(function (err) {
    //     console.log(err);
    //   });

    //$scope.cards = Array.prototype.slice.call(cardTypes, 0);
    var userId = window.localStorage['id'];
    $scope.cards = SearchRole.query({id: userId});
    console.log($scope.cards)
    $scope.cardDestroyed = function(index) {
      $scope.cards.splice(index, 1);
    };

    $scope.addCard = function() {
      var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
      newCard.id = Math.random();
      $scope.cards.push(angular.extend({}, newCard));
    };

    $scope.yesCard = function() {
      console.log('YES');
      $scope.addCard();
    };

    $scope.noCard = function() {
      console.log('NO');
      $scope.addCard();
    };
    $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
    };
  })
})//


.controller('CardCtrl', function($scope, TDCardDelegate) {
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard();
  };
})//
