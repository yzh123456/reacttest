/**
 * Created by zhest on 2016/11/29.
 */
export let dataService = {
    //加载所有车位分享记录
    loadCarPlaceShareRecord : function(data,pageIndex = 1){
        let carPlaceList = "";
        var lng = '113.366856';
        var lat = '22.521415';
        var key = data.key;
        if (data && data.position) {
            data = locat;
            lng = data.position.getLng();
            lat = data.position.getLat();
        };
        window.loadMoreStop = false;
        $.ajax({
            url : 'http://192.168.1.205:7774/jspsn/queryCarPlaceShareList.servlet',//jsLifeKFS.getHost() + "queryCarPlaceShareList.servlet",
            cache : false,
                data : {
                PAGE_SIZE : 10,
                PAGE_INDEX : pageIndex,
                BEFORELONGITUDE : lng,//用户当前经度
                BEFORELATITUDE : lat,//用户当前纬度
                KEY:key || 6
            },
            dataType : 'json',
            type:'post',
            async:false,
            success : function(data) {
                carPlaceList = data;
                /*if (data.resultCode == "0" && data.dataItems != null && data.dataItems.length > 0) {

                }else if (data.resultCode == "0" && data.dataItems != null && data.dataItems.length == 0) {
                    if($(".share_content_list .periphery").length>0){
                        $(".share_content_list").append('<div class="periphery" style="text-align:center;">暂无更多内容</div>');
                    }else{
                        $(".share_content_list").append('<div class="periphery" style="text-align:center;">暂无内容</div>');
                    }
                }*/
        },
        /*error : function(XMLHttpRequest, textStatus) {
            $(".lock_car_and_ground").html("<em>定位不到附近的车场！请手动搜索。</em>");
            $(".zhegai, #waiting").hide();
        }*/
    });
        return carPlaceList;
    }

}