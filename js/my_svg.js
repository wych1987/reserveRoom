define(["jquery"],function($){
    var mySVG = mySVG||{};
    mySVG.DOM = document;
    mySVG.xmlns = "http://www.w3.org/2000/svg";
    mySVG.SVG = function(id,cssText){
        mySVG.svgBox = mySVG.DOM.getElementById(id);
        var svg = mySVG.DOM.createElementNS(mySVG.xmlns,"svg");
        svg.setAttribute("xmlns",mySVG.xmlns);
        svg.setAttribute("version","1.1");
        svg.style.cssText=cssText;
        mySVG.svgBox.appendChild(svg);
        return svg;
    }
    mySVG.createEle=function(svgObj,type,attr,textContent){
        var e = mySVG.DOM.createElementNS(mySVG.xmlns,type);
        if(attr){
            mySVG.setAttr(e,attr);
        }
        if(textContent){
            var textNode= mySVG.DOM.createTextNode(textContent);
            e.appendChild(textNode);
        }
        if(svgObj){
            svgObj.appendChild(e);
        }
        return e;
    }
    mySVG.setAttr=function(ele,param){
        if(param){
            for(var attr in param){
                ele.setAttribute(attr,param[attr]);
            }
        }
        return ele;
    }
    mySVG.rect=function(svgObj,attr){
        return mySVG.createEle(svgObj,"rect",attr);
    }
    mySVG.circle = function(svgObj,attr){
        return mySVG.createEle(svgObj,"circle",attr);
    }
    mySVG.line=function(svgObj,attr){
        return mySVG.createEle(svgObj,"line",attr);
    }
    mySVG.text=function(svgObj,attr,text){
        var t = mySVG.createEle(svgObj,"text",attr);
        t.innerHTML=text||"";
        return t;
    }
    mySVG.group=function(svgObj,attr){
        return mySVG.createEle(svgObj,"g",attr);
    }
    mySVG.path=function(svgObj,attr){
            return mySVG.createEle(svgObj,"path",attr);
    }
    mySVG.text=function(svgObj,attr,textContent){
        return mySVG.createEle(svgObj,"text",attr,textContent);
    }
    return mySVG;
});