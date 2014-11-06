define(['jquery','handlebars'],function($,Handlebars){
    var o = {};
    var config={};
    var fixObj={};//未预定的popup
    fixObj.box=$("#popupFix");
    fixObj.meetingForm=document.getElementById("meetingForm");
    fixObj.title=$("#popupTitle");
    fixObj.close=$("#meetingPopupClose");
    fixObj.startHour=$("#startHour");
    fixObj.startMinu=$("#startMinu");
    fixObj.endtHour=$("#endtHour");
    fixObj.endMinu=$("#endMinu");
    fixObj.meetingTitle=$("#meetingTitle");
    fixObj.meetingUser=$("#meetingUser");
    fixObj.meetingUserEmail=$("#meetingUserEmail");
    fixObj.saveMeetingBtn=$("#saveMeetingBtn");

    fixObj.close.on("click",function(){
        fixObj.box.addClass("hide");
        fixObj.meetingForm.reset();

    });
    var disabledPopup={};
    disabledPopup.box=$("#popupDisabled");
    disabledPopup.tpl='<div class="mis-popup-stuff "><div class="title-popup-box"><h3 class="mis-popup-title">{{meetingName}}</h3><i class="mis-popup-close"title="关闭"type="close"></i></div><div class="mis-popup-content"><ul class="popup-form-wrap"><li class="form-item"><div class="input-item"><label class="pwd-label">会议时间:</label><input class="input-txt01  mis-input"value="{{tplStart}}-{{tplEnd}}"readonly/></div></li><li class="form-item"><div class="input-item"><label class="pwd-label"><em class="star-tip">*</em>会议主题:</label><input class="input-txt01  mis-input"value="{{ title}}"readonly/></div></li><li class="form-item"><div class="input-item"><label class="pwd-label"> 预订人:</label><input class="input-txt01  mis-input"value="{{ meetingUser}}"readonly/></div></li><li class="form-item"><div class="input-item"><label class="pwd-label">联系方式:</label><input class="input-txt01  mis-input"value="{{ meetingUserEmail}}"readonly/></div></li></ul></div></div>';


    disabledPopup.template=Handlebars.compile(disabledPopup.tpl);
    disabledPopup.box.on("click",function(e){
       var ele= e.target;
        if(ele.getAttribute("type")==="close"){
            disabledPopup.box.addClass("hide");
        }
    });
    o.init=function(param){
        config=param;
        config.minRange=[];
        for(var i = 0; i <60;i=i+config.minRangeTime){
            if(i<10){
                config.minRange.push("0"+i);
            }else{
                config.minRange.push(i);
            }
        }
    }
    function formatRangeData(param){
        var c = {};
        //生成2级联动下拉框
        var startArray=param.tplStart.split(":");
        var endArray=param.tplEnd.split(":");

        for(var i = startArray[0]-0; i <=endArray[0]-0;i++){

            var sMin=config.minRange[0];
            var eMax=config.minRange[config.minRange.length-1];
            if(i ==startArray[0]){
                  sMin=startArray[1];
                var arrayIndex= getArrayIndex(config.minRange,sMin);
               //
                c[i]=config.minRange.slice(arrayIndex);
            }else if(i==endArray[0]){
                 eMax=endArray[1] ;
                var arrayIndex=getArrayIndex(config.minRange,eMax);
                c[i]=config.minRange.slice(0,arrayIndex);
            }else{
                //
              c[i]=[].concat(config.minRange);
            }
        }
        return c;
    }
    function getArrayIndex(arr,item){
        for(var i = 0; i<arr.length;i++){
            if(item==arr[i]){
                return i;
            }
        }
    }
    o.fixPopupOpen=function(data){

        var rangeTime=formatRangeData(data);

        fixObj.box.removeClass("hide");
    }
    o.disabledPopupOpen=function(data){
        disabledPopup.box.html(disabledPopup.template(data));
        disabledPopup.box.removeClass("hide");
    }
    return o;
});