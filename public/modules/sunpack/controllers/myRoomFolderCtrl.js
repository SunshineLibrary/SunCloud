angular.module('sunpack')
    .controller('myRoomFolderController',
    ['$scope', 'folder', 'RoomDataProvider', 'FolderDataProvider', 'FileDataProvider','AuthService', '$stateParams', 'FileUploader', '$state', '$timeout', function ($scope, folder, RoomDataProvider, FolderDataProvider, FileDataProvider,AuthService, $stateParams, FileUploader, $state, $timeout) {
        $scope.folder = folder;
        $scope.files = $scope.folder.files;
        $scope.gridOptions =
        {
            data: 'files',
            multiSelect: false,
            enableColumnResize: true,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'type', displayName: '类型', width: '8%',cellTemplate: '<div><span ng-bind-html="row.entity.type | typeFilter"></span></div>'},
                {field: 'originalname', displayName: '文件名称', width: '35%', cellTemplate: '<div><a ng-click="selectFile(row.entity._id)">{{row.entity.originalname}}</a></div>'},
                {field: 'description', displayName: '描述', cellTemplate: '<div ng-show="row.entity.description">' +
                '<a title="文件描述:{{row.entity.description}}" id="info-tooltip" data-placement="right" data-toggle="tooltip"  type="button"><i class="glyphicon glyphicon-info-sign text-success" ng-mouseover="tooltip()"></i></a>'+
                ' {{row.entity.description}}</div><div ng-hide="row.entity.description"><span class="label label-default">暂无</span></div>'},
                {field: 'users.length', displayName: '使用人数', width: '10%'},
                {field: 'size', displayName: '文件大小',width: '10%', cellTemplate: '<div>{{row.entity[col.field]/1024/1024 | number:2}} MB</div>'}
                ],
            selectedItems: []
        };


        $scope.selectFile = function (fileId) {
            $state.go('sunpack.myroom.folder.file', {fileId: fileId});
        };
    }
    ]
);