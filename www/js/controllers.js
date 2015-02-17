angular.module('starter.controllers', [])

.controller('CalculatorCtrl', function($scope, $timeout, ptCharts, localstorage) {

  $scope.data = {
    'score' : '00.0',
    'runTime': "9:00",
    'runMax': '200',
    'runTimeSec': 600,
    'bodyCompSlider': 16,
    'bodyComp': 0,
    'sliderValue': 800,
    'pushUpSlider': 37,
    'sitUpSlider': 37,
    'bodyCompScore': 0,
    'pushupScore': 0,
    'situpScore': 0,
    'runScore': 0,
    'allPassed': true,
    'cc': 'male_run_under30',
    'cc_display': 'Male under 30',
    'minMax': {},
    'settings': {
      'sexToggle': true,
      'displaySex': 'Male',
      'runExempt': false,
      'situpExempt': false,
      'pushupExempt': false,
      'bodyCompExempt': false,
      'walkExempt': false
    }
  };

  $scope.$watch($scope.data.settings, function(){
  //$scope.$watch(function() { return $scope.data.settings}, function(){
    //console.log('changing settings');
    localstorage.setObject('settings', $scope.data.settings);
  }, true);
  /*
  * Grabs the ptCharts via the ptCharts service and then
  * fires the getMinMax for the first time
  */
  ptCharts.getCharts().then(
    function () {
      $scope.data.minMax = ptCharts.getMinMaxes($scope.data.cc);
      calculateScore();
      //console.log('this is min max: ' + JSON.stringify($scope.data.minMax));
    }, 
    function (){
      console.log('failed to load charts!')
    });

  // $scope.data.minMax = ptCharts.getMinMaxes($scope.data.cc);
    console.log('this is min max: ' + JSON.stringify($scope.data.minMax));
  
  //This will be called everytime a view is changed
  $scope.$on('$stateChangeSuccess', function () {
    //get settings form local storage
    $scope.data.settings = localstorage.getObject('settings');
    console.log('changeState: '+ JSON.stringify($scope.data.settings))
    $scope.data.cc = buildChosenChart();
    $scope.data.minMax = ptCharts.getMinMaxes($scope.data.cc);
  });



  // based on which options are clicked pick the right ptChart
  var buildChosenChart = function() {
     age = '30to39';
    switch(Number($scope.data.settings.ageSlider)){
      case 0:
        age = 'under30';
        break;
      case 1:
        age = '30to39';
        break;
      case 2:
        age = '40to49';
        break;
      case 3:
        age = '50to59';
        break;
      case 4:
        age = 'above59';
        break;
    }
    $scope.data.cc_display = ($scope.data.settings.sexToggle ? 'Male ' : 'Female ') + age;
    return ($scope.data.settings.sexToggle ? 'male_' : 'female_') + 'run_' + age;
  };

  $scope.selectMan = function() {
    //console.log('man button clicked!');
    $scope.data.settings.sexToggle = true;
    $scope.data.settings.displaySex = 'Male';
    $scope.data.cc = buildChosenChart();
    console.log($scope.data.cc);
    $scope.data.minMax = ptCharts.getMinMaxes($scope.data.cc);
    //setup();
  };

  $scope.selectWoman = function(){
    $scope.data.settings.sexToggle = false;
    $scope.data.settings.displaySex = 'Female';
    $scope.data.cc = buildChosenChart();
    $scope.data.minMax = ptCharts.getMinMaxes($scope.data.cc);
    //setup();
  };

  var calculateScore = function() {

    var cc = $scope.data.cc; //until selector thing is built just use the one chart for testing
   
    $scope.data.bodyComp = 20 + ($scope.data.bodyCompSlider / 2);
    $scope.data.bodyCompScore = ptCharts.getAbScore($scope.data.bodyComp, cc);
    $scope.data.runScore = ptCharts.getRunScore($scope.data.runTimeSec, cc);
    $scope.data.pushupScore = ptCharts.getPushupScore($scope.data.pushUpSlider, cc);
    $scope.data.situpScore = ptCharts.getSitupScore($scope.data.sitUpSlider, cc);

    $scope.data.allPassed = (!$scope.data.bodyCompScore ||
      !$scope.data.runScore ||
      !$scope.data.pushupScore ||
      !$scope.data.situpScore) ? false : true;


    
    console.log("abScore: " + $scope.data.bodyCompScore 
      + " runScore: " + $scope.data.runScore
      + " pushup: "+ $scope.data.pushupScore
      + " situp: "+ $scope.data.situpScore);

    $scope.data.score = ($scope.data.runScore 
      + $scope.data.bodyCompScore 
      + $scope.data.pushupScore 
      + $scope.data.situpScore).toFixed(1);
    //console.log('PT score: '+ $scope.data.score);
  };

  var calculateRunTime = function(){
    //console.log('calculateRuntime called:' + $scope.data.sliderValue);
    var time =  parseInt($scope.data.sliderValue); 
    $scope.data.runTimeSec = time;

    var minutes = Math.floor(time / 60);
    time -= minutes * 60;
    var seconds = parseInt(time % 60, 10);
    $scope.data.runTime = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
    console.log($scope.data.runTime);
  };



  var timeoutId = null;

  //Watch for Run Slider
  $scope.$watch('data.sliderValue', function() {
    //console.log('slider changed');

    if(timeoutId !== null){
      return;
    }

    timeoutId = $timeout(function() {
        $timeout.cancel(timeoutId);
        timeoutId = null;
        calculateRunTime();
        calculateScore();

    }, 400);

  })

   //Watch for Body comp slider
  $scope.$watch('data.bodyCompSlider', function() {
    //console.log('bodyCompchanged');

    if(timeoutId !== null){
      return;
    }

    timeoutId = $timeout(function() {
        $timeout.cancel(timeoutId);
        timeoutId = null;
        //calculateRunTime();
        calculateScore();

    }, 200);

  })

 //Watch for pushup slider
  $scope.$watch('data.pushUpSlider', function() {
   // console.log('pushuphanged');

    if(timeoutId !== null){
      return;
    }

    timeoutId = $timeout(function() {
        $timeout.cancel(timeoutId);
        timeoutId = null;
        //calculateRunTime();
        calculateScore();

    }, 200);

  })

 //Watch for situp slider
  $scope.$watch('data.sitUpSlider', function() {
   // console.log('pushuphanged');

    if(timeoutId !== null){
      return;
    }

    timeoutId = $timeout(function() {
        $timeout.cancel(timeoutId);
        timeoutId = null;
        //calculateRunTime();
        calculateScore();

    }, 200);

  })



})


.controller('OptionsCtrl', function($scope, $timeout, $stateParams, localstorage) {
 $scope.config = {
    'ageSlider': 0,
    'displayAge': 'under 30',
    'sexToggle': true,
    'displaySex': 'Male'
  };
  //$scope.displaySex = 'Male';

  $scope.$watch(function() { return $scope.config;}, function(){
    console.log('changing settings');
    localstorage.setObject('settings', $scope.config);
  }, true);
 
  var timeoutId = null;

  //changes value of displayAge when config.displayAge changes
  $scope.$watch('config.ageSlider', function() {
    //console.log('slider changed');

    if(timeoutId !== null){
      return;
    }


    timeoutId = $timeout(function() {
        $timeout.cancel(timeoutId);
        timeoutId = null;

        if($scope.config.ageSlider == 0){
          $scope.config.displayAge = 'Under 30';
        }else if($scope.config.ageSlider == 1){
          $scope.config.displayAge = '30 to 39';
        }else if($scope.config.ageSlider == 2){
          $scope.config.displayAge = '40 to 49';
        }else if($scope.config.ageSlider == 3){
          $scope.config.displayAge = '50 to 59';
        }else if($scope.config.ageSlider == 4){
          $scope.config.displayAge = 'Above 59';
        }
        
    }, 400);

  })

 //changes value of displayAge when config.displaySex changes
  $scope.$watch('config.sexToggle', function() {
    console.log('slider changed');
    //localstorage.setObject('settings', $scope.config);
    if(timeoutId !== null){
      return;
    }


   timeoutId = $timeout(function() {
      $timeout.cancel(timeoutId);
      timeoutId = null;
      if($scope.config.sexToggle == true){
        $scope.config.displaySex = 'Male';
      }else{
        $scope.config.displaySex = 'Female';
      }
   
    }, 200);

  }); 


});
