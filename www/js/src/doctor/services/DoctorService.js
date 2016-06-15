//医生
app.service('DoctorService', function(UTIL_HTTP){
	return {
		getDoctors : function(params){
			return UTIL_HTTP.get({
				url: "/doctor",
				data: params
			})
		},
		getDoctorById: function(doctorId, cb){
			return UTIL_HTTP.get({
				url: "/doctor/" + doctorId
			});
		}
	};
		
})