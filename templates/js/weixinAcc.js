define("weixinAcc",["utility"],function(e,t,i){e("utility");var n=$("[rel=weixinAccForm]");n.formVerify({rules:{wechat_id:{required:[!0,"\u8bf7\u8f93\u5165\u5fae\u4fe1\u8d26\u53f7"]},nick_name:{required:[!0,"\u8bf7\u8f93\u5165\u82f1\u6587\u540d"]},device_id:{required:[!0,"\u8bf7\u8f93\u5165\u624b\u673a\u8bbe\u5907\u7f16\u53f7"]},user_group:{required:[!0,"\u8bf7\u9009\u62e9\u7528\u6237\u7c7b\u578b"]}},errorHandler:function(e,t){$(this).siblings("p").html(e?"":t)},submitHandler:function(){if(this.checkFlag&&!n.sendStatus){var e=$(".sub_account");$.ajax({beforeSend:function(){n.sendStatus=!0,e.addClass("sub_account_dis").val("\u63d0\u4ea4\u4e2d...")},url:"/AdminContact/addAdminWechatContact",type:"post",data:n.serialize(),dataType:"json",success:function(e){1e4==e.status?(alert("\u6dfb\u52a0\u6210\u529f"),window.location.assign("/AdminContact/wxMain")):alert(e.message)},error:function(){alert("\u7f51\u7edc\u9519\u8bef\u8bf7\u91cd\u8bd5\uff01")},complete:function(){n.sendStatus=!1,e.removeClass("sub_account_dis").val("\u786e\u5b9a")}})}}})});