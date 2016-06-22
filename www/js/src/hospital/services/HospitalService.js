//医院
app.service('HospitalService', function(UTIL_HTTP){
	return {
		//医院列表查询
		getHospitals : function(params){
			return UTIL_HTTP.get({
				url: "/hospital",
				data: params
			});
		},
		//根据id获取医院信息
		getHospitalById : function(hospitalId){
			return UTIL_HTTP.get({
				url: "/hospital/" + hospitalId
			});
		},
		//获取默认医院信息
		getDefaultHospital: function(){
			return UTIL_HTTP.get({
				url: "/hospital/default"
			});
		},
		//医院药品价格查询
		getHosDrugPrices : function(params){
			return UTIL_HTTP.get({
				url: "/hospital/medicinePrice",
				data: params
			});
		},
		//医院服务价格查询
		getHosServPrices : function(params){
			return UTIL_HTTP.get({
				url: "/hospital/servicePrice",
				data: params
			});
		},
	};
		
})