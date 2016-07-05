//预约时间
app.controller('AppointDateCtrl',function($scope, $stateParams, $state,ArrayJob){
	//获取科室
	var dept=$stateParams.dept;
	$scope.dept = dept;

	var now = new Date();	
	var DAY_Millisecond =86400000;
	var weekNames = ['周日','周一','周二','周三','周四','周五','周六'];
	//初始化日期界面
	$scope.dateList=sevenDays(now,1);
	//初始化获取号源
	getArrayJob($scope.dateList[0].simpleFullDate,$scope.dateList[6].simpleFullDate,dept);
	//
	//7天日期选择
	function sevenDays(sdate,type){
		var dateArray = new Array();
		if(type==1){
				for(var i=0;i<7;i++){
				var da = new Object();
					da.date = new Date(sdate.getTime()+i*DAY_Millisecond);
				    da.week = weekNames[da.date.getDay()];//周几
				    da.simpleDate = (da.date.getMonth()+1)+'-'+(da.date.getDate());//简单日期‘06-28’
				    da.simpleFullDate = simplyFormateDate(da.date);//简单全日期‘2016-06-28’
				    da.bgc='white';//背景色，默认白色
				dateArray.push(da);
			}
		}else if(type==-1){
				for(var i=7;i>0;i--){
					var da = new Object();
					da.date = new Date(sdate.getTime()-i*DAY_Millisecond);
				    da.week = weekNames[da.date.getDay()];
				    da.simpleDate = (da.date.getMonth()+1)+'-'+(da.date.getDate());
				    da.simpleFullDate = simplyFormateDate(da.date);
					dateArray.push(da);
				}
		}
		
		return dateArray;
	}
	//格式化日期 yyyy-mm-dd
	function simplyFormateDate(date){
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		if(month<10){
			return year+'-0'+month+'-'+day;
		}else{
			return year+'-'+month+'-'+day;
		}
	}
	//排班号源	
	function getArrayJob(sdate,edate,dept){
		ArrayJob.arrayJob({
			hosId:dept.tHospitalId,
			deptCode:dept.deptCode,
			dateStart:sdate,
			dateEnd:edate
		}).then(function(data){
			console.log(data);
			$scope.arrayJobs=data.arrayjobs;
			var da = $scope.dateList[0];//默认页面加载第一个日期的排班预约
			da.bgc='#CCFFFF';//背景色
			produceOneDayJob(da.date);
		});
	}
	//处理某一天的号源并按照时间段归类
	function produceOneDayJob(sdate){
		$scope.fullJobs=new Array();//全班
		$scope.moningJobs=new Array();//上午班
		$scope.afternoonJobs=new Array();//下午班
		$scope.nightJobs=new Array();//晚班
		if($scope.arrayJobs != null ){
			var arrayJobs = $scope.arrayJobs;
			for(var i=0 ; i< arrayJobs.length;i++){
				var aj = arrayJobs[i];				
				if( simplyFormateDate(new Date(aj.arrayjobDate))== simplyFormateDate(sdate)){//指定日期的排班
					if(aj.regisrationPeriodCd == 1){//全班			
						$scope.fullJobs.push(aj);
					}else if(aj.regisrationPeriodCd == 2){//上午班
						$scope.moningJobs.push(aj);
					}else if(aj.regisrationPeriodCd == 3){//下午班
						$scope.afternoonJobs.push(aj);
					}else if(aj.regisrationPeriodCd == 4){//晚班
						$scope.nightJobs.push(aj);
					}
					
					if(aj.allowReservationNum>0){//判断是否可以预约	
						aj.allow=1;//可以预约
						aj.bgc='#33CC00';//可以预约的背景色
					}else{
						aj.allow=2;//不可预约
						aj.bgc='#bbbbaa';//不可预约的背景色
					} 
				}
			}
			console.log('fullJobs'+$scope.fullJobs);
			console.log('moningJobs'+$scope.moningJobs);
			console.log('afternoonJobs'+$scope.afternoonJobs);
			console.log('nightJobs'+$scope.nightJobs);
			

		}
		
	}
	//上一页
	$scope.prex=function(){
		$scope.dateList =sevenDays($scope.dateList[0].date,-1);
	}
	//下一页
	$scope.next=function(){
		$scope.dateList =sevenDays(new Date($scope.dateList[6].date.getTime()+DAY_Millisecond),1);
	}
	//选择某一天
	$scope.selectDate=function(da){
		for(var i=0;i<$scope.dateList.length;i++){//设置其他日期按钮背景都为白色
			$scope.dateList[i].bgc='white';
		}
		da.bgc='#CCFFFF';//当前点击的日期背景色改变
		produceOneDayJob(da.date);
	}
	//去预约挂号
	$scope.toAppointMent=function(aj){
		$state.go('appointMent',{aj:aj});
	}
	
});