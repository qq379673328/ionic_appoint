//消息
app.service('MessageService', function(UTIL_HTTP){
	return {
		getUnreadMessages : function(){
			return UTIL_HTTP.get({
				url: "/usermessage/unread"
			});
		}
	};
		
})