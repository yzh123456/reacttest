var locationX, locationY;
var beforeLocationX;
var beforeLocationY;
var cpoint; //地图中心点
var toolBar, locationInfo;
var markerobj = []; //标注对象
var start_xy; //导航起点
var end_xy; //导航终点
var tname; //当前选中的停车场的名称
var parkId; //选中停车场的id
var parkClicked;
var parkCode;
var aroundParking = {}; //周围停车场(mark)。
var city;
var flagGPS = false;
var isAttentionParkMore = false; //用来标记是否点了显示更多的关注停车场按钮。默认为false
var attentionParkListMsg = {}; //定义一个变量attentionParkListMsg。用来保存已关注的停车场列表信息
var parkBookedList = {}; //显示预订的停车场列表
var searchListPark = {}; //用来保存搜索出来的停车场。
var touchSlideMarker;
var amount;
var geolocation;
var statusParks = 0;
var oldBookId;
var indexClick = 0;
var markerImg = [];
var mar = [];
var markClicked = {};
var markerSpan = [];
var parkDetailTarget;  //停车场详情来源页面：1地图弹窗 2搜索列表 3关注列表 4预订列表
var moveEvent = false;  //屏蔽ios滑动并点击事件
var HOSTPATH = window.location.href.split('jspsn')[0]+'jspsn/parkApp/';
var PARKDETAIL = HOSTPATH + 'queryParkInfo.servlet'; //查询停车场详情
var ATTENTION_PARK = HOSTPATH + 'addParkAttention.servlet';
var CANCLE_ATTENTION = HOSTPATH + 'delParkAttention.servlet';
var ATTENTION_QUERY_LIST = HOSTPATH + 'queryParkAttention.servlet'; //关注列表。
var PARK_BOOKING_LIST = HOSTPATH + 'queryBooking.servlet'; //预订记录
var SEARCH_PARK_POSITION = HOSTPATH + 'queryParkByPosition.servlet';
var CAR_CARD_PAY = window.location.href.split('jspsn')[0]+'jspsn/pay/veNoPay.servlet';
var unionid = jspsnQueryOpen();
var lng="";
var lat="";
/*锁车业务 start*/
$("#unlock").click(function(){   //点击发起解锁车辆对话
	if ($(".item_1 ul").find('li').length > 0) {
		$("#unlock_mask, .popup_unlock").show();
	}else {
		poptip("您没有被锁定的车辆");
	}
	
});

$(".item_1 li").live("click",function(){      //点击选择车牌
	$(".item_1 li").find("div").removeClass("icon-out-choose");
	$(this).find("div").addClass("icon-out-choose");
});
$("#unlock_mask, #unlock_cel").click(function(){   //点击取消解锁车辆
	$("#unlock_mask, .popup_unlock").hide();
});
$("#unlock_ok").click(function(){   //点击确认发起解锁操作
	var park_id = $(".icon-out-choose").parent().data("parkId");
	var carNo_id = $(".icon-out-choose").parent().data("carNo_id");
	unlockCar.unlock(carNo_id,park_id);
	$("#unlock_mask, .popup_unlock").hide();
});
	
var unlockCar = {
	initCarNo:function(){
		var url = window.location.href.split('jspsn')[0]+'jspsn/'+'queryLockCarListByUser.servlet';
	    $.ajax({
	        url : url,
	        cache : false,
	        data : {'unionid':unionid},
	        dataType : 'json',
	        type : 'post',
	        success : function(data, textStatus, jqXHR) {
	        	if (data && data.resultCode == '0' && data.dataItems.length > 0) {
	            	$(".item_1 ul").empty();
	        	    for (var i = 0; i < data.dataItems.length; i++) {
	        	    	if (data.dataItems[i].attributes.IS_LOCK == '1') {
	        	    		var vehicleNo = data.dataItems[i].attributes.CARNO;  
		                    var id =  data.dataItems[i].attributes.CARNO_ID;
		                    var parkId =  data.dataItems[i].attributes.PARK_ID;
		                    //var tmpClass = 'icon-choose  icon-out-choose';
		                    if(i == data.dataItems.length - 1) tmpClass = 'icon-choose  icon-out-choose';
		        	    	var tp = $('<li id="' + id + '">' + vehicleNo + ' <div class="icon-choose"></div></li>');
		        	    	$(".item_1 ul").append(tp);
		        	    	$('#' + id).data({"parkId":parkId,"carNo_id":id});
						}
	        	    };
	        	    $(".item_1 ul").find('li').eq(0).find("div").addClass('icon-out-choose');
	            }
	        	if ($(".item_1 ul").find('li').length < 1) {
	        		$("#unlock").hide();
	        	}else {
	        		$("#unlock").show();
				}
	        },
	        error : function(XMLHttpRequest, textStatus, errorThrown) {
	            throw XMLHttpRequest.responseText;
	            var data = XMLHttpRequest.responseText;

	        }
	    });
	},
	unlock:function(carNo_id,park_id){
		$.ajax({
            url :  window.location.href.split('jspsn')[0]+'jspsn/' + "lockOrUnlockCar.servlet",
            cache : false,
            data : {
                property_code : unionid,
                carno_id : carNo_id,
                park_id : park_id,
                lock_or_un : "1" //0:锁车，1：解锁
            },
            dataType : 'json',
            type:'post',
            success : function(data) {
                if (data.resultCode == "0" ) {
                    poptip("车辆保护已解除！");
                    $("#unlock_mask, .popup_unlock").hide();
                }else if (data.resultCode == "1" ) {
                    
                }else{
                    poptip("处理失败！");
                }
                setTimeout(function(){
                    self.location.reload(); 
                },2000);
            },
            error:function(str){

            }
        });
	}
};
/*锁车业务 end */

var search_type = GetRequest().search;////如果在车牌缴费跳转过来则直接显示搜索界面
$(function() {
	if (search_type) {
		searchPark();
		return;
	}
});

//弹出提示
var poptip = function(mess) {
	$("#poptip").html(mess);
	$("#poptip").fadeIn(400, function() {
		setTimeout(function() {
			$("#poptip").fadeOut('slow');
		}, 1200);
	});
};
var hrefPage = function(id) {
	$(id).css({"z-index":"10"}).siblings().css({"z-index":"1"});
	$('#icon_return').show();
};

var mapObj = new BMap.Map("mapContainer");  
	var point = new BMap.Point("","");
	mapObj.centerAndZoom(point,15);
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			var mk = new BMap.Marker(r.point);
			mapObj.addOverlay(mk);
			mapObj.panTo(r.point);
			lng=r.point.lng;
			lat=r.point.lat;
			onComplete(r.point);
		}
		else {
			alert('failed'+this.getStatus());
		}        
	},{enableHighAccuracy: true})
mapObj.enableDragging();   //开启拖拽
function onComplete(data) {
	var p1 = new BMap.Point(data.lng,data.lat);
	var mapObj = new BMap.Map("allmap");  
	var point = new BMap.Point(p1);
	mapObj.centerAndZoom(point,15);
}



//加载地图，调用浏览器定位服务
/*var mapObj = new BMap.Map("mapContainer", {
	resizeEnable: true,
	view: new BMap.View2D({
		resizeEnable: true,
		zoom: 17, //地图显示的缩放级别
	}),
	keyboardEnable: false
});


//原定位
mapObj.plugin('BMap.Geolocation', function() {
	geolocation = new BMap.Geolocation({
		enableHighAccuracy: true, //是否使用高精度定位，默认:true
		timeout: 10000, //超过10秒后停止定位，默认：无穷大
		maximumAge: 0, //定位结果缓存0毫秒，默认：0
		convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
		showButton: true, //显示定位按钮，默认：true
		buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
		buttonOffset: new BMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
		buttonPosition:'LB',
		showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
		showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
		panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
		zoomToAccuracy: false //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	});
	mapObj.addControl(geolocation);
	BMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
});*/

function onComplete(data) {
	console.log(data);
	var gc = new BMap.Geocoder();
	var pt = data;
	gc.getLocation(pt, function(rs){    
		var addComp = rs.addressComponents;    
        if (addComp['province'] && typeof addComp['province'] === 'string') {
	        city = addComp['province'];
	    }
	    if (addComp['city'] && typeof addComp['city'] === 'string') {
	    	city += addComp['city'];
	    }
	    if (addComp['district'] && typeof addComp['district'] === 'string') {
	    	city += addComp['district'];
	    }	
        if (addComp['street'] && typeof addComp['street'] === 'string') {
	    	city += addComp['street'];
	    }
	    if (addComp['streetNumber'] && typeof addComp['streetNumber'] === 'string') {
	    	city += addComp['streetNumber'];
	    }			
	});  
	/*mapObj.getCity(function(data) {
	    if (data['province'] && typeof data['province'] === 'string') {
	        city = data['province'];
	    }
	    if (data['city'] && typeof data['city'] === 'string') {
	    	city += data['city'];
	    }
	    if (data['district'] && typeof data['district'] === 'string') {
	    	city += data['district'];
	    }
	});*/
	beforeLocationX = data.lng; //当前位置精度
	beforeLocationY = data.lat; //当前位置纬度
	locationX = data.lng; //查询经度
	locationY = data.lat; //查询纬度	
	cpoint = new BMap.Point(beforeLocationX, beforeLocationY); //中心点坐标
	start_xy = cpoint;
	placeSearch();
	localStorage.setItem("lng",data.lng);
	localStorage.setItem("lat",data.lat);
	//捷停车，隐藏“关注、预订”按钮
	var host = window.location.href.split("sy_html")[0];
	if(location.href.indexOf('from=') > -1){
		var fromUrl = location.href.split("from=")[1].substr(0,3);
	}
	if(fromUrl && fromUrl == "JTC"){
		$("#tip_focuson").hide();
		$("#tip_coupon").hide();
	}else{
		$("#tip_focuson").show();
		$("#tip_coupon").show();
	}
}

function onError(data) {
    poptip('定位失败，请刷新重试');
}

//定位当前位置。
window.onload = function() {
	setTimeout('unlockCar.initCarNo();', 300);
	new BMap.Geolocation().getCurrentPosition();
};

//拖拽地图时候加载
var dragendCount = 0;


mapObj.addEventListener('dragend', function(e) {
	if (flagGPS) return;
	dragendCount++;
	dragendCompleted(dragendCount);
});


function dragendCompleted(oldDragendCount) {
	setTimeout(function() {
		if (oldDragendCount == dragendCount) {
			$('#leftTabBox').hide();
			//删除tempWrap。---start
			var tp = $('#temp_carousel_parkInfo').clone();
			tp.empty();
			$('.tempWrap').remove();
			$('#leftTabBox').append(tp);
			//删除tempWrap。----end			
			new BMap.Geolocation().getCurrentPosition(function(e){
				cpoint = new BMap.Point(e.point.lng, e.point.lat); //中心点坐标				
				locationX = e.point.lng; //定位坐标经度值
				locationY = e.point.lat; //定位坐标纬度值
			});
						
			for (var i = 0; i < markerobj.length; i++) {
				markerobj[i].setMap(null); //批量删除以前的停车场标注
			}
			city = "";
			placeSearch();
			dragendCount = 0;
		}
	}, 1000);
}

//地图，搜索周围停车场
function placeSearch() {
	var obj = new Object();
	obj.longitude = locationX;
	obj.latitude = locationY;
	obj.unionid = unionid;
	obj.beforelongitude = locationX;//beforeLocationX;
	obj.beforelatitude = locationY;//beforeLocationY;
	obj.canton = city;
	obj.synch_signal = new Date().getTime() + '';
	$.ajax({
		url: SEARCH_PARK_POSITION,
		cache: false,
		data: obj,
		type: 'get',
		dataType: 'json',
		success: function(data) {
			if (data.resultCode == "0" && data.dataItems != null && data.dataItems.length > 0) {
				placeSearch_CallBack(data.dataItems);
				$('#leftTabBox').css("z-index","-1");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			poptip("加载周围停车场失败");
		}
	});
}


//搜索框，搜索周围停车场
function SecrchByKeyword(flag) {
	if($('#keyword').val().replace(/\s/g,"").length <=0){
		poptip('请先输入停车场名称');
		return false;
	}

	var parkList;
	if (localStorage.getItem("SearchParkName")) {
		parkList = localStorage.getItem("SearchParkName").split(',');
		localStorage.removeItem("SearchParkName");
	} else {
		parkList = [];
	}

	var obj = new Object();
	obj.unionid = unionid;
	obj.longitude = beforeLocationX || "0";
	obj.latitude = beforeLocationY || "0";
	obj.beforelongitude = beforeLocationX || "0";
	obj.beforelatitude = beforeLocationY || "0";
	obj.canton = city;
	obj.name = encodeURI($('#keyword').val());
	obj.synch_signal = new Date().getTime() + '';

	$.ajax({
		url: SEARCH_PARK_POSITION,
		cache: false,
		data: obj,
		type: 'get',
		dataType: 'json',
		success: function(data) {
			if (data.resultCode == "0" && data.dataItems != null && data.dataItems.length > 0) {
				hrefPage('#searchList');
				$("#searchList_ul").empty();
				for (var i = 0; i < data.dataItems.length; i++) {
					var tmp = data.dataItems[i].attributes;
					searchListPark[i] = data.dataItems[i];
					var tp = $("#searchList_li").clone();
					tp.show();
					tp.removeAttr('id');
					tp.find("#searchList_li_name").html(tmp.name).removeAttr('id');
					parseInt(tmp.distance) > 1000 ?
						tp.find("#searchList_li_dis").html((parseInt(tmp.distance) / 1000).toFixed(2) + 'km').removeAttr('id') :
						tp.find("#searchList_li_dis").html(tmp.distance.toFixed(0) + 'm').removeAttr('id');
					tp.find("#searchList_li_addr").html(tmp.address).removeAttr('id');
					tp.find("#searchList_li_price").html(tmp.park_qh).removeAttr('id');
					if(tmp.emptyParkPlaceCount == 0 || tmp.emptyParkPlaceCount < -1){
						tp.find("#searchList_li_beds").html('0').css("color","#ccc").removeAttr('id');
					}else if(tmp.emptyParkPlaceCount == -1){
						tp.find("#searchList_li_beds").html(tmp.parkPlaceCount).css("color","#ccc").removeAttr('id');
					}else{
						tp.find("#searchList_li_beds").html(tmp.emptyParkPlaceCount);
					}
					tp.find("#searchList_li_totalbeds").html(tmp.parkPlaceCount).removeAttr('id');
					$("#searchList_ul").append(tp);
					if (tmp.emptyParkPlaceCount / tmp.parkPlaceCount > 0.5) {
						tp.find(".fp_num_0").removeClass().addClass("fp_num_0 green");
					} else if (tmp.emptyParkPlaceCount >= 10) {
						tp.find(".fp_num_0").removeClass().addClass("fp_num_0 orange");
					} else if (tmp.emptyParkPlaceCount > 0) {
						tp.find(".fp_num_0").removeClass().addClass("fp_num_0 red");
					} else {
						tp.find(".fp_num_0").removeClass().addClass("fp_num_0 gray");
					}
				}
				parkDetailTarget = 2;

				//将搜索记录append到historyCode中去。				
				if (flag == undefined || !flag) {					
					if (parkList.length > 0) {
						var flag = false;
						for (var k in parkList) {
							if ($('#keyword').val() == parkList[k]) {
								flag = true;
							}
						}
						if (!flag) {
							parkList.push($('#keyword').val());
						}
					} else {
						parkList.push($('#keyword').val());
					}					
					localStorage.setItem("SearchParkName", parkList.join(','));				
				}
			} else if (data.resultCode == "0" && data.dataItems.length == 0) {
				poptip('没有搜索到相应的停车场，重新输入');
			} else if (data.resultCode == "1" && (data.message == "beforelongitude不能为空" || data.message == "beforelatitude不能为空")){
				poptip('获取当前位置失败，请重试');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			poptip('查询停车场失败，请重试');	
		}
	});
}
//点击跳转至相应停车场
$('.searchParkMark,.focusonlist_content').live("touchmove click", function() {
	moveEvent = true;
});
$('.searchParkMark,.focusonlist_content').live("touchend click", function() {
	if(moveEvent == true){
		moveEvent = false;
		return false;
	}

	$("#focusonlist").css({"z-index":"1"});
	var index = $(this).index();		
	for(var obj in searchListPark){
		if($('label',this.children[0]).text() == searchListPark[obj].attributes.name){
			locationX = searchListPark[obj].attributes.longitude;
			locationY = searchListPark[obj].attributes.latitude;
			beforeLocationX = searchListPark[obj].attributes.longitude;
			beforeLocationY = searchListPark[obj].attributes.latitude;
			if (search_type) {
				localStorage.setItem('park_code',searchListPark[obj].attributes.park_code);
				localStorage.setItem('name',searchListPark[obj].attributes.name);
				localStorage.setItem('parkingId',searchListPark[obj].attributes.id);
				localStorage.setItem('businesser_code',searchListPark[obj].attributes.businesser_code);
				window.location.href = window.location.href.split("jspsn")[0] +"jspsn/html/carNo-pay.html";
				return;
			};
			break;
		}
	}

	sessionStorage.setItem('_js_map_mark_select',$('label',this.children[0]).text());

	for (var i = 0; i < markerobj.length; i++) {
		markerobj[i].setMap(null); //批量删除以前的停车场标注
	}
	//加载地图，调用浏览器定位服务
	mapObj = new BMap.Map("mapContainer", {
		resizeEnable: true,
		view: new BMap.View2D({
			resizeEnable: true,
			center: new BMap.Point(locationX, locationY),
			zoom: 16, //地图显示的缩放级别
		}),
		keyboardEnable: false
	});
	mapObj.plugin('BMap.Geolocation', function() {
		geolocation = new BMap.Geolocation({
			enableHighAccuracy: true, //是否使用高精度定位，默认:true
			timeout: 10000, //超过10秒后停止定位，默认：无穷大
			maximumAge: 0, //定位结果缓存0毫秒，默认：0
			convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
			showButton: true, //显示定位按钮，默认：true
			buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
			buttonOffset: new BMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
			showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
			panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
			zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
		});
		mapObj.addControl(geolocation);
	});
	$("#searchList, #searchpage").css({"z-index":"1"});
	$("#homepage").css({"z-index":"10"});
	/*只显示一个
	var arr = new Array;
	for(var obj in searchListPark){
		if($('label',this.children[0]).text() == searchListPark[obj].attributes.name){
			arr.push(searchListPark[obj]);
			break;
		}
	}*/
	$("#searchList_ul").empty();
	/*显示数组*/
	for(var obj in searchListPark){
		if($(this).parents("li").find("h4 label").text() == searchListPark[obj].attributes.name){
			sessionStorage.setItem('_js_map_mark_select',$(this).parents("li").find("h4 label").text());
			break;
		}
	}
	city = "";
	placeSearch();
	/*
	var searchListParkArray = new Array;
	for(var i in searchListPark)
	{
	    searchListParkArray.push(searchListPark[i]);
	}
	placeSearch_CallBack(searchListParkArray);
	*/
	//再次绑定拖拽监听事件。			
	mapObj.addEventListener('dragend', function(e) {
		if (flagGPS) return;
		dragendCount++;
		dragendCompleted(dragendCount);
	});
	//绑定一个click事件。
	mapObj.addEventListener('click', function(event) {
		$('#leftTabBox').css("z-index","-1");
		markerImg[indexClick].src = "./image/icon_marker_4.png";
	});
	$("#icon_return").hide();
	return false;
});
    $(".share_place").live("click",function(){
    	var host = window.location.href.split("sy_html")[0];
    	window.location.href = host + "html/carPlaceShare/carParkShare.html";
    });
    $("#go_to_parking").live("click",function(){
    	var host = window.location.href.split("sy_html")[0];
    	window.location.href = host + "html/carPlaceShare/carParkShare.html";
    });
//清除搜索记录
$('#clearrecords').click(function() {
	localStorage.clear('SearchParkName');
	$('#historyCode li').remove();
});


//回调函数
function placeSearch_CallBack(data) {

	$("#temp_carousel_parkInfo").empty();
	$('#leftTabBox').show().css("z-index","11");
	
	_point_index = 0;

	for (var i = 0; i < data.length; i++) {
		addmarker(i, data[i]);
		var parkCurrent = data[i].attributes;

		if(parkCurrent.name == sessionStorage.getItem('_js_map_mark_select')){
			_point_index = i;
		}

		var tp = $("#temp_carousel_parkInfo_ul").clone();
		tp.show();
		tp.removeAttr('id');
		tp.find('#isattention').attr('data-attention', parkCurrent.isattention).removeAttr('id');
		(function(flag) {
			flag == 1 ? tp.find('.clickFollow').removeClass('icon_focuson').addClass('icon_focuson2').html('已关注') : tp.find('.clickFollow').removeClass('icon_focuson2').addClass('icon_focuson').html('未关注');
		})(parkCurrent.isattention);
		if(parkCurrent.IS_CARPLACE_SHARE&&parkCurrent.IS_CARPLACE_SHARE==1){
			var sharePlace = '<span class="share_place">享</span>';
		}else{
			var sharePlace ='';
		}
		tp.find("#carouselParkName").html(sharePlace + (i + 1) + '.' + parkCurrent.name).removeAttr('id');
		tp.find("#carouselParkPrice").html(parkCurrent.park_qh).removeAttr('id');
		parkCurrent.emptyParkPlaceCount == -1 ? tp.find("#carouselParkBeds").html(parkCurrent.parkPlaceCount).css("color","#ccc").removeAttr('id') : tp.find("#carouselParkBeds").html(parkCurrent.emptyParkPlaceCount).removeAttr('id');
		tp.find("#carouselParkTotalBeds").html(parkCurrent.parkPlaceCount).removeAttr('id');
		parseInt(parkCurrent.distance) > 1000 ? tp.find("#carouselParkDistance").html((parseInt(parkCurrent.distance) / 1000).toFixed(1) + 'km') : tp.find("#carouselParkDistance").html(parseInt(parkCurrent.distance).toFixed(0) + 'm').removeAttr('id');
		$("#temp_carousel_parkInfo").append(tp);
		if(parkCurrent.businesser_code == null || parkCurrent.businesser_code == "null" || parkCurrent.businesser_code == ""){
			tp.find(".icon_booking").css("color","#e2e2e2").attr("onclick","");
			tp.find(".icon_price").css("color","#e2e2e2").attr("onclick","");
		}
		if(parkCurrent.emptyParkPlaceCount < 1){
			tp.find(".icon_booking").css("color","#e2e2e2").attr("onclick","");
		}

		//如果跳转前页面是寻车页面
		var referHref = document.referrer;
		if(referHref && referHref.indexOf("searchCar") > -1){
			$("#temp_carousel_parkInfo .tip_li").hide();
			$(".selectPark").show();
		}
		tp.find(".selectPark").attr("id",parkCurrent.id);
	}
	touchSlideMarker = TouchSlide({
		slideCell: "#leftTabBox"
	});

	setTimeout(function() {
		markClicked[_point_index]();
	}, 500);

	parkDetailTarget = 1;
}


//预订列表，默认按月显示
var flagBookPay = false; //false未过期,true 表示过期。
function ShowParkMonthList() {
	var flag = false;
	ShowParkList(flag);
	flagBookPay = true;
}
//预订列表，全部显示
function ShowParkAllList(){
	var flag = true;
	ShowParkList(flag);
}
function ShowParkList(flag) {
	var now= new Date();
	var year=now.getFullYear();
	var month=now.getMonth()+1;
	if(!flag){
		var nowdate=9999+"-"+12+"-"+31+" "+23+":"+59;
		var beforedate=year+"-"+month+"-"+1+" "+0+":"+0;
	}else{
		var nowdate=9999+"-"+12+"-"+31+" "+23+":"+59;
		var beforedate=1970+"-"+1+"-"+1+" "+0+":"+0;
	}
	

	//打开预订列表
	$("#bookinglist").css({"z-index":"10"}).siblings().css({"z-index":"1"});
	$(".icon_return").show();
	$(".fp_sort li:first-of-type").addClass("selected").siblings().removeClass();
	var obj = new Object();
	obj.pageSize = 100;
	obj.pageIndex = 1;
	obj.unionid = unionid;
	obj.begintime = beforedate;
	obj.endtime = nowdate;

	$.ajax({
		url: PARK_BOOKING_LIST,
		cache: false,
		data: obj,
		dataType: 'json',
		success: function(data) {
			if (data.resultCode == "0" && data.dataItems != null && data.dataItems.length > 0) {
				setFoucsParkList(data.dataItems);
				parkBookedList = data.dataItems;
			}else{
				$("#bookinglist .fp_list").empty().html("目前没有预订记录").css("text-align","center");
			}
		}
	});
}
function setFoucsParkList(data) {

	$('#booked_park_list').empty();

	for (var i in data) {
		var parkCurrent = data[i].attributes;
		var tp = $("#tp_park_list").clone();
		tp.show();
		tp.removeAttr('id');
		tp.find("#parkName").html('<b class=\"fp_list_title\">'+parkCurrent.parkname+'</b>').removeAttr('id');
		tp.find("#bookTime").html(parkCurrent.booktime.substring(2,16)).removeAttr('id');
		tp.find("#vehicle_no").html(parkCurrent.vehicle_no).removeAttr('id');
		tp.find("#parkAddress").html(parkCurrent.parkaddr).removeAttr('id');
		tp.find("#overdueTime").html(parkCurrent.overduetime.substring(2,16)).removeAttr('id');
		if((new Date(parkCurrent.overduetime.replace(/\-/g,"/")).getTime()) < (new Date().getTime())){
			tp.find(".isOverTime").addClass("overtime");
		}
		if(parkCurrent.oldbook_id){
			tp.find('b').after('<i class="icon_delay"></i>');
		}
		$("#booked_park_list").append(tp);
	}
	parkDetailTarget = 4;

}


//添加查询结果的marker&infowindow   
function addmarker(i, d) {
	aroundParking[i] = d;
	var emptyParkPlaceCount = aroundParking[i].attributes.emptyParkPlaceCount;
	var emptyBeds = '';
	if(emptyParkPlaceCount == 0 || emptyParkPlaceCount < -1){
		emptyBeds = 0;
	}else if(emptyParkPlaceCount == -1){
		emptyBeds = aroundParking[i].attributes.parkPlaceCount;
	}else{
		emptyBeds = emptyParkPlaceCount;
	}
	var beds = aroundParking[i].attributes.parkPlaceCount;	
	var lngX = aroundParking[i].attributes.longitude;
	var latY = aroundParking[i].attributes.latitude;

	//自定义点标记内容   
	var markerContent = document.createElement("div");
	markerContent.className = "markerContentStyle";
	//点标记中的图标
	markerImg[i] = document.createElement("div");
	markerImg[i].className = "markerlnglat markerContent_bg";
	if (emptyParkPlaceCount / beds > 0.5) {
		$(markerImg[i]).addClass("bg_green");
	} else if (emptyParkPlaceCount >= 10) {
		$(markerImg[i]).addClass("bg_orange");
	} else if (emptyParkPlaceCount > 0) {
		$(markerImg[i]).addClass("bg_red");
	} else {
		$(markerImg[i]).addClass("bg_gray");
	}

	markerContent.appendChild(markerImg[i]);
	//点标记中的文本
	markerSpan[i] = document.createElement("span");
	markerSpan[i].className = "markername";
	markerSpan[i].innerHTML = "¥" + aroundParking[i].attributes.park_qh||"";
	markerContent.appendChild(markerSpan[i]);

	//停车场mark标记
	var markerOption = {
		map: mapObj,
		position: new BMap.Point(lngX, latY), //基点位置
		offset: new BMap.Pixel(-18, -36), //相对于基点的偏移位置
		draggable: false, //是否可拖动
		content: markerContent //自定义点标记覆盖物内容
	};

	mar[i] = new BMap.Marker(markerOption);
//	marker.push(new BMap.LngLat(lngX, latY));
	markerobj.push(mar[i]);
    
	markClicked[i] = function() {
		$('#leftTabBox').css("z-index","1");
		indexClick = i;		
		//绑定click事件。
		touchSlideMarker.doPlay(true, indexClick);
		var markerChild = $(markerImg[indexClick]).html();
		if(markerChild == ''){
			var markerSelected = $("<img src='./image/icon_marker_1.png'/>");
			$(markerImg[indexClick]).append(markerSelected).parents(".amap-marker").css("z-index","101").siblings().css("z-index","100").find(".markerlnglat").empty();
		}
		end_xy = new BMap.Point(lngX, latY); //获取导航的终点
		parkClicked = aroundParking[indexClick].attributes;
		tname = parkClicked.name;
		parkId = parkClicked.id;
		parkCode = parkClicked.park_code;
	};
	mar[i].addEventListener("click", markClicked[i]);
    mapObj.addOverlay(aroundParking[i].attributes.longitude,aroundParking[i].attributes.latitude);
}





	// 编写自定义函数,创建标注
	function addMarker(point){
	  var marker = new BMap.Marker(point);
	  map.addOverlay(latitude);
	}
	
	for (var i = 0; i < markerobj; i ++) {
		var point = new BMap.Point(markerobj[i]);
		addMarker(point);
	}



//信息窗体，绑定click事件
mapObj.addEventListener('click', function(event) {
	$('#leftTabBox').css("z-index","-1");
});
$('#tip_focuson,#tip_coupon').click(function() {
	$('#leftTabBox').css("z-index","-1");
	$(markerImg[indexClick]).attr("src","./image/icon_marker_4.png");
});

function FailBookDriving(e) {
	var tmp = $(e).parent().data('key');
	end_xy = new BMap.Point(tmp.split(',')[0], tmp.split(',')[1]); //获取导航的终点
	tname = tmp.split(',')[2];
	$("#homepage").css({"z-index":"10"}).siblings().css({"z-index":"1"});
	driving_route();
}

//跳转至反向寻车
$(".selectPark").live("touchend",function(){
	var parkingName = $(this).siblings().eq(0).find("label").html().split(".")[1];
	sessionStorage.setItem("parkingName",parkingName);
	var selectParkId = $(this).attr("id");
	sessionStorage.setItem("selectParkId",selectParkId);
	var host = window.location.href.split("sy_html")[0];
	if(location.href.indexOf('from=') > -1){
		var fromUrl = location.href.split("from=")[1].substr(0,3);
	}
	if(fromUrl && fromUrl == "JTC"){
		window.location.href = host + "html/dynamic/searchCar.html?from=JTC";
		window.event.returnValue = false;
	}else{
		window.location.href = host + "html/dynamic/searchCar.html";
		window.event.returnValue = false;
	}
});

//首页进入停车场详情页
function IndexDetail(e) {
	statusParks = 0;
	goDetail();
}


//根据关注列表显示对应的停车场信息，地图左上角关注弹出层
function AttentionListDetail(e) {  //预订Y
	$("#focusonrecords").hide();
	statusParks = 1;

	if(isAttentionParkMore == false){
		var index = $(e).index();
	}else{
		var index = $(e).closest("li").index();
	}

	var lt = attentionParkListMsg[index].attributes;
	tname = lt.name;
	parkClicked = attentionParkListMsg[index].attributes;

	end_xy = new BMap.Point(lt.longitude, lt.latitude); //获取导航的终点
	parkId = attentionParkListMsg[index].attributes.parkid;
	goDetail();
}

//显示搜索停车场的详情。searchListPark
function GoDetailBySearch(e) {
	statusParks = 2;
	var index = $(e).parents("li").index();
	var lt = searchListPark[index];
	tname = lt.attributes.name;
	parkClicked = searchListPark[index];
	end_xy = new BMap.Point(lt.attributes.longitude, lt.attributes.latitude); //获取导航的终点
	parkId = searchListPark[index].attributes.id;
	parkCode = searchListPark[index].attributes.park_code;
	goDetail();
	localStorage.setItem('name',lt.attributes.name);
	//localStorage.setItem('lng',lt.longitude);
	//localStorage.setItem('lat',lt.latitude);
	localStorage.setItem('parkingId',lt.attributes.id);
	localStorage.setItem('park_code',lt.attributes.park_code);
	localStorage.setItem('businesser_code',lt.attributes.businesser_code);
}
//显示预订查询里的详情。
function BookListDetail(e) {
	statusParks = 3;
	goDetail();
}

//选择已预订的停车场
$('#booked_park_list li').live("touchmove", function() {
	moveEvent = true;
});
$('#booked_park_list li').live("touchend", function() {
	if(moveEvent == true){
		moveEvent = false;
		return false;
	}
	$(this).css("background-color", "#eefcff").siblings().css("background-color", "");
	$('#parklist_bottom_nav').show();
	var index = $(this).index();
	parkClicked = parkBookedList[index].attributes;
	end_xy = new BMap.Point(parkClicked.longitude, parkClicked.latitude); //获取导航的终点
	parkId = parkClicked.parkid;
	tname = parkClicked.parkname;
	parkCode = parkClicked.parkcode;
	oldBookId = parkClicked.id;
	vehicleNo = parkClicked.vehicle_no;
	amount = parkClicked.amount;
	probebtaddress = parkClicked.probe_bt_address;
	localStorage.setItem('vehicleNo',vehicleNo);
	sessionStorage.setItem('parkId',parkId);
	$(this).find('.isOverTime').hasClass('overtime') ?
		$('.tip_li_yd.tip_overtime_yd').css('color', '#e2e2e2').attr('onclick', '') :
		$('.tip_li_yd.tip_overtime_yd').css('color', '').attr('onclick', 'DelayPayBookPark();');
});

//立即预订。
function PayBookPark() {
	sessionStorage.setItem("parkId",parkId);
	sessionStorage.setItem("flagBookPay",flagBookPay);
	var parkClickedSession = [];
	parkClickedSession.push(parkClicked.name);
	parkClickedSession.push(parkClicked.emptyParkPlaceCount);
	parkClickedSession.push(parkClicked.address);
	parkClickedSession.push(parkClicked.longitude);
	parkClickedSession.push(parkClicked.latitude);
	parkClickedSession.push(parkClicked.businesser_code);
	sessionStorage.setItem("parkClicked",parkClickedSession);
	var host = window.location.href.split("sy_html")[0];
	if(location.href.indexOf('from=') > -1){
		var fromUrl = location.href.split("from=")[1].substr(0,3);
	}
	if(fromUrl && fromUrl == "JTC"){
		window.location.href = host + "sy_html/booking.html?from=JTC";
		window.event.returnValue = false;
	}else{
		window.location.href = host + "sy_html/booking.html";
		window.event.returnValue = false;
	}
}


//延时预订
function DelayPayBookPark() {
	sessionStorage.setItem("oldBookId",oldBookId);
	sessionStorage.setItem("parkId",parkId);
	sessionStorage.setItem("flagBookPay",flagBookPay);
	var parkClickedSession = [];
	parkClickedSession.push(parkClicked.name);
	parkClickedSession.push(parkClicked.emptyParkPlaceCount);
	parkClickedSession.push(parkClicked.address);
	parkClickedSession.push(parkClicked.longitude);
	parkClickedSession.push(parkClicked.latitude);
	parkClickedSession.push(parkClicked.businesser_code);
	sessionStorage.setItem("parkClicked",parkClickedSession);
	var host = window.location.href.split("sy_html")[0];
	if(location.href.indexOf('from=') > -1){
		var fromUrl = location.href.split("from=")[1].substr(0,3);
	}
	if(fromUrl && fromUrl == "JTC"){
		window.location.href = host + "sy_html/booking.html?from=JTC";
		window.event.returnValue = false;
	}else{
		window.location.href = host + "sy_html/booking.html";
		window.event.returnValue = false;
	}
}


//详情关注。
function DetailFollowPark(e) {
	isFollowPark(e, indexClick, statusParks);
}
//关注停车场
function isFollowPark(e, _index, _status) {
	//关注停车场
	if (parkClicked.isattention == 0) {  //未关注
		var obj = new Object();
		obj.unionid = unionid;
		obj.parkid = parkId;
		$.ajax({
			url: ATTENTION_PARK,
			cache: false,
			data: obj,
			type: 'post',
			dataType: 'json',
			success: function(data) {
				if (data.resultCode == "0" && data.dataItems != null && data.dataItems.length > 0) {
					$(e).removeClass('icon_focuson').addClass('icon_focuson2').html('已关注');
					//通过首页进入详情页。
					if (_index != undefined) {
						var tmp = $('#temp_carousel_parkInfo ul').eq(_index).find('.clickFollow ');
						tmp.removeClass('icon_focuson').addClass('icon_focuson2').html('已关注');
					}
					parkClicked.attentionid = data.dataItems[0].attributes.id;
					parkClicked.isattention = 1;
				} else {
					poptip('关注失败，请稍后再试');
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				poptip('关注失败，请稍后再试');
			}
		});
	}
	//取消关注。
	else if (parkClicked.isattention == 1) {
		var obj = new Object();
		obj.id = parkClicked.attentionid;
		$.ajax({
			url: CANCLE_ATTENTION,
			cache: false,
			data: obj,
			type: 'post',
			dataType: 'json',
			success: function(data) {
				if (data.resultCode == "0" && data.dataItems != null && data.dataItems.length > 0) {

					$(e).removeClass('icon_focuson2').addClass('icon_focuson').html('未关注');
					if (_index != undefined) {
						var tmp = $('#temp_carousel_parkInfo ul').eq(_index).find('.clickFollow ');
						tmp.removeClass('icon_focuson2').addClass('icon_focuson').html('未关注');
					}

					parkClicked.attentionid = null;
					parkClicked.isattention = 0;

					var isattentionName = $(e).parents(".fp_menu").siblings(".pd_details").find("#parkName").html() || "";  //关注列表
					$("#temp_carousel_parkInfo ul li h4 label").each(function(){
						if($(this).html().split('.')[1] == isattentionName){
							$(this).parents("li").siblings(".clickFollow").html("未关注").removeClass("icon_focuson2").addClass("icon_focuson");
						}
					});

				}
			}
		});
	}

}

/*蓝牙开锁*/
function ParkingLock(){
	$.ajax({
		url: PARK_LOCK,
		cache: false,
		async: true, //同步异步
		data: {
		 	BLUETOOTH_PROBE_ADDR : probebtaddress?probebtaddress:"",
			STATUS : 0,
			PARK_ID :parkId,
			CAR_NO : vehicleNo
		},
		dataType: 'json',
		success: function(data) {
			if (data.resultCode == "0") {
				poptip('开锁成功');
			}else{
				poptip('开锁失败');
			}
		}
	});
}

//停车场详情返回上级
function detailGoBack(detailpark){
	$(detailpark+'').css({"z-index":"10"}).siblings().css({"z-index":"1"});
	$("#parkingdetails").hide();
	if($("#homepage").is(":hidden")){
		$(".icon_return").show().attr("onclick","");
	}	
}
//停车场详情返回上级--关注列表
function detailGoFocusonlist(){
	$("#focusonlist").css({"z-index":"10"}).siblings().css({"z-index":"1"});
	$("#parkingdetails").hide();
	isAttentionParkMore = true;
	getAttentionParkData();
	$(".icon_return").show().attr("onclick","");
}

//打开停车场详情	
function goDetail() {
	$("#parkingdetails").css({"z-index":"10"}).siblings().css({"z-index":"1"});
	$("#parkingdetails").show();
	$(".icon_return").show();	
	if (parkClicked.isattention && parkClicked.isattention == 0) {
		$('#detailAttention').removeClass('icon_focuson2').addClass('icon_focuson').html('未关注');
	}
	if (parkClicked.isattention && parkClicked.isattention == 1) {
		$('#detailAttention').removeClass('icon_focuson').addClass('icon_focuson2').html('已关注');
	}
	
	var obj = new Object();
	obj.id = parkId;
	obj.unionid = unionid;
	obj.beforelongitude = beforeLocationX;
	obj.beforelatitude = beforeLocationY;
	$.ajax({
		url: PARKDETAIL,
		cache: false,
		data: obj,
		dataType: 'json',
		success: function(data) {
			if (data.resultCode == "0" && data.dataItems != null && data.dataItems.length > 0) {
				parkDetail(data.dataItems[0].attributes);
				parkClicked = data.dataItems[0].attributes;
				TouchSlide({
					slideCell: "#parkDetailImages"
				});
			}
		}
	});
	//判断停车场详情返回页面
	if(parkDetailTarget == 1){
		$("#icon_return").attr("onClick","detailGoBack('#homepage')");
	}else if(parkDetailTarget == 2){
		$("#icon_return").attr("onClick","detailGoBack('#searchList')");
	}else if(parkDetailTarget == 3){
		$("#icon_return").attr("onClick","detailGoFocusonlist()");
	}else if(parkDetailTarget == 4){
		$("#icon_return").attr("onClick","detailGoBack('#bookinglist')");
	}
};
//填充停车场详情信息
function parkDetail(data) {
	parkId = data.id;
	sessionStorage.setItem("parkId",parkId);
	if (!parkClicked.isattention && data.isattention == 0) {
		$('#detailAttention').removeClass('icon_focuson2').addClass('icon_focuson').html('未关注');
	}
	if (!parkClicked.isattention && data.isattention == 1) {
		$('#detailAttention').removeClass('icon_focuson').addClass('icon_focuson2').html('已关注');
	}
	//清理图片。
	$('#parkDetailImagesList').empty();
	if (data.park_photo) {
		var images = data.park_photo.split(',');
		for (var i = 0; i < images.length; i++) {
			if (images[i]) {
				var tp = $("<ul class='slides'><li><img/></li></ul>");
				var clientwidth = document.body.clientwidth;
				tp.find('img').attr('src', images[i]).css({"width":clientwidth,"border":"0"});
				$('#parkDetailImagesList').append(tp);
			}
		}
	}
	$('#parkName').html(data.name);
	$('#distance').html(data.distance>1000 ? parseInt(data.distance/1000).toFixed(1)+"km" : parseInt(data.distance)+"m");
	$('#price').html(data.park_qh);
	if(data.emptyParkPlaceCount == 0 || data.emptyParkPlaceCount < -1){
		$('#emptyParkPlaceCount').html('0').css("color","#ccc");
	}else if(data.emptyParkPlaceCount == -1){
		$('#emptyParkPlaceCount').html(data.parkPlaceCount).css("color","#ccc");
	}else{
		$('#emptyParkPlaceCount').html(data.emptyParkPlaceCount);
	}
	if(data.businesser_code == null || data.businesser_code == "undefined" || data.businesser_code == ""){
		$(".tip_booking").css("color","#e2e2e2").attr("onclick","");
		$("li.tip_focuson").css("color","#e2e2e2").attr("onclick","");
	}else if(data.businesser_code != null && data.businesser_code != "undefined" && data.businesser_code != "" && data.emptyParkPlaceCount <= 0){
		$(".tip_booking").css("color","#e2e2e2").attr("onclick","");
		$("li.tip_focuson").css("color","#545454").attr("onclick","showFeePay(this)");
	}else if(data.businesser_code != null && data.businesser_code != "undefined" && data.businesser_code != "" && data.emptyParkPlaceCount > 0){
		$(".tip_booking").css("color","#545454").attr("onclick","PayBookPark()");
		$("li.tip_focuson").css("color","#545454").attr("onclick","showFeePay(this)");
	}

	$('#parkPlaceCount').html(data.parkPlaceCount);
	if(data.IS_CARPLACE_SHARE&&data.IS_CARPLACE_SHARE==1){
		$("#go_to_parking").removeClass("hide");
	}else{
		$("#go_to_parking").addClass("hide");
	}
	$('#address').html(data.address);
	$('#park_fee_scale').html(data.park_fee_scale);
}

//查看停车场详情大图
$(document).on('click', '#parkDetailImagesList ul', function() {
	var tp = $(this).find('img').attr('src');
	$('#showParkDetailImage')
		.find('img').attr('src', tp)
		.parent().show().siblings().hide();
});
$(document).on('click', '#showParkDetailImage img', function() {
	$('#parkingdetails').show().siblings().hide();
});

//关注图标：切换显示隐藏关注弹出层
$("#tip_focuson").click(function(){
	if($("#focusonrecords").is(":hidden")){
		isAttentionParkMore = false;
		getAttentionParkData();
	}else{
		isAttentionParkMore = false;
		$(this).removeClass("tip_map tip_focuson_2").addClass("tip_map tip_focuson");
		$("#focusonrecords").hide();
	}
});

//获取关注停车场信息
function getAttentionParkData() {
	var obj = new Object();
		obj.pageSize = 10000;
		obj.pageIndex = 1;
		obj.unionid = unionid;
		obj.beforelongitude = beforeLocationX;
		obj.beforelatitude = beforeLocationY;
	$.ajax({
		url: ATTENTION_QUERY_LIST,
		cache: false,
		data: obj,
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			if (data.resultCode == "0" && data.dataItems != null && data.dataItems.length > 0) {
				if (isAttentionParkMore) {
					attentionParkListMsg = data.dataItems;
					$("#focusonlist_ul").empty();
					for (var i = 0; i < data.dataItems.length; i++) {
						var parkCurrent = data.dataItems[i].attributes;
						var tp = $("#focusonlist_li").clone();
						tp.show();
						tp.removeAttr('id');
						tp.find("#focusonlist_li_name").html(parkCurrent.name).removeAttr('id');
						tp.find("#focusonlist_li_price").html('¥' + parkCurrent.park_qh).removeAttr('id');
						if(parseInt(parkCurrent.distance)<1000){
							tp.find("#focusonlist_li_dis").html(parseInt(parkCurrent.distance) + 'm').removeAttr('id');
						}else{
							tp.find("#focusonlist_li_dis").html((parseInt(parkCurrent.distance)/1000).toFixed(1) + 'km').removeAttr('id');
						}
						tp.find("#focusonlist_li_addr").html(parkCurrent.address).removeAttr('id');

						if(parkCurrent.emptyParkPlaceCount == 0 || parkCurrent.emptyParkPlaceCount < -1){
							tp.find("#focusonlist_li_beds").html('0').css("color","#ccc").removeAttr('id');
						}else if(parkCurrent.emptyParkPlaceCount == -1){
							tp.find("#focusonlist_li_beds").html(parkCurrent.parkPlaceCount).css("color","#ccc").removeAttr('id');
						}else{
							tp.find("#focusonlist_li_beds").html(parkCurrent.emptyParkPlaceCount);
						}

						tp.find("#focusonlist_li_totalbeds").html(parkCurrent.parkPlaceCount).removeAttr('id');
						if (parkCurrent.emptyParkPlaceCount / parkCurrent.parkPlaceCount > 0.5) {
							tp.find(".fp_num_0").removeClass().addClass("fp_num_0 green");
						} else if (parkCurrent.emptyParkPlaceCount >= 10) {
							tp.find(".fp_num_0").removeClass().addClass("fp_num_0 orange");
						} else if (parkCurrent.emptyParkPlaceCount > 0) {
							tp.find(".fp_num_0").removeClass().addClass("fp_num_0 red");
						} else {
							tp.find(".fp_num_0").removeClass().addClass("fp_num_0 gray");
						}
						$("#focusonlist_ul").append(tp);
					}
					parkDetailTarget = 3;

				} else {
					$("#attentionParkList").empty();
					attentionParkListMsg = data.dataItems;
					var attentionLength = 0;
					if (data.dataItems.length <= 5) {
						attentionLength = data.dataItems.length;
					} else {
						attentionLength = 5;
					}
					for (var i = 0; i < attentionLength; i++) {
						var parkCurrent = data.dataItems[i].attributes;
						var tp = $("#attentionParkMsg").clone();
						tp.show();
						tp.removeAttr('id');
						tp.find("#parkNameAttention").html(parkCurrent.name).removeAttr('id');
						tp.find("#parkPriceAttention").html('¥' + parkCurrent.park_qh).removeAttr('id');
						tp.find("#parkDistanceAttention").html(parseInt(parkCurrent.distance)>1000 ? (parseInt(parkCurrent.distance)/1000).toFixed(1)+'km' : parseInt(parkCurrent.distance)+'m').removeAttr('id');
						$("#attentionParkList").append(tp);
					}
					$("#attentionParkList").append('<p onClick="attentionMore();"></p>');
					$(this).removeClass("tip_map tip_focuson").addClass("tip_map tip_focuson_2");
					$("#focusonrecords").show();
				}
			}else{
				$("#focusonrecords").hide();
				if($("#focusonlist").is(":visible")){
					$("#bookinglist .fp_list").empty().html("目前没有关注记录").css("text-align","center");
				}else{
					poptip('目前暂时没有关注停车场');
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			poptip('获取关注停车场信息失败，请重试');
		}
	});
}

//显示关注的停车场列表
function attentionMore() {
	isAttentionParkMore = true;
	$("#focusonlist").css({"z-index":"10"}).siblings().css({"z-index":"1"})
	$("#focusonrecords").hide();
	$(".icon_return").show();
	$("#tip_focuson").attr("class", "tip_map tip_focuson");
	getAttentionParkData();
}

//导航
//起、终点
var line, //路线对象
	sicon,
	startmarker,
	polyline, //pol路线
	endmarker,
	eicon;
function driving_route() {
 var driving = new BMap.DrivingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: true}});
	driving.search(new BMap.Point(116.404, 39.915), new BMap.Point(116.404, 39.919));









	if ($('#leftTabBox')[0].style.zIndex == '1') {
		$('#leftTabBox').css("z-index","-1");
	}
	var MDrive;
	BMap.DrivingRoute(["BMap.Driving"], function() {
		var DrivingOption = {
			policy: BMap.DrivingPolicy.LEAST_TIME
		};
		MDrive = new BMap.Driving(DrivingOption); //构造驾车导航类 
		//根据起终点坐标规划驾车路线
		MDrive.search(start_xy, end_xy, function(status, result) {
			if (status === 'complete' && result.info === 'OK') {
				driving_routeCallBack(result);
				for (var i = 0; i < markerobj.length; i++) {
					markerobj[i].setMap(null); //批量删除以前的停车场标注
				}
				flagGPS = true;
			} else {
				poptip(result);
			}
		});
	});
	$("#tip").show();
}
//导航结果展示
function driving_routeCallBack(data) {
	var routeS = data.routes;
	if (routeS.length <= 0) {
		document.getElementById("result").innerHTML = "未查找到任何结果!<br />建议：<br />1.请确保所有字词拼写正确。<br />2.尝试不同的关键字。<br />3.尝试更宽泛的关键字。";
	} else {
		route_text = "";
		for (var v = 0; v < routeS.length; v++) {
			//驾车步骤数
			steps = routeS[v].steps;
			var route_count = steps.length;
			//行车距离（米）
			var distance = routeS[v].distance;
			//拼接输出html
			for (var i = 1; i < steps.length; i++) {
				route_text += "<tr><td align=\"left\" onMouseover=\"driveDrawFoldline('" + i + "')\">" + i + "." + steps[i].instruction + "</td></tr>";
			}
		}

		//输出行车路线指示
		route_text = "<table cellspacing=\"5px\"><tr><td><img src=\"./image/start.gif\" />&nbsp;&nbsp;当前位置</td><td id='btn_close' class='icon_close'>退出导航</td></tr>" + route_text + "<tr><td><img src=\"./image/end.gif\" />&nbsp;&nbsp;" + tname + "</td></tr></table>";
		document.getElementById("result").innerHTML = route_text;
		drivingDrawLine();

		var liheight = $("#result").find("tr").length;
		if (liheight < 7) {
			var reheight1 = liheight * 20 + 50 + "px";
			var reheight2 = liheight * 20 + 90 + "px";
		} else {
			var reheight1 = "180px";
			var reheight2 = "220px";
		};
		$("#tip_zoom1").css("bottom", reheight2);
		$("#tip_zoom2").css("bottom", reheight1);
		$(".amap-geo").css("bottom", reheight1).hide();
	}
}
//绘制驾车导航路线
function drivingDrawLine(s) {
	/*var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/fox.gif", new BMap.Size(300,157));
	var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
	map.addOverlay(marker2);              // 将标注添加到地图中
	
	sicon = new BMap.Icon("./image/icon_loadpoint2.png",new BMap.Size(36, 58),new BMap.Pixel(0, 0));*/
	
	// 	//起点图标
	sicon = new BMap.Icon({
		image: "./image/icon_loadpoint2.png",
		size: new BMap.Size(36, 58),
		imageOffset: new BMap.Pixel(0, 0)
	});
	if (endmarker != null) {
		endmarker.setMap(null);
	}
	if (polyline != null) {
		polyline.setMap(null);
	}
	startmarker = new BMap.Marker({
		icon: sicon, //复杂图标
		visible: true,
		position: start_xy,
		map: mapObj,
		offset: {
			x: -20,
			y: -50
		}
	});
	//终点图标
	eicon = new BMap.Icon({
		image: "./image/icon_loadpoint1.png",
		size: new BMap.Size(36, 58),
		imageOffset: new BMap.Pixel(0, 0)
	});
	endmarker = new BMap.Marker({
		icon: eicon, //复杂图标
		visible: true,
		position: end_xy,
		map: mapObj,
		offset: {
			x: -20,
			y: -40
		}
	});
	//起点到路线的起点 路线的终点到终点 绘制无道路部分
	var extra_path1 = new Array();
	extra_path1.push(start_xy);
	extra_path1.push(steps[0].path[0]);
	var extra_line1 = new BMap.Polyline({
		map: mapObj,
		path: extra_path1,
		strokeColor: "#9400D3",
		strokeOpacity: 0.7,
		strokeWeight: 4,
		strokeStyle: "dashed",
		strokeDasharray: [10, 5]
	});

	var extra_path2 = new Array();
	var path_xy = steps[(steps.length - 1)].path;
	extra_path2.push(end_xy);
	extra_path2.push(path_xy[(path_xy.length - 1)]);
	var extra_line2 = new BMap.Polyline({
		map: mapObj,
		path: extra_path2,
		strokeColor: "#9400D3",
		strokeOpacity: 0.7,
		strokeWeight: 4,
		strokeStyle: "dashed",
		strokeDasharray: [10, 5]
	});

	var drawpath = new Array();
	for (var s = 0; s < steps.length; s++) {
		var plength = steps[s].path.length;
		for (var p = 0; p < plength; p++) {
			drawpath.push(steps[s].path[p]);
		}
	}
	var polyline = new BMap.Polyline({
		map: mapObj,
		path: drawpath,
		strokeColor: "#9400D3",
		strokeOpacity: 0.7,
		strokeWeight: 4,
		strokeDasharray: [10, 5]
	});
	mapObj.setFitView();
}

//绘制驾车导航路段
function driveDrawFoldline(num) {
	var drawpath1 = new Array();
	drawpath1 = steps[num].path;
	if (polyline != null) {
		polyline.setMap(null);
	}
	polyline = new BMap.Polyline({
		map: mapObj,
		path: drawpath1,
		strokeColor: "#FF3030",
		strokeOpacity: 0.9,
		strokeWeight: 4,
		strokeDasharray: [10, 5]
	});
	mapObj.setFitView(polyline);
}
//开始导航
function DrivingRouteInsiade() {
	$("#homepage").css({"z-index":"10"}).siblings().css({"z-index":"1"});
	//$(this).hide();
	//$(this).css({"z-index":"1"});
	$(".parkList li").css("background-color", "");
	driving_route();
}
//退出导航
$('#btn_close').live('touchend', function() {
   $(".confirm").removeClass("hide");
   $(".mask").show();
});
//确认按钮
$('#confirm_sure').live('touchend',function(){
	$(".confirm").addClass("hide");
    $(".mask").hide();
	window.location.href = window.location.href;
	window.event.returnValue = false;
});
//取消按钮
$('#confirm_cancel').live('touchend',function(){
	$(".confirm").addClass("hide");
    $(".mask").hide();
});

//实时路况切换
$("#tip_traffic").click(function(){
	var traffic = new BMap.TrafficLayer();
	  if( $("#tip_traffic").hasClass("tip_traffic") ){
		  _traffic = traffic;
		 mapObj.removeTileLayer(_traffic);
		 
		 $("#tip_traffic").removeClass("tip_traffic").addClass("tip_traffic2");
	  }else{
		  _traffic = traffic;
		  _traffic.hide();
		 mapObj.addTileLayer(_traffic);
/*var ctrl = new BMapLib.TrafficControl();
mapObj.addControl(ctrl);*/
		 $("#tip_traffic").removeClass("tip_traffic2").addClass("tip_traffic");
	  }

   }
);

	/*mapObj.centerAndZoom(new BMap.Point(lng, lat), 16); 
	var ctrl = new BMapLib.TrafficControl({
		showPanel: false //是否显示路况提示面板
	});   */   
	 
	

	
 	

// 全景地图
    mapObj.enableScrollWheelZoom(true);
	// 覆盖区域图层测试
	mapObj.addTileLayer(new BMap.PanoramaCoverageLayer());
	var stCtrl = new BMap.PanoramaControl(); //构造全景控件
	stCtrl.setOffset(new BMap.Size(20, 20));
	
mapObj.addEventListener("tilesloaded",function(){
	mapObj.addControl(stCtrl);//添加全景控件
	$(".BMap_noprint").css("right","5px");
});


// 定位		
function addtoolbar(){
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			mapObj.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), mapZoom);
		}
		else {
			alert('failed'+this.getStatus());
		}        
	},{enableHighAccuracy: true})
}
    
//自定义地图工具条
var mapZoom = mapObj.getZoom();
document.getElementById('tip_zoom1').onclick = function() {   //放大
	
	mapObj.centerAndZoom(new BMap.Point(lng, lat),(mapZoom + 1));
    mapZoom=mapZoom + 1;
};

document.getElementById('tip_zoom2').onclick = function() {   //缩小
	mapObj.centerAndZoom(new BMap.Point(lng, lat),(mapZoom - 1));
	mapZoom=mapZoom - 1;
};


/*var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM});
mapObj.addControl(top_right_navigation);*/
//缴费
function showFeePay(obj){
	var businesser_code = parkClicked.businesser_code;
	var park_code = parkClicked.park_code;
	if (!businesser_code || typeof(businesser_code) == "undefined" || businesser_code == '') {
		poptip('抱歉，改停车场没有商户编号，您不能进行缴费！');
		return;
	} else {
		if($(obj).attr('class') == "tip_li amap-info-btn icon_price"){  //弹出窗口
			var parkName_text = $(obj).siblings("li").first().find("label").text()
			var parkName = parkName_text.substring(parkName_text.indexOf('.')+1);
		}else if($(obj).attr('class') == "tip_li_yd tip_focuson"){  //详情页面
			var parkName = $(obj).parents(".fp_menu").siblings("#detailPark").find("#parkName").text();
		}
		localStorage.setItem('parkingId',parkClicked.id);
		localStorage.setItem('name',parkName);
		localStorage.setItem('park_code',park_code);
		localStorage.setItem('businesser_code',businesser_code);
		localStorage.setItem('queryNearbyPark',"false");

		var host = "http://" + window.location.host;
		var title = $("title").html();
		if(title == "捷停车"){
			window.location.href = host + "/jspsn/html/carNo-pay.html?from=JTC";
			window.event.returnValue = false;
		}else{
			window.location.href = host + "/jspsn/html/carNo-pay.html";
			window.event.returnValue = false;
		}
	}
}


//返回上级
$("#icon_return").click(function() {
	$("#homepage").css({"z-index":"10"}).siblings().css({"z-index":"1"});
	$(this).hide();
});


//搜索框点击，跳转至搜索页面
$("#searchParkName").click(function() {
	searchPark();
});

function searchPark(){
	$("#searchpage").css({"z-index":"10"}).siblings().css({"z-index":"1"});
	$(".icon_return").show();
	$("#keyword").focus();
	var parkSearch;
	if (localStorage.getItem("SearchParkName")) {
		parkSearch = localStorage.getItem("SearchParkName").split(',');
	} else {
		parkSearch = [];
	}
	if (parkSearch && parkSearch.length > 0) {
		$('#historyCode').empty();
		for (var i = 0; i < parkSearch.length; i++) {
			$('#historyCode').append('<li>'+parkSearch[i]+'</li>');
		}
	}
	$("#historyCode li").on('click',function() {
		$('#keyword').val($(this).html());
		SecrchByKeyword(true);
	});
}

//停车费、剩余车位数图标切换
$("#tip_layer").click(function(){
	if($(this).hasClass("tip_standard")){  //停车费，切换至剩余车位
		for (var k in aroundParking) {
			var emptyParkPlaceCount = aroundParking[k].attributes.emptyParkPlaceCount; 
			var parkPlaceCount = aroundParking[k].attributes.parkPlaceCount;

			if(emptyParkPlaceCount == 0 || emptyParkPlaceCount < -1){
				$(markerSpan[k]).html('0').css("color","#999");
			}else if(emptyParkPlaceCount == -1){
				$(markerSpan[k]).html(parkPlaceCount).css("color","#999");
			}else{
				$(markerSpan[k]).html(emptyParkPlaceCount);
			}
		}
		$(this).removeClass("tip_map tip_standard").addClass("tip_map tip_number");
	}else{  //剩余车位，切换至停车费
		for (var k in aroundParking) {
			markerSpan[k].innerHTML = "¥" + aroundParking[k].attributes.park_qh;
		}
		$(this).removeClass("tip_map tip_number").addClass("tip_map tip_standard");
	}
});

//在车场详情跳转至车场地图
function comeMap(){
	var parkingName = $("#parkName").html();
	var regionId = getRegions(parkingName);
	if (!regionId && regionId != "") {
		poptip("该停车场无室内地图！");
		return ;
	};
	var floorId = loadFloor(regionId);
	sessionStorage.setItem("parkingName",parkingName);
	sessionStorage.setItem("park_id",parkId);
	var host = window.location.href.split("sy_html")[0];
	if(location.href.indexOf('from=') > -1){
		var fromUrl = location.href.split("from=")[1].substr(0,3);
	}
	if(fromUrl && fromUrl == "JTC"){
		window.location.href = host + "html/dynamic/navitest.htm?from=JTC&regionId=" + regionId +"&floorId=" + floorId;
		window.event.returnValue = false;
	}else{
		window.location.href = host + "html/dynamic/navitest.htm?regionId=" + regionId +"&floorId=" + floorId;
		window.event.returnValue = false;
	}
}
//获取车场
function getRegions(region){
	var regionId;
    var url = 'http://h5.indoorun.com:81/h5/getRegions.html';
    var param = '';
    $.ajax({
        url: window.location.href.split('jspsn')[0]+'jspsn/' + "httpRequest.servlet", //地址
        type: 'post', //提交方式 可以选择post/get 推荐post
        async: false, //同步异步
        data:{url:url,param:param},
        dataType: 'json', //返回数据类型
        success: function(data) {
            if (data) {                 
                //var evalData = strToJson(data);
                for ( var i = 0; i < data.regions.length; i++) {
                    if (data.regions[i].name == region) {
                        regionId = data.regions[i].id;
                        break;
                    }
                }
            }
        }
    });
    return regionId;
}
function loadFloor(regionId){
	var floorId;
	//获取所有展商信息
	(function(){
	    var url = 'http://wx.indoorun.com/wx/getRegionInfo';
	    var param = 'regionId=' + regionId || '';
	    //alert(getRegions());
		$.ajax({
			url: window.location.href.split('jspsn')[0]+'jspsn/' + "httpRequest.servlet", //地址
			type: 'post', //提交方式 可以选择post/get 推荐post
			async: false, //同步异步
			data:{url:url,param:param},
			dataType: 'text', //返回数据类型
			success: function(str) {
		        str = str.replace(/\n/g, '');
		        var data = eval('(' + str + ')');
		        if (data != null) {
		          if (data.code == "success") {
		            floorId = data.data.floorList[0].id;//默认取缔一个楼层
		            //alert(floorId);
		          }
		        }
		     },
		    error:function(str) {
	          alert('楼层信息获取失败!'+str);
	      	}
		});
	})();
	return floorId;
};

function GetRequest() { 
	var url = location.search;
	url = decodeURIComponent(url); 
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) { 
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
		} 
	}
	return theRequest; 
}