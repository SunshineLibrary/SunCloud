angular.module('sunpack')
    .controller('myRoomPackController',
    ['$scope', 'myRoom', 'folders',function ($scope, myRoom, folders) {
        $scope.myRoom = myRoom;
        $scope.folders = folders;
        $scope.temp = {};
        //console.log('hi I;m in myRoom state');
        //console.log(myRoom);

        $scope.gridOptions =
        {
            data: 'folders',
            multiSelect: false,
            enableColumnResize: true,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'name', displayName: '文件夹名', cellTemplate: '<div><a>{{row.entity.name}}</a></div>'},
                {field: 'files.length', displayName: '文件个数', width: '10%'},
                {field: 'semester.name', displayName: '年级'},
                {field: 'created_at', displayName: '创建时间'},
                {field: 'updated_at', displayName: '更新时间'},
                {field: 'rooms', displayName: '分配班级'},
                {field: '', displayName: '编辑', width: '10%',cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                '<a class="fui-new text-success" ng-click="showEditFolderDialog($event, row)"></a> &nbsp;&nbsp;' +
                '<a class="fui-cross text-danger" ng-click="deleteFolder($event,row)"></a></div>'}
            ],
            selectedItems: []
        };
    }]);