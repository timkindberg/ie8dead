'use strict';

var app = angular.module('myApp', []);

app.config(function($sceProvider){
  $sceProvider.enabled(false);
});

app.controller("mainController", function($scope, $http, $sce){
  var self = this;

  var myComments = [
    { feature: "CSS Generated content for pseudo-elements", text: "I use these all the time!"},
    { feature: "calc() as CSS unit value", text: "So handy in certain situations, we already used it to position the dropdown in the main nav."},
    { feature: "CSS3 Multiple backgrounds", text: "Now you can compose a divs background from multiple images, colors and gradients in a single css property. That's pretty convenient."},
    { feature: "CSS3 Multiple column layout", text: "Though it's a tad buggy, its super convenient for simpler column requirements"},
    { feature: "CSS Repeating Gradients", text: "Finally! Right? I think we can safely assume this is the most important new feature."},
    { feature: "CSS3 3D Transforms", text: "Not only can we now do transitions, but we can do cool 3D ones.... oooooooo.... aaaaaaaaahh."},
    { feature: "CSS3 selectors", text: "I was addicted to these already but always had to have fallback for IE, no more!"},
    { feature: "CSS3 Transitions", text: "Just nice to know that transitions will be experienced by all users now, so we can build that into our experience with confidence that it's supported"},
    { feature: "Flexible Box Layout Module", text: '<img src="http://cdn.meme.am/instances/250x250/57839195.jpg"/>'},
    { feature: "rem (root em) units", text: "rem units are fluid unit that we should start to use instead of px"},
    { feature: "Viewport units: vw, vh, vmin, vmax", text: "These can come in real handy when a deeply nested dom element needs to size or position itself relative to the size of the view (aka window)"},
    { feature: "async attribute for external scripts", text: "We don't need this now because we use requirejs, but it's really handy."},
    { feature: "defer attribute for external scripts", text: "We don't need this now because we use requirejs, but it's really handy."},
    { feature: "querySelector/querySelectorAll", text: "This could be great for projects that don't have jquery, it's basically a native $() selector"},
    { feature: "input placeholder attribute", text: "It's just typically good UX to use placeholders, now all users get this"},
    { feature: "Web Sockets", text: "Websockets are faster and more feature rich than REST. We should keep looking into ways to use it."},
    { feature: "Content Security Policy 1.0", text: "A good tool for security"},
    { feature: "ECMAScript 5 Strict Mode", text: "It's like a linter built right into your chrome dev tools!"},
    { feature: "HTTP/2 protocol / SPDY", text: "A faster web site is always good"},
    { feature: "SVG in HTML img element", text: "I've wanted to use SVG for a while... in reality we should start using wherever possible. It's vector so it draws faster at any resolution with a comparable file size to raster images."}
  ];

  self.comment = function(feature){
    return _.findWhere(myComments, {feature: feature.title});
  };

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
