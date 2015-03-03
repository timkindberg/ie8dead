'use strict';

var app = angular.module('myApp', []);

app.controller("mainController", function($scope, $http){
  var self = this;

  $http.get('data.json').success(function(data){
    console.log(data);
    self.json = data.data;
  })
});

app.filter("supportedByAllBrowsers", function(){

  var krogerSupportedBrowsers = [
    { browser: 'ie',      version: '11' },
    { browser: 'firefox', version: '35' },
    { browser: 'chrome',  version: '40' },
    { browser: 'safari',  version: '8'  },
    { browser: 'ios_saf', version: '8.1'},
    { browser: 'android', version: '37' },
    { browser: 'and_chr', version: '40' }
  ];

  return function(items){
    return _.filter(items, function(item){
      return _.every(krogerSupportedBrowsers, function(support){
        return item.stats[support.browser][support.version].charAt(0) === 'y'
            || item.stats[support.browser][support.version].charAt(0) === 'a';
      })
    });
  }
});

app.filter("ieSupportImproved", function(){
  return function(items){
    return _.filter(items, function(item){
      var ie8support = item.stats.ie['8'].charAt(0);
      var ie11support = item.stats.ie['11'].charAt(0);
      return (ie8support === 'n' && (ie11support === 'a' || ie11support === 'y'))
          || (ie8support === 'a' && ie11support === 'y')
    });
  }
});

app.filter('groupBy', ['$parse', '$filter', function ($parse, $filter) {

  return function (items, groupBy, orderByInGroup, firstInGroupAttr) {

    if(items.length == 0) return;

    var orderedItems = $filter("orderBy")(items, [groupBy, orderByInGroup]);

    var groupedItems = [];
    var previousItem = null;

    // loop through each item in the items
    angular.forEach(orderedItems, function (item, i) {

      var firstInGroup = false;

      // if the first item OR this item's group is different than the prev item
      if (!previousItem || $parse(groupBy)(previousItem) !== $parse(groupBy)(item)) {
        firstInGroup = true;
      }

      // if the group changed, then add a new field to the item to indicate this
      item[firstInGroupAttr || 'firstInGroup'] = firstInGroup;
      groupedItems.push(item);
      previousItem = item;
    });

    return groupedItems;
  };
}]);
