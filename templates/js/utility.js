define(function(e,t,n){!function(e){e.extend(e.fn,{formVerify:function(t){var n=this,r=e.formVerify,a=r.defaults,o=r.utility,c=e.extend({},a,t),i=c.rules,u=c.errorHandler,s=c.submitHandler,l=c.checkAll,f={};if(!i)throw"no rules";for(var p in i){var d=n.find("[rel="+p+"]");d.get(0)&&(f[p]=d.setDefault().setCheck(i[p],u))}return n.formList=f,e.formVerify.formlist[n.attr("rel")]=f,n.on("submit",function(e){o.stopHandler(e).stopDef(),n.checkFlag=!0;for(var t in f)if(!f[t].trigger(f[t].checkType).checkFlag&&(n.checkFlag=!1,!l))break;s.call(n)}),n},setDefault:function(){var e=this,t=e.get(0).tagName.toLocaleLowerCase(),n=e.attr("type");switch(t){case"input":e.checkFlag="checkbox"===n?e.prop("checked"):!1;break;case"select":e.checkFlag=""!==e.val();break;default:e.checkFlag=!1}return e},setCheck:function(t,n){var r=this,a=(r.get(0).tagName.toLocaleLowerCase(),t.errorHandler);"function"!=typeof a&&(a=n),r.errorHandler=a;var o=function(){for(var n in t)if("errorHandler"!==n){var o=e.formVerify.utility.trim(r[0].value),c=e.formVerify.utility.rules[n].call(r,t[n][0],o);if("breakTag"==c)break;if("boolean"==typeof c&&!c||"number"==typeof c&&0>c)return r.setState(c,t[n][1],a)}r.setState(c,"",a)},c=function(){var e=this.attr("check-type");if(e)return this.checkType=e,this;var t,n=this.attr("type")||this[0].nodeName.toLowerCase();switch(!0){case"checkbox"===n:t="click";break;case n.indexOf("select")>-1:t="change";break;default:t="blur"}return this.checkType=t,this};return r.on(c.call(r).checkType,function(){o.call(r)}),r},setState:function(e,t){var n=this,r="number"==typeof e?e>=0:e;return n.checkFlag=r,n.errorHandler.call(n,e,t),n},teachingScroll:function(t){var n={cursorcolor:"#cdcdcd",autohidemode:!1,cursorwidth:10,cursorborderradius:0},r=e.extend({},n,t),a=e(this);return seajs.use("niceScroll",function(){a.niceScroll(r)}),a}}),e.formVerify={formlist:{},defaults:{checkAll:!0,errorHandler:function(e,t){var n=this.closest("dl").next(".error-tips");e?n.html("").hide():n.html(t).fadeIn()},submitHandler:function(){this.checkFlag&&this[0].submit()},ajaxHandler:{success:function(e){var t=e.status;return 1==t?0:t},error:function(){return-1}}},utility:{updateAjaxHandler:function(t){e.extend(e.formVerify.defaults.ajaxHandler,t)},trim:function(e){return e.replace(/(^\s*)|(\s*$)/g,"")},stopHandler:function(e){var e=e||event;return{stopDef:function(){e.preventDefault?e.preventDefault():e.returnValue=!1},stopBub:function(){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0}}},rules:{required:function(e,t){return e||""!=t?"checkbox"===this.attr("type")?this.checkFlag=this.prop("checked"):""==t?!1:!0:"breakTag"},length:function(e,t){if(!(!e instanceof Array)){var n=t.replace(/[^\x00-\xf]/g,"xx").length;return n<e[0]||n>e[1]?!1:!0}},reg:function(e,t){var n=new RegExp(e,"gi");return n.test(t)?!0:!1},equalto:function(t,n){var r=e.formVerify.utility.trim(e(t).val());return n==r},remote:function(t,n){var r=t,a=r.url,o=r.key,c=r.type||"get",i=1==r.async,u=r.timeout>0&&r.timeout||3e3,s=e.formVerify.defaults.ajaxHandler,l=r.success||s.success||new Function,f=r.error||s.error||new Function,p=null;sendData={},sendData[o]=n;var d={};if("function"==typeof r.addData){var h=r.addData();"object"==typeof h&&(d=h)}return e.ajax({url:a,type:c,data:e.extend({},sendData,d),dataType:"json",async:i,cache:!1,success:function(){p=l.apply(null,arguments)},error:function(){p=f.apply(null,arguments)},timeout:u}),p}},regs:{phone:"(^1[0-9]{10}$)",verifycode:"(^[0-9]{6}$)",password:"(^.{6,20}$)",cnname:"(^[\\u4e00-\\u9fa5]{2,10}$)",enname:"(^[a-zA-Z]{2,50}$)",stu:"(^[a-zA-Z_0-9]{1,}$)",activeorphone:"(^1[0-9]{10}$)|(^[0-9]{6}$)",teachingtext:"(^.{1,20}$)",learntext:"(^.{1,20}$)",teachingprogress:"(^.{1,20}$)",teaname:"(^[\\u4e00-\\u9fa5]{2,10}$)|(^[a-zA-Z]{3,}$)"}}};var t={deftime:function(t){if("object"==typeof t){var n=e(t.tar),r=t.url,a=(t.key,t.time||60),o=t.text||"\u83b7\u53d6\u9a8c\u8bc1\u7801",c="function"==typeof t.error&&t.error||function(){alert("\u83b7\u53d6\u9a8c\u8bc1\u7801\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01")},i="function"==typeof t.before&&t.before||null,u="function"==typeof t.success&&t.success||null,s=0,l=t.sendBefore,f=n.get(0).nodeName.toLowerCase(),p="input"==f?"val":"text";!function(t){var n=arguments;0==s?(t.bind("click",function(){if(!t.hasClass("isajax")&&("function"!=typeof l||l.apply(null,arguments))){var a=l.apply(null,arguments);null!==i&&i.call(null),e.ajax({url:r,type:"get",data:a,beforeSend:function(){t.addClass("isajax")},success:function(e,r,a){u.apply(null,arguments)&&n.callee(t)},error:function(){c.call(null)},complete:function(){t.removeClass("isajax")},dataType:"json",cache:!1})}}).removeClass("is-sending")[p](o),s=a):(t.unbind("click").addClass("is-sending")[p](s+"\u79d2\u91cd\u65b0\u83b7\u53d6"),s--,setTimeout(function(){n.callee(t)},1e3))}(n)}},cookieFn:{set:function(e,t,n,r,a,o){document.cookie=encodeURIComponent(e)+"="+encodeURIComponent(t)+(n?"; expires="+this.setDays(n):"")+(r?"; path="+r:"")+(a?"; domain="+a:"")+(o?"; secure":"")},get:function(e){for(var t=document.cookie.split("; "),n=0;n<t.length;n++){var r=t[n].split("=");if(decodeURIComponent(r[0])===e)return decodeURIComponent(r[1])}return""},del:function(e){this.set(e,"",-1)},setDays:function(e){var t=new Date;return t.setDate(t.getDate()+e),t.toGMTString()}},placeHolderFix:{_check:function(){return"placeholder"in document.createElement("input")},init:function(e){this._check()||this.fix(e)},fix:function(t){var n=this;jQuery(":input[placeholder]").each(function(r,a){var o=e(this),c=o.attr("placeholder"),i=o.attr("dataHeight"),u=o.position(),s=i?i:t?o.outerHeight():t,l=o.css("padding-left"),f=e('<span class="placeholder-span"></span>').text(c).css({position:"absolute",left:u.left,top:u.top,height:s,lineHeight:s+"px",paddingLeft:l,color:"#aaa",cursor:"text"}).appendTo(o.parent());o.on("input propertychange",function(e){n.busy||(n.busy=!0,""==o.val()?f.show():f.hide(),n.busy=!1)}),f.click(function(e){setTimeout(function(){o.focus()},0)})})}}};n.exports=t}(jQuery)});