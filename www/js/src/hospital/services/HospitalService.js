//医院
app.service('HospitalService', function(UTIL_HTTP){
	return {
		getHospitals : function(params){
			return UTIL_HTTP.get({
				url: "/hospital",
				data: params
			});
		},
		getHospitalById : function(hospitalId){
			return UTIL_HTTP.get({
				url: "/hospital/" + hospitalId
			});
		},
		getDefaultHospital: function(){
			return UTIL_HTTP.get({
				url: "/hospital/default"
			});
		}
	};
		
})