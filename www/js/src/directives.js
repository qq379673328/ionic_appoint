angular.module('app.directives', [])

//自定义下拉选择
.directive('agSelect', [function(){
	return {
        restrict: 'E',
        scope: {
        	title: "@",//显示文字
        	data: "=",//下拉数据
        	value: "=",//绑定的值
        	defaultDesc: "=",//默认显示
        	defaultValue: "=",//默认值
        	change: "&"//切换事件
        },
        replace: true,
        templateUrl: "js/src/views/directive/agSelect.html",
        link: function(scope, el, attrs, controller) {
            scope.currentDesc = scope.title;

            debugger;
            if(scope.defaultDesc){

            	scope.currentDesc = scope.defaultDesc;
            }
            if(scope.defaultValue){
                scope.value = scope.defaultValue;
            }

            scope.click = function(item){
				scope.showSelect = false;
				scope.currentDesc= item.desc;
				scope.value = item.value;
				if(scope.change){
					scope.change(item);
				}
            };
        }
    };
}]);

