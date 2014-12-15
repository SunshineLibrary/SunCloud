;(function(win, ng, undefined){
angular.module('d3Rect', [])
  .directive('d3Rect', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {
        value: '@'
      },
      controller: ['$scope', '$element', '$location', '$http', '$attrs',function($scope, $element, $location, $http, $attrs) {

        var getAttrVal = function(name, defaults){
          return parseInt($attrs[name])||defaults;
        };

        var width = getAttrVal('width', 0);
        var height = getAttrVal('height', 0);

        var progress = 0;

        var svg = d3.select($element.get(0)).append("svg")
            .attr("width", width)
            .attr("height", getAttrVal('height', 0));


        var warpper = svg.append("g")
            .attr('fill', '#fff')

        var outter = warpper.append("rect")
            .attr('fill', '#f70')
            .attr('x', 0)
            .attr('width', width)
            .attr('height',getAttrVal('height', 0))

        var inner = warpper.append("rect")
            .attr('fill', '#ECF0F1')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', getAttrVal('height', 0))

        var animate = function(percentage){
          var i = d3.interpolate(progress, percentage);
          d3.select($element.get(0))
            .transition()
            .delay(300)
            .duration(800)
            .tween("progress", function () {
              return function (t) {
                  progress = i(t);
                  inner.attr('height', height - (height  * progress));
              };
          });
        }; 

        $attrs.$observe('max', function(max){
          animate(getAttrVal('value', 0) / getAttrVal('max', 100));
        });
        $attrs.$observe('value', function(v){
          animate(getAttrVal('value', 0) / getAttrVal('max', 100));
        });

      }],
      template: ''
    };
  })

})(window, angular);