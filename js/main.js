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
require(['jquery',"my_svg",'handlebars'],function($,mySVG,Handlebars){
    var config={};
    config.xAxisTime=[];
    config.interval=30;//30分钟一个数据点
    config.startTime=9;//早九点
    config.endTime=21;//晚21点
    config.strStartTime="9:00";
    config.strEndTime="21:00";
    config.leftWidth=150;
    config.yAxis=30;
    config.scaleY=80;//y轴间隔
    config.lineColor="#C0D0E0"
    config.meetingData=[{id:1,name:"湾流",meetingTime:[{start:"9:15",end:"10:25",title:"巴巴巴巴拉拉"},{start:"13:15",end:"15:25",title:"balalalala"}]},{id:2,name:"三重门",meetingTime:[{start:"9:15",end:"11:05",title:"难啊难南岸"},{start:"13:55",end:"14:25",title:"急啊急啊急啊急啊"}]}];
    var tpl='{{#each this}}<li class="meeting-item" meetingId="{{id}}" "><h2 class="meeting-name">{{name}}</h2><div class="meeting-time"><div class="time-item time-past" style="width:0%;"></div>{{#each meetingTime}}<div class="time-item time-disabled" style="width:{{percent}};left:{{offset}}" title="{{title}} {{start}}-{{end}}"><h3 class="time-title">{{title}}</h3><p class="time-range">{{start}}-{{end}}</p></div>{{/each}}</div></li>{{/each}}'
     var template=Handlebars.compile(tpl);
    $(document).ready(function(){
        var jWin=$(window);
        var jWinHeight=jWin.height();
        var jWinWidth=jWin.width();
        config.winWidth=jWinWidth;
        var meetingList=$("#meetingList");
        var cssTextX="position:fixed;width:"+jWinWidth+"px;height:"+jWinHeight+"px;top:50px;left:-10px;z-index:11;";
        var cssTextY="position:absolute;width:"+jWinWidth+"px;height:"+jWinHeight+"px;top:50px;left:-10px;";
        var SVGX=mySVG.SVG("meetingBox",cssTextX);
        var SVGY=mySVG.SVG("meetingBox",cssTextY);
       // mySVG.line(SVG,{  x1:"0", y1:"0", x2:jWinWidth, y2:jWinHeight,stroke:"#C0D0E0","stroke-width":"1"});
        init();
        createXAxis(SVGX,{width:jWinWidth});
        createYAxis(SVGY,config.meetingData,meetingList);
        //console.log(config);

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
        //
        for(var i = 0;i<data.length;i++){
            var d=data[i];
            d.meetingTime=formateTime(d.meetingTime,config.startTime,config.endTime);
        }
        //
        dom.html(template(data));
    }
    function formateTime(time,startTime,endTime){
        var minute=60;
        var startMinute=startTime*minute;
        var endminute=endTime*minute;

        var rangeTime=endminute-startMinute;//会议时间区间的分钟数
        for(var i=0; i< time.length;i++){
            var start = time[i].start;
            var end = time[i].end;
            var s=start.split(":");
            var e=end.split(":");
            var percent=0, offset=0;
            var sMinute=(s[0]-0)*minute+parseInt(s[1]);
            var eMinute=(e[0]-0)*minute+parseInt(e[1]);
             var r=eMinute-sMinute;
            offset = (sMinute-startMinute) /rangeTime ;
            percent = r/rangeTime ;
            time[i].offset = (offset*100)+"%";
            time[i].percent = (percent*100)+"%";
        }
        console.log(time);
        return time;
    }
});