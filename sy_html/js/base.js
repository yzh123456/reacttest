;(function(window){
	//判断来源，改变title
	var fromUrl = location.href.split("from=")[1];
	if(fromUrl && fromUrl == "JTC"){
		document.getElementsByTagName('title')[0].innerHTML = "捷停车";
		sessionStorage.setItem("appFrom","JTC");
	}
	if("JTC" == sessionStorage.getItem("appFrom")){
		document.getElementsByTagName("title")[0].innerHTML="捷停车";
	}else{
		document.getElementsByTagName('title')[0].innerHTML = "捷生活";
	}

	//获取参数
	function $_GetRequest() {
		var url = location.search;
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for ( var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	};

	//获取unionid
	var jspsn_url = location.href;
	var _id = $_GetRequest().unionid || "";
	if (null == _id || undefined == _id || "null" == _id || "undefined" == _id || "" == _id) {
		_id = sessionStorage.getItem('jspsn_unionid');
		if (null == _id || undefined == _id || "null" == _id || "undefined" == _id || "" == _id) {
			var _servlet = jspsn_url.substring(0, jspsn_url.indexOf("sy_html"));
			_servlet += ("parkApp/userValid.servlet?jspsn_url=" + jspsn_url);
			window.location.href=_servlet;
			window.event.returnValue = false;
		};
	};
	
	
	if (null != _id && undefined != _id && "null" != _id && "undefined" != _id && "" != _id) {
		sessionStorage.setItem('jspsn_unionid', _id);
		var url=jspsn_url.split("?")[0];
		$.ajax({
			url : jspsn_url.split('jspsn')[0]+"jspsn/parkApp/"+ "userMenuSave.servlet?unionid="+_id+"&url="+url,
			cache : false,
			dataType : 'text',
			async : false,
			type:'post',
			success : function(data) {
				;
			}
		});
	};

	window.jspsnQueryOpen = function(){
		return sessionStorage.getItem('jspsn_unionid');
	};


	//触摸屏事件
	window.touchEvent =  function(element,e,fun){
		var start_x, start_y, end_x, end_y, move_num;
	    var client_height = $(window).height();
	    $(element).on("touchstart", function(e) {
	        start_x = e.originalEvent.targetTouches[0].clientX;
	        start_y = e.originalEvent.targetTouches[0].clientY;
	    });
	    $(element).on("touchmove", function(e) {
	        $(this).removeClass("slow_action");
	        end_x = e.originalEvent.targetTouches[0].clientX;
	        end_y = e.originalEvent.targetTouches[0].clientY;
	        move_num = (end_y - start_y).toFixed(2);
	    });
	    $(element).on("touchend", function() {
	        if (move_num < -(client_height / 2)){  //下往上，半屏
	        	fun();
	        } else if (move_num > 0) {  //上往下
	            fun();
	        } else {  //点击，不滑动
		        
	        }
    	});
	}

	function onBridgeReady(){
		WeixinJSBridge.call('hideOptionMenu');
	}

	if (typeof WeixinJSBridge == "undefined"){
	    if( document.addEventListener ){
	        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	    }else if (document.attachEvent){
	        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
	        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	    }
	}else{
	    onBridgeReady();
	}

	/*var jsLifeKFS = function() {
		var _$ajax = function(options) {
			var img = $("#progressImgage");
			var mask = $("#maskOfProgressImage");
			var complete = options.complete;
			options.complete = function(httpRequest, status) {
				img.hide();
				mask.hide();
				if (complete) {
					complete(httpRequest, status);
				}
			};		
			options.async = true;		
			img.show().css({
				"position" : "fixed",
				"top" : "50%",
				"left" : "50%",
				"z-index" : "99999",
				"margin-top" : function() {
					return -1 * img.height() / 2;
				},
				"margin-left" : function() {
					return -1 * img.width() / 2;
				}
			});
			mask.show().css("opacity", "0.1");
			$.ajax(options);
		};
		return {
			ajax : _$ajax,
		}
	}()*/
})(window);