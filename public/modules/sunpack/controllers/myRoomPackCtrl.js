angular.module('sunpack')
    .controller('myRoomPackController',
    ['$scope', '$state', '$stateParams','myRoom', 'folders', 'myFolders', 'FolderDataProvider','RoomDataProvider', '$rootScope', function ($scope, $state, $stateParams,myRoom, folders, myFolders,FolderDataProvider, RoomDataProvider, $rootScope) {
        //$scope.myRoom = myRoom;
        //$scope.folders = folders;
        console.log('myroom enter');
        console.log($scope.myRooms);
        $scope.myFolders = myFolders;
        $scope.selected = [];
        $scope.temp = {};
        $scope.error = {};
        //console.log($scope.myRoom.sunpack);
        $scope.myRoom = _.findWhere($scope.myRooms, {_id: $stateParams.roomId});
        $scope.folders = folders;



            //console.log($scope.myRoom);

        //console.log(typeof $scope.myRoom.foldersByMe);
        //console.log($scope.myRoom['foldersByMe']);
        //console.log(JSON.stringify($scope.myRoom));


        //console.log($scope.myRoom.name);
        //
        //$scope.folders = $scope.myRoom.foldersByMe;
        //console.log($scope.folders);

        var subjectIds = _.map($scope.subjects, function(subject) {return subject._id});
        var semesterIds = _.map($scope.semesters, function(semester) {return semester._id});
        $scope.allSubjects = [{name: '所有科目', _id: subjectIds }].concat($scope.subjects);
        $scope.selectedSubject = $scope.allSubjects[0]._id;
        $scope.allSemesters = [{name: '所有年级', _id: semesterIds }].concat($scope.semesters);
        $scope.selectedSemester = $scope.allSemesters[0]._id;
        //
        //$scope.$watch('folders', function(newValue, oldValue) {
        //    if(newValue) {
        //        console.log('.....', newValue);
        //        $scope.myRoom.foldersByMe = $scope.folders;
        //    }
        //});


        $scope.gridOptions =
        {
            data: 'folders',
            multiSelect: false,
            enableColumnResize: true,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseout="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'name', displayName: '文件夹名', cellTemplate: '<div><a>{{row.entity.name}}</a></div>'},
                {field: 'files.length', displayName: '文件个数', width: '10%'},
                {field: 'subject.name', displayName: '科目'},
                {field: 'semester.name', displayName: '年级'},
                {field: 'download', displayName: '下载情况'},
                {field: 'created_at', displayName: '创建时间', cellTemplate: '<span class="label label-success" am-time-ago="row.entity.created_at"></span>'},
                {field: 'updated_at', displayName: '更新时间', cellTemplate: '<span class="label label-success" am-time-ago="row.entity.updated_at"></span>'},
                {field: '', displayName: '移出', width: '5%',cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                //'<a class="fui-new text-success" ng-click="showEditFolderDialog($event, row)"></a> &nbsp;&nbsp;' +
                '<a class="fui-cross-circle text-danger" ng-click="removeFolderFromRoom($event,row)"></a></div>'}
            ],
            selectedItems: []
        };

        $scope.$watchGroup(['selectedSubject', 'selectedSemester'], function(newValue) {
            if(newValue) {
                //console.log(newValue);
                _.each($scope.myFolders, function(folder) {
                    folder.show = newValue[0].indexOf(folder.subject._id) > -1 && newValue[1].indexOf(folder.semester._id) > -1;
                })
            }
        });

        $scope.checkAll = function() {
            _.each($scope.foldersNotIn, function(folder) {
                if(folder.show) {
                    folder.selected = $scope.checkall;
                }
            })
        };
        $scope.unclickable = function(event) {
            event.stopPropagation();
        };
        $scope.selectAFolder = function(folder) {
            folder.selected = !folder.selected;
        };

        var getFoldersNotIn = function() {
            $scope.foldersNotIn = _.reject($scope.myFolders, function(folder) {
                return _.findWhere($scope.folders, {_id: folder._id})
            });
            _.each($scope.foldersNotIn, function(folder) {
                folder.selected = false;
            });
        };
        $scope.toAddFolders = function() {
            getFoldersNotIn();
            $scope.checkall = false;
            $scope.error = {};
            $('#addFoldersDialog').modal('show');
            $scope.selectedSubject = $scope.allSubjects[0]._id;
            $scope.selectedSemester = $scope.allSemesters[0]._id;
        };
        $scope.addFolders = function () {
            var selectedFolders = [];
            var selectedFolderIds = [];
            _.each($scope.foldersNotIn, function(folder) {
                if(folder.selected) {
                    selectedFolders.push(folder);
                    selectedFolderIds.push(folder._id);
                }
            });
            if(!selectedFolderIds.length) {
                $scope.error.noselection = true;
                return;
            }
            RoomDataProvider.addFoldersToRoom($scope.myRoom._id, selectedFolderIds)
                .success(function(newRoom) {
                    console.log(newRoom.sunpack);
                    $scope.myRoom = newRoom;
                    $scope.folders = $scope.folders.concat(selectedFolders);
                    //$scope.foldersNotIn = _.reject($scope.foldersNotIn, function(folder) {
                    //    return selectedFolderIds.indexOf(folder._id) > -1;
                    //});
                    $('#addFoldersDialog').modal('hide');
                    swal({title: '添加成功', type: 'success', timer: 1500});
                    $rootScope.$broadcast('addFoldersToRoom', {roomId: newRoom._id, num: selectedFolders.length});
                })
                .error(function(err) {
                    console.error(err);
                    swal({title: '添加失败', text: '请重试', type: 'error', timer: 2000});
                });
        };

        $scope.removeFolderFromRoom = function(event, row) {
            event.stopPropagation();
            swal({
                    title: "移出文件夹",
                    text: "您确定要将文件夹 "+row.entity.name+" 移出班级吗?\n 移出之后，该文件夹不会被删除",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "取消",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "移出",
                    closeOnConfirm: false },
                function(){
                    RoomDataProvider.removeFolderFromRoom($scope.myRoom._id, row.entity._id)
                        .success(function(newRoom) {
                            $scope.myRoom = newRoom;
                            swal({title: "移出成功", type: "success", timer: 1000 });
                            $scope.folders.splice($scope.folders.indexOf(row.entity),1);
                            $rootScope.$broadcast('removeFolderFromRoom', {roomId: newRoom._id});
                        })
                        .error(function(err) {
                            console.error(err);
                            swal({title: "移出失败", text: "请重试", type: 'error'})

                        });
                });
        };

        $scope.selectFolder = function () {
            $state.go('sunpack.myroom.folder', {folderId: $scope.gridOptions.selectedItems[0]._id});
        };

        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
        $('[data-toggle="checkbox"]').radiocheck();
        //$('[data-toggle="radio"]').radiocheck();
        //// Table: Toggle all checkboxes
        //$('.table .toggle-all :checkbox').on('click', function () {
        //    var $this = $(this);
        //    var ch = $this.prop('checked');
        //    $this.closest('.table').find('tbody :checkbox').radiocheck(!ch ? 'uncheck' : 'check');
        //});
        //
        //// Table: Add class row selected
        //$('.table tbody :checkbox').on('change.radiocheck', function () {
        //    var $this = $(this);
        //    var check = $this.prop('checked');
        //    var checkboxes = $this.closest('.table').find('tbody :checkbox');
        //    var checkAll = checkboxes.length === checkboxes.filter(':checked').length;
        //
        //    $this.closest('tr')[check ? 'addClass' : 'removeClass']('selected-row');
        //    $this.closest('.table').find('.toggle-all :checkbox').radiocheck(checkAll ? 'check' : 'uncheck');
        //});
        //

    }]);