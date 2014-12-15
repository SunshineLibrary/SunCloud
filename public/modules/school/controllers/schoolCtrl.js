angular.module('schoolManage')
    .controller('schoolController',
    [
        'SchoolDataProvider',
        'TeacherDataProvider',
        'RoomDataProvider',
        'StudentDataProvider',
        'TabletDataProvider',
        'school',
        '$scope',
        'AuthService',
        function
            (SchoolDataProvider, TeacherDataProvider,RoomDataProvider,StudentDataProvider, TabletDataProvider,school,$scope, AuthService) {
            $scope.editorEnabled = false;
            $scope.school = school;

            async.parallel({
                roomCount: function(callback) {
                    RoomDataProvider.getCountsOfRoomsBySchool(school._id, callback);
                },
                studentCount: function(callback) {
                    StudentDataProvider.getCountsOfStudentsBySchool(school._id, callback);
                },
                teacherCount: function(callback) {
                    TeacherDataProvider.getCountsOfTeachersBySchool(school._id, callback);
                },
                xiaoshuLogCount: function(callback) {
                    TabletDataProvider.getXiaoshuLogCountBySchool(school._id,  callback);
                },
                xiaoshuCount: function(callback) {
                    TabletDataProvider.getTabletCountBySchool(school._id,  callback);
                }
            }, function(err, results) {
                if(err) {
                    console.error(err);
                }else {
                    $scope.roomCount = results.roomCount;
                    $scope.studentCount = results.studentCount;
                    $scope.teacherCount = results.teacherCount;
                    $scope.xiaoshuLogCount = results.xiaoshuLogCount;
                    $scope.xiaoshuCount = results.xiaoshuCount;





                    var w = 200;
                    var h = 200;
                    var r = h/2;
                    var margin = {top: 0, right: 10, bottom: 80, left: 600 },
                        //width = 1000 - margin.left - margin.right,
                        //height = 450 - margin.top - margin.bottom,
                        width = 200,
                        height = 200,
                        radius = Math.min(width,height)/2;

                    var color = ["#FF4C00", "#E9E7EF"];
                    console.log(parseInt($scope.studentCount));


                    var data = [{"label":"登录晓书的人数", "value": parseInt($scope.xiaoshuLogCount)},
                        {"label":"未登录晓书的人数", "value": parseInt($scope.studentCount) - parseInt($scope.xiaoshuLogCount)}];

                    var percent = (data[0].value * 100 /(data[0].value + data[1].value)).toFixed(0);
                    //percent = Math.round(percent * 100) / 100;


                    var vis = d3.select('#chart').append("svg:svg").data([data])
                        .attr("width", width)
                        .attr("height", height)
                        .append("svg:g")
                        .attr("transform","translate(" + width / 2 + ","  + (height/2)+ ")");


                    var pie = d3.layout.pie().value(function(d){return d.value;});

// declare an arc generator function
                    var arc = d3.svg.arc().outerRadius(radius).innerRadius(80);

// select paths, use arc generator to draw
                    var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
                    arcs.append("svg:path")
                        .attr("fill", function(d, i){
                            return color[i];
                        })
                        .attr("d", function (d) {
                            // log the result of the arc generator to show how cool it is :)
                            console.log(arc(d));
                            return arc(d);
                        });

                    arcs.append("text")
                        .style("text-anchor","middle")
                        .style("fill", "#FF8000")
                        .style("font-family","Arial")
                        .style("font-size", "xx-large")
                        .text(percent+ "%");
// add the text
//                    arcs.append("svg:text").attr("transform", function(d){
//                        d.innerRadius = 0;
//                        d.outerRadius = r;
//                        return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
//                            return data[i].label;}
//                    );
                }

            });
            /**
             * Register watcher.
             */
            $scope.$watch('school', function (newSchool) {
                if (newSchool) {
                    $scope.school = school;
                    $scope.schoolNewName = school.name;
                }
            }, true);

            $scope.enableEditor = function() {
                $scope.editorEnabled = true;
                $scope.schoolNewName = $scope.school.name;
            };

            $scope.disableEditor = function() {
                $scope.editorEnabled = false;
            };

            $scope.editSchool = function () {
                if (($scope.schoolNewName == "") || ($scope.schoolNewName === undefined)) {
                    alert('请填写学校新名称');
                    return;
                }
                school.name = $scope.schoolNewName;
                console.log($scope.schoolNewName);
                SchoolDataProvider.editSchool(school, function (newSchool) {
                    $scope.school = newSchool;
                });
                $scope.isEditingSchoolName = false;
            };

            $scope.save = function() {
                //var newSchool = $scope.school;
                //newSchool.name = $scope.schoolNewName;
                $scope.editorEnabled = false;
                console.log(school._id);
                SchoolDataProvider.editSchoolName(school._id, $scope.schoolNewName)
                    .success(function(school){
                        $scope.school.name = school.name;
                    }).error(function(err){
                        console.error(err);
                        swal({title: "修改失败", text: "请重试", type: 'error'})
                    })
            };

//
//            //var data = [$scope.studentCount, $scope.xiaoshuLogCount];
//            var w = 400;
//            var h = 400;
//            var r = h/2;
//            var color = d3.scale.category20c();
//            console.log(parseInt($scope.studentCount));
//
//            var data = [{"label":"Category A", "value": parseInt($scope.studentCount)},
//                {"label":"Category B", "value":50},
//                {"label":"Category C", "value":30}];
//
//
//            var vis = d3.select('#chart').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
//            var pie = d3.layout.pie().value(function(d){return d.value;});
//
//// declare an arc generator function
//            var arc = d3.svg.arc().outerRadius(r);
//
//// select paths, use arc generator to draw
//            var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
//            arcs.append("svg:path")
//                .attr("fill", function(d, i){
//                    return color(i);
//                })
//                .attr("d", function (d) {
//                    // log the result of the arc generator to show how cool it is :)
//                    console.log(arc(d));
//                    return arc(d);
//                });
//
//// add the text
//            arcs.append("svg:text").attr("transform", function(d){
//                d.innerRadius = 0;
//                d.outerRadius = r;
//                return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
//                    return data[i].label;}
//            );
        }]);
