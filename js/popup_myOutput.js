define(['jquery','handlebars'],function($,Handlebars){
    var o = {};
    var config={};
    var fixObj={};//未预定的popup
    var rangeTime={};
	var body=$("body");
    fixObj.box=$("#popupFix");
	var popupFixTPL='<div class="mis-popup-wrap hide"id="popupFix"><div class="mis-popup-stuff "><div class="title-popup-box"><h3 class="mis-popup-title"id="popupTitle">预定会议室--</h3><i class="mis-popup-close"title="关闭"id="meetingPopupClose"></i></div><div class="mis-popup-content"><form onsubmit="return false;"id="meetingForm"><ul class="popup-form-wrap"><li class="form-item"><div class="input-item"><label for="startHour"class="pwd-label"><em class="star-tip">*</em>选择开始时间:</label><div class="select-box01"><select class="mis-select"id="startHour"> </select><span class="select-tips">点</span><select class="mis-select"id="startMinu"> </select><span class="select-tips">分</span></div></div></li><li class="form-item"><div class="input-item"><label for="endHour"class="pwd-label"><em class="star-tip">*</em>选择结束时间:</label><div class="select-box01"><select class="mis-select"id="endHour"> </select><span class="select-tips">点</span><select class="mis-select"id="endMinu"> </select><span class="select-tips">分</span></div></div></li><li class="form-item"><div class="input-item"><label for="meetingTitle"class="pwd-label"><em class="star-tip">*</em>会议主题:</label><input class="input-txt01 mis-input"id="meetingTitle"value=""></div></li><li class="form-item"><div class="input-item"><label for="meetingUser"class="pwd-label"><em class="star-tip">*</em>预订人:</label><input class="input-txt01 mis-input"id="meetingUser"value=""></div></li><li class="form-item"><div class="input-item"><label for="meetingUserPhone"class="pwd-label"><em class="star-tip">*</em>手机号码:</label><input class="input-txt01  mis-input "id="meetingUserPhone"value=""> </div></li><li class="form-item"><div class="input-item"><label for="meetingUserEmail"class="pwd-label"><em class="star-tip">*</em>公司邮箱:</label><input class="  mis-input"id="meetingUserEmail"value=""><span class="input-tips">@diditaxi.com.cn</span></div></li><li class="form-item txt-center"><input class="mis-btn mis-btn02"id="saveMeetingBtn"value="提 交"type="button"></li></ul></form></div></div></div>';
	if(fixObj.box.length!=1){
		body.append(popupFixTPL);
		 fixObj.box=$("#popupFix");
	}
	
 
    fixObj.meetingForm=document.getElementById("meetingForm");
    fixObj.title=$("#popupTitle");
    fixObj.close=$("#meetingPopupClose");
	
	
    fixObj.startHour=$("#startHour");
    fixObj.startMinu=$("#startMinu");
    fixObj.endHour=$("#endHour");
    fixObj.endMinu=$("#endMinu");
    fixObj.meetingTitle=$("#meetingTitle");
    fixObj.meetingUser=$("#meetingUser");
    fixObj.meetingUserEmail=$("#meetingUserEmail");
    fixObj.meetingUserPhone=$("#meetingUserPhone");
    fixObj.saveMeetingBtn=$("#saveMeetingBtn");

    fixObj.close.on("click",function(){
         o.fixPopupClose();
    });
    var disabledPopup={};
    disabledPopup.box=$("#popupDisabled");
	var popupCloseTPL='<div class="mis-popup-wrap hide" id="popupDisabled"></div>';
	if(disabledPopup.box.length!=1){
		body.append(popupCloseTPL);
		 disabledPopup.box=$("#popupDisabled");
	}
    disabledPopup.tpl='<div class="mis-popup-stuff "><div class="title-popup-box"><h3 class="mis-popup-title">{{meetingName}}</h3><i class="mis-popup-close"title="关闭"type="close"></i></div><div class="mis-popup-content"><ul class="popup-form-wrap"><li class="form-item"><div class="input-item"><label class="pwd-label">会议时间:</label><input class="input-txt01  mis-input"value="{{tplStart}}-{{tplEnd}}"readonly/></div></li><li class="form-item"><div class="input-item"><label class="pwd-label">会议主题:</label><input class="input-txt01  mis-input"value="{{ title}}"readonly/></div></li><li class="form-item"><div class="input-item"><label class="pwd-label"> 预订人:</label><input class="input-txt01  mis-input"value="{{ meetingUser}}"readonly/></div></li><li class="form-item"><div class="input-item"><label class="pwd-label">手机号码:</label><input class="input-txt01  mis-input"value="{{ meetingUserPhone}}"readonly/></div></li><li class="form-item"><div class="input-item"><label class="pwd-label">公司邮箱:</label><input class="input-txt01  mis-input"value="{{ meetingUserEmail}}"readonly/></div></li></ul></div></div>';


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
        var hour=[];
        //生成2级联动下拉框
        var startArray=param.tplStart.split(":");
        var endArray=param.tplEnd.split(":");

        for(var i = startArray[0]-0; i <=endArray[0]-0;i++){
            hour.push(i);

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

        return {hour:hour,hourList:c};
    }
    function getArrayIndex(arr,item){
        for(var i = 0; i<arr.length;i++){
            if(item==arr[i]){
                return i;
            }
        }
    }
    function createOption(list){
          var h = '';
            for(var i = 0; i <list.length;i++){
                h+='<option value="'+list[i]+'">'+list[i]+'</option>';
            }
        return h;
     }
    fixObj.startHour.on("change",function(){
        var v = this.value;
        var minu=rangeTime.hourList[v];
        fixObj.startMinu.html(createOption(minu));
        //结束时间的限制
        var s = getArrayIndex(rangeTime.hour,v);
		if(config.superRight){
			var endH=rangeTime.hour.slice(s);
		}else{
			var endH=rangeTime.hour.slice(s,s+config.maxTime/60+1);
		}
        fixObj.endHour.html(createOption(endH));
    });
     fixObj.endHour.on("change",function(){
        var v = this.value;
        var minu=rangeTime.hourList[v];
        fixObj.endMinu.html(createOption(minu));
    });
	 fixObj.saveMeetingBtn.on("click",function(){
		var startHour=fixObj.startHour.val();
		var	startMinu=fixObj.startMinu.val();
		var endHour=fixObj.endHour.val();
		var	endMinu=fixObj.endMinu.val();
		var s = new Date();
		var e = new Date();
		s.setHours(startHour);
		s.setMinutes(startMinu);
		var sTime=s.getTime();
		e.setHours(endHour);
		e.setMinutes(endMinu);
		var eTime=e.getTime();
		var r = (eTime-sTime)/(1000*60);
		if(!config.superRight){
			if(r>config.maxTime){
				alert("最长预定时间不能超过"+config.maxTime+"分钟");
				return false;
			}
		}
		var meetingTitle=$.trim(fixObj.meetingTitle.val());
		if(!meetingTitle.length){
			alert("会议主题不能为空");
			return false;
		}
		var meetingUser=$.trim(fixObj.meetingUser.val());
		if(!meetingUser.length){
			alert("预订人不能为空");
			return false;
		}		
		var meetingUserPhone=$.trim(fixObj.meetingUserPhone.val());
		if(/^1[34578][0-9]{9}$/.test(meetingUserPhone)==false){
			alert("请填写正确的手机号");
			return false;
		}	
		var meetingUserEmail=$.trim(fixObj.meetingUserEmail.val());
		if(!meetingUserEmail.length){
			alert("预订人邮箱不能为空");
			return false;
		}	
			
		meetingUserEmail=meetingUserEmail+"@diditaxi.com.cn";
		var param={start_date:config.dateInput.val()+" "+startHour+":"+startMinu,end_date:config.dateInput.val()+" "+endHour+":"+endMinu,meeting_user_name:meetingUser,meeting_user_email:meetingUserEmail,meeting_title:meetingTitle,meeting_room_id:config.meetingId,meeting_user_phone:meetingUserPhone}
		$.post("/mis/meeting/addMeetingOrder",param,function(serverData){
			if(serverData){
				if(serverData.errno==0){
					o.fixPopupClose();
				}else if(serverData.errno==-1){
					//-1代表此会议室在该时间段已经预定
					alert("此会议室在该时间段已经预定");
					return false;
				}else{
					alert(serverData.msg);
				}
			}
		 
		},"json");
		
		
	 });
    o.fixPopupOpen=function(data){
		fixObj.title.html("预定会议室--"+data.meetingName);
		config.meetingId=data.meetingId;
         rangeTime=formatRangeData(data);
        fixObj.startHour.html(createOption(rangeTime.hour)).trigger("change");
        fixObj.endHour.trigger("change");
		
        fixObj.box.removeClass("hide");
    }
	o.fixPopupClose=function(){
		// 
		 fixObj.box.addClass("hide");
		fixObj.meetingForm.reset();
		fixObj.endHour.html("");
		fixObj.endMinu.html("");
		
		$("#searchBtn").trigger("click");
	}
    o.disabledPopupOpen=function(data){
        disabledPopup.box.html(disabledPopup.template(data));
        disabledPopup.box.removeClass("hide");
    }
	
    return o;
});