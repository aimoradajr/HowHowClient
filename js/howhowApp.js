app = angular.module('howhowApp',['ngRoute','ngMaterial','ngFileUpload']);

app.config(function($routeProvider) {
   $routeProvider
    .when("/", {
        templateUrl : "login.html",
        controller: "howhowCtrl"
    })
    .when("/admin", {
        templateUrl : "admin.html",
        controller: "howhowCtrl"
    })
    .when("/how", {
        templateUrl : "how.html",
        controller: "howhowCtrl"
    })
    .when("/addHow", {
        templateUrl : "addHow.html",
        controller: "howhowCtrl"
    })
    .when("/editHow", {
        templateUrl : "editHow.html",
        controller: "howhowCtrl"
    })
    .when("/search", {
        templateUrl : "search.html",
        controller: "howhowCtrl"
    })
    .otherwise({
        templateUrl : "main.html",
        controller: "howhowCtrl"
    });
});

app.factory('MyGlobals', function(){

	var property = {
	  	showSearch: false,
	  	isAdmin: false,
	  	username: "admin",
	  	userpassword: "admin",
	  	currentHow: {}
  	 };

	return {
	    getProperty: function () {
	        return property;
	    },
	    setProperty: function(value) {
	        property = value;
	    }
	};
});