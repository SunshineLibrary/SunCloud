;(function(win, ng, undefined){
    angular.module('d3Pie', [])
        .directive('d3Pie', function() {
            return {
                restrict: 'AE',
                transclude: true,
                scope: {
                    max: '@',
                    value: '@'
                },
                controller: ['$scope', '$element', '$location', '$http', '$attrs',function($scope, $element, $location, $http, $attrs) {
                    //var $element = {
                    //    get: function(){
                    //        return angular.element;
                    //    }
                    //
                    //};
                    var width     = 250,
                        height    = 270,
                        value     = parseInt($attrs.value)   || 0,
                        max       = parseInt($attrs.max)    || 100,

                        twoPi     = 2 * Math.PI,
                        progress  = 0,
                        format    = '$value / $max + "%" ';

                    var arc = d3.svg.arc()
                        .startAngle(0)
                        .innerRadius(70)
                        .outerRadius(80);

                    var svg = d3.select(angular.element($element)).append("svg")
                        .attr("width", width)
                        .attr("height", height);


                    var warpper = svg.append("g")
                        .attr('fill', '#fff')
                        .attr("transform", "translate(" + width / 2 + "," + (height / 2 - 20) + ")");


                    var titleWarpper = svg.append("g");

                    var title = titleWarpper.append("text")
                        .attr('dx', "7em")
                        .attr("dy", "13em")
                        .attr("text-anchor", "middle")
                        .attr("font-size","18")
                    //="" ="" =""
                    if($attrs.tooltip){
                        var tooltips = titleWarpper.append("text")
                            .attr("text-anchor", "middle")
                            .attr("dx", "11.5em")
                            .attr("dy", "13em")
                            .attr('class', "pie-tooltips")
                            .attr("font-size","18")
                            .attr("title", $attrs.tooltip)
                            .attr("data-toggle", "tooltip")
                            .attr("data-placement", "left")
                            .text('(?)')
                    }
                    // .text($attrs.text);

                    var meter = warpper.append("g")
                        .attr("class", "pie-inner");

                    meter.append("path")
                        .attr("class", "background")
                        .attr("d", arc.endAngle(twoPi));

                    var foreground = meter.append("path")
                        .attr("class", "foreground");

                    var text = meter.append("text")
                        .attr("text-anchor", "middle")
                        .attr("dy", ".35em")
                        .attr("font-size","36")

                    $attrs.$observe('caption', function(t) {
                        title.text(t);
                    });

                    $attrs.$observe('text', function(t){
                        text.text(t);
                    });

                    var animate = function(percentage){
                        var i = d3.interpolate(progress, percentage);
                        d3.select(angular.element($element[0]))
                            .transition()
                            .delay(300)
                            .duration(800)
                            .tween("progress", function () {
                                return function (t) {
                                    progress = i(t);
                                    foreground.attr("d", arc.endAngle(twoPi * progress));
                                    if(!$attrs.text){
                                        text.text(Math.floor(progress * 100) + '%');
                                    }
                                };
                            });
                    };

                    //animate(value / max);

                    $attrs.$observe('value', function(v) {
                        var per = parseInt($attrs.value) / parseInt($attrs.max);
                        animate(isNaN(per) ? 0 : per);
                    });
                    $attrs.$observe('max', function(max) {
                        var per = parseInt($attrs.value) / parseInt($attrs.max);
                        animate(isNaN(per) ? 0 : per);
                    });

                    $(document).on('mouseover', '.pie-tooltips', function(){
                        var pos = $(this).position();
                        var $tooltip = $('.tooltip');

                        var tooltipInner = $tooltip.find('.tooltip-inner');
                        tooltipInner.text($(this).attr('title'));

                        var R = $tooltip.width() / 2;
                        var height = $tooltip.height();

                        pos.left = pos.left - (R - 8);
                        pos.top = pos.top - (height + 8);
                        if($(this).attr('title')){
                            $tooltip.show();
                            $tooltip.css(pos).addClass('in');
                        }

                    }).on('mouseout', '.pie-tooltips', function(){
                        $('.tooltip').removeClass('in').hide();
                    });

                }],
                template: ''
            };
        })

})(window, angular);
