requirejs.config({
    shim : {
        'handlebars' : {
            exports : 'Handlebars'
        }
    },
        paths : {
            'jquery': "http://libs.baidu.com/jquery/1.9.0/jquery",
            'handlebars' : "handlebars"
        }
})
require(['jquery',"my_svg",'handlebars','popup'],function($,mySVG,Handlebars,popup){
    var config={};
    config.xAxisTime=[];
    config.interval=30;//30分钟一个数据点
    config.startTime=9;//早九点
    config.endTime=21;//晚21点
    config.strStartTime="9:00";
    config.strEndTime="21:00";
    config.maxTime=60*3;//会议室最长时间180分钟
    config.minRangeTime=5;//时间间隔,5分钟
    config.rangeTime=(config.endTime-config.startTime)*60*60;
    config.leftWidth=150;
    config.yAxis=30;
    config.scaleY=80;//y轴间隔
    config.lineColor="#C0D0E0";
    config.meetingData=[{id:1,name:"湾流",meetingTime:[{start:1415089505,end:1415089505+60*120,title:"巴巴巴巴拉拉",meetingUser:"wyc",meetingUserEmail:"www@163.com"},{start:1415089505+60*150,end:1415089505+60*220,title:"balalalala",meetingUser:"wyc",meetingUserEmail:"www@163.com"}]},
        {id:2,name:"三重门",meetingTime:[{start:1415089505-60*420,end:1415089505-60*300,title:"难啊难南岸",meetingUser:"wyc",meetingUserEmail:"www@163.com"},{start:1415089505-60*120,end:1415089505,title:"急啊急啊急啊急啊",meetingUser:"wyc",meetingUserEmail:"www@163.com"}]}];

    var tpl='{{#each this}}<li class="meeting-item" meetingIndex="{{@index}}" "><h2 class="meeting-name">{{name}}</h2><div class="meeting-time"><div class="time-item time-past" style="width:0%;"></div>{{#each meetingTime}}<div class="time-item j_time_item {{#if disabled}} time-disabled {{/if}}" style="width:{{percent}};left:{{offset}}"  title="      {{#if disabled}}{{title}} {{/if}}{{tplStart}}-{{tplEnd}}"  index="{{@index}}"><h3 class="time-title">{{#if disabled}}{{title}}{{/if}}</h3><p class="time-range">{{tplStart}}-{{tplEnd}}</p></div>{{/each}}</div></li>{{/each}}'
     var template=Handlebars.compile(tpl);
    var dateInput={};
    $(document).ready(function(){
        popup.init({startTime:config.startTime,endTime:config.endTime,maxTime:config.maxTime,minRangeTime:config.minRangeTime});
        var jWin=$(window);
        var jWinHeight=jWin.height();
        var jWinWidth=jWin.width();
        config.winWidth=jWinWidth;
        dateInput=$("#dateInput");
        var meetingList=$("#meetingList");
        var cssTextX="position:fixed;width:"+jWinWidth+"px;height:40px;top:50px;left:-5px;z-index:11;";
        var cssTextY="position:absolute;width:155px;height:"+jWinHeight+"px;top:50px;left:-5px;";
        var SVGX=mySVG.SVG("meetingBox",cssTextX);
        var SVGY=mySVG.SVG("meetingBox",cssTextY);
       // mySVG.line(SVG,{  x1:"0", y1:"0", x2:jWinWidth, y2:jWinHeight,stroke:"#C0D0E0","stroke-width":"1"});
        init();
        createXAxis(SVGX,{width:jWinWidth});
        createYAxis(SVGY,config.meetingData,meetingList);
        meetingList.on("click",function(e){
            var ele = e.target;
            showMeetingPopup(ele);
        });
    });
    function init(){
        //生成x轴的时间
        config.xAxisTime=[];//生成了类似于9:00 9:15 :9:30这样的时间刻度
        for(var m = config.startTime;m<config.endTime;m++){
            for(var n =0;n<60;n+=config.interval ){
                if(n===0){
                    config.xAxisTime.push(m+":00");
                }else{
                    config.xAxisTime.push(m+":"+n);
                }
            };
        }
        config.xAxisTime.push(config.endTime+":00");
        //生成时间刻度的坐标
        config.xAxis=[];
            var d = Math.floor((config.winWidth-config.leftWidth)/(config.xAxisTime.length-1));//计算坐标间隔
        for(var i = 0; i <config.xAxisTime.length;i++){
            config.xAxis.push(i*d);
        }
    }
    function createXAxis(svgDom,param){
        var xAxis={};
        xAxis.x1=config.leftWidth;
        xAxis.y2=xAxis.y1=config.yAxis;
        xAxis.x2=param.width;
        xAxis.stroke=config.lineColor;
        xAxis["stroke-width"]=1;
        mySVG.line(svgDom,xAxis);
        //画出刻度，
        var scaleY=config.yAxis-10;
        var g = mySVG.group();
        for(var i = 0; i <config.xAxis.length;i++){
            var m = config.leftWidth+config.xAxis[i];
            //m=i%2?m:m/2;
            var y = i%2?scaleY:scaleY/2;
            var d="M"+m+" "+xAxis.y2+" L"+m+" "+y;
            var attr={d:d,stroke:config.lineColor, opacity:"1","stroke-width":1};
              mySVG.path(g,attr);
        }
        svgDom.appendChild(g);
        //写时间点
        var txtScaleY=config.yAxis-20;
        var txtG=mySVG.group();
        for(var i =0;i<config.xAxisTime.length;i++){
            var t=config.xAxisTime[i];
            var txtX=config.leftWidth+config.xAxis[i]-15;
            var attr={x:txtX,y:txtScaleY,fill:"#ff9012"};
            mySVG.text(txtG,attr,t);
        }
        svgDom.appendChild(txtG);
    }
    //创建Y轴
    function createYAxis(svgDom,data,dom){
        fillMeetingBox(data,dom);
        drawYaxis(svgDom,data.length);
    }
    //绘制刻度
    function drawYaxis(svgDom,length){
        var attr={}
        var scaleY=config.scaleY;
        var scaleYWidth=config.leftWidth-100;
        var length=config.meetingData.length;
        attr.x2=attr.x1=config.leftWidth;
        attr.y1=config.yAxis;
        attr.y2=scaleY*length;
        attr.stroke=config.lineColor;
        attr["stroke-width"]=1;
        mySVG.line(svgDom,attr);
        var g = mySVG.group();
        var m = config.leftWidth
        for(var i = 0; i <length;i++){
            var y = i*scaleY+config.yAxis;
            var d="M"+m+" "+y+" L"+scaleYWidth+" "+y;
            var attr={d:d,stroke:config.lineColor, opacity:"1","stroke-width":1};
            mySVG.path(g,attr);
        }
        svgDom.appendChild(g);
    }
    function fillMeetingBox(data,dom){

        var date=new Date(dateInput.val().replace(/-/g,"/"));
        var start=parseInt(date.setHours(config.startTime)/1000);
        var end=parseInt(date.setHours(config.endTime)/1000);
        //填充完整的时间区间
        addAttr(data,{disabled:true});
        data=config.meetingData=addGreenRange2Array(data,start,end);


        for(var i = 0;i<data.length;i++){
            var d=data[i];
            d.meetingTime=formateTime2Box(d.meetingTime,start,end);
        }
        dom.html(template(data));
    }
    function formateTime2Box(time,startTime,endTime){
       for(var i=0; i< time.length;i++){
             createMettingBoxSize(time[i],startTime);
        }
        return time;
    }
    function formatTime2mmdd(timeNum){
        var d = new Date();
        d.setTime(timeNum*1000);
        var h = d.getHours();
        var m = d.getMinutes()-0;
        m=m>10?m:"0"+m;
        return h+":"+m;
    }
    function createMettingBoxSize(time,startTime){
        var start = time.start-0;
        var end = time.end-0;
        var percent=0, offset=0;
        var r=end-start;
        offset = (start-startTime) /config.rangeTime ;
        percent = r/config.rangeTime ;
        time.offset = (offset*100)+"%";
        time.percent = (percent*100)+"%";
        time.tplStart=formatTime2mmdd(start);//用于在模版展示
        time.tplEnd=formatTime2mmdd(end);
    }
    //增加那些能申请会议室的区间
    function addGreenRange2Array(timeData,startTime,endTime){
       //clone数组
        var title="点击预定会议室";
        var a = deepClone(timeData,[]);
        for(var i=0;i<timeData.length;i++){
            var a1=a[i].meetingTime;
            var time=timeData[i].meetingTime;
            for(var n=0;n<time.length;n++){
                var m = time[n];
                if(n===0){
                   if(m.start!=startTime){
                       a1.unshift({start:startTime,end: m.start,title:title});
                   }
                }else{
                   var p = time[n-1];
                    a1.splice(n,0,{start: p.end,end: m.start,title:title});
                }
                if(n===time.length-1&&m.end!=endTime){
                    a1.push({start: m.end,end: endTime,title:title});
                }
            }
        }
        timeData=null;

        return a;
    }
    function addAttr(data,attr){
        for(var i=0;i<data.length;i++){
            var d=data[i].meetingTime;
            for(var n=0;n<d.length;n++){
               // d[n].disabled=true;
                for(var key in attr){
                    d[n][key]=attr[key];
                }
            }
        }
    }
    //深度复制的方法
   function deepClone(parent, child) {
        var i, toStr = Object.prototype.toString,astr = "[object Array]";
        child = child || {};
        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === "object") {
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                    deepClone(parent[i], child[i]);
                } else {
                    child[i] = parent[i];
                }
            }
        }
        return child;
    }
    function showMeetingPopup (ele){
        //判断是已预订的还是未预定的时间段
        var e=$(ele);
        var className="j_time_item";//时间区间节点的class
        if(!e.hasClass(className)){
            e = e.parents("div."+className);
        }
        var index= e.attr("index");
        var meetingIndex= e.parents("li").attr("meetingIndex");
        var meetingData=config.meetingData[meetingIndex];
        var thisRangeData=meetingData.meetingTime[index];
        if(thisRangeData.disabled){
            //已预订，弹出信息
            popup.disabledPopupOpen(thisRangeData);
        }else{
            //未预定，弹出信息
            popup.fixPopupOpen(thisRangeData);
        }
    }
});