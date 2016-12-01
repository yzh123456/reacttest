$(document).ready(function() {

	$(document).on('click', '#btn_pay', function() {
		$("#payok").show().siblings().hide();
		$(".icon_return").show();
	});	
	$(".btn_receive").click(function() {
		$(".popup_share").show();
	});
	$(".pay_coupon").click(function() {
		$(".pay_couponbox").show();
	});
	$(".fp_sort li:not(.fp_search)").click(function() {
		$(this).addClass("selected").siblings().not(".fp_search").removeClass("selected");
	});
	
	$("#keyword").bind('input propertychange', function() {
		var wordlength = $("#keyword").val().trim();
		if (wordlength.length == 0) {
			$(".btnClear").hide();
		} else {
			$(".btnClear").show();
		};
	});
	$(".btnClear").click(function() {
		$("#keyword").val('');
		$("#scanpage input").val('');
		$("#scanpage nav").show();
		$(this).hide();
	});
	$("#scanpage li").click(function() {
		$("#scanpage input").val($(this).html()).focus();
		$("#scanpage nav").hide();
		$(".btnClear").show();
	});
	$("#bookingScan li").click(function() {
		$("#bookingScan input").val($(this).html()).focus();
		$("#bookingScan nav").hide();
		$(".btnClear").show();
	});
	$("#carNo").click(function() {
		if ($(this).val() == "") {
			$("#scanpage nav").show();
		}
	});
	var coupon_li = $(".pay_couponbox li");
	for (i = 0; i < coupon_li.length; i++) {
		$(coupon_li[i]).click(function() {
			$(this).find("input[type=radio]").attr("checked", true);
			$(".pay_couponbox").hide();
			var couponbox_text = $(this).find("h3").text();
			$(".pay_coupon > span").text(couponbox_text);
		});
	};
	$('.pay_coupon2').live('touchstart', function() {
		$(".popup_share").hide();
	});
	$('#payok .pay_details').live('touchstart', function() {
		$(".popup_share").hide();
	});
});