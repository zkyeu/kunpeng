define("weixinUtil",[],function(n,e,t){var r={};!function(){var n="[\u5fae\u7b11][\u6487\u5634][\u8272][\u53d1\u5446][\u5f97\u610f][\u6d41\u6cea][\u5bb3\u7f9e][\u95ed\u5634][\u7761][\u5927\u54ed][\u5c34\u5c2c][\u53d1\u6012][\u8c03\u76ae][\u5472\u7259][\u60ca\u8bb6][\u96be\u8fc7][\u9177][\u51b7\u6c57][\u6293\u72c2][\u5410][\u5077\u7b11][\u6109\u5feb][\u767d\u773c][\u50b2\u6162][\u9965\u997f][\u56f0][\u60ca\u6050][\u6d41\u6c57][\u61a8\u7b11][\u60a0\u95f2][\u594b\u6597][\u5492\u9a82][\u7591\u95ee][\u5618][\u6655][\u75af\u4e86][\u8870][\u9ab7\u9ac5][\u6572\u6253][\u518d\u89c1][\u64e6\u6c57][\u62a0\u9f3b][\u9f13\u638c][\u7cd7\u5927\u4e86][\u574f\u7b11][\u5de6\u54fc\u54fc][\u53f3\u54fc\u54fc][\u54c8\u6b20][\u9119\u89c6][\u59d4\u5c48][\u5feb\u54ed\u4e86][\u9634\u9669][\u4eb2\u4eb2][\u5413][\u53ef\u601c][\u83dc\u5200][\u897f\u74dc][\u5564\u9152][\u7bee\u7403][\u4e52\u4e53][\u5496\u5561][\u996d][\u732a\u5934][\u73ab\u7470][\u51cb\u8c22][\u5634\u5507][\u7231\u5fc3][\u5fc3\u788e][\u86cb\u7cd5][\u95ea\u7535][\u70b8\u5f39][\u5200][\u8db3\u7403][\u74e2\u866b][\u4fbf\u4fbf][\u6708\u4eae][\u592a\u9633][\u793c\u7269][\u62e5\u62b1][\u5f3a][\u5f31][\u63e1\u624b][\u80dc\u5229][\u62b1\u62f3][\u52fe\u5f15][\u62f3\u5934][\u5dee\u52b2][\u7231\u4f60][NO][OK][\u7231\u60c5][\u98de\u543b][\u8df3\u8df3][\u53d1\u6296][\u6004\u706b][\u8f6c\u5708][\u78d5\u5934][\u56de\u5934][\u8df3\u7ef3][\u6295\u964d][\u6fc0\u52a8][\u4e71\u821e][\u732e\u543b][\u5de6\u592a\u6781][\u53f3\u592a\u6781]",e=n.split("]").join("]|").split("|").slice(0,-1),t=[],i={},o="(((https?|ftp|mms):\\/\\/)?([A-z0-9]+[_\\-]?[A-z0-9]+\\.)*[A-z0-9]+\\-?[A-z0-9]+\\.[A-z]{2,}(\\/.*)*\\/?)";t.push(o);for(var a=0,f=e.length;f>a;a++){var s=e[a];t.push("\\"+s.slice(0,-1)+"\\"+s.slice(-1)),i[s]=String(a)}var c=new RegExp(t.join("|"),"g");r.qqfaceConfigArr=e,r.msgFilter=function(n,e){return n.replace(c,function(n){if(n in i)return'<i class="qqemoji qqemoji'+i[n]+'"></i>';if(e)return n;var t=n.search(/https?|ftp|mms/)>-1?n:"http://"+n;return'<a href="'+t+'" target="_blank">'+n+"</a>"})}}(),function(){var n=["#nickname#","#relationship#","#studentname#"],e=new RegExp("#[^#]+#","gi");r.conRegArr=n,r.conReg=e,r.conFilter=function(n,t){return n.replace(e,function(n){var e=t[n.toLowerCase()];return void 0!=e?e:n})}}(),function(){var n,e;n=function(n,e){var t=n.getAsFile(),r=new FileReader;r.onload=function(n){"function"==typeof e&&e(n.target.result)},r.readAsDataURL(t)},e=function(e,t){var r,i,o,a=e.clipboardData,f=0;if(a&&(r=a.items)){for(i=r[0],o=a.types||[];f<o.length;f++)if("Files"===o[f]){i=r[f];break}i&&"file"===i.kind&&i.type.match(/^image\//i)&&n(i,function(n){"function"==typeof t&&t(n)})}},r.pasteFn=e}(),function(){return}(),r.flashText=function(n,e){var t;return{set:function(n,e){clearInterval(t);var r=n+"";if(r){var i=r.length,o=r+r+r,a=0;t=setInterval(function(){var n=o.slice(a);"function"==typeof e&&e(n),a==i?a=0:a++},380)}},reset:function(n){clearInterval(t),"function"==typeof n&&n()}}},r.checkBrowser=function(){var n=navigator.userAgent,e=n.indexOf("Opera")>-1;return e?"Opera":n.indexOf("Firefox")>-1?"FF":n.indexOf("Chrome")>-1?"Chrome":n.indexOf("Safari")>-1?"Safari":n.indexOf("compatible")>-1&&n.indexOf("MSIE")>-1&&!e?"IE":void 0},r.wxPop=function(){var n,e,t,r,i,o=$("body");t={},r=-1,i={alert:'<dd><span class="wx_pop_sure" rel="fnHide">\u786e\u5b9a</span></dd>',confirm:'<dd><span class="wx_pop_sure" rel="fnSure">\u786e\u5b9a</span><span class="wx_pop_cancel" rel="fnCancel">\u53d6\u6d88</span></dd>'},n=function(n,e){var t=[];return t.push('<div class="wx_pop">'),t.push('<dl class="wx_pop_in wx_pop_'+n+'">'),t.push("<dt>"+e+"</dt>"),t.push(i[n]),t.push("</dl>"),t.push("</div>"),t.join("")},e=function(n,e){n.on("click","span[rel*=fn]",function(){var t=$(this),r=t.attr("rel");switch(r){case"fnCancel":n.remove();break;case"fnHide":case"fnSure":"function"==typeof e&&e(),n.remove()}})},getPop=function(i,a,f){var s="dom"+ ++r;t[s]=$(n(i,a)),o.append(t[s]),t[s].show(),e(t[s],f)};for(var a in i)window["_"+a]=function(n){return function(e,t){getPop(n,e,t)}}(a)},r.closeTab=function(){navigator.userAgent.indexOf("MSIE")>0?navigator.userAgent.indexOf("MSIE 6.0")>0?(window.opener=null,window.close()):(window.open("","_top"),window.top.close()):navigator.userAgent.indexOf("Firefox")>0?window.location.href="about:blank":(window.opener=null,window.open("","_self",""),window.close(),window.open("http://www.51talk.com/","_self").close())},r.setDate=function(n){var e=new Date;e.setDate(e.getDate()+n);var t=e.getFullYear(),r=e.getMonth()+1>9?e.getMonth()+1:"0"+(e.getMonth()+1),i=e.getDate()>9?e.getDate():"0"+e.getDate();return t+"-"+r+"-"+i},t.exports=r});