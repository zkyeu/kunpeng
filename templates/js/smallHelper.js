define("smallHelper",["niceScroll"],function(e,t,a){function l(){r.request("get","/CourseTextbook/getAllTextbook",{},function(e){if(1e4!==e.status)return alert(e.message);for(var t=e.message,a="",l=0;l<t.length;l++){var n=t[l].book_type,i=t[l].version,o=t[l].title;a+="<li>",a+='<label><input type="radio" name="banben" data-version="'+i+'" value="'+n+'"><span>'+o+"</span>",a+="</label></li>"}$("#lesson-banben").html(a),s()})}function s(){$("#lesson-banben li label").on("click",function(e){$(this).addClass("cut-sel").parent("li").siblings().find("label").removeClass("cut-sel");var t=$(this).find("input"),a=t.val(),l=t.attr("data-version");return r.request("post","/CourseTextbook/getAllLevelByBookType",{book_type:a,version:l},function(e){if(1e4!==e.status)return alert(e.message);var t=e.message;if(t.length>0){for(var s="",i=0;i<t.length;i++){var o=t[i].level,r=t[i].title;s+="<li><label>",s+='<input type="radio" name="jibie" ',s+='data-book_type="'+a+'"  data-version="'+l+'" data-level="'+o+'"',s+=' value="'+o+'"><span>'+r+"</span>",s+="</label></li>"}$("#lesson-jibie").html(s),$(".jibie").show()}else $(".jibie").hide();n()}),!1})}function n(){$("#lesson-jibie li label").on("click",function(){$(this).addClass("cut-sel").parent("li").siblings().find("label").removeClass("cut-sel");var e=$(this).find("input"),t=e.attr("data-book_type"),a=e.attr("data-version"),l=e.attr("data-level");return r.request("post","/CourseTextbook/getAllUnitByLevel",{book_type:t,version:a,level:l},function(e){if(1e4!==e.status)return alert(e.message);var s=e.message;if(s.length>0){for(var n="",o=0;o<s.length;o++){var r=s[o].unit_id,u=s[o].unit_name;n+="<li>",n+='<label><input type="radio" name="danyuan"',n+='data-book_type="'+t+'"  data-version="'+a+'" data-level="'+l+'" data-unit_id="'+r+'"',n+=' value="'+l+'"><span>'+u+"</span>",n+="</label></li>"}$("#selUser").html(n),$("#selUser").niceScroll({cursorcolor:"#c0c0c0",autohidemode:!0,railpadding:{top:10,right:5,left:0,bottom:10}}),$(".danyuan").show(),i()}else $(".danyuan").hide()}),!1})}function i(){$("#selUser li").on("click",function(){return $("#subUserData").show(),$(this).find("label").hasClass("cut-sels")?$(this).find("label").removeClass("cut-sels"):$(this).find("label").addClass("cut-sels"),!1})}function o(){var e=$("#subUserData");e.on("click",function(){var e=$(".cut-sels input");if(e.length){for(var t,a=[],l=0;l<e.length;l++)t=e[l].dataset.unit_id,a.push(t);console.log("\u9009\u62e9\u7684\u7528\u6237\u662f\uff1a"+a)}else alert("\u8bf7\u9009\u62e9\u7528\u6237")})}e("niceScroll");var r={request:function(e,t,a,l,s){$.ajax({url:t,type:e,data:a,dataType:"JSON",success:function(e){l(e)},error:s})}};l(),o()});