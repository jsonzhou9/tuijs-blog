var CrossMessageEvent = function(){
	/**
	 *自定义事件
	 */
	var handlers = {}; //事件列表
	
	function addHandler(type, handler){//添加事件
		if (typeof handlers[type] == "undefined"){
            handlers[type] = [];
        }

        handlers[type].push(handler);
	};
	
	function fire(event){ //触发事件
		if (handlers[event.type] instanceof Array){
            var handlerList = handlers[event.type];
            for (var i=0, len = handlerList.length; i < len; i++){
                handlerList[i](event);
            }
        }
	};
	
	function removeHandler(type, handler){//移除事件
		if (handlers[type] instanceof Array){
            var handlerList = handlers[type];
            for (var i=0, len = handlerList.length; i < len; i++){
                if (handlerList[i] === handler){
                    break;
                }
            }
            handlerList.splice(i, 1);
        }
	};
	
	function removeAllHandler(type){//移除某类型所有事件
		if (handlers[type] instanceof Array){
            handlers[type] = [];
        }
	};
	
	/**
	 *系统事件
	 */
	function addEventListener(element, type, handler){
		if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
	}
	 
	function removeEventListener(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
	}
	
	function getEvent(event){
        return event ? event : window.event;
    }
	
	//打印
	function log(_res){
		if(typeof console != 'undefined'){
			console.log(_res);
		}
	}
	
	//object转字符串
	//在字符串加_ISOBJECT_标识，以便正确还原
	function _toString(object){
		if (typeof object !== 'string') {
			return window.JSON && JSON.stringify
			? '_ISOBJECT_' + JSON.stringify(object)
			: null;
		};
		
		return object;
	}
	
	//字符串转object
	function _toObject(string){
		var source = string.split('_ISOBJECT_')[1];
		
		if (source) {
			try {
				string = JSON.parse(source);
			} catch (e) {};
		};
		
		return string;
	}
	
	/**
	 *发送消息
	 */
	function postMessage(otherWindow, message, targetOrigin){
		targetOrigin = targetOrigin || '*';
		
		//IE8,9原生postMessage方法不能传递 Object 类型消息
		//统一转换为字符串
		message = _toString(message);
		
		if (typeof message !== 'string') {
			log('Error message type!');
		};
		
		// IE8+ 和其它html5浏览器支持原生的 postMessage 方法
		if (otherWindow.postMessage) {
			otherWindow.postMessage(message, targetOrigin);
			return;
		};
		
		//for ie6,ie7
		try{
			window.opener.postMessage(message,targetOrigin);
		}catch(e){log(e);};
	}
	
	/**
	 *添加事件监听
	 */
	function receiveMessage(_callback){
		addHandler("message",_callback);
	}
	/**
	 *移除事件监听
	 */
	function remove(_callback){
		if (_callback) {
			removeHandler("message",_callback);
		}else{ //不指定原回调方法的引用，则清除所有
			removeAllHandler("message");
		}
	}
	
	function init(otherWindow){
		if (window.postMessage) { //IE8+,FF,Chrome...html5
			addEventListener(window, 'message', function (event) {
				event = getEvent(event);
				
				var data = event.data,
					src = event;
					
				if (typeof data !== 'string') { //data只能是字符串
					return;
				};
				
				event = {};
				
				for (var i in src) { //深复制一个event对象，防止修改引起所有引用变化
					event[i] = src[i];
				};
				
				event.data = _toObject(event.data); //还原成对象
				fire(event);
			});
		}else{ //ie6,ie7 hack
			if(otherWindow){
				otherWindow.opener={ //接收消息的回调
					postMessage:function(str,origin){
						origin = origin || "*";
						var data = _toObject(str);
						var event = {type:"message",data:data,origin:origin};
						fire(event);
					}   
				}
			}else{ //子框架
				parent.opener={
					postMessage:function(str,origin){
						origin = origin || "*";
						var data = _toObject(str);
						var event = {type:"message",data:data,origin:origin};
						fire(event);
					}   
				}
			}
		}
	}
	
	return {
		init : init,
		postMessage : postMessage,
		receiveMessage : receiveMessage,
		remove : remove
	}
}();


var JSON;JSON||(JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();