app.controller('howhowCtrl',function($scope,$http,$location,MyGlobals,Upload){
	$scope.apiaddress =  "192.168.254.123";
	$scope.apiport =  "8080";

	// login
	$scope.globvars = MyGlobals.getProperty();
	console.log($scope.globvars);
	$scope.hows = [];

	// adding new howto
	$scope.addHowTitle = "";
	$scope.addHowSteps = [{}];

	$scope.goLogin = function(){
		// cheating!
		if($scope.globvars.username=="admin")
		{
			if($scope.globvars.userpassword=="admin")
			{
				// set globals
				$scope.globvars.isAdmin = true;
				$scope.globvars.showSearch = true;
				MyGlobals.setProperty($scope.globvars);

				console.log($scope.globvars);

				$scope.showMain();
				return;
			}
		}
		
		alert('no user');
	};

	$scope.goLoginGuest = function(){
		// cheating!
		$scope.globvars.username="";
		$scope.globvars.userpassword="";
		$scope.globvars.isAdmin = false;
		$scope.globvars.showSearch = true;
		MyGlobals.getProperty($scope.globvars);
		$scope.showMain();
	};

	$scope.go = function ( path ) {
		$location.path( path );
	};

	$scope.showMain = function(how){
		MyGlobals.showSearch = true;
		$location.path( "/main" );
	};

	$scope.showHow = function(how){
		$scope.globvars.currentHow = how;
		MyGlobals.setProperty($scope.globvars);

		$location.path( "/how" );
	};

	$scope.addHowAddStep = function(){
		$scope.addHowSteps.push({});
	}

	$scope.editHowAddStep = function(){
		$scope.globvars.currentHow.steps.push({});
	}

	$scope.processAddHowForm = function()
	{
		console.log('sending form');

		console.log($scope.addHowTitle);

		var sendMe = {};
		var newhow = {
			title: "temptemp"
		};

		newhow.title= "asds";
		newhow.title = $scope.addHowTitle;
		newhow.image_icon = $scope.addHowTitleImage;
		newhow.steps = $scope.addHowSteps;

		sendMe.new_how = newhow;

		$http({
		method  : 'POST',
		url     : 'http://'+$scope.apiaddress+':'+$scope.apiport+'/howhow/api/hows',
		data    : sendMe,  // pass in data as strings
		headers : { 'Content-Type': 'application/json; charset=utf-8' }  // set the headers so angular passing info as form data (not request payload)
		})
		.success(function(data) {
			console.log("ADD HOW: SUCCESS: ret: ",data);
	        $scope.showMain();
		});
	};

	$scope.processEditHowForm = function()
	{
		console.log('sending form');

		console.log($scope.globvars.currentHow.title);

		var sendMe = {};
		var newhow = $scope.globvars.currentHow;

		sendMe.new_how = newhow;

		$http({
			method  : 'PUT',
			url     : 'http://'+$scope.apiaddress+':'+$scope.apiport+'/howhow/api/hows/'+$scope.globvars.currentHow._id,
			data    : sendMe,  // pass in data as strings
			headers : { 'Content-Type': 'application/json; charset=utf-8' }  // set the headers so angular passing info as form data (not request payload)
		})
		.success(function(data) {
			console.log("EDIT HOW: SUCCESS: ret: ",data);
	        $scope.showHow($scope.globvars.currentHow);
		});
	};

	$scope.goSearch = function(){
		MyGlobals.setProperty($scope.globvars);

		$scope.go('/search');

		$http.get('http://'+$scope.apiaddress+':'+$scope.apiport+'/howhow/api/hows/search?search_text='+$scope.globvars.search_how_text).
	        then(function(response) {
	           $scope.search_res_hows = response.data;
	            console.log("SEARCH: SUCCESS: hows return: ",$scope.hows);
	        });
	}

	$scope.removeHow = function(how){
		if(!confirm('Are you sure you want to delete?'))
			return;

		var howid = how._id;

		$http.delete('http://'+$scope.apiaddress+':'+$scope.apiport+'/howhow/api/hows/'+howid).
        then(function(response) {
            $scope.hows = response.data;
            console.log($scope.hows);

        	$scope.showMain();
        });
	};

	$scope.showEditHow = function(how){
		var howid = how._id;

		$scope.globvars.currentHow = how;
		MyGlobals.setProperty($scope.globvars);

		$location.path( "/editHow" );
	};

	$scope.upvoteHow = function(){
		$scope.globvars.currentHow.upvotes = $scope.globvars.currentHow.upvotes || 0;
		$scope.globvars.currentHow.upvotes++;

		$scope.enableUpvote = false;
		$scope.processEditHowForm();
	};

	$scope.enableUpvote = true;


	$scope.showHows = function(){
		console.log('getting list of howtos');
		$http.get('http://'+$scope.apiaddress+':'+$scope.apiport+'/howhow/api/hows').
	        then(function(response) {
	            $scope.hows = response.data;
	            console.log($scope.hows);
	        });
    };

	$scope.showHows();

	$scope.imageFilenames = [];

	// file upload
    $scope.upsubmit = function(){ //function to call on form submit
    	console.log('submitting file',$scope.upload_form.upfile,$scope.upfile);
        if ($scope.upload_form.upfile.$valid && $scope.upfile) { //check if from is valid
            $scope.upupload($scope.upfile); //call upload function
        }
        else{
        	console.log('invalid file to upload');
        }
    }
    $scope.upupload = function (file) {
        Upload.upload({
            url: 'http://'+$scope.apiaddress+':'+$scope.apiport+'/howhow/api/uploads', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: filename:'+resp.data.filename);
                $scope.imageFilenames.push(resp.data.filename);
            } else {
                console.log('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.upprogress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
});