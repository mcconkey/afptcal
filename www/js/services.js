angular.module('starter.services', [])

.factory('localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('ptCharts', function($http) {
  
 var charts, procCharts = {};
 var procCharts = {};
 var tmpChart = {};

   /*
  *  helper function getMax returns the highest (first) key value a given 
  * key-> value style object 
  * @param obj scores
  * @return int maxKey  
  */

  var getMax =  function (scores) {
        var initial = 0;
        var maxKey = '';  
        for(var key in scores){
          if(scores[key] > initial){
            initial = scores[key];
            maxKey = key;
          }
        } 
        return maxKey;
  };

  /*
  * helper function getMin returns the lowest (last) key value a given 
  * key-> value style object
  * @param obj scores
  * @return int max  
  */

  var getMin = function (scores){
        var initial = '';
        var minKey = '';  
        for(var key in scores){
          if(initial == '' || scores[key] < initial){
            initial = scores[key];
            minKey = key;
          }
        } 
        return minKey;
  };

  return {
      getCharts: function () {
        return $http.get('/json/scoresheets.json').then(function(response){
          charts = response["data"];
          //console.log('loaded charts... ' + JSON.stringify(charts));
          
           // now just need to process the charts to a usable format
          angular.forEach(charts, function (value, key) {
              //this first iteration should be all the Charts (e.g. male_run_under30)
              //console.log('key: '+ JSON.stringify(key));
              //console.log('value: '+ JSON.stringify(value));
               procCharts[key] = {
                  "cardio": {},
                  //"cardio": [],
                  "pushups": value["pushups"],
                  "situps": value["situps"],
                  "bodyComp": value["bodyComp"]
               };


              angular.forEach(value["cardio"], function(score, time){
                //this should transform the mm:ss time into total seconds
               // console.log('time: '+ JSON.stringify(time));
               //console.log('score: '+ JSON.stringify(score));

                var time_r = time.split(':');
                var seconds  = parseInt(time_r[0]) * 60 + parseInt(time_r[1]);
               // console.log('calculated seconds: ' + seconds + ' from ' + time);

             //  procCharts[key]["cardio"].push({"time": seconds, "score": score}); 
                 procCharts[key]["cardio"][seconds] = score;
              });

          });

         // console.log('tried to process charts: ' + JSON.stringify(procCharts));
          return true;
        })
      },


      /*
      * function getMinMaxes returns an object with the mins and
      * maxes from the chart specified by parameter chartChosen
      * @param str chartChosen
      * @return obj MinMaxes  
      */
      getMinMaxes: function (chartChosen) {
        //console.log('in getMinMaxes ' + chartChosen)
        var chart = procCharts[chartChosen];
        var minMaxes = {};
        angular.forEach(chart, function (value, key) {
         // console.log('key: '+ key + ' value: '+ JSON.stringify(value));
          minMaxes[key] = {
            "max": {},
            "min": {}
          };
          minMaxes[key]['max'] = getMax(value);
          minMaxes[key]['min'] = getMin(value);
        });
        return minMaxes;
       // console.log('THIS IS MIN MAX: \n' + JSON.stringify(minMaxes));
      },

      getRunScore: function (runTime, chartChoosen) {
        //find the correct chart..
        //console.log('get runRunScore called pcharts: (' + chartChoosen + ') ' + JSON.stringify(procCharts[chartChoosen]["cardio"]));
        var chart = procCharts[chartChoosen]["cardio"];
 
       /*
       Runtime: 11min
       Goes to first row.... which it is more than... so go to the next
       Go until this the chart time is higher than... then go back one.
       */ 
/*
       for(var i = 0; i < chart.length; i++){
          if(runTime > chart[i]["time"]){
            //console.log('inside loop :' + JSON.stringify(chart[i]));
          }else{
            return chart[i]["score"];
          }
       }*/
        //returnt he score form the value jsut before

        for(var key in chart){
          if(runTime > key){
            //console.log('absize '+ abSize+ ' key: ' + key + ' value: ' + chart[key] )
          }else{
          //  console.log('returning: ' + chart[key])
            return parseFloat(chart[key]);
          }
        }


      },

      getAbScore: function (abSize, chartChoosen) {
         /*
          EX: bodycomp = 35
         */
         var chart = procCharts[chartChoosen]["bodyComp"];


        for(var key in chart){
          if(abSize > parseFloat(key)){
            //console.log('absize '+ abSize+ ' key: ' + key + ' value: ' + chart[key] )
          }else{

            return parseFloat(chart[key]);
          }
        }

        // return score of 0 if did not find score...
        return 0;
      },
      getPushupScore: function (pushups, chartChoosen) {
        var chart = procCharts[chartChoosen]["pushups"];
        
        //console.log('pushups in getPushupScore '+ pushups); 
        //console.log(JSON.stringify(procCharts[chartChoosen]));

        for(var key in chart){
          if(pushups > parseFloat(key)){
            //console.log('pushups '+ pushups + ' key: ' + key + ' value: ' + chart[key] )
          }else{
           //console.log('pushup returning: ' + chart[key])
            return parseFloat(chart[key]);
          }
        }
      },
      
      getSitupScore: function (situps, chartChoosen){
        var chart = procCharts[chartChoosen]["situps"];
        
        //console.log('pushups in getPushupScore '+ situps); 
        //console.log(JSON.stringify(procCharts[chartChoosen]));

        for(var key in chart){
          if(situps > parseFloat(key)){
            //console.log('pushups '+ pushups + ' key: ' + key + ' value: ' + chart[key] )
          }else{
           // console.log('situp returning: ' + chart[key])
            return parseFloat(chart[key]);
          }
        }
      }     

  };

});



