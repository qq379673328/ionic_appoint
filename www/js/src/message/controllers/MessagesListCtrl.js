 //消息列表页
app.controller('MessagesListCtrl', function($scope, MessageService) {
	MessageService.getUnreadMessages().then(function(data){
		$scope.messages = data.data.message;
	});
})