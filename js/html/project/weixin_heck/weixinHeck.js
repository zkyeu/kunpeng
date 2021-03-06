// define("weixinHeck", ["niceScroll", "vm", "fancybox", "weixinUtil", "editImg", "layui", "upload", "html2js", "uploadCos", "clipboard", "weixinRecorder"], function (require, exports, module) {
define("weixinHeck", ["niceScroll", "vm", "fancybox", "weixinUtil", "editImg", "layui", "upload", "html2js",  "clipboard", "weixinRecorder", "liveMsger"], function (require, exports, module) {
    require("html2js");
    $("#app").replaceWith(window.html2js["html/weixin_body.html2js.html"]);
    require("layui");
    require("weixinRecorder");
    /*编辑图片old*/
    /*var editImgFn = require("editImg").init({
     container: "edit-img",
     save: function (id, imgSrc) {
     // 弹出分数面板
     wxHeck.wxInit.$broadcast("sendHomeWorkResult", imgSrc);
     }
     });*/
    var editImgFn = require("editImg");
    // 增加一个更新属性的全局方法
    $.fn.wxScroll = function () {
        var self = $(this);
        self.niceScroll(
            {
                cursorcolor: "#686b71",
                autohidemode: true,
                cursorwidth: 7,
                cursorborderradius: "999px",
                cursorborder: 0
            }
        );
        return self;
    }
    //复制个人信息弹层【微信号】
    var clipboard = new Clipboard('.copytext', {
        target: function() {
            return document.querySelector('#wechatName');
        }
    });
    // 大图
    $("[rel=gallery]").fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        padding : 0
    });

    // 小助手数据处理
    ;(function(){
        var wxHelper = localInfo.wxHelper;
        if(!wxHelper) return;
        var result = [];
        result.push({
            id : wxHelper.id,
            c_type : "0",
            img : localInfo.helperImg,
            nick : wxHelper.nick
        });
        localInfo.wxHelper = result;
    })();


    ;
    (function (root) {
        root.wxHeck = root.wxHeck || {};
        wxHeck.PROJECT_DOMAIN = "http://test48.zuoyebang.cc";
        wxHeck.dataSource = {
            // cc信息
            localInfo: localInfo,
            // 用户列表 包含用户跟群
            userList : [2135349210,2135297487,2135447549,2135352685,2135448937,'weixin_id'],
            // 全部用户列表
            userListAll : [2135349210,2135297487,2135447549,2135352685,2135448937,'weixin_id'],
            // 用户列表 只有群
            userListGroup: [],
            // 用户列表 只有用户,
            userListPerson: [],
            //获取群成员列表信息
            groupUserLists: {},
            //群的id
            groupFromId: "",
            //群主
            groupOwnner: "",
            showOwnnerBtn: false,
            // 当前用户 以id绑定
            curUserId: "",
            // 消息列表
            msgList : {
                2135349210: {
                    isGroup : false,
                    userInfo : {
                        img : '../images/gantan.png',
                        nick : '李亮'
                    },
                    noRead : 0,
                    historyMsg:{
                        isGetAll : true
                    },
                    crmInfo : {
                        age :20
                    },
                    msgContent: null,
                    userMsg :[],
                    lastMsg : null
                },
                2135297487: {
                    isGroup : false,
                    userInfo : {
                        img : '../images/heck_user.png',
                        nick : '晓林'
                    },
                    noRead : 0,
                    historyMsg:{
                        isGetAll : true
                    },
                    crmInfo : {
                        age :20
                    },
                    msgContent: null,
                    userMsg :[],
                    lastMsg : null
                },
                2135447549: {
                    isGroup : false,
                    userInfo : {
                        img : '../images/groupheader.jpg',
                        nick : '王斌'
                    },
                    noRead : 0,
                    historyMsg:{
                        isGetAll : true
                    },
                    crmInfo : {
                        age :30
                    },
                    msgContent: null,
                    userMsg :[],
                    lastMsg : null
                },
                2135352685: {
                    isGroup : false,
                    userInfo : {
                        img : '../images/account_img2.png',
                        nick : '学生'
                    },
                    noRead : 0,
                    historyMsg:{
                        isGetAll : true
                    },
                    crmInfo : {
                        age :30
                    },
                    msgContent: null,
                    userMsg :[],
                    lastMsg : null
                },
                weixin_id: {
                    isGroup : false,
                    userInfo : {
                        img : '../images/account_img2.png',
                        nick : '学生weixin_id'
                    },
                    noRead : 0,
                    historyMsg:{
                        isGetAll : true
                    },
                    crmInfo : {
                        age :30
                    },
                    msgContent: null,
                    userMsg :[],
                    lastMsg : null
                },
                2135448937: {
                    isGroup : false,
                    userInfo : {
                        img : '../images/heck_user.png',
                        nick : '老师'
                    },
                    noRead : 0,
                    historyMsg:{
                        isGetAll : true
                    },
                    crmInfo : {
                        age :30
                    },
                    msgContent: null,
                    userMsg :[],
                    lastMsg : null
                }
            },
            // 替代者模式下 曾经聊过的user
            trustList: [],
            //评论
            comment: 0,
            //当前版本
            clientVersion: '',
            //最新版本
            cloudVersion: '',
            // 微信版本
            wechat_version : '',
            //当前版本信息
            //dylib_version: '',
            // 置顶列表
            topList: [],
            // 微信小助手列表
            helpList : [],
            //重复登录
            repeatEnter: false,
            //屏蔽列表
            muteList:[],
            // 设置当前用户列表
            setMsgList:function(data){
                if(!data)return;
                this.msgList=data;
                for(var val in data){
                    this.userList.push(val);
                }
            }
        }

        //长连接参数
        wxHeck.connArgs = {
            uid: wxHeck.dataSource.curUserId,
            onConnectFail: function() {
                //连接失败时的逻辑
                console.log("连接失败")
            },
            onMsg: function(msgs) {
                $.each(msgs, function(i, msg) {
                    //连接成功，消息处理逻辑

                    //消息转换
                    // "{"sig_no":1,"data":{"zybWeixinId":"zyb_weixin_id","weixinId":"weixin_id","msgType":1,"msgContent":"111111111111","createTime":1500620774}}"

                    var _msg = JSON.parse(msg.msg_content);

                    var sig_no   = _msg.sig_no, //业务类型
                        zybWeixinId = _msg.data.zybWeixinId, //终端信息
                        weixinId = _msg.data.weixinId, //发送人
                        msgContent = _msg.data.msgContent, //消息内容
                        msgType = _msg.data.msgType, //消息类型
                        createTime = wxHeck.unicodeTimeSet(_msg.data.createTime); //消息时间


                    switch (msgType){
                        case  1 :
                            msg.sig_no = sig_no;
                            msg.zybWeixinId = zybWeixinId;
                            msg.content = msgContent;
                            msg.msg_time = createTime;
                            msg.weixinId = weixinId;
                            break;
                        default:
                    }
                    console.log('用户：'+ weixinId + ' 增加消息');
                    console.log(msg)
                    wxHeck.dataSource.msgList[weixinId].userMsg.push(msg);
                    wxHeck.dataSource.msgList[weixinId].lastMsg = msgContent;
                    // 移到第一位
                    wxHeck.toTop(weixinId);

                    /*
                    *消息类型
                    if (obj.cnt_type == 0) return obj._msg;
                    if (obj.cnt_type == 1 || obj.cnt_type == 9999) return "[图片消息]";
                    if (obj.cnt_type == 2) return "[语音消息]";
                    if (obj.cnt_type == 42) return "[名片消息]";
                    if (obj.cnt_type == 3000 || obj.cnt_type == 3001) return "[卡片消息]";
                    if (obj.cnt_type == 495) return "[文章消息]";
                    if (obj.cnt_type == 4950) return "[加群邀请]";
                    if (obj.cnt_type == 6000) return "[收到文件]";
                    if (obj.cnt_type == 6001) return "[视频]";
                    if (obj.cnt_type == 3100) return obj.msg.content;
                    return msgConfig[obj.cnt_type] || obj.msg;
                    */

                });
            }
        }

        //引用外部封装方法
        wxHeck.Util = require("weixinUtil");
        wxHeck.Util.wxPop();
        // 浏览器检测
        wxHeck.isChrome = wxHeck.Util.checkBrowser() == "Chrome";
        // wxHeck.isChrome = (wxHeck.Util.checkBrowser() == "Chrome" || wxHeck.Util.checkBrowser() == "FF");
        // wxHeck.isChrome = wxHeck.Util.checkBrowser() != "IE";
        if (!wxHeck.isChrome) return $(".update_mask2").show();
        wxHeck.uploadFn = require("upload");
        wxHeck.uploadFnCos = require("uploadCos");

        //判断类型是cc
        wxHeck.isCC = function () {
            return wxHeck.wxInit.wxData.localInfo.admin_type == "cc";
        }
        //判断类型是SS
        wxHeck.isSS = function () {
            return wxHeck.wxInit.wxData.localInfo.admin_type == "is";
        }

        //时间戳转换
        wxHeck.unicodeTimeSet = function (val) {
            var t =  new Date(val),
                Y = t.getFullYear(),
                M = t.getMonth() + 1 < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1,
                D = t.getDate(),
                h = t.getHours(),
                m = t.getMinutes(),
                s = t.getSeconds();
            return  Y + '/' + M + '/' + D + ' ' + h + ':' + m + ':' + s
        }
        wxHeck.getFullId = function(id){
            return localInfo.wechat_id + "$" + id;
        }
        wxHeck.userBoxTop = (function () {
            var userBox = $(".user_lists");
            return function () {
                userBox.scrollTop(0);
            }
        })();
        //根据类型显示内容
        wxHeck.checkUserType = function(name,type){
            var nameTitle = '';
            if (wxHeck.isCC()) {
                if(localInfo.user_group == 6 || localInfo.user_group == 7 || localInfo.user_group == 8 || localInfo.user_group == 9){
                    nameTitle = name;
                }else{
                    //var _talk = '我是51Talk课程老师';
                    var _on = '我是'+name +'，我带您做一下课前准备，您加一下我的微信吧～';
                    var _end = '您好，我是'+ name +'，我给您发一下体验课报告，您加一下我的微信吧～';
                    var _cancel = '您好，我是' + name +'，我帮您重新预约一节外教课吧～';
                    var _non = '您好，我是' + name +'，有时间我帮您预约一节外教课吧～';
                    console.log('userName：'+name, '类型：'+type);
                    switch (type){
                        //代表已约课
                        case 'on':
                            nameTitle = _on;
                            break;
                        //代表未约课
                        case 'non':
                            nameTitle = _non;
                            break;
                        //代表体验课完成
                        case 'end':
                            nameTitle = _end;
                            break;
                        //cancel、s_absent、t_absent分别代表取消、学生缺席，老师缺席
                        case 'cancel':
                        case 's_absent':
                        case 't_absent':
                            nameTitle = _cancel;
                            break;
                        default:
                            nameTitle = name;
                    }
                }
            } else {
                nameTitle = '51Talk班主任老师：' + name;
            }
            return nameTitle;
        }

        wxHeck.labelFn = {
            nameMap : {},
            idMap : {},
            get : function(){
                var labelList = localInfo.labelList;
                var that = this;
                $.map(labelList, function(ele, index){
                    $.map(ele, function(el, idx){
                        that.nameMap[el.tag_name] = that.idMap[el.id] = el;
                    });
                });
            }
        }

        wxHeck.labelFn.get();

        //置顶
        wxHeck.toTop = function (id) {
            console.log("to top ====> " + id);
            var wxData = wxHeck.wxInit.wxData;

            //屏蔽消息
            //if(wxData.msgList[id].userInfo.mute_session || wxData.muteList.indexOf(id) > -1) return;
            // 是否小助手
            var helpIndex = wxData.helpList.indexOf(id);
            // 是否置顶列表
            var topIndex = wxData.topList.indexOf(id);
            // 先从列表中删除
            wxData.userList.$remove(id);
            // 再加入
            // 置顶位置
            var toTopPos;
            switch(true){
                // 如果是小助手列表成员
                case helpIndex > -1:
                    toTopPos = 0;
                    break;

                // 如果是置顶列表成员
                case topIndex > -1:
                    toTopPos = wxData.helpList.length
                    break;

                default:
                    toTopPos = wxData.helpList.length + wxData.topList.length;
                    break;
            }
            wxData.userList.splice(toTopPos, -1, id);
        }
        wxHeck.scrollToBottom = function () {
            if (!wxHeck.msgBox) return;
            if (document.hidden) return;
            wxHeck.msgBox.scrollTop(wxHeck.msgBox.get(0).scrollHeight);
        }
        wxHeck.getData = function (options) {
            var defaults = {
                    timeout : 10000,
                    type: "post",
                    dataType: "json",
                    error : function(){
                        alert("网络错误请重试！");
                    }
                },
                settings = $.extend({}, defaults, options);
            $.ajax(settings);
        }
        wxHeck.getDouble = function (str) {
            var _str = str + "";
            return _str.length > 1 ? _str : "0" + _str;
        }
        wxHeck.getTime = function (timestamp) {
            var time = new Date(+timestamp),
                timeArr = [time.getFullYear(), (time.getMonth() + 1), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()];
            timeArr = $.map(timeArr, function (ele, index) {
                return wxHeck.getDouble(ele);
            });
            return timeArr.slice(0, 3).join("/") + " " + timeArr.slice(3).join(":");
        }
        // 图片上传
        wxHeck.upLoadImgInit = function (vm) {
            wxHeck.uploadFn.init({
                progress: function () {
                    return $(".send_progress>i")[0];
                },
                filters: {
                    mime_types: [ //只允许上传图片
                        {
                            title: "Image files", extensions: "jpg,jpeg,gif,png,bmp"
                        }
                    ]
                },
                // 上传之前
                BeforeUpload: function (up, file, previewImage) {
                    // 如果是群发到群
                    if (vm.setGroupChat.flag) return;
                    // 上传之前 在页面上放置图片
                    previewImage(file, function (imgsrc) {
                        wxHeck.pushMsg({
                            pushId: vm.wxData.curUserId,
                            isCC: true,
                            msg: [imgsrc, file.fileFullName],
                            time: (new Date).getTime(),
                            cnt_type: 9999
                        });
                    });
                },
                // 上传成功
                FileUploaded: function (up, file, info) {
                    var msgObj = {
                        action: "chat",
                        id: localInfo.id,
                        type: "web",
                        to_id: vm.wxData.curUserId,
                        to_type: "ios",
                        content: file.fileFullName,
                        // 图片发送cnt_type 为1
                        cnt_type: 1
                    }
                    // 如果是群发到群
                    if (vm.setGroupChat.flag) {
                        vm.sendGroupChat(msgObj);
                        return;
                    }
                    ;
                    // 发送消息
                    wxHeck.sendMsg(msgObj);
                },
                Error : function(up, err){
                    alert(err.message);
                }
            });
        }
        // 文件上传
        wxHeck.upLoadFileInit = function (vm) {
            return;//20170719 liliang
            wxHeck.uploadFnCos.init({
                selector: "#send_file_button",
                fileLimitType: "jpg,jpeg,gif,png,bmp,pdf,doc,xlsx,txt,xls,docx,pptx,ppt",
                startCallBack : function(){
                    vm.loading.show = true;
                },
                error: function (errorData) {
                    vm.loading.show = false;
                    if (errorData.errorCode == -1) return alert("文件上传格式错误！");
                    if (errorData.errorCode == -2) return alert("最大只能发送5M的文件！");
                },
                errorCallBack : function(callback){
                    alert(callback.responseJSON.message);
                    vm.loading.show = false;
                },
                successCallBack: function (data) {
                    var msgObj = JSON.stringify({
                        title: data.fileInfo.fileName,
                        introduction: data.fileInfo.fileSize + "K",
                        icon: localInfo.fileicon,
                        link: data.fileUpdate.data.access_url,
                        id: data.fileUpdate.data.vid
                    });
                    wxHeck.sendMsg({
                        "action": "chat",
                        "id": localInfo.id,
                        "to_id": wxHeck.wxInit.wxData.curUserId,
                        "type": "web",
                        cnt_type: 3000,
                        content: msgObj
                    });
                    wxHeck.pushMsg({
                        pushId: wxHeck.wxInit.wxData.curUserId,
                        isCC: true,
                        msg: msgObj,
                        cnt_type: 3000,
                        time: (new Date).getTime()
                    });
                    vm.loading.show = false;
                },
                progress: function () {
                    return $(".send_progress>i")[0];
                }
            });
        }
        wxHeck.getTextPos = function () {
            var text = $(".send_text")[0];
            if (!text) return;
            try {
                var startPos = text.selectionStart;
                var endPos = text.selectionEnd;
                return {
                    startPos: startPos,
                    endPos: endPos,
                    setPos: function (len) {
                        text.selectionStart = text.selectionEnd = len;
                    }
                }
            } catch (e) {
            }
        }
        // 获取列表
        wxHeck.getUserList = function () {
            if (wxHeck.wxInit.wxData.userList.length > 0) return;
            // 获取列表
            wxHeck.sendMsg({
                "action": "gain_user_list",
                "id": localInfo.id,
                "type": "web"
            });
            // 朋友圈未读
            wxHeck.sendMsg({
                "action": "receive_wcmsg",
                "id": localInfo.id,
                "type": "web"
            });
            //跟踪时间
            wxHeck.sendMsg({
                "action": "follow_info",
                "id": localInfo.id,
                "type": "web"
            });
        }
        wxHeck.pushMsg = function (opts) {
            console.log('↓↓↓↓↓↓↓发出的消息↓↓↓↓↓↓↓');
            console.log(opts);
            var defaults = {
                    // 更新数组方法 默认 push
                    pushType: "push",
                    // 是否滚动到底部
                    gotoBottom: true,
                    // 是否是拉取历史纪录
                    isGetHistory: false,
                    // 消息类型 默认为文本
                    cnt_type: 0
                },
                obj = $.extend({}, defaults, opts);
            // 如果为拉取历史纪录 则不需要滚动到最底部
            if (obj.isGetHistory) obj.gotoBottom = false;
            if (!!wxHeck.wxInit.wxData.msgList && !!wxHeck.wxInit.wxData.msgList[obj.pushId]) {
                // 495 卡片链接消息 , 492001 是红包消息
                var msgConfig = {
                    "62": "收到用户发送的视频，但暂时无法在网页端看用户的视频",
                    "492001": "收到用户发送的红包，可以提醒用户我们不能接受客户的红包",
                    "48": "收到用户发送的地址，但现在不支持查看地址",
                    // "496" : "学员给你发送了一份文件，暂时不支持文件查看，可以提醒学员发送截图",
                    "50": "对方邀请你音视频通话，但我们不支持音视频通话"
                }
                obj.msg = (function () {
                    // 如果是文本 则进行表情 连接 转换
                    if (obj.cnt_type == 0) {
                        obj._msg = wxHeck.Util.msgFilter(obj.msg, true);
                        return wxHeck.Util.msgFilter(obj.msg);
                    }
                    // 如果是名片
                    if (obj.cnt_type == 42
                        || obj.cnt_type == 3000
                        || obj.cnt_type == 3001
                        || obj.cnt_type == 3100
                        || obj.cnt_type == 495
                        || obj.cnt_type == 4950
                        || obj.cnt_type == 6000
                        || obj.cnt_type == 6001) {
                        try {
                            return JSON.parse(obj.msg);
                        } catch (e) {
                            return obj.msg;
                        }
                    }
                    return msgConfig[obj.cnt_type] || obj.msg;
                })();
                // 插入消息
                wxHeck.wxInit.wxData.msgList[obj.pushId].userMsg[obj.pushType]({
                    // 是否本机发送
                    isCC: obj.isCC,
                    // 内容
                    content: obj.msg,
                    msg_content: obj.msg,
                    // 时间戳
                    time: wxHeck.getTime(obj.time),
                    msg_time : wxHeck.getTime(obj.time),
                    //msg_time : wxHeck.unicodeTimeSet(wxHeck.getTime(obj.time)),
                    // 历史记录中的昵称
                    name: obj.name,
                    // 消息类型 在msgConfig中的 当 0(文本) 来处理
                    cnt_type: obj.cnt_type,
                    from_uid: localInfo.wechat_id,
                    to_group_id: 0,
                    to_group_id_str: "",
                    to_uid: obj.pushId

                });

                // 如果为拉取历史记录 则不更新最后一条消息
                if (!obj.isGetHistory) {
                    var
                        // 如果为群消息 且不是cc自己发的 加上发消息人的name
                        lastMsg1 = (wxHeck.wxInit.wxData.msgList[obj.pushId].isGroup && !obj.isCC) ? obj.name + ":" : "",
                        lastMsg2 = (function () {
                            if (obj.cnt_type == 0) return obj._msg;
                            if (obj.cnt_type == 1 || obj.cnt_type == 9999) return "[图片消息]";
                            if (obj.cnt_type == 2) return "[语音消息]";
                            if (obj.cnt_type == 42) return "[名片消息]";
                            if (obj.cnt_type == 3000 || obj.cnt_type == 3001) return "[卡片消息]";
                            if (obj.cnt_type == 495) return "[文章消息]";
                            if (obj.cnt_type == 4950) return "[加群邀请]";
                            if (obj.cnt_type == 6000) return "[收到文件]";
                            if (obj.cnt_type == 6001) return "[视频]";
                            if (obj.cnt_type == 3100) return obj.msg.content;
                            return msgConfig[obj.cnt_type] || obj.msg;
                        })();
                    // 更新最后一条消息
                    wxHeck.wxInit.wxData.msgList[obj.pushId].lastMsg = lastMsg1 + lastMsg2;
                }
                if (obj.gotoBottom) {
                    // 插入消息后 滚动到底部
                    window.setTimeout(function () {
                        wxHeck.scrollToBottom();
                    }, 0);
                }
            }
        }
        // 转换图片url
        wxHeck.getImgUrl = function(url){
            if(!url) return "";
            var key = url.split(".")[0].replace(/h.*\//, "");
            var config = {
                testtest1117 : "bbimage1",
                weixinheiniao : "bbimage2",
                useoss : "bbimage2"
            }
            // 转换后的url 服务器配置反向代理访问 跳过跨域
            var _url = url.replace(/h.*com/, "/" + config[key]);
            // 服务器配置上线后去掉
            // _url = url;
            return _url;
        }
        wxHeck.isMyFriend = function(id){
            return $.inArray(id, wxHeck.wxInit.wxData.userList) > -1;
        }
        wxHeck.isHelper = function(){
            var curUserId = wxHeck.wxInit.wxData.curUserId;
            var helpList = wxHeck.wxInit.wxData.helpList;
            return $.inArray(curUserId, helpList) > -1;
        }

        wxHeck.flashTitle = wxHeck.Util.flashText();

        wxHeck.flashTitleFn = (function(){
            var title = document.title;
            return {
                set : function(text){
                   wxHeck.flashTitle.set(text, function (flashText) {
                        document.title = flashText;
                    });
                },
                reset : function(cb){
                    wxHeck.flashTitle.reset(function(){
                        document.title = title;
                        typeof(cb) == "function" && cb();
                    });
                }
            }
        })();

        // 联系人搜索框组件
        var userSel = Vue.extend({
            template: "#weixin_sel_bom",
            data: function () {
                return {
                    selSelect: [],
                    selFilter: "",
                    selShow: false,
                    openType: "getChat",
                    inputMsg: "",
                    selLabel: "",
                    selLabelss:localInfo.labelList,
                    selList: [],
                    // 0 群发给个人 1 群发给群
                    chatType : "",
                    isPending: {
                        flag: false,
                        text: "",
                        isSure: false,
                        sureText: ""
                    }
                }
            },
            props: {
                selData: {
                    default: function () {
                        return {};
                    }
                },
                selLabels: {
                    default: function () {
                        return [];
                    }
                },
                localInfo: {
                    default: function () {
                        return {};
                    }
                }
            },
            computed: {
                inputMsgVal: function () {
                    return $.trim(this.inputMsg);
                },
                // 是否是群发
                isGetGroupChat: function () {
                    return this.openType == "getGroupChat";
                },
                // 是否是群发个人
                isSingle : function(){
                    return this.isGetGroupChat && this.chatType == "0";
                },
                // 是否是群发到群
                isGroup : function(){
                    return this.isGetGroupChat && this.chatType == "1";
                },
                selTitle: function () {
                    if(this.isSingle) return "群发个人";
                    if(this.isGroup) return "群发给群";
                    return "选择联系人";
                },
                // 配合搜索生成的列表数据 以后支持拼音
                // selLabel
                selLists: function () {
                    var that = this;
                    var _selFilter = $.trim(that.selFilter);
                    var _selLabel = that.selLabel;
                    if ((_selFilter == "" && _selLabel == "") || that.selList.length == 0) return that.selList;
                    var filterResult = [];
                    $.map(that.selList, function (ele, index) {
                        var userInfo = that.selData[ele].userInfo;
                        // 根据nick或者备注做匹配
                        var selByFilter = that.isMath(userInfo.c_remark, _selFilter) || that.isMath(userInfo.nick, _selFilter);
                        // 根据标签做匹配
                        var selByLabel = userInfo.label.indexOf(_selLabel) > -1;
                        if (selByFilter && selByLabel) {
                            filterResult.push(ele);
                        }
                    });
                    return filterResult;
                },
                // 是否全选
                isSelUserAll: function () {
                    var that = this;
                    var _selFilter = $.trim(that.selFilter);
                    var _selLabel = that.selLabel;
                    if (that.selList.length == 0 || that.selLists.length == 0) return false;
                    // 如果关键字为空 列表完整
                    if (_selFilter == "" && _selLabel == "") return that.selLists.length == that.selSelect.length;
                    var result = true;
                    $.map(that.selLists, function (ele, index) {
                        if (that.selSelect.indexOf(ele) == -1) {
                            result = false;
                            return false;
                        }
                    });
                    return result;
                }
            },
            watch: {
                selSelect: function (value) {
                    if (this.isGetGroupChat) this.$dispatch("getSelList", value);
                }
            },
            methods: {
                // str 搜索的部分 key关键字
                isMath : function(str, key){
                    if(!str) return;
                    return str.toLowerCase().indexOf(key.toLowerCase()) > -1;
                },
                selUser: function (id) {
                    var index = this.selSelect.indexOf(id);
                    if (index > -1) {
                        this.selSelect.splice(index, 1);
                    } else {
                        this.selSelect.unshift(id);
                    }
                },
                selDel: function (id) {
                    this.selSelect.$remove(id);
                },
                // 全选功能
                selUserAll: function () {
                    var that = this;
                    var _selFilter = $.trim(that.selFilter);
                    var _selLabel = that.selLabel;
                    if (that.selList.length == 0 || that.selLists.length == 0) return;
                    if (_selFilter == "" && _selLabel == "") {
                        // 如果关键词为空 列表完整
                        if (that.isSelUserAll) {
                            // 如果是全选状态
                            that.selSelect = [];
                        } else {
                            // 如果非全选状态
                            that.selSelect = that.selLists.slice();
                        }
                    } else {
                        // 如果关键词非空 列表非完整
                        if (that.isSelUserAll) {
                            // 如果是全选状态
                            $.map(that.selLists, function (ele, index) {
                                that.selSelect.$remove(ele);
                            });
                        } else {
                            // 如果非全选状态
                            $.map(that.selLists, function (ele, index) {
                                if (that.selSelect.indexOf(ele) == -1) {
                                    that.selSelect.unshift(ele);
                                }
                            });
                        }
                    }
                },
                // 关闭弹层
                selCancel: function () {
                    this.selShow = false;
                    this.selSelect = [];
                    this.selFilter = "";
                    this.inputMsg = "";
                    this.selLabel = "";
                    this.chatType = "";
                    this.isPendingDefault();
                    this.$root.parentSend = false;
                    this.$root.forwardText = "";
                },
                isPendingDefault: function () {
                    this.isPending.flag = false;
                    this.isPending.isSure = false;
                    this.isPending.sureText = "";
                    this.isPending.text = "";
                },
                // 打开弹层
                selOpen: function () {
                    this.selShow = true;
                    this.$nextTick(function () {
                        $(".sel_list").each(function (index, ele) {
                            $(ele).wxScroll();
                        });
                    });
                },
                // 按确定
                selSure: function () {
                    if (this.selSelect.length == 0) return;
                    if (this.openType == "getGroup" && this.inputMsg == "") return;
                    var that = this;
                    that.$dispatch("userSelSure", {
                        openType: that.openType,
                        returnData: {
                            selectList: that.selSelect.slice(),
                            inputMsg: that.inputMsg
                        }
                    });
                }
            },
            events: {
                userSelOpen: function (data) {
                    this.openType = data.type;
                    this.chatType = data.chatType;
                    // 如果是群发到群 则为群列表 否则为个人列表
                    this.selList = data[this.isGroup ? "listGroup" : "listPerson"];
                    this.selOpen();
                },
                userSelClose: function () {
                    this.selCancel();
                },
                userSelPending: function (data) {
                    this.isPending.text = data;
                    this.isPending.flag = true;
                },
                userSelPendingSure: function (data) {
                    this.isPending.isSure = true;
                    this.isPending.sureText = data;
                },
                userSelPendingDefault: function () {
                    this.isPendingDefault();
                }
            }
        });
        // 改名组件
        var editName = Vue.extend({
            template: "#weixin_edit",
            data: function () {
                return {
                    editShow: false,
                    editvalue: "",
                    isGroup: false,
                    isNicker: false
                }
            },
            computed: {
                editValue: function () {
                    return $.trim(this.editvalue.replace(/<|>|\//g,''))
                }
            },
            methods: {
                selCancel: function () {
                    this.editShow = false;
                    this.editvalue = "";
                },
                selSure: function (a) {
                    if (this.editValue == "") return;
                    this.$dispatch("editNameSure", {
                        isGroup: this.isGroup,
                        editValue: this.editValue,
                        nickInfo: a
                    });
                }
            },
            events: {
                editNameOpen: function (data) {
                    this.editvalue = data.reMark;
                    this.editShow = true;
                    this.isGroup = data.isGroup;
                    this.isNicker = data.isNicker
                },
                editNameClose: function () {
                    this.selCancel();
                },
                editMyNicker: function (data) {
                    this.editShow = true;
                    this.isNicker = true;
                    this.isGroup = true;
                    this.editvalue = data.nicker;
                }
            }
        });
        // 知识库组件
        var quickCon = Vue.extend({
            template: "#quick_con",
            data: function () {
                return {
                    conList: [],
                    otherList : [
                        { content : "1.如何使用黑鸟给学员发送教材？点开学员聊天界面，右上角会显示学员当天预约的教材，点击一键发送即可。目前黑鸟支持当天或黑鸟上显示预约的教材，如想发其他日期上的教材需要进入学员会员中心下载单独发送。" },
                        { content : "2.如何把学员设置为全部标签里的某一个标签，如：快到期，已过期？全部标签所有的标签都是系统判断的，不能手动设置。如有发现名字下有此类学员没有被系统标注正确标签，请您及时反馈给我们。" },
                        { content : "3.如何建群？点击左上角菜单按钮，点击发起群聊，在搜索栏里选择你要群聊的对象，点击确认即可。" },
                        { content : "4.如何群发个人？点击左上角菜单按钮，点击 群发个人，在搜索栏里选择你要群发的对象和图片，点击确认即可。目前群发图片和文字时不能同步发送。" },
                        { content : "5.如何群发图片？黑鸟支持群发图片和文字，点击群发按钮，选择群发对象，选中群发图片即可。" },
                        { content : "6.学员推荐好友给我，如何查看推荐来源推荐人是谁？目前黑鸟无法实现此功能，建议您问学员是被谁推荐来的：如微信名字或者手机号等。" },
                        { content : "7.如果使用黑鸟往朋友圈分享小视频？1）安装PC端微信客户端，登陆自己的微信号。2）使用自己微信发视频给黑鸟工作微信。3）在黑鸟微信浏览器端点击分享到朋友圈。" },
                        { content : "8.微信掉线怎么办？及时复制下图上的微信ID发到黑鸟工作群里，以便技术及时为您解决。如果是自己使用手机踢掉线的，在准备提掉线之前请提前说明。" }
                    ],
                    isOther : false,
                    inputData: "",
                    tagSel: {
                        selShow: false,
                        selData: [],
                        selName: ""
                    },
                    isSearch: false,
                    tagList:[],
                    labelId:''
                }
            },
            props: {
                isShow: {
                    default: false
                },
                isGroup:false
            },
            computed : {
                conLists : function(){
                    return this.isOther ? this.otherListCom : this.conList;
                },
                otherListCom : function(){
                    var _val = $.trim(this.inputData);
                    if(_val == "") return this.otherList;
                    return this.highLight(_val, this.otherList, true);
                }
            },
            methods: {
                // 高亮搜索关键字
                highLight : function(key, list, isFilter){
                    var result = [];
                    if(list.length == 0) return result;
                    var reg = new RegExp(key.split(/\s+/).join("|"), "gi");
                    $.map(list, function (ele, index) {
                        var content = ele.content;
                        if(isFilter){
                            if(content.search(reg) < 0) return;
                        }
                        var _content = content.replace(reg, function (e) {
                            return "<em>" + e + "</em>";
                        });
                        result.push({
                            content : content,
                            _content : _content
                        });
                    });
                    return result;
                },
                sendQuickCon: function (content) {
                    this.$dispatch("getQuickCon", content);
                },
                selShow: function () {
                    var that = this;
                    if (that.tagSel.selData.length == 0 && !that.tagSel.selShow) {
                        wxHeck.getData({
                            url: "/Knowledge/getCardKeyword",
                            data: {
                                admin_id: localInfo.admin_id
                            },
                            success: function (r) {
                                if (r.status != 10000) return alert(r.message);
                                that.tagSel.selData = r.message;
                                if(r.message.length > 0) that.tagSel.selShow = true;
                            }
                        });
                    } else {
                        that.tagSel.selShow = !that.tagSel.selShow;
                    }
                },
                getTag: function (data) {
                    var that = this;
                    that.tagSel.selShow = false;
                    that.labelId = data.id;
                    // console.log(data.id);
                    wxHeck.getData({
                        url: "/Knowledge/getCardPushByKeywordId",
                        data: {
                            keyword_id: data.id,
                            admin_id: localInfo.admin_id
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            that.conList = r.message;
                            that.inputData = "";
                            that.tagSel.selName = data.name;
                            if (that.conList.length != 0) that.isSearch = false;
                        }
                    });
                },
                selHide: function () {
                    this.tagSel.selShow = false;
                }
            },
            watch: {
                inputData: function (val) {
                    var _val = $.trim(val);
                    var that = this;
                    // 如果是黑鸟小助手的数据
                    if(this.isOther) return;
                    if (_val == "") return that.conList = [];
                    wxHeck.getData({
                        url: "/Knowledge/getPushContent",
                        data: {
                            name: _val,
                            admin_id: localInfo.admin_id
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            that.conList = that.highLight(_val, r.message);
                            that.tagSel.selName = "";
                            if (that.conList.length != 0) that.isSearch = true;
                        }
                    });

                }
            },
            events: {
                setOtherList : function(isOther){
                    this.isOther = isOther;
                },
                setTagList:function(data){
                    if(data){
                        this.tagList = data.labelList;
                    }else{
                        this.tagList = [];
                    }
                    this.labelId = ''
                },
                setSelData: function (data) {
                    this.inputData = data;
                }
            }
        });
        // 搜索组件
        var userSearch = Vue.extend({
            template: "#user_search",
            props: {
                selList: {
                    default: function () {
                        return [];
                    }
                },
                selData: {
                    default: function () {
                        return {};
                    }
                },
                localInfo: {
                    default: function () {
                        return {};
                    }
                }
            },
            data: function () {
                return {
                    selFilter: "",
                    showSel: false,
                    canHideFlag: true
                }
            },
            computed: {
                // 以后支持拼音
                userListFilter: function () {
                    var that = this;
                    var _selFilter = $.trim(that.selFilter);
                    if (_selFilter == "" || that.selList.length == 0) {
                        that.showSel = false;
                        return [];
                    }
                    var filterResult = [];
                    $.map(that.selList, function (ele, index) {
                        var userInfo = that.selData[ele].userInfo;
                        if (that.isMath(userInfo.c_remark, _selFilter) || that.isMath(userInfo.nick, _selFilter)) {
                            filterResult.push(ele);
                        }
                    });
                    that.showSel = true;
                    return filterResult;
                }
            },
            methods: {
                // str 搜索的部分 key关键字
                isMath : function(str, key){
                    if(!str) return;
                    return str.toLowerCase().indexOf(key.toLowerCase()) > -1;
                },
                searchReturn: function (id) {
                    this.$dispatch("getSearch", id);
                    this.selFilter = "";
                    this.showSel = false;
                },
                searchHide: function () {
                    if (this.canHideFlag) this.showSel = false;
                },
                cannotHide: function () {
                    this.canHideFlag = false;
                },
                canHide: function () {
                    this.canHideFlag = true;
                }
            },
            ready: function () {
                $(".user_search_result").wxScroll();
            }
        });
        // 列表分类
        var userType = Vue.extend({
            template: "#user_type",
            props: ["selLabels", "listType"],
            methods: {
                setType: function (x) {
                    if (x == this.type) return;
                    this.type = x;
                    this.$dispatch("setListType", x);
                }
            }
        });
        var userTypes = Vue.extend({
            template: "#user_types",
            data: function () {
                return {
                    type : "",
                    show : false
                }
            },
            props: ["localInfo"],
            methods: {
                setType: function (x) {
                    // if (x == this.type) return;
                    this.type = x;
                    this.$dispatch("setListType", x);
                    this.show = false;
                },
                showFn : function(){
                    this.show = !this.show;
                    if(this.show){
                        this.$nextTick(function(){
                            $(".wx_sel").wxScroll();
                        });
                    }
                },
                hideFn : function(){
                    this.show = false;
                }
            },
            computed : {
                showType : function(){
                    var type = this.type;
                    if(type == "") return "全部";
                    if(type == "todayFocus") return "今日关注";
                    return type;
                }
            }
        });
        // 更新个人信息
        var infoUpdate = Vue.extend({
            template: "#info_update",
            data: function () {
                return {
                    updateShow: false
                }
            },
            props: [
                "localInfo", "nickName", "userGroup", "deviceId", "rankList"
            ],
            methods: {
                updateHide: function () {
                    this.updateShow = false;
                    this.nickName = this.localInfo.nick_name;
                    this.userGroup = this.localInfo.user_group;
                    this.deviceId = this.localInfo.device_id;
                    this.rankList = this.localInfo.rank_list;
                },
                updateInfoFn: function () {
                    var that = this;
                    if (!that.canUpdate) return;
                    var data = {
                        admin_id: localInfo.admin_id,
                        wechat_id: localInfo.wechat_id,
                        user_group: that.userGroup,
                        nick_name: $.trim(that.nickName),
                        device_id: $.trim(that.deviceId),
                        rank_list: $.trim(that.rankList).replace(/，/g, ",")
                    }
                    wxHeck.getData({
                        url: "/AdminContact/updateAdminWechatContact",
                        data: data,
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            that.$dispatch("infoUpdateCb", data);
                            alert("更新成功");
                        }
                    });
                }
            },
            computed: {
                canUpdate: function () {
                    return $.trim(this.nickName) != "" && !!this.userGroup && $.trim(this.deviceId) != "" //&& $.trim(this.rankList) != ""
                },
                initShow: function () {
                    return !this.localInfo.nick_name || !this.localInfo.user_group || !this.localInfo.device_id //|| !this.localInfo.rank_list
                }
            },
            events: {
                showUpdate: function () {
                    this.updateShow = true;
                },
                hideUpdate: function () {
                    this.updateHide();
                }
            }
        });
        // 异常弹层
        var errorsTip = Vue.extend({
            template: "#errors_tip",
            data: function () {
                return {
                    errors: {
                        netErr: false,
                        phoneErr: false
                    },
                    iscc:false,
                    isss : false,
                    errDetail:false,
                    ttt : 20,
                    bTime: 20,
                    isErrored : false,
                    mt : null,
                    wechatId: localInfo.wechat_id,
                    crm: localInfo.id,
                    resetError : {
                        show : false,
                        time : 20,
                        timeRemark : 20,
                        mt : null,
                        send : false
                    },
                    showLast : false,
                    isKickOff : false
                }
            },
            methods : {
                sendStatus : function(status){
                    // status 1 掉线 2 临时 3 绝对
                    wxHeck.getData({
                        url: "/AdminMonitor/addAdminMonitorLog",
                        data:{
                            wechat_id: localInfo.wechat_id,
                            status:status
                        },
                        error:function(){
                        }
                    });
                },
                reload: function(){
                    window.location.reload();
                },
                resetErr : function(){
                    if(this.resetError.send) return;
                    if(this.resetError.show) return;
                    var that = this;
                    clearInterval(this.resetError.mt);
                    // 如果是 踢出 /Reboot/setReboot 否则 /AdminContact/killWechat
                    var api = this.isKickOff ? "/Reboot/setReboot" : "/AdminContact/killWechat";
                    wxHeck.getData({
                        beforeSend : function(){
                            that.resetError.send = true;
                        },
                        url : api,
                        data : {
                            wechat_id : localInfo.wechat_id
                        },
                        timeout : 5000,
                        success : function(r){
                            if(r.status != 10000){
                                _alert(r.message, function(){
                                    that.resetErrClear();
                                    that.showLast = true;
                                })
                                return;
                            };
                            that.resetErrSuccess();
                        },
                        complete : function(){
                            that.resetError.send = false;
                        },
                        error : function(){
                            _alert("操作失败", function(){
                                that.resetErrClear();
                                that.showLast = true;
                            });
                        }
                    });
                },
                resetErrSuccess : function(){
                    this.resetError.show = true;
                    this.resetError.mt = setInterval(function(){
                        if(this.resetError.time > 1){
                            this.resetError.time--;
                        }else{
                            this.resetErrClear();
                            this.showLast = true;
                        }
                    }.bind(this), 1000);
                },
                resetErrClear : function(){
                    clearInterval(this.resetError.mt);
                    this.errDetail = false;
                    this.isKickOff = false;
                    this.resetError.time = this.resetError.timeRemark;
                    this.resetError.show = false;
                }
            },
            props: {
                deviceId: {
                    default: ""
                }
            },
            computed: {
                errorsTipShow: function () {
                    var errors = this.errors;
                    for (var x in errors) {
                        if (errors[x]) {
                            return true;
                            break;
                        }
                    }
                    return false;
                }
            },
            events: {
                setErrors: function (data) {
                    var that = this;
                    var errors = this.errors;
                    for (var x in data) {
                        if (x in errors) errors[x] = data[x];
                    }
                    this.iscc = data.iscc;
                    this.isss = data.isss;

                    // 设置滚动标题
                    var isErrors = errors.netErr || errors.phoneErr;
                    if(isErrors){
                        wxHeck.flashTitleFn.set("黑鸟已掉线！");
                    }else{
                        wxHeck.flashTitleFn.reset(function(){
                            if(wxHeck.wxInit.noReadAll > 0) wxHeck.flashTitleFn.set("您有新的消息！");
                        });
                    }

                    // 网络错误
                    if(errors.netErr){
                        // console.log(that.mt);
                        clearInterval(that.mt);
                        that.bTime = that.ttt;
                        that.errDetail = false;
                        that.iscc = that.isss = false;
                        return;
                    };
                    //手机掉线
                    clearInterval(that.mt);
                    if(errors.phoneErr){
                        this.isErrored = true;
                        that.sendStatus(1);
                        // 倒计时20s
                        that.mt = setInterval(function(){
                            if(that.bTime > 1){
                                that.bTime--;
                            }else{
                                that.sendStatus(3);
                                clearInterval(that.mt);
                                wxHeck.getData({
                                    url : "/Reboot/getKickOutStatus",
                                    data : {
                                        wechat_id : localInfo.wechat_id
                                    },
                                    success : function(r){
                                        that.isKickOff = r.status == 10000;
                                        that.bTime = that.ttt;
                                        that.errDetail = true;
                                        that.iscc = that.isss = false;
                                    },
                                    error : function(){
                                        that.bTime = that.ttt;
                                        that.errDetail = true;
                                        that.iscc = that.isss = false;
                                    }
                                });
                                /*
                                 clearInterval(that.mt);
                                 that.bTime = that.ttt;
                                 that.errDetail = true;
                                 that.iscc = that.isss = false;*/
                            }
                        }, 1000);
                    }else{
                        //手机上线
                        if(this.isErrored){
                            console.log("手机上线");
                            if(that.bTime != that.ttt){
                                that.sendStatus(2);
                            }
                            clearInterval(that.mt);
                            that.bTime = that.ttt;
                            that.errDetail = false;
                            that.iscc = that.isss =false;
                            // 手机掉线后 上线了
                            this.errDetail = false;
                            this.showLast = false;
                            this.resetErrClear();
                        }
                    }
                }
            }
        });
        // 添加好友
        var addFriend = Vue.extend({
            template: "#add_friend",
            data: function () {
                return {
                    // 去下一步
                    toNext: false,
                    // 展示加好友界面
                    addFriendShow: false,
                    // 搜索用的微信账号或手机号
                    wxAcc: "",
                    // 个人介绍
                    wxDes: "",
                    // 正常添加 type0 卡片 type 1
                    type: "0",
                    // 添加好友第二步 微信头像
                    wechat_img: "",
                    // 添加好友第二步 昵称
                    wechat_nick: "",
                    // 设置备注
                    remark: "",
                    // crm id
                    crmId : "",
                    // crm手机号
                    crmMobile : "",
                    // 是否是我的学员添加
                    addType : "",
                    //当前学员课程状态
                    trialStatus : "",
                    //个人介绍字符长度
                    longStrTip : false
                }
            },
            props: ["localInfo"],
            methods: {
                addFriendHide: function () {
                    this.crmId = "";
                    this.crmMobile = "";
                    this.remark = "";
                    this.wechat_nick = "";
                    this.wechat_img = "";
                    this.type = "0";
                    this.wxDes = "";
                    this.wxAcc = "";
                    this.addType = "";
                    this.trialStatus = "";
                    this.addFriendShow = false;
                    this.toNext = false;
                },
                addFriendNext: function () {
                    if(!this._wxAcc) return;
                    // 如果从我的学员过来的 已经有crmid 跟crmmobile 直接走添加
                    if(this.addType){
                        this.$dispatch("addFriendNextCb", {
                            keyword: this._wxAcc,
                            trialStatus: this.trialStatus
                        });
                        return;
                    }

                    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
                    // 如果搜索关键字是手机号
                    if(reg.test(this._wxAcc)){
                        var that = this;
                        // 根据手机号 搜索crmid
                        wxHeck.getData({
                            url: "/UserContact/searchUserInfo",
                            data: {
                                user_num: that._wxAcc
                            },
                            success: function (r) {
                                if(r.message.id){
                                    // 如果是有crmid
                                    that.crmId = r.message.id;
                                    that.crmMobile = r.message.mobile;
                                    that.trialStatus = r.message.trialStatus || '';
                                    that.$dispatch("addFriendNextCb", {
                                        keyword: that._wxAcc,
                                        crmId: that.crmId,
                                        trialStatus: that.trialStatus
                                    });
                                }else{
                                    // 如果没有
                                    that.$dispatch("addFriendNextCb", {
                                        keyword: that._wxAcc
                                    });
                                }
                                console.log('状态是：'+ that.trialStatus);
                            }
                        });

                    }else{
                        this.$dispatch("addFriendNextCb", {
                            keyword: this._wxAcc
                        });
                    }
                },
                addFriendFn: function () {
                    var that = this;
                    if (!that.canUpdate) return;
                    wxHeck.getData({
                        url: "/UserContact/remindCount",
                        data: {
                            admin_id: localInfo.id,
                        },
                        success: function (r) {
                            if (r.status != 10000) return  _alert(r.message);
                            _confirm(r.message, function(){
                                that.$dispatch("addFriendCb", {
                                    // 搜索用的关键字
                                    wxid: that.wxAcc,
                                    // 介绍
                                    verify_msg: that._wxDes,
                                    // 添加方式 卡片 1 正常 0
                                    type: that.type,
                                    // crmid
                                    user_id: that.crmId,
                                    // crm手机号
                                    mobile: that.crmMobile,
                                    remark: that.remark
                                });
                            })
                        },
                        error:function () {
                            _alert("网络错误，请重试！");
                        }
                    });
                }
            },
            computed: {
                _wxAcc: function () {
                    return $.trim(this.wxAcc);
                },
                _wxDes: function () {
                    return $.trim(this.wxDes);
                },
                _wxDesLen: function () {
                    //判断自我介绍长度
                    // var tem = [];
                    // var str = this._wxDes;
                    // if(str){
                    //     for(var i = 0; i < str.length; i++){
                    //         if(str.charCodeAt(i) > 255){
                    //             tem.push('.','.','.')
                    //         }else{
                    //             tem.push(str[i]);
                    //         }
                    //     }
                    // }
                    var tem = this._wxDes;
                    if(tem.length > 50){
                        this.longStrTip = true;
                    }else{
                        this.longStrTip = false;
                    }
                    return tem.length;
                },
                canUpdate: function () {
                    return this._wxAcc != "" && this._wxDes != "" && this._wxDesLen <= 50;
                }
            },
            events: {
                showAddFriend: function (data) {
                    console.log(data);
                    if (data.type == 1){
                        // 如果是卡片传入wxid
                        this.wxAcc = data.wxAcc;
                    }else{
                        // 否则清空添加
                        this.wxAcc = data.acc || "";
                    }
                    //如果是我的学员添加

                    if(data.addType == 'fromMyStudy'){
                        switch (data.trialStatus){
                            case 1:
                                this.trialStatus = 'end';
                                break;
                            case 2:
                                this.trialStatus = 'on';
                                break;
                            case 3:
                                this.trialStatus = 'non';
                                break;
                            case 4:
                                this.trialStatus = 'cancel';
                                break;
                            default:
                                this.trialStatus = 'noData';
                        }
                    }
                    // 正常 or 卡片
                    this.type = data.type;
                    this.wxDes = wxHeck.checkUserType(localInfo.nick_name,this.trialStatus);
                    console.log('a',localInfo.nick_name,this.trialStatus);
                    // 从我的学员过来 可能会传入 crmId 跟 crmMobile
                    this.crmId = data.crmId || "";
                    this.crmMobile = data.crmMobile || "";
                    this.addType = data.addType || "";
                    this.addFriendShow = true;
                },
                addFriendToNext: function (data) {
                    var that = this;
                    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
                    // 备注
                    var remark = [];
                    ;(function(){
                        // 如果有crmid
                        if(that.crmId) remark.push(that.crmId);
                        // 昵称
                        remark.push(data.wechat_nick);
                        // crm手机号
                        if(that.crmMobile){
                            // 如果有crm手机号
                            remark.push(that.crmMobile)
                        }else{
                            // 如果没有 判断搜索条件是否为手机号
                            // 如果是 则为备注
                            if(reg.test(that._wxAcc)){
                                remark.push(that._wxAcc);
                            }
                        }
                    })();
                    this.wechat_img = data.wechat_img;
                    this.wechat_nick = data.wechat_nick;
                    this.remark = remark.join("-");
                    this.wxDes = wxHeck.checkUserType(localInfo.nick_name,this.trialStatus);
                    console.log('b',localInfo.nick_name,this.trialStatus);
                    this.toNext = true;
                },
                // 私聊的时候 不是好友 直接到第二步
                addFriendGoNext: function (data) {
                    this.wechat_img = data.wechat_img;
                    this.wechat_nick = data.wechat_nick;
                    this.toNext = true;
                    this.wxAcc = data.wxid.split('$')[1];
                    this.wxDes = wxHeck.checkUserType(localInfo.nick_name,this.trialStatus);
                    this.addFriendShow = true;
                    console.log('c',localInfo.nick_name,this.trialStatus);
                },
                hideAddFriend: function () {
                    this.addFriendHide();
                }
            }
        });
        // 粘贴上传
        var sendPaste = Vue.extend({
            template: "#send_paste",
            data: function () {
                return {
                    sendPasteShow: false,
                    imgSrc: "",
                    sureDisable: false
                }
            },
            methods: {
                hide: function () {
                    this.sendPasteShow = false;
                    this.imgSrc = "";
                    this.sureDisable = false;
                },
                send: function () {
                    // 截图上传
                    this.sureDisable = true;
                    this.$dispatch("getSendPaste", {
                        imgSrc: this.imgSrc
                    });
                }
            },
            events: {
                openSendPaste: function (data) {
                    this.sendPasteShow = true;
                    this.imgSrc = data.imgSrc;
                },
                enableSendPaste: function () {
                    this.sureDisable = false;
                },
                hideSendPaste: function () {
                    this.hide();
                }
            }
        });
        // 发送表情
        var sendFace = Vue.extend({
            template: "#send_face",
            data: function () {
                return {
                    show: false,
                    curType: 0,
                    faceData: [
                        {
                            type: 0,
                            des: "默认表情",
                            data: wxHeck.Util.qqfaceConfigArr
                        }/*,
                         {
                         type : 1,
                         des : "51表情",
                         data : []
                         }*/
                    ]
                }
            },
            methods: {
                changType: function (type) {
                    if (this.curType != type) this.curType = type;
                },
                sendFace: function (type, con) {
                    this.$dispatch("getFace", {
                        type: type,
                        con: con
                    });
                },
                sendFaceShow: function () {
                    this.show = !this.show;
                },
                sendFaceHide: function () {
                    this.show = false;
                }
            }
        });
        // 发送图片
        var sendImg = Vue.extend({
            template: "#send_img"
        });
        // 发送文章
        var sendArticle = Vue.extend({
            template: "#send_article",
            data: function () {
                return {
                    isLoading: true,
                    articleListShow: false,
                    navlist: {},
                    articleListData: [],
                    curArticleIndex: null,
                    articlePageCount: 0,
                    //当前选择的类型／
                    articleCurrentPage: null,
                    searchKey:'',
                    //文章红点
                    redPoint:{
                        newflag:false,
                        type:[],
                        news:false
                    }
                }
            },
            methods: {
                //检测红点
                checkNewArticle: function () {
                    return;
                    //2017-7-19 李亮截断
                    var that = this;
                    wxHeck.getData({
                        url:'/Article/AddNewArticleTips',
                        data:{user_group:localInfo.user_group},
                        success:function (data) {
                            if(data.status == 10000){
                                that.redPoint.newflag = data.message.newflag != 0;
                                //var aidlist={"1":1234,"2":2222,"3":3,"4":4}
                                if(!data.message.aidlist instanceof Array){
                                    //console.log('有');
                                    //遍历类型是否有红点
                                    for(val in data.message.aidlist){
                                        that.redPoint.type.push(val);
                                    }
                                }else{
                                    that.redPoint.type = [];
                                    //console.log('木有');
                                }
                            }
                        },
                        error: function () {
                            console.log("请求文章红点失败！");
                        }
                    });
                },
                show: function () {
                    this.articleListShow = true;
                    if (this.articleListData.length > 0) return;
                    this.getArticle("1");
                    this.$nextTick(function () {
                        $('.con-show').niceScroll({
                            autohidemode: false,
                            cursorcolor: "#686b71",
                            cursoropacitymin: 0.7,
                            cursoropacitymax: 0.7,
                            railpadding: { top: 10, right: 0, left: 0, bottom: 10}
                        });
                    });
                },
                //获取文章类型跟列表
                getArticle: function (page) {
                    this.searchKey = '';
                    if (page == this.articleCurrentPage) return;
                    var that = this;

                    //获取文章分类
                    wxHeck.getData({
                        url: "/Article/getArctype",
                        success: function (data) {
                            if (data.status != 10000) return _alert(data.message);
                            that.navlist = data.message;
                        }
                    });
                    //获取文章分类文章
                    wxHeck.getData({
                        url: "/Article/chatList",
                        beforeSend: function () {
                        },
                        data: {
                            // page: page,
                            page: 1,
                            aid: page
                        },
                        success: function (data) {
                            if (data.status != 10000) return _alert(data.message);
                            that.articleListData = data.message.list;
                            that.articlePageCount = data.message.pageCount;
                            // that.articleCurrentPage = data.message.currentPage;
                            that.articleCurrentPage = page;
                            that.curArticleIndex = null;
                        },
                        complete: function () {
                            that.isLoading = false;
                        }
                    });
                },
                //搜索文章
                searchArticle:function () {
                    var that = this;
                    wxHeck.getData({
                        url: "/Article/search",
                        beforeSend: function () {},
                        data: {
                            aid: that.articleCurrentPage,
                            keyword: that.searchKey
                        },
                        success: function (data) {
                            if (data.status != 10000){
                                //获取文章分类文章
                                wxHeck.getData({
                                    url: "/Article/chatList",
                                    beforeSend: function () {
                                    },
                                    data: {
                                        page: 1,
                                        aid: that.articleCurrentPage
                                    },
                                    success: function (data) {
                                        that.articleListData = data.message.list;
                                        that.curArticleIndex = null;
                                    },
                                    complete: function () {
                                        that.isLoading = false;
                                    }
                                });
                                //return _alert(data.message);
                            }
                            that.articleListData = data.message.list;
                            that.articlePageCount = data.message.pageCount;
                            that.curArticleIndex = null;
                        },
                        complete: function () {
                            that.isLoading = false;
                        }
                    });
                },
                hide: function () {
                    this.articleListShow = false;
                    this.curArticleIndex = null;
                    this.articleCurrentPage = null;
                    this.articleListData = [];
                    this.searchKey = '';
                },
                cutAticle: function (curArticleIndex) {
                    this.curArticleIndex = curArticleIndex;
                    this.articleListShow = true;
                },
                sendArticleParent : function(data){
                    var msgObj = JSON.stringify({
                        title: data.title,
                        introduction: data.desc,
                        icon: data.thumbUrl,
                        link: data.urlStr,
                        id: localInfo.admin_id,
                        forward_text : data.forwardText
                    });

                    var _msgObj = {
                        "action": "chat",
                        "id": localInfo.id,
                        "to_id": wxHeck.wxInit.wxData.curUserId,
                        "type": "web",
                        cnt_type: 3000,
                        content: msgObj
                    }

                    wxHeck.wxInit.sendGroupChat(_msgObj, true);
                },
                sendArticle: function () {
                    var msgObj = JSON.stringify({
                        title: this.articleListData[this.curArticleIndex].title,
                        introduction: this.articleListData[this.curArticleIndex].introduction,
                        icon: this.articleListData[this.curArticleIndex].icon,
                        link: this.articleListData[this.curArticleIndex].link,
                        id: this.articleListData[this.curArticleIndex].id
                    });

                    var _msgObj = {
                        "action": "chat",
                        "id": localInfo.id,
                        "to_id": wxHeck.wxInit.wxData.curUserId,
                        "type": "web",
                        cnt_type: 3000,
                        content: msgObj
                    }
                    // 群发到群
                    if (wxHeck.wxInit.setGroupChat.flag) {
                        var root = this.$root;
                        root.temShareMsg = {
                            desc : this.articleListData[this.curArticleIndex].introduction,
                            thumbUrl : this.articleListData[this.curArticleIndex].icon,
                            title : this.articleListData[this.curArticleIndex].title,
                            urlStr : this.articleListData[this.curArticleIndex].link
                        }
                        root.parentSend = true;
                    } else {
                        wxHeck.pushMsg({
                            pushId: wxHeck.wxInit.wxData.curUserId,
                            isCC: true,
                            msg: msgObj,
                            cnt_type: 3000,
                            time: (new Date).getTime()
                        });
                        wxHeck.sendMsg(_msgObj);
                    }

                    //发送完重置
                    this.curArticleIndex = null;
                    this.articleCurrentPage = null;
                    this.articleListData = [];
                    this.articleListShow = false;
                    //统计文章发送次数
                    wxHeck.getData({
                        url:'/OperationLog/addOperationLog',
                        data:{
                            operation_type: 7
                        },
                        success:function(r){},
                        error:function(r){}
                    })
                }
            },
            filters:{
                filterKey: function (value) {
                    var newExp = new RegExp(this.searchKey, 'g');
                    return value.replace(newExp, '<span>'+this.searchKey+'</span>');
                }
            },
            watch:{
                    searchKey:function (val) {
                        var _val = $.trim(val);
                        var that = this;
                        if (_val == ""){
                            wxHeck.getData({
                                url: "/Article/search",
                                beforeSend: function () {},
                                data: {
                                    aid: that.articleCurrentPage,
                                    keyword: that.searchKey
                                },
                                success: function (data) {
                                    if (data.status != 10000){
                                        //获取文章分类文章
                                        wxHeck.getData({
                                            url: "/Article/chatList",
                                            beforeSend: function () {
                                            },
                                            data: {
                                                page: 1,
                                                aid: that.articleCurrentPage
                                            },
                                            success: function (data) {
                                                that.articleListData = data.message.list;
                                                that.curArticleIndex = null;
                                            },
                                            complete: function () {
                                                that.isLoading = false;
                                            }
                                        });
                                        //return _alert(data.message);
                                    }
                                    that.articleListData = data.message.list;
                                    that.articlePageCount = data.message.pageCount;
                                    that.curArticleIndex = null;
                                },
                                complete: function () {
                                    that.isLoading = false;
                                }
                            });
                        }
                    }
            },
            events:{
                shareMsg: function (r) {
                    this.sendArticleParent(r.msg);
                }
            },
            created : function(){
                //检测是否有新文章[红点提示]
                this.checkNewArticle();
            }
        });
        //发送文件
        var sendFile = Vue.extend({
            "template": "#send_file"
        });
        //发送语音
        var sendVoice = Vue.extend({
            "template": "#send_voice",
            data : function(){
                return {
                    creat : false,
                    show : true,
                    isStep2 : false,
                    isOver : false,
                    time : 0,
                    timeLimit : 60,
                    audioName : "voice",
                    recorderOpen : false,
                    mt : null,
                    pending : false
                }
            },
            methods : {
                open : function(){
                    this.creat = true;
                    this.show = true;
                },
                close1 : function(){
                    this.show = false;
                },
                start : function(){
                    FWRecorder.record(this.audioName, 'audio.wav');
                },
                close2 : function(){
                    this.clear();
                    this.show = false;
                },
                clear : function(){
                    // 停止录音
                    this.stopRecording();
                    this.time = 0;
                    // 恢复到第一步
                    this.isStep2 = false;
                    // 恢复到没有超时
                    this.isOver = false;
                },
                stopRecording : function(){
                    FWRecorder.stopRecording(this.audioName);
                    clearInterval(this.mt);
                },
                startRecord : function(){
                    this.isStep2 = true;
                    clearInterval(this.mt);
                    this.mt = window.setInterval(function(){
                        if(this.time < this.timeLimit){
                            // 没有超时
                            this.time = Math.ceil(FWRecorder.duration(this.audioName));
                        }else{
                            // 超时了 停止录音
                            this.stopRecording();
                            // 切到超时
                            this.isOver = true;
                        }
                    }.bind(this), 1000);
                },
                end : function(){
                    var that = this;
                    // 打开发送中
                    that.pending = true;
                    // 停止录音
                    that.stopRecording();
                    // 获取音频
                    window.setTimeout(function(){
                        wxHeck.getData({
                            url : "/UploadFile/uploadRecorder",
                            type : "post",
                            dataType : "json",
                            data : {
                                file_base64 : FWRecorder.getBase64(that.audioName)
                            },
                            success : function(r){
                                if(r.status != 10000){
                                    _alert(r.message, function(){
                                        that.pending = false;
                                    });
                                    return;
                                }
                                // 发送语音
                                that.sendVoiceFn(r.message);
                                // 关闭弹层
                                that.close2();
                                that.pending = false;
                            },
                            error : function(){
                                _alert("网络错误，请重试！", function(){
                                    that.pending = false;
                                });
                            }
                        });
                    }, 0);
                },
                sendVoiceFn : function(audioURL){
                    wxHeck.pushMsg({
                        pushId: wxHeck.wxInit.wxData.curUserId,
                        isCC: true,
                        msg: audioURL,
                        time: (new Date).getTime(),
                        cnt_type: 2
                    });
                }
            }
        });
        // 聊天工具---
        var chatTools = Vue.extend({
            template: "#chat_tools",
            components: {
                sendImg: sendImg,
                sendFace: sendFace,
                sendArticle: sendArticle,
                sendFile: sendFile,
                sendVoice: sendVoice
            }
        });
        //版本升级
        var updateWechat = Vue.extend({
            template: "#update_wechat",
            data: function () {
                return {
                    waiting: true
                }
            },
            props: ["clientVersion", "cloudVersion"],
            computed: {
                updataShow: function () {
                    return parseInt(this.clientVersion) < parseInt(this.cloudVersion);
                }
            },
            methods: {
                onUpdate: function () {
                    wxHeck.sendMsg({
                        "action": "get_version",
                        "id": localInfo.id,
                        "type": "web"
                    });
                    setTimeout(function () {
                        location.reload()
                    }, 30000);
                    this.waiting = false;
                }
            }
        });
        var logout = Vue.extend({
            template: '#logout',
            data: function () {
                return {
                    logoutShow: false,
                    selSelect: "",
                    selFilter: ""
                }
            },
            props: {
                selList: {
                    default: function () {
                        return [];
                    }
                },
                selData: {
                    default: function () {
                        return {};
                    }
                }
            },
            computed: {
                // 配合搜索生成的列表数据 以后支持拼音
                // selLabel
                selLists: function () {
                    var that = this;
                    var _selFilter = $.trim(that.selFilter);
                    if (_selFilter == "" || that.selList.length == 0) return that.selList;
                    var filterResult = [];
                    $.map(that.selList, function (ele, index) {
                        var userInfo = that.selData[ele].userInfo;
                        // 根据nick或者备注做匹配
                        var selByFilter = (userInfo.c_remark || userInfo.nick).indexOf(_selFilter) > -1;
                        if (selByFilter) {
                            filterResult.push(ele);
                        }
                    });
                    return filterResult;
                }
            },
            methods: {
                userLogout: function () {
                    if (!window.confirm("确认退出？")) return;
                    wxHeck.Util.closeTab();
                },
                selHide: function () {
                    this.logoutShow = false;
                    this.selFilter = "";
                    this.selSelect = "";
                },
                selUser: function (id) {
                    if (id == this.selSelect) this.selSelect = "";
                    else this.selSelect = id;
                },
                // 打开弹层
                selOpen: function (id) {
                    //默认选中
                    var that = this;
                    var _id = id + "";
                    ;
                    (function () {
                        if (id == "") return;
                        var index = $.inArray(_id, that.selList);
                        if (index == -1) return;
                        that.selList.splice(index, 1);
                        that.selList.unshift(_id);
                        that.selSelect = _id;
                    })();
                    this.logoutShow = true;
                    this.$nextTick(function () {
                        $(".sel_list").each(function (index, ele) {
                            $(ele).wxScroll();
                        });
                    });
                },
                userLogoutTrust: function () {
                    if (this.selSelect == "") return;
                    this.$dispatch("userLogoutTrust", this.selSelect);
                }
            },
            events: {
                logoutShowFn: function (id) {
                    this.selOpen(id);
                }
            }
        });
        // select tool
        var fnTab = Vue.extend({
            template: "#fn_tab",
            data: function () {
                return {
                    show: false,
                    pos: {
                        left: 0,
                        top: 0
                    },
                    sendData: ""
                }
            },
            methods: {
                hide: function () {
                    this.show = false;
                },
                sendSelData: function () {
                    this.$dispatch("getSelData", this.sendData);
                    this.hide();
                },
                open: function (data) {
                    this.pos.left = data.pos.left + "px";
                    this.pos.top = (data.pos.top - 35) + "px";
                    this.sendData = data.sendSelData;
                    this.show = true;
                    this.$nextTick(function () {
                        document.querySelector(".fn_tab").focus();
                    });
                }
            },
            events: {
                openFnTab: function (data) {
                    this.open(data);
                },
                closeFnTab: function () {
                    this.hide();
                }
            }
        });
        var crmRemark = Vue.extend({
            template: "#crm_remark",
            data: function () {
                return {
                    remarks: [],
                    isshow: false,
                    inputData: "",
                    userId: "",
                    showTip: false,
                    selTime: '',
                    selYear: '2017',
                    selMonth: '1',
                    selDay: '1',
                    demo: false
                }
            },
            computed: {
                _inputData: function () {
                    return $.trim(this.inputData);
                }
            },
            methods: {
                hide: function () {
                    this.isshow = false;
                    this.remarks = [];
                    this.inputData = "";
                    this.userId = "";
                    this.showTip = false;
                },
                show: function () {
                    this.isshow = true;
                    // this.$nextTick(function () {
                    //     $(".send_article_inner ul").wxScroll();
                    // });
                    this.$nextTick(function () {
                        $(".add-info-scroll").wxScroll();
                    });
                },
                addRemark: function () {
                    if (this.demo) {
                        this.selTime = this.selYear + "-" + this.selMonth + "-" + this.selDay;
                    }
                    else {
                        this.selTime = '';
                    }
                    var that = this;
                    if (that._inputData == "") return;
                    wxHeck.getData({
                        url: "/Remark/addNew",
                        data: {
                            user_id: that.userId,
                            content: that._inputData,
                            follow_date: that.selTime
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            that.inputData = "";
                            that.showTip = true;
                            clearTimeout(that.tm);
                            that.tm = setTimeout(function () {
                                that.showTip = false;
                            }, 1500);
                        }
                    });
                },
                addRemarkTime: function () {
                    this.demo = !this.demo;
                    // if (this.demo) {
                    //     this.selTime = this.selYear + "-" + this.selMonth + "-" + this.selDay;
                    // }
                    // console.log(this.selTime)
                }
            },
            events: {
                crmRemarkOpen: function (data) {
                    //组件时间
                    var time = new Date();
                    this.selYear = time.getFullYear();
                    this.selMonth = time.getMonth() + 1;
                    this.selDay = time.getDate() + 1;
                    var that = this;
                    that.userId = data.user_id;
                    wxHeck.getData({
                        url: "/Remark/list",
                        data: {
                            user_id: that.userId
                        },
                        success: function (r) {
                            that.remarks = r.message.reverse();
                        }
                    });
                    that.show();
                }
            }
        });
        //群聊相关
        var quickTab = Vue.extend({
            template: "#quick_tab",
            data: function () {
                return {
                    show: false,
                    pos: {
                        left: 0,
                        top: 0
                    },
                    name: "",
                    from_id: "",
                    mem_id: "",
                    //群人员当前信息
                    groupUserInfo: {
                        groupUserWechat_id: "",
                        groupUserWechat_nick: ""
                    },
                    showChatList: false,
                    chatListDetail: [],
                    // 语音播放F
                    voicePlay2: {
                        voiceSrc2: "",
                        playVoiceSrc2: ""
                    },
                    contentType: {
                        types: ["0", "1", "2", "9999", "42", "3000",  "3001", "3100", "4000", "5000", "495", "4950", "6000", "6001", "10000"]
                    },
                    //删除按钮
                    delShow: {
                        show: false
                    },
                    videoUrl :""
                }
            },
            methods: {
                //@人
                atUser: function () {
                    var userCurrent = this.mem_id.split("$");
                    if (userCurrent[1] == '') {
                        _alert("非法@");
                        return;
                    }
                    if (userCurrent[0] == userCurrent[1]) {//groupUserInfo.groupUserWechat_id == localInfo.id
                        _alert("不能@自己");
                        return;
                    }
                    this.$dispatch("getAt", this.name, this.mem_id);
                    this.show = false;
                },
                //私聊
                privateChat: function () {
                    console.log("++++" + this.mem_id);
                    console.log("----" + this.groupUserInfo.groupUserWechat_id);
                    var userCurrent = this.mem_id.split("$");
                    if (userCurrent[1] == '') {
                        _alert("不能私聊！");
                        return;
                    }
                    if (userCurrent[0] == userCurrent[1]) {//groupUserInfo.groupUserWechat_id == localInfo.id
                        _alert("不能私聊自己");
                        return;
                    }
                    this.$dispatch("oneChat", this.mem_id);
                    this.show = false;
                    console.log("私聊:" + this.mem_id);
                },
                //content在哪里
                getChatList: function () {
                    var that = this;
                    if (!that.mem_id.split("$")[1]) return _alert("对不起，当前记录暂不能查询");
                    wxHeck.getData({
                        url: "/WechatMessage/getChatSelfMessage",
                        data: {
                            wechatId: that.from_id,
                            ccId: localInfo.id,
                            mem_id: that.mem_id.split("$")[1]
                        },
                        success: function (r) {
                            that.show = false;
                            if (r.status != 10000) return alert(r.message);
                            for (var i = 0; i < r.message.length; i++) {
                                if(r.message[i].cnt_type==495 || r.message[i].cnt_type==4950 || r.message[i].cnt_type==6000 || r.message[i].cnt_type==6001){
                                    r.message[i].content = JSON.parse(r.message[i].content)
                                }
                            }
                            that.chatListDetail = r.message;
                            that.showChatList = true;
                            that.$nextTick(function () {
                                $(".chat-content").wxScroll();
                            });
                        }
                    });
                },
                //删除群成员
                delCutUser: function () {
                    this.$dispatch("groupListUserDelete", this.groupUserInfo);
                    console.log(this.groupUserInfo);
                    this.show = false;
                },
                closeChatDetail: function () {
                    this.showChatList = false
                },
                hide: function () {
                    this.show = false;
                    this.mem_id = "";
                },
                // 播放声音
                playVoice2: function (src) {
                    this.voicePlay2.voiceSrc2 = src;
                    this.$nextTick(function () {
                        voiceMsgPlayer2.play();
                    });
                },
                isPlaying: function () {
                    this.voicePlay2.playVoiceSrc2 = this.voicePlay2.voiceSrc;
                },
                isEnded: function () {
                    this.voicePlay2.playVoiceSrc2 = "";
                }
            },
            events: {
                openQuickTab: function (data) {
                    console.log(data)
                    this.from_id = data.from_id || data.curtId;//当前群id
                    console.log(this.from_id)
                    this.mem_id = data.mem_id;//当前人wxid
                    this.name = data.name;
                    this.pos.left = data.event.x + "px";
                    this.pos.top = data.event.y + "px";
                    this.show = true;
                    this.$nextTick(function () {
                        $(".quick_tab")[0].focus();
                    });
                    //if (wxHeck.wxInit.$data.contentGroupLayer.show) {
                    this.groupUserInfo.groupUserWechat_id = data.wechat_id;
                    this.groupUserInfo.groupUserWechat_nick = data.wechat_nick;
                    // this.mem_id = data.wechat_id;
                    // this.name = data.wechat_nick;
                    // this.from_id = data.curtId;
                    //}
                    // else {
                    //     this.groupUserInfo.groupUserWechat_id = this.groupUserInfo.groupUserWechat_nick = '';
                    //}
                },
                showDelBtn: function (x) {
                    this.delShow.show = x;
                },
                delGroupListUser: function (data) {
                    if (data.status == 10000) {
                        var listData = wxHeck.dataSource.groupUserLists[data.from_id];
                        console.log(listData)
                        var userId = this.groupUserInfo.groupUserWechat_id;
                        for (var i = 0; i < listData.length; i++) {
                            if (listData[i].wechat_id == userId) {
                                listData.splice(i, 1);
                            }
                        }
                        //退群
                        /*if (listData.length == 1) {
                         this.$root.userListByType.$remove(data.from_id);
                         // this.$root.wxData.userList.$remove(data.from_id);
                         console.log(this.$root.userListByType);//wxData.userlist
                         // console.log(this.$root.wxData.userList);//wxData.userlist
                         }*/
                        _alert("删除成功");
                    } else {
                        _alert(data.message);
                    }
                }
            },
            filters: {
                paser: function (value, index) {
                    this.$data.chatListDetail[index].content = JSON.parse(value);
                },
                artile: function (val, x, y) {
                    if (typeof x == 'string') {
                        return (JSON.parse(x))[y]
                    }
                }
            }
        });
        //分页组件
        var page = Vue.extend({
            template:"#page",
            data:function(){
                return{
                    current:1,
                    showItem:6,
                    allpage:1
                }
            },
            computed:{
                pages:function(){
                    var pag = [];
                    if( this.current < this.showItem ){ //如果当前的激活的项 小于要显示的条数
                        //总页数和要显示的条数那个大就显示多少条
                        var i = Math.min(this.showItem,this.allpage);
                        while(i){
                            pag.unshift(i--);
                        }
                    }else{ //当前页数大于显示页数了
                        var middle = this.current - Math.floor(this.showItem / 2 ),//从哪里开始
                            i = this.showItem;
                        if( middle >  (this.allpage - this.showItem)  ){
                            middle = (this.allpage - this.showItem) + 1
                        }
                        while(i--){
                            pag.push( middle++ );
                        }
                    }
                    return pag
                }
            },
            methods:{
                goto:function(index){
                    // if(index == this.current) return;
                    this.current = index;
                    //这里可以发送ajax请求
                    this.$dispatch("goPage",index);
                }
            },
            events:{
                changePage:function (data) {
                    this.allpage = data.pageCount;
                    this.current = data.pageCurrent;
                }
            }
        });
        //我的学员
        var myStudy = Vue.extend({
            "template": "#myStudyLayer",
            data: function () {
                return {
                    startTime:'',
                    endTime:'',
                    show: false,
                    friends: [],
                    uids: [],
                    user_info: '',
                    studyList :[],//总列表
                    curStudyList:[],//显示的列表
                    detailPage:2,//每页显示几条
                    countPage:null,//总页
                    cutPage:1,//当前页
                    hasStudy:false,
                    cc: false,
                    ss: false,
                    cutBtn:{
                        appoint_status: 1,
                        date_type : 0,
                        appoint_time:''
                    },
                    cutSelUserList:[],
                    addStatus:{
                        //isSel : '',//选择状态
                        isSelUserId:'',//当前人的userid
                        unfind: false,//未找到
                        adding: false//添加中
                    }
                }
            },
            components:{
                // 'vue-calendar': calendar,
                // 'vue-calendar-now': calendarNow,
                'page':page
            },
            methods: {
                //选择当前学员
                selUser:function(val){
                    this.addStatus.isSelUserId = val;

                },
                //批量添加我的学员
                selStudyList: function(){
                    var that = this;
                    wxHeck.getData({
                        url: "/UserContact/remindCount",
                        data: {
                            admin_id: localInfo.id,
                        },
                        success: function (r) {
                            if (r.status != 10000) return  _alert(r.message);
                            _confirm(r.message, function(){
                                _confirm("批量添加了"+ that.cutSelUserList.length +"人耗时在"+ that.cutSelUserList.length +"分钟左右，请耐心等待", function(){
                                    wxHeck.getData({
                                        url:'/MassAddUserWechat/addCrmUser',
                                        data:{
                                            admin_id: localInfo.admin_id,
                                            user_id: that.cutSelUserList
                                        },
                                        success: function(data){
                                            if(data.status != 10000) return _alert(data.message);
                                            _alert(data.message);
                                        }
                                    });
                                    //重新请求我的学员列表
                                    that.$dispatch("reGetMyStudy");
                                    that.cutSelUserList = [];
                                });
                            })
                        },
                        error:function () {
                            _alert("网络错误，请重试！");
                        }
                    });

                },
                hideMyStudy: function () {
                    this.show = false;
                    this.cutBtn.appoint_status = 1;
                    this.cutSelUserList = [];
                    this.curStudyList = [];
                    this.hasStudy = false;
                },
                //点击后聊天
                addChat: function (id) {
                    this.$dispatch("studyChat", this.user_info + "$" + id);
                    this.show = false;
                },
                goAddFriend: function (crmMobile, crmId, addType, trialStatus) {
                    var that = this;
                    _confirm('提前电话沟通，并告诉学员会加她好友会极大提高加好友的通过率，请确认已与学员进行过电话沟通。', function () {
                        that.$dispatch("addListFriend", crmMobile, crmId, addType, trialStatus);
                    });

                    // _alert("提前电话沟通，并告诉学员会加她好友会极大提高加好友的通过率，请确认已与学员进行过电话沟通。", function(){
                    //     that.$dispatch("addListFriend", crmMobile, crmId, addType)
                    // });
                    // this.show = false;
                },
                //我的学员备注
                crmRemarkTable: function (id) {
                    this.$dispatch("crmRemarkTableOpen", id);
                },
                //打电话
                telphone: function (id,phone) {
                    this.$dispatch("callTelpnone", id, phone);
                },
                //聊天
                studyChat: function (id) {
                    this.show = false;
                    this.$dispatch("studyChat", id);
                },
                changePage : function (data) {
                    var that = this;
                    setTimeout(function () {
                        that.$broadcast("changePage", data);
                    },0);
                },
                checkType:function(x){
                    var reqUrl = '';
                    var that = this;
                    //SS我的学员搜索按钮
                    if(wxHeck.isSS()){
                        that.cutBtn.appoint_status = 1;
                        reqUrl = '/UserContact/getCrmUser';
                        var data = {
                            start_time: studyStartTime.value,
                            end_time: studyEndTime.value,
                            page_num: 1,
                            page_size: 10,
                            appoint_status:1
                        }
                    }
                    //CC我的学员当前按钮
                    if(wxHeck.isCC()){
                        switch(x){
                            case 'classA':
                                that.cutBtn.appoint_status = 1;
                                break;
                            case 'classB':

                                that.cutBtn.appoint_status = 2;
                                break;
                            case 'classC':

                                that.cutBtn.appoint_status = 3;
                                break;
                            case 'classD':

                                that.cutBtn.appoint_status = 4;
                                break;
                            default:
                                that.cutBtn.appoint_status = 1;
                        }
                        reqUrl = '/UserContact/getCrmUserByCc';
                        var curday = new Date(studyEndTime.value).getTime() + 1000*60*60*24*2;
                        var _curday = new Date(curday);
                        var _curMonth = _curday.getMonth()+1 > 9 ? _curday.getMonth()+1 : '0'+ (_curday.getMonth()+1);
                        var _curDay = _curday.getDate() > 9 ? _curday.getDate() : ('0' + _curday.getDate());
                        var cur = _curday.getFullYear() + '-' + _curMonth + '-' + _curDay;
                        var data = {
                            start_time: studyStartTime.value,
                            end_time:  cur,
                            page_num: 1,
                            page_size: 10,
                            appoint_status:that.cutBtn.appoint_status
                        }
                    }
                    wxHeck.getData({
                        url: reqUrl,
                        data: data,
                        success: function (r) {
                            if (r.status != 10000) return _alert(r.message);
                            if(r.message.list.length == 0){
                                that.curStudyList = [];
                                that.hasStudy = false;
                            }else{
                                that.curStudyList = r.message.list;
                                that.hasStudy = true;
                                setTimeout(function () {
                                    that.$broadcast("changePage",r.message.pagenation);
                                },0)
                            }
                        }
                    });
                }
            },
            events: {
                studySearch : function(){
                    // this.studySearchBtn();
                    this.checkType();
                },
                //页码跳转
                goPage :function (p) {
                    this.cutPage = p;
                    var that = this;
                    var reqUrl = '';
                    var data = {
                        start_time: studyStartTime.value,
                        end_time:  studyEndTime.value,
                        page_num: p,
                        page_size: 10,
                        appoint_status:that.cutBtn.appoint_status
                    }
                    if(wxHeck.isSS()){
                        reqUrl = '/UserContact/getCrmUser';
                    }
                    if(wxHeck.isCC()){
                        reqUrl = '/UserContact/getCrmUserByCc';
                        data.appoint_id = that.appoint_status;
                    }
                    wxHeck.getData({
                        url: reqUrl,
                        data: data,
                        success: function (r) {
                            if (r.status != 10000) return _alert(r.message);
                            that.curStudyList = r.message.list;
                        }
                    });
                },
                showMyStudyLayer: function (data) {
                    this.user_info = data.user_info;//当前机器身份

                    //时间相关
                    this.startTime = data.myStudyData.date.startTime;
                    this.endTime = wxHeck.Util.setDate(0);
                    // this.endTime = data.myStudyData.date.endTime;
                    // if(wxHeck.isCC()){
                    //     this.endTime = data.myStudyData.date.endTime;
                    // }

                    if(data.myStudyData.list.length !=0){
                        this.hasStudy = true;
                        //当前页显示数据
                        this.curStudyList = data.myStudyData.list;

                        // console.log(data.myStudyData.pagenation.pageCount);
                        //页码相关
                        this.pageCount = data.myStudyData.pagenation.pageCount;// 总页数
                        this.pageSize = data.myStudyData.pagenation.pageSize;//每页显示条目
                        this.pageCurrent = data.myStudyData.pagenation.pageCurrent;//当前页码
                        //处理页码
                        this.changePage(data.myStudyData.pagenation);
                    }
                    this.show = true;
                },
                //我的学员搜索时间
                setTimePast:function(data){
                    this.startTime = data;
                },
                setTimeNow:function(data){
                    this.endTime = data;
                },
                setStudyTypeBoolean: function(r){
                    this.cc = r.cc;
                    this.ss = r.ss;
                }
            },
            watch:{
                cutPage:function (val) {
                    var startPage = this.detailPage*(this.cutPage-1);//启始数
                    var endPage = (this.detailPage*this.cutPage);//尾数
                    this.curStudyList = this.studyList.slice(startPage,endPage)
                }
            },
            filters: {
                m_d_h_m: function (v) {
                    return v.substring(6,16);
                },
                h_m: function (v) {
                    return v.substring(11,16);
                },
            }
        });
        //好友
        var myFriend = Vue.extend({
            template: "#myFriend",
            data: function () {
                return {
                    isShow: false,
                    list: [],
                    pending: true
                }
            },
            methods: {
                hide: function () {
                    this.isShow = false;
                    this.list = [];
                    this.pending = true;
                },
                show: function () {
                    this.isShow = true;
                    this.$nextTick(function () {
                        $(".friend-box-in").wxScroll();
                    });
                },
                accept: function (encryptusername) {
                    wxHeck.sendMsg({
                        "action": "add_hello_friend",
                        "id": localInfo.id,
                        "type": "web",
                        "encryptusername": encryptusername
                    });
                }
            },
            events: {
                myFriendShow: function () {
                    this.show();
                },
                myFriendData: function (data) {
                    this.list = data;
                    this.pending = false;
                },
                myFriendSure: function (data) {
                    var that = this,
                        list = that.list;
                    $.map(list, function (ele, index) {
                        if (ele.encryptusername == data) {
                            list[index].encryptusername = "";
                            return false;
                        }
                    });
                }
            }
        });
        // 批改作业
        var homeWork = Vue.extend({
            template: "#homeWork",
            data: function () {
                return {
                    isShow: false,
                    pending: true,
                    list: [],
                    startTime: "",
                    endTime: "",
                    groupId: "",
                    editKey: "",
                    edit$Key: "",
                    groupData: {},
                    groupheader: "",
                    scoreShow: false,
                    score: "",
                    imgSrc: "",
                    scoreAudioShow : false,
                    audioText : "",
                    voicePlay: {
                        voiceSrc: "",
                        playVoiceSrc: ""
                    },
                    cur$key : "",
                    comText : "",
                    editType : {
                        "1" : "Img",
                        "2" : "Audio",
                        "6001" : "Video"
                    },
                    // 是否重新批改
                    isReEdit : false,
                    mt : null
                }
            },
            methods: {
                editGo : function(type){
                    var todo = $(".home-work-list-in>ul>li .todo");
                    var length = todo.length;
                    var curIndex;
                    todo.each(function(index, ele){
                        var $ele = $(ele);
                        if($ele.hasClass("cur-edit")){
                            curIndex = index + 1;
                            return false;
                        }
                    });
                    // 先关闭工具
                    this.scoreAudioHide();
                    switch(type){
                        case "l":
                            if(curIndex == 1){
                                curIndex = length;
                            }else{
                                curIndex--;
                            }
                            break;

                        case "r":
                            if(curIndex == length){
                                curIndex = 1;
                            }else{
                                curIndex++;
                            }
                            break;
                    }

                    this.$nextTick(function(){
                        todo.eq(curIndex - 1).click();
                    });
                },
                getJson : function(str){
                    var _str;
                    try{
                        _str = JSON.parse(str);
                    }catch(e){
                        _str = "";
                    }
                    return _str;
                },
                playVoice: function (src) {
                    this.voicePlay.voiceSrc = src;
                    this.$nextTick(function () {
                        voiceMsgPlayer3.play();
                    });
                },
                isPlaying: function () {
                    this.voicePlay.playVoiceSrc = this.voicePlay.voiceSrc;
                },
                isEnded: function () {
                    this.voicePlay.playVoiceSrc = "";
                },
                shList: function (s, key, $key) {
                    this.list[key][$key].showTool = s == 0;
                },
                // 图片编辑
                editList: function (key, $key, type) {
                    this.cur$key = $key;
                    // 根据类型分发编辑方法
                    this["edit" + this.editType[type]].apply(null, arguments);
                    this.editKey = key;
                    this.edit$Key = $key;
                },
                editImg : function(key, $key, type){
                    /*编辑图片new*/
                    // 图片地址
                    var source = wxHeck.getImgUrl(this.list[key][$key].content.split(",")[1] || this.list[key][$key].content);
                    var userData = this.groupData[key];
                    // 头像
                    var headIcon = userData.wechat_img;
                    // 昵称
                    var nickName = userData.wechat_nick;
                    // 是否批改
                    var isEdit = this.list[key][$key].status == 1;
                    var that = this;
                    editImgFn.initNew({
                        source: source,
                        isEdit : isEdit,
                        nickName : nickName,
                        save : function(data, isError){
                            if(isError) return _alert("操作失败请重试！");
                            // 弹出分数面板
                            that.$emit("sendHomeWorkResult", data);
                        }
                    });
                },
                // 语音编辑
                editAudio : function(key, $key, type){
                    this.scoreAudioShow = true;
                    this.editKey = key;
                    this.edit$Key = $key;
                    this.isReEdit = this.list[key][$key].status == 1;
                },
                scoreAudioHide : function(){
                    this.scoreAudioShow = false;
                    this.audioText = "";
                    this.isReEdit = false;
                },
                // 视频编辑
                editVideo : function(key, $key, type){
                    this.scoreAudioShow = true;
                    this.editKey = key;
                    this.edit$Key = $key;
                    this.isReEdit = this.list[key][$key].status == 1;
                },
                hideReEdit : function(){
                    this.isReEdit = false;
                },
                delList: function (key, $key) {
                    var that = this;
                    if (!confirm("确认删除？")) return;
                    wxHeck.getData({
                        url: "/WorkCorrect/changeChatRoomStatus",
                        data: {
                            wechat_id: that.groupId,
                            message_id: $key,
                            status: 1
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            Vue.delete(that.list[key], $key);
                            that.list[key].length--;
                        }
                    });
                },
                checkListAudio : function(){
                    var that = this;
                    if(that._audioText == "") return;
                    var data = {
                        wechat_id: that.groupId,
                        message_id : that.edit$Key,
                        status: 2,
                        u_wechat_id : that.editKey,
                        text : that._audioText
                    }
                    that.$parent.loading.show = true;
                    that.$dispatch("getAt", that.groupData[that.editKey].wechat_nick, that.editKey, data.text);
                    that.$parent.sendMsg();
                    wxHeck.getData({
                        url: "/WorkCorrect/changeChatRoomStatus",
                        data: data,
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            that.list[that.editKey][that.edit$Key].status = "1";
                            _alert("发送批改结果成功！");
                            that.$parent.loading.show = false;
                        }
                    });
                },
                checkList: function (obj) {
                    var that = this;
                    var data = {
                        wechat_id: that.groupId,
                        message_id: that.edit$Key,
                        status: 2,
                        score: obj.score,
                        u_wechat_id : obj.u_wechat_id,
                        correct_img : obj.correct_img,
                        text : obj.text
                    }
                    // if(that.list[that.editKey][that.edit$Key].status == 1) return;
                    wxHeck.getData({
                        url: "/WorkCorrect/changeChatRoomStatus",
                        data: data,
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            that.list[that.editKey][that.edit$Key].status = "1";
                        }
                    });
                },
                hide: function () {
                    this.isShow = false;
                    this.list = [];
                    this.groupId = "";
                    this.pending = true;
                    this.editKey = "";
                    this.edit$Key = "";
                    this.groupheader = "";
                    this.groupData = {};
                    this.cur$key = "";
                    this.scoreShow = false;
                },
                getDate: function () {
                    var date = new Date();
                    var toD = function (s) {
                        var _s = s + "";
                        return _s.length < 2 ? "0" + _s : _s;
                    }
                    return date.getFullYear() + "-" + toD(date.getMonth() + 1) + "-" + toD(date.getDate());
                },
                getHomeWork: function () {
                    var that = this;
                    wxHeck.getData({
                        url: "/WorkCorrect/ajaxGetChatRoomMessage",
                        data: {
                            wechat_id: that.groupId,
                            start_time: _startTime.value || "",
                            end_time: _endTime.value || ""
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            // 如果是自己
                            var isSelf = function (x) {
                                if (!x) return;
                                var _x = x.split("$");
                                return _x[0] == _x[1];
                            }
                            // 如果为空 遍历群里人员 展示全部提醒
                            if (r.message == "" || r.message == []) {
                                var result = {};
                                result.length = 0;
                                for (var x in that.groupData) {
                                    if (isSelf(x)) continue;
                                    result[x] = {
                                        length: 0
                                    }
                                    result.length++;
                                }
                                that.list = result;
                                return;
                            }
                            that.list = (function (ms) {
                                for (var x in ms) {
                                    if (isSelf(x)) continue;
                                    ms[x].length = 0;
                                    for (var xx in ms[x]) {
                                        if (xx == "length") continue;
                                        ms[x][xx].showTool = false;
                                        ms[x].length++;
                                    }
                                }
                                for (var x in that.groupData) {
                                    if (x in ms) continue;
                                    if (isSelf(x)) continue;
                                    ms[x] = {
                                        length: 0
                                    }
                                }
                                return ms;
                            })(r.message);
                        },
                        complete: function () {
                            that.pending = false;
                        }
                    });
                },
                homeWorkTip: function (key) {
                    // 验证是否是好友
                    if(wxHeck.isMyFriend(key)){
                        // 组装连接消息
                        var content = "小朋友抓紧时间交作业哦，每天的坚持都是很重要的呢！";
                        this.$parent.sendMsg(null, true, key, content);
                        _alert("发送提醒成功！");
                    }else{
                        // 如果不是好友
                        _confirm("和学员还不是好友关系，是否添加对方为好友？如学员未及时通过好友请求，建议电话沟通~", function(){
                            this.$root.$broadcast("showAddFriend", {wxAcc:key.split("$")[1], type:'1'});
                        }.bind(this));
                    }
                },
                sendScore: function (force) {
                    var self = this;
                    if (self._score == "" && !force) return;
                    var that = this.$parent;
                    var _imgSrc = this.imgSrc;
                    var _score = self._score;
                    var _text = self.comText;
                    var _u_wechat_id = self.editKey;
                    this.hideScore();
                    wxHeck.getData({
                        beforeSend: function () {
                            that.loading.show = true;
                        },
                        url: "/UploadFile/screenImg",
                        data: {
                            file_base64: _imgSrc,
                            admin_id: localInfo.admin_id,
                            wechat_id: localInfo.wechat_id,
                        },
                        success: function (r) {
                            if (r.status == 10000) {
                                var time = (new Date).getTime();
                                // test
                                if(window.testURL)  r.message = window.testURL;
                                // 上传成功
                                // 消息体
                                var msgObj = {
                                    action: "chat",
                                    id: localInfo.id,
                                    type: "web",
                                    to_id: that.wxData.curUserId,
                                    to_type: "ios",
                                    content: r.message,
                                    // 图片发送cnt_type 为1
                                    cnt_type: 1,
                                    content_id : String(time)
                                }

                                self.setSuccessFn = function(){
                                    clearTimeout(self.mt);
                                    // 在页面上放置图片
                                    wxHeck.pushMsg({
                                        pushId: that.wxData.curUserId,
                                        isCC: true,
                                        msg: [_imgSrc, r.message],
                                        time: time,
                                        cnt_type: 9999
                                    });
                                    //@ ta
                                    self.$dispatch("getAt", self.groupData[self.editKey].wechat_nick, self.editKey);
                                    that.sendMsg();
                                    // 设置已批改
                                    self.checkList({
                                        score : _score,
                                        correct_img : r.message,
                                        u_wechat_id : _u_wechat_id,
                                        text : _text
                                    });
                                    _alert("发送批改结果成功！");
                                    that.loading.show = false;
                                }
                                // 发送消息
                                wxHeck.sendMsg(msgObj);

                                clearTimeout(self.mt);
                                self.mt = setTimeout(self.setFailFn, 10 * 1000);

                            } else {
                                _alert("上传失败请重试！");
                                that.loading.show = false;
                            }
                        },
                        error: function () {
                            _alert("网络错误请重试！");
                            that.loading.show = false;
                        }
                    });
                },
                hideScore: function () {
                    this.scoreShow = false;
                    this.imgSrc = "";
                    this.score = "";
                    this.comText = "";
                },
                setSuccessFn : function(){},
                setFailFn : function(msg){
                    clearTimeout(this.mt);
                    this.setSuccessFn = function(){};
                    _alert(msg || "发送失败请重试！");
                    this.$parent.loading.show = false;
                }
            },
            computed: {
                _score: function () {
                    return $.trim(this.score);
                },
                _audioText : function(){
                    return $.trim(this.audioText);
                }
            },
            events: {
                hwSetSuccess : function(){
                    this.setSuccessFn();
                    this.setSuccessFn = function(){};
                },
                hwSetFail : function(msg){
                    this.setFailFn(msg);
                },
                sendHomeWorkResult: function (data) {
                    this.scoreShow = true;
                    this.imgSrc = data.img;
                    this.comText = data.text;
                },
                showHomeWork: function (data) {
                    var that = this;
                    that.groupheader = data.localInfo.groupheader;
                    that.groupId = data.groupId;
                    ;
                    (function (groupData) {
                        $.map(groupData, function (ele, index) {
                            Vue.set(that.groupData, ele.wechat_id, ele);
                        });
                    })(data.groupData || []);
                    that.startTime = that.endTime = that.getDate();
                    that.isShow = true;
                    that.$nextTick(function () {
                        $(".home-work-con").wxScroll();
                    });
                    that.$nextTick(function () {
                        that.getHomeWork();
                    });
                }
            }
        });
        // 单人作业
        var homeWorkOne = Vue.extend({
            template: "#homeWorkOne",
            data: function () {
                return {
                    isShow: false,
                    pending: true,
                    list: [],
                    startTime: "",
                    endTime: "",
                    // 群id
                    realgroupId : "",
                    // 当前人的id
                    groupId: "",
                    // 当前人的id
                    editKey: "",
                    edit$Key: "",
                    groupData: {},
                    scoreShow: false,
                    score: "",
                    imgSrc: "",
                    scoreAudioShow : false,
                    audioText : "",
                    voicePlay: {
                        voiceSrc: "",
                        playVoiceSrc: ""
                    },
                    cur$key : "",
                    comText : "",
                    editType : {
                        "1" : "Img",
                        "2" : "Audio",
                        "6001" : "Video"
                    },
                    // 是否重新批改
                    isReEdit : false,
                    mt : null
                }
            },
            methods: {
                editGo : function(type){
                    var todo = $(".home-work-list-in>ul>li .todo");
                    var length = todo.length;
                    var curIndex;
                    todo.each(function(index, ele){
                        var $ele = $(ele);
                        if($ele.hasClass("cur-edit")){
                            curIndex = index + 1;
                            return false;
                        }
                    });
                    // 先关闭工具
                    this.scoreAudioHide();
                    switch(type){
                        case "l":
                            if(curIndex == 1){
                                curIndex = length;
                            }else{
                                curIndex--;
                            }
                            break;

                        case "r":
                            if(curIndex == length){
                                curIndex = 1;
                            }else{
                                curIndex++;
                            }
                            break;
                    }

                    this.$nextTick(function(){
                        todo.eq(curIndex - 1).click();
                    });
                },
                getJson : function(str){
                    var _str;
                    try{
                        _str = JSON.parse(str);
                    }catch(e){
                        _str = "";
                    }
                    return _str;
                },
                playVoice: function (src) {
                    this.voicePlay.voiceSrc = src;
                    this.$nextTick(function () {
                        voiceMsgPlayer3.play();
                    });
                },
                isPlaying: function () {
                    this.voicePlay.playVoiceSrc = this.voicePlay.voiceSrc;
                },
                isEnded: function () {
                    this.voicePlay.playVoiceSrc = "";
                },
                shList: function (s, key, $key) {
                    this.list[key][$key].showTool = s == 0;
                },
                // 图片编辑
                editList: function (key, $key, type) {
                    this.cur$key = $key;
                    // 根据类型分发编辑方法
                    this["edit" + this.editType[type]].apply(null, arguments);
                    this.editKey = key;
                    this.edit$Key = $key;
                },
                editImg : function(key, $key, type){
                    /*编辑图片new*/
                    // 图片地址
                    var source = wxHeck.getImgUrl(this.list[key][$key].content.split(",")[1] || this.list[key][$key].content);
                    var userData = this.groupData[key];
                    // 头像
                    var headIcon = userData.img;
                    // 昵称
                    var nickName = userData.c_remark || userData.nick;
                    // 是否批改
                    var isEdit = this.list[key][$key].status == 1;
                    var that = this;
                    editImgFn.initNew({
                        source: source,
                        isEdit : isEdit,
                        nickName : nickName,
                        save : function(data, isError){
                            if(isError) return _alert("操作失败请重试！");
                            // 弹出分数面板
                            that.$emit("sendHomeWorkResult", data);
                        }
                    });
                },
                // 语音编辑
                editAudio : function(key, $key, type){
                    this.scoreAudioShow = true;
                    this.editKey = key;
                    this.edit$Key = $key;
                    this.isReEdit = this.list[key][$key].status == 1;
                },
                scoreAudioHide : function(){
                    this.scoreAudioShow = false;
                    this.audioText = "";
                    this.isReEdit = false;
                },
                // 视频编辑
                editVideo : function(key, $key, type){
                    this.scoreAudioShow = true;
                    this.editKey = key;
                    this.edit$Key = $key;
                    this.isReEdit = this.list[key][$key].status == 1;
                },
                hideReEdit : function(){
                    this.isReEdit = false;
                },
                delList: function (key, $key) {
                    var that = this;
                    if (!confirm("确认删除？")) return;
                    wxHeck.getData({
                        url: "/WorkCorrect/changeChatRoomStatus",
                        data: {
                            wechat_id: that.realgroupId,
                            message_id: $key,
                            status: 1
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            Vue.delete(that.list[key], $key);
                            that.list[key].length--;
                        }
                    });
                },
                checkListAudio : function(){
                    var that = this;
                    if(that._audioText == "") return;
                    var data = {
                        wechat_id: that.realgroupId,
                        message_id : that.edit$Key,
                        status: 2,
                        u_wechat_id : that.editKey,
                        text : that._audioText
                    }
                    that.$parent.loading.show = true;
                    that.$parent.wxData.msgList[that.editKey].msgContent = data.text;
                    that.$parent.sendMsg();
                    wxHeck.getData({
                        url: "/WorkCorrect/changeChatRoomStatus",
                        data: data,
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            that.list[that.editKey][that.edit$Key].status = "1";
                            _alert("发送批改结果成功！");
                            that.$parent.loading.show = false;
                        }
                    });
                },
                checkList: function (obj) {
                    var that = this;
                    var data = {
                        wechat_id: that.realgroupId,
                        message_id: that.edit$Key,
                        status: 2,
                        score: obj.score,
                        u_wechat_id : obj.u_wechat_id,
                        correct_img : obj.correct_img,
                        text : obj.text
                    }
                    // if(that.list[that.editKey][that.edit$Key].status == 1) return;
                    wxHeck.getData({
                        url: "/WorkCorrect/changeChatRoomStatus",
                        data: data,
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            that.list[that.editKey][that.edit$Key].status = "1";
                        }
                    });
                },
                hide: function () {
                    this.isShow = false;
                    this.list = [];
                    this.realgroupId = "";
                    this.groupId = "";
                    this.pending = true;
                    this.editKey = "";
                    this.edit$Key = "";
                    this.groupData = {};
                    this.cur$key = "";
                    this.scoreShow = false;
                },
                getDate: function () {
                    var date = new Date();
                    var toD = function (s) {
                        var _s = s + "";
                        return _s.length < 2 ? "0" + _s : _s;
                    }
                    return date.getFullYear() + "-" + toD(date.getMonth() + 1) + "-" + toD(date.getDate());
                },
                getHomeWork: function () {
                    var that = this;
                    wxHeck.getData({
                        url: "/WorkCorrect/getStudentJobList",
                        data: {
                            group_id : that.realgroupId,
                            wechat_id: that.groupId,
                            start_time: _startTime.value || "",
                            end_time: _endTime.value || ""
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            // 如果为空 遍历群里人员 展示全部提醒
                            if (r.message == "" || r.message == []) {
                                var result = {};
                                result.length = 0;
                                for (var x in that.groupData) {
                                    result[x] = {
                                        length: 0
                                    }
                                    result.length++;
                                }
                                that.list = result;
                                return;
                            }
                            that.list = (function (ms) {
                                for (var x in ms) {
                                    ms[x].length = 0;
                                    for (var xx in ms[x]) {
                                        if (xx == "length") continue;
                                        ms[x][xx].showTool = false;
                                        ms[x].length++;
                                    }
                                }
                                return ms;
                            })(r.message);
                        },
                        complete: function () {
                            that.pending = false;
                        }
                    });
                },
                homeWorkTip: function (key) {
                    var groupData = this.groupData[key];
                    var content = groupData.nick + "小朋友抓紧时间交作业哦，每天的坚持都是很重要的呢！";
                    this.$parent.wxData.msgList[key].msgContent = content;
                    this.$parent.sendMsg();
                    _alert("发送提醒成功！");
                },
                sendScore: function (force) {
                    var self = this;
                    if (self._score == "" && !force) return;
                    var that = this.$parent;
                    var _imgSrc = this.imgSrc;
                    var _score = self._score;
                    var _text = self.comText;
                    var _u_wechat_id = self.editKey;
                    this.hideScore();
                    wxHeck.getData({
                        beforeSend: function () {
                            that.loading.show = true;
                        },
                        url: "/UploadFile/screenImg",
                        data: {
                            file_base64: _imgSrc,
                            admin_id: localInfo.admin_id,
                            wechat_id: localInfo.wechat_id,
                        },
                        success: function (r) {
                            if (r.status == 10000) {
                                var time = (new Date).getTime();
                                // test
                                if(window.testURL)  r.message = window.testURL;
                                // 上传成功
                                // 消息体
                                var msgObj = {
                                    action: "chat",
                                    id: localInfo.id,
                                    type: "web",
                                    to_id: that.wxData.curUserId,
                                    to_type: "ios",
                                    content: r.message,
                                    // 图片发送cnt_type 为1
                                    cnt_type: 1,
                                    content_id : String(time)
                                }
                                self.setSuccessFn = function(){
                                    clearTimeout(self.mt);
                                    // 在页面上放置图片
                                    wxHeck.pushMsg({
                                        pushId: that.wxData.curUserId,
                                        isCC: true,
                                        msg: [_imgSrc, r.message],
                                        time: time,
                                        cnt_type: 9999
                                    });
                                    // 设置已批改
                                    self.checkList({
                                        score : _score,
                                        correct_img : r.message,
                                        u_wechat_id : _u_wechat_id,
                                        text : _text
                                    });
                                    _alert("发送批改结果成功！");
                                    that.loading.show = false;
                                }
                                // 发送消息
                                wxHeck.sendMsg(msgObj);
                                clearTimeout(self.mt);
                                self.mt = setTimeout(self.setFailFn, 10 * 1000);
                            } else {
                                _alert("上传失败请重试！");
                                that.loading.show = false;
                            }
                        },
                        error: function () {
                            _alert("网络错误请重试！");
                            that.loading.show = false;
                        }
                    });
                },
                hideScore: function () {
                    this.scoreShow = false;
                    this.imgSrc = "";
                    this.score = "";
                    this.comText = "";
                },
                setSuccessFn : function(){},
                setFailFn : function(msg){
                    clearTimeout(this.mt);
                    this.setSuccessFn = function(){};
                    _alert(msg || "发送失败请重试！");
                    this.$parent.loading.show = false;
                }
            },
            computed: {
                _score: function () {
                    return $.trim(this.score);
                },
                _audioText : function(){
                    return $.trim(this.audioText);
                }
            },
            events: {
                hwSetSuccess : function(){
                    this.setSuccessFn();
                    this.setSuccessFn = function(){};
                },
                hwSetFail : function(msg){
                    this.setFailFn(msg);
                },
                sendHomeWorkResult: function (data) {
                    this.scoreShow = true;
                    this.imgSrc = data.img;
                    this.comText = data.text;
                },
                showHomeWorkOne: function (data) {
                    var that = this;
                    that.groupId = data.groupId;
                    that.realgroupId = wxHeck.getFullId(data.groupData[data.groupId].showHW) + "@chatroom";
                    ;
                    (function (groupData) {
                        Vue.set(that.groupData, that.groupId, groupData[that.groupId].userInfo);
                    })(data.groupData || []);
                    that.startTime = that.endTime = that.getDate();
                    that.isShow = true;
                    that.$nextTick(function () {
                        $(".home-work-con").wxScroll();
                        that.getHomeWork();
                    });
                }
            }
        });
        // 作业汇总
        var homeWorkDetail = Vue.extend({
            template: "#homeWorkDetail",
            data: function () {
                return {
                    isShow: false,
                    pending: true,
                    list: [],
                    startTime: "",
                    endTime: "",
                    groupId: "",
                    groupData: {},
                    groupheader: "",
                    voicePlay: {
                        voiceSrc: "",
                        playVoiceSrc: ""
                    },
                    hwShow : false,
                    hwSrc : ""
                }
            },
            methods: {
                getJson : function(str){
                    var _str;
                    try{
                        _str = JSON.parse(str);
                    }catch(e){
                        _str = "";
                    }
                    return _str;
                },
                playVoice: function (src) {
                    this.voicePlay.voiceSrc = src;
                    this.$nextTick(function () {
                        voiceMsgPlayer4.play();
                    });
                },
                isPlaying: function () {
                    this.voicePlay.playVoiceSrc = this.voicePlay.voiceSrc;
                },
                isEnded: function () {
                    this.voicePlay.playVoiceSrc = "";
                },
                hide: function () {
                    this.isShow = false;
                    this.list = [];
                    this.groupId = "";
                    this.pending = true;
                    this.groupheader = "";
                    this.hwHideFn();
                    this.groupData = {};
                },
                hwHideFn : function(){
                    this.hwShow = false;
                    this.hwSrc = "";
                },
                getDate: function () {
                    var date = new Date();
                    var toD = function (s) {
                        var _s = s + "";
                        return _s.length < 2 ? "0" + _s : _s;
                    }
                    return date.getFullYear() + "-" + toD(date.getMonth() + 1) + "-" + toD(date.getDate());
                },
                getHomeWork: function () {
                    var that = this;
                    wxHeck.getData({
                        url: "/WorkCorrect/classInfoList",
                        data: {
                            wechat_id: that.groupId,
                            start_time: _startTime_2.value || "",
                            end_time: _endTime_2.value || ""
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            // 如果是自己
                            var isSelf = function (x) {
                                if (!x) return;
                                var _x = x.split("$");
                                return _x[0] == _x[1];
                            }
                            // 如果为空 遍历群里人员 展示全部提醒
                            if (r.message == "" || r.message == []) {
                                that.list = [];
                                return;
                            }
                            that.list = (function (ms) {
                                for (var x in ms) {
                                    if (isSelf(x)) continue;
                                    ms[x].length = 0;
                                    for (var xx in ms[x]) {
                                        if (xx == "length") continue;
                                        ms[x][xx].showTool = false;
                                        ms[x].length++;
                                    }
                                }
                                return ms;
                            })(r.message);
                        },
                        complete: function () {
                            that.pending = false;
                        }
                    });
                },
                send : function(key){
                    // if(!localInfo.domainOpen) return _alert("目前暂不可发送，敬请期待。");
                    // 验证是否是好友
                    if(wxHeck.isMyFriend(key)){
                        // 组装连接消息
                        var _url = this.getUrl(key);
                        var link = location.origin + _url._url;
                        var title = _url._nick + "的作业记录";
                        var introduction = "这是"+ _url._nick +"小朋友在51Talk的作业记录，请查收～";
                        var icon = localInfo.img;
                        var msgObj = JSON.stringify({
                            title: title,
                            introduction: introduction,
                            icon: icon,
                            link: link,
                            id: 999
                        });
                        var _msgObj = {
                            "action": "chat",
                            "id": localInfo.id,
                            "to_id": key,
                            "type": "web",
                            cnt_type: 3000,
                            content: msgObj
                        }
                        wxHeck.pushMsg({
                            pushId: key,
                            isCC: true,
                            msg: msgObj,
                            cnt_type: 3000,
                            time: (new Date).getTime()
                        });
                        wxHeck.sendMsg(_msgObj);
                        _alert("发送成功");
                    }else{
                        // 如果不是好友
                        _confirm("和学员还不是好友关系，是否添加对方为好友？如学员未及时通过好友请求，建议电话沟通~", function(){
                            this.$root.$broadcast("showAddFriend", {wxAcc:key.split("$")[1], type:'1'});
                        }.bind(this));
                    }
                    /*this.$parent.sendMsg(null, true, key, location.origin + _url._url);
                     this.$parent.sendMsg(null, true, key, "这是"+ _url._nick +"小朋友在51Talk的作业记录，请查收～");*/
                },
                getUrl : function(key){
                    var that = this;
                    var userData = that.groupData[key];
                    var localId = localInfo.wechat_id + "$" + localInfo.wechat_id;
                    // 当前老师的微信信息
                    var localWxInfo = that.groupData[localId];
                    var url = [
                            "startTime=" + _startTime_2.value,
                            "endTime=" + _endTime_2.value,
                            "u_wechat_id=" + key,
                            "wechat_id=" + that.groupId,
                            "nickName=" + userData.wechat_real_nick,
                            "headUrl=" + userData.wechat_img,
                            "teaName=" + localWxInfo.wechat_nick,
                            // "teaName=" + localInfo.admin_name,
                            "teaHead=" + localWxInfo.wechat_img
                            // "teaHead=" + localInfo.img
                        ],
                        // _url = "/WorkCorrect/stuInfoList?" + url.join("&");
                        _url = "/Guest/stuInfoList?" + url.join("&");
                    return {
                        _url : _url,
                        _nick : userData.wechat_real_nick
                    };
                },
                preview : function(key){
                    var _url = this.getUrl(key)._url;
                    this.hwSrc = _url;
                    this.hwShow = true;
                }
            },
            events: {
                showHomeWorkDetail: function (data) {
                    var that = this;
                    that.groupheader = data.localInfo.groupheader;
                    that.groupId = data.groupId;
                    ;
                    (function (groupData) {
                        $.map(groupData, function (ele, index) {
                            Vue.set(that.groupData, ele.wechat_id, ele);
                        });
                    })(data.groupData || []);
                    that.startTime = that.endTime = that.getDate();
                    that.isShow = true;
                    that.$nextTick(function () {
                        $(".home-work-con").wxScroll();
                    });
                    that.$nextTick(function () {
                        that.getHomeWork();
                    });
                }
            }
        });
        //群公告
        var groupAnnounce = Vue.extend({
            "template": "#groupAnnounce",
            data: function () {
                return {
                    show: false,
                    annContent: "",
                    groupId: ""
                }
            },
            methods: {
                sendAnnounce: function () {
                    this.show = false;
                    wxHeck.sendMsg({
                        "action": "announcement",
                        "id": localInfo.id,
                        "u_id": this.groupId,
                        "type": "web",
                        "content": this.annContent
                    });
                    this.annContent = "";
                },
                hide: function () {
                    this.show = false
                }
            },
            events: {
                showAnnLayer: function (data) {
                    this.show = true;
                    this.groupId = data;
                }
            }
        });
        //设置自动发送
        var autoSend = Vue.extend({
            "template": "#autoSend",
            data: function () {
                return {
                    show: false,
                    setTime: {
                        walkhalf: {
                            val : 0,
                            text : ""
                        },
                        walkhour: {
                            val : 0,
                            text : ""
                        },
                        walkcut: {
                            val : 0,
                            text : ""
                        }
                    },
                    uid: ""
                }
            },
            methods: {
                confirmBtn: function () {
                    this.show = false;
                },
                conselBtn: function () {
                    this.show = false;
                },
                setTimeCheck: function (e) {
                    switch (e) {
                        case 'walkhalf':
                            if (this.setTime.walkhalf.val == 0) {
                                this.setTime.walkhalf.val = 1;
                            } else {
                                this.setTime.walkhalf.val = 0
                            }
                            break;
                        case 'walkhour':
                            if (this.setTime.walkhour.val == 0) {
                                this.setTime.walkhour.val = 1;
                            } else {
                                this.setTime.walkhour.val = 0
                            }
                            break;
                        case 'walkcut':
                            if (this.setTime.walkcut.val == 0) {
                                this.setTime.walkcut.val = 1;
                            } else {
                                this.setTime.walkcut.val = 0;
                            }
                            break;
                        default:
                    }
                },
                confirmBtn: function () {
                    var that = this;
                    wxHeck.getData({
                        url: "/UserContact/saveRemindSwitch",
                        data: {
                            "uid": that.uid,
                            "admin_id": localInfo.admin_id,
                            "walkhalf": that.setTime.walkhalf.val==undefined ? '' : that.setTime.walkhalf.val,
                            "walkhour": that.setTime.walkhour.val==undefined ? '' : that.setTime.walkhour.val,
                            "walkcut": that.setTime.walkcut.val==undefined ? '' : that.setTime.walkcut.val
                        },
                        success: function (r) {
                            if (r.status != 10000) _alert(r.message);
                            _alert("自动发送设置成功！");
                            that.show = false;
                        }
                    });
                }
            },
            events: {
                showAutoLayer: function () {
                    this.show = true;
                },
                setTimeAjax: function (data, id) {
                    this.uid = id;
                    this.setTime.walkhalf.val = data.walkhalf == undefined ? '' : data.walkhalf;
                    this.setTime.walkhalf.text = data.text.walkhalf == undefined ? '' : data.text.walkhalf;
                    this.setTime.walkhour.val = data.walkhour == undefined ? '' : data.walkhour;
                    this.setTime.walkhour.text = data.text.walkhour == undefined ? '' : data.text.walkhour;
                    this.setTime.walkcut.val = data.walkcut == undefined ? '' : data.walkcut;
                    this.setTime.walkcut.text = data.text.walkcut == undefined ? '' : data.text.walkcut;
                }
            }
        });
        // 设置作业
        var setHw = Vue.extend({
            template : "#setHW",
            data : function(){
                return {
                    show : false,
                    showLoading : false,
                    isGroupOwner : false,
                    list : [],
                    groupId : "",
                    sending : false
                }
            },
            computed : {
                sel_nosure : function(){
                    return this.list.length == 0;
                }
            },
            methods : {
                sendHwMsg : function(){
                    var that = this;
                    // 以后可能多张图?
                    var imgSrc = that.list[0];
                    wxHeck.pushMsg({
                        pushId: that.groupId,
                        isCC: true,
                        msg: [imgSrc, imgSrc],
                        time: (new Date).getTime(),
                        cnt_type: 9999
                    });
                    // 发送消息
                    var msgObj = {
                        action: "chat",
                        id: localInfo.id,
                        type: "web",
                        to_id: that.groupId,
                        to_type: "ios",
                        content: imgSrc,
                        // 图片发送cnt_type 为1
                        cnt_type: 1
                    }
                    wxHeck.sendMsg(msgObj);
                    /*var content = "今天的作业已经发给大家了，宝贝们抓紧时间提交哦~";
                    // 如果是群主
                    if(that.isGroupOwner){
                        // 发送at all
                        wxHeck.sendMsg({
                            "action": "announcement",
                            "id": localInfo.id,
                            "u_id": that.groupId.split("$")[1],
                            "type": "web",
                            "content": content
                        });
                    }else{
                        // 如果不是群主
                        that.$parent.sendMsg(null, true, that.groupId, content);
                    }*/
                },
                subHW : function(){
                    var that = this;
                    if(that.list.length == 0) return;
                    // 打标签存储
                    wxHeck.getData({
                        beforeSend : function(){
                            that.sending = true;
                        },
                        url : "/WorkCorrect/assignHomework",
                        data : {
                            wechat_id : that.groupId,
                            work_images : that.list.join(",")
                        },
                        success : function(r){
                            if(r.status != 10000){
                                alert(r.message);
                                return;
                            }
                            that.sendHwMsg();
                            _alert("发送成功", that.hide);
                        },
                        error : function(){
                            alert("发送失败请重试！");
                        },
                        complete : function(){
                            that.sending = false;
                        }
                    });
                },
                hide : function(){
                    this.show = false;
                    this.list = [];
                    this.groupId = "";
                    this.isGroupOwner = false;
                },
                initUpload : function(){
                    var that = this;
                    wxHeck.uploadFn.init({
                        browse_button : "set-hw-upload-btn",
                        container : "set-hw-upload",
                        filters: {
                            mime_types: [ //只允许上传图片
                                {
                                    title: "Image files", extensions: "jpg,jpeg,gif,png,bmp"
                                }
                            ]
                        },
                        // 上传之前
                        BeforeUpload: function (up, file, previewImage) {
                            that.showLoading = true;
                        },
                        // 上传成功
                        FileUploaded: function (up, file, info) {
                            that.list.push(file.fileFullName);
                            that.showLoading = false;
                        },
                        Error : function(up, err){
                            alert(err.message);
                            that.showLoading = false;
                        }
                    });
                }
            },
            events : {
                showSetHW : function(data){
                    this.isGroupOwner = data.isGroupOwner;
                    this.groupId = data.groupId;
                    this.show = true;
                    this.$nextTick(this.initUpload);
                }
            }
        });
        //群主权利转让
        var changeOwner = Vue.extend({
            template: "#changeGroupOwner",
            data: function(){
                return {
                    show:false,
                    showlayer: false,
                    showOk: false,
                    sel: '',
                    groupList:[],
                    groupId :'',
                    groupOwnner:'',
                    search:'',
                    nickName:''
                }
            },
            methods:{
                hideChangeOwner: function(){
                    this.show = false;
                    this.groupList = [];
                },
                selUser: function (id,x) {
                    if (id == this.sel) {
                        this.sel = "";
                    }else{
                        this.sel = id;
                    }
                    this.nickName = x.wechat_nick || x.wechat_real_nick || "";
                },
                setNewOwner:function(){
                    if(this.sel == '') return;
                    var that = this;
                    _confirm("确定选择"+ that.nickName +"为新群主，你将自动放弃群主身份。",function(){
                        wxHeck.sendMsg({
                            "action": "change_chatroom_owner",
                            "id": window.localInfo.id,
                            "type": "web",
                            "new_owner_id": that.sel.split('$')[1],
                            "u_id": that.groupId
                        });
                    });

                }
            },
            events:{
                showChangeOwner: function(data){
                    wxHeck.wxInit.$root.$data.contentGroupLayer.show = false;
                    this.show = true;
                    this.showlayer = true;
                    this.groupId = data.groupId;
                    this.groupOwnner = data.groupOwnner;
                    // console.log(data.groupOwnner)
                    // console.log(this.groupOwnner)
                    // console.log(data.groupList)
                    // for(var i = 0; i < data.groupList.length; i++){
                    //     var arr = data.groupList[i].wechat_id.split("$")[1];
                    //     if( arr == data.groupOwnner){
                    //         data.groupList.splice(i,1);
                    //         break;
                    //     };
                    // }
                    this.groupList = data.groupList;
                    this.$nextTick(function () {
                        $(".group-user-list").wxScroll();
                    });
                },
                changeOwnerOk:function(){
                    this.showOk = true;
                    this.showlayer = true;
                    var that = this;
                    setTimeout(function(){
                        that.showOk = false;
                        that.show = false;
                    },600);
                }
            },
            computed: {
                selLists: function () {
                    var that = this;
                    var _selFilter = $.trim(that.search);
                    if (_selFilter == "" || that.groupList.length == 0) return that.groupList;
                    var filterResult = [];
                    $.map(that.groupList, function (ele, index) {
                        // var userInfo = that.groupList[ele].wechat_nick || that.groupList[ele].wechat_real_nick;
                        var userInfo = that.groupList[index].wechat_nick;
                        // 根据nick或者备注做匹配
                        var selByFilter = userInfo.indexOf(_selFilter) > -1;
                        if (selByFilter) {
                            filterResult.push(ele);
                        }
                    });
                    return filterResult;
                }
            }
        });
        //查看学员信息
        var cutUserDetail = Vue.extend({
            template:"#cutUserDetail",
            data: function(){
                return{
                    show: false,
                    details:{}
                }
            },
            methods: {
                hideCutMask: function(){
                    this.show = false;
                }
            },
            events:{
                showCutUserLayer:function(data){
                    this.show = true;
                    this.details = data.details;
                }
            }
        });
        //托管
        var instead = Vue.extend({
            template: "#instead",
            data: function(){
                return{
                    show:false,
                    crm:''
                }
            },
            methods: {
                hide: function(){
                    this.show =false;
                },
                submitCrm: function(){
                    if(!this.crm) return;
                    var that = this;
                    wxHeck.getData({
                        url :'/AdminContact/updateTrust',
                        data:{
                            trust_id : that.crm
                        },
                        success:function(data){
                            if(data.status !=10000) return _alert(data.message)
                            _alert(data.message);
                            this.crm = '';
                            that.show = false;
                            location.replace('http://www.51talk.com/');
                        }
                    });
                }
            },
            events:{
                crmTrust: function(){
                    this.show = true;
                    console.log("----")
                }
            }
        });
        //发送课程
        var sendClass = Vue.extend({
            template:"#sendLink",
            data:function(){
                return{
                    show:false,
                    classLink:'',
                    className:'',
                    id : '',
                    course_id:'',
                    dengdai:false
                }
            },
            methods:{
                hide:function(){
                    this.show = false;
                    // this.classLink = this.className = ''
                },
                sendLink:function(){
                    console.log(this.id)
                    this.show=false;
                    this.$root.sendMsg(null, true, this.id, this.classLink);
                }
            },
            events:{
                sendLinkClassName: function(data){
                    this.className = data.course_name_cn + data.unit_name_cn + data.lession_name_cn;
                },
                sendLinkLayer:function(arg){
                    var that = this;
                    that.id = arg.id;
                    that.course_id = arg.course_id;
                    wxHeck.getData({
                        url:'/Course/getCourseLinkById',
                        data:{
                            course_id: that.course_id
                        },
                        success: function(data){
                            if(data.status != 10000) {
                                that.show = false;
                                return _alert(data.message);
                            }
                            that.show = true;
                            that.classLink = data.message;
                        }
                    })
                }
            }
        });

        //推荐学员
        var recommend = Vue.extend({
            template:"#recommend",
            data: function(){
                return{
                    show: false,
                    recMoble: "",
                    des: "",
                    user_id:""
                }
            },
            methods:{
                //点击添加按钮
                addRecomd: function(){
                    var that = this;
                    wxHeck.getData({
                        url:'/RecommendUser/addRecomUser',
                        data:{
                            mobile: that.recMoble,
                            remark: that.des,
                            recomm_user_id: that.user_id
                        },
                        success:function(data){
                            if(data.status != 10000) return _alert(data.message);
                            _alert(data.message);
                            that.show = false;
                            that.recMoble = that.des = that.user_id ='';
                        }
                    });
                },
                //取消按钮
                hide:function(){
                    this.show = false;
                    this.recMoble = this.des = '';
                }
            },
            events:{
                recommendFn:function(data){
                    this.show = true;
                    this.user_id = data.user_id;
                }
            }
        });

        var labelEditor = Vue.extend({
            template : "#labelEditor",
            data : function(){
                return {
                    show : false,
                    showvis : false,
                    labelList : [],
                    labelData : [],
                    sysList : [],
                    labelDataRemark : "",
                    wechatId : "",
                    pos : {
                        top : "1px"
                    },
                    mt : null
                }
            },
            methods : {
                editLabel : function(data){
                    // 假设是系统标签 不设置
                    if(data.status == 1) return;
                    var id = data.id;
                    var index = this.labelData.indexOf(id);
                    if(index > -1){
                        this.labelData.splice(index, 1);
                    }else{
                        this.labelData.push(id);
                    }
                },
                sendEdit : function(){
                    this.$dispatch("changeLabel", {
                        labelData : this.labelData,
                        wechatId : this.wechatId
                    });
                },
                close : function(){
                    this.show = this.showvis = false;
                    // 如果数据改变
                    if(this.labelData.sort().join(",") != this.labelDataRemark) this.sendEdit();
                    this.labelList = [];
                    this.sysList = [];
                    this.labelData = [];
                    this.labelDataRemark = "";
                    this.wechatId = "";
                },
                blurHide : function(){
                    this.$root.showLabelEditor = "";
                    this.$root.showLabelEditorBlur = this.wechatId;
                    this.close();
                    clearTimeout(this.mt);
                    setTimeout(function(){
                        this.$root.showLabelEditorBlur = "";
                    }.bind(this),300);
                }
            },
            events : {
                openLabelEditor : function(data){
                    this.close();
                    // 标签列表
                    this.labelList = data.labelList;
                    // 系统标签列表
                    this.sysList = data.sysList;
                    this.labelData = data.labelData;
                    this.labelDataRemark = data.labelData.sort().join(",");
                    this.wechatId = data.wechatId;
                    this.show = true;
                    this.$nextTick(function(){
                        var $labelEditor = $(".label-editor");
                        // 计算位置
                        var target = data.target;
                        var t = target.offset().top;
                        var h = $(window).height() - t;
                        var H = $labelEditor.outerHeight();
                        var top = 0;
                        if(h > H){
                            top = t;
                        }else{
                            top = t - H;
                        }
                        this.pos.top = top + "px";
                        this.showvis = true;
                        this.$nextTick(function(){
                            $labelEditor.wxScroll().focus();
                        });
                    }.bind(this));
                },
                closeLabelEditor : function(){
                    this.close();
                }
            }
        });

        var helperLink = Vue.extend({
            template : "#helperLink",
            data : function(){
                return {
                    show : false,
                    data : {}
                }
            },
            methods : {
                close : function(){
                    this.show = false;
                    this.data = {};
                }
            },
            events : {
                helperLinkOpen : function(data){
                    this.data = data;
                    //this.data.link = "http://local.51talk.com/templates/html/weixin_heck/helperLink.html";
                    this.show = true;
                }
            }
        });

        // 聊天工具
        wxHeck.wxInit = new Vue({
            el: "body",
            data: {
                // 显示撤回
                mesBackShow : false,
                // 加载进度
                userProgress : {
                    progress : 0,
                    // 是否首次加载
                    // isFirst : true //20170719 liliang
                    isFirst : false
                },
                // 数据
                wxData: wxHeck.dataSource,
                // 绑定crm相关
                bindCrm: {
                    // 绑定按钮显示
                    showBindBtn: false,
                    // 绑定层
                    showBindCon: false,
                    // 已绑定信息层
                    showBindInfo: false,
                    // 绑定弹层
                    showBindPop: false,
                    // 搜索框的值
                    searchKey: "",
                    // 搜索结果
                    searchResult: {
                        id: "",
                        nick_name: ""
                    }
                },
                bindGroupCtl: {
                    showBindGroup: false,//绑定
                    canselBindGroup: false,//取消绑定
                    showbindLayer: false,//绑定弹层
                    searchKey: "",// 搜索框的值
                    searchResult: {// 搜索结果
                        id: "",
                        name: ""
                    },
                    //二维码，无返回-->指定二维码
                    wechatCode: "http://static.51talk.com/static/images/html/www_new/common/guan-wx.png?v=1484273503143",
                    groupDetail: {},//群信息
                    groupType:{//群类型
                        cst: false,
                        dls: false,
                        other: false
                    },
                    menu:false,
                    userGroup : localInfo.user_group
                },
                // 历史记录
                historyMsg: {
                    isLoading: false
                },
                // 操作菜单
                userOp: {
                    show: false
                },
                //修改备注，删除
                userOpt: {
                    show: false
                },
                // 语音播放
                voicePlay: {
                    voiceSrc: "",
                    playVoiceSrc: ""
                },
                // 消息提示
                contentTip: "",
                // 消息类型
                contentType: {
                    types: ["0", "1", "2", "9999", "42", "3000", "3001", "3100", "4000", "5000", "495", "4950", "6000", "6001", "400", "10000"]
                },
                //文件类型
                fileDetailType: "",
                // 所有未读消息条数
                noReadAll: 0,
                // 列表类型
                userListType: "",
                //今日关注
                todayFocusUser :[],
                at_id: [],
                // 群发到群
                setGroupChat: {
                    flag: false,
                    list: [],
                    msg: "",
                    chatType : ""
                },
                loading: {
                    show: false
                },
                contentGroupLayer: {
                    show: false,
                    del: false
                },
                // 新的好友
                newFriCount: 0,
                //群公告按钮
                showOwnnerBtn: false,
                //分享文章显示
                shareArticle: {
                    show: false,
                    title: "",
                    desc: "",
                    icon: "",
                    dig: "",
                    urlStr: "",
                    videoUrl: ""
                },
                groupUserInfo: {
                    from_id: "",
                    mem_id: "",
                    name: ""
                },
                //添加好友被删除
                addDelFriendInfo:{
                    show : false,
                    nameTitle :'51Talk的课程顾问',
                    msg:''
                },
                showLength : {
                    userListByType : {
                        // 默认展示多少条
                        startMark : 20,
                        // 当前展示多少条
                        start : 20,
                        // 每次增/减多少条
                        step : 10,
                        // 每条的高度
                        cH : 64,
                        // 滚动触发符合条件的buffer
                        buffer : 100
                    }
                },
                //个人信息弹层Data
                personalInfo:{
                    personalMask : false,
                    copyWechatImg : false,
                    copyImgBtn : false,
                    id : '',
                    wechat_username:'',
                    img: '',
                    nick: '',
                    qrcode_url: '',
                    show :false
                },
                //转介绍二维码
                introImg:{
                    show: false,
                    img:''
                },
                //设置群为班级群
                classGroupInfo:{
                    show: false,
                    bindBtn: true,
                    userGroup : localInfo.user_group
                },
                //黑鸟使用注意事项
                blackUseTip:false,
                //右上角收缩显示
                showInfo:{
                    recent: false,
                    last:false
                },
                cutUserMenuList: false,
                // 标签移上显示
                labelsWrap : {
                    data : [],
                    show : false,
                    showvis : false,
                    pos : {
                        top : 0
                    }
                },
                showLabelEditor : "",
                showLabelEditorBlur : "",
                //分享文章按钮显示
                showShare:'',
                //群发文章
                parentSend: false,
                //群发文章留言
                forwardText: "",
                //分享的消息数据
                temShareMsg:{},
                //主要跟进人
                mainwechat:false,
                //新功能提醒
                newFnTips : {
                    // 主菜单
                    main : [],
                    // 聊天窗口单人
                    chatSingle : [],
                    // 聊天窗口群组
                    chatGroup : [],
                    // 右侧单人
                    infoSingle : [],
                    // 右侧群组
                    infoGroup : []
                }
            },
            filters: {
                //文件大小取整
                _parseInt: function (value) {
                    return Math.round(value);
                },
                //时间处理
                y_m_d: function (v) {
                    return v.substring(0,10);
                },
                y_m_d_h_m: function (v) {
                    return v.substring(0,16);
                },
                h_m: function (v) {
                    return v.substring(11,16);
                },
            },
            components: {
                userSel: userSel,
                editName: editName,
                quickCon: quickCon,
                userSearch: userSearch,
                infoUpdate: infoUpdate,
                errorsTip: errorsTip,
                addFriend: addFriend,
                chatTools: chatTools,
                sendPaste: sendPaste,
                updateWechat: updateWechat,
                logout: logout,
                userType: userType,
                fnTab: fnTab,
                crmRemark: crmRemark,
                quickTab: quickTab,
                myStudy: myStudy,
                userTypes: userTypes,
                myFriend: myFriend,
                homeWork: homeWork,
                groupAnnounce: groupAnnounce,
                autoSend: autoSend,
                homeWorkDetail : homeWorkDetail,
                homeWorkOne : homeWorkOne,
                setHw : setHw,
                changeOwner : changeOwner,
                cutUserDetail: cutUserDetail,
                instead : instead,
                sendClass :sendClass,
                recommend : recommend,
                labelEditor : labelEditor,
                helperLink : helperLink
            },
            computed: {
                userListByType: function () {
                    var that = this;
                    var _selLabel = that.userListType;
                    var filterResult = [];
                    if (_selLabel == ""){
                        filterResult = that.wxData.userList;
                    }else{
                        //标签
                        $.map(that.wxData.userList, function (ele, index) {
                            // 今日关注
                            if(_selLabel == "todayFocus"){
                                if(that.todayFocusUser.indexOf(ele) > -1){
                                    filterResult.push(ele);
                                    if(filterResult.length == that.todayFocusUser.length) return false;
                                }
                            }else{
                                // 标签
                                var userInfo = that.wxData.msgList[ele].userInfo;
                                // 根据标签做匹配
                                var selByLabel = userInfo.label.indexOf(_selLabel) > -1;
                                if (selByLabel) {
                                    filterResult.push(ele);
                                }
                            }
                        });
                    }
                    // console.log(that.wxData.userList)
                    this.$nextTick(function(){
                        wxHeck.userBoxTop();
                    });
                    this.showLength.userListByType.start = this.showLength.userListByType.startMark;
                    return filterResult;
                },
                bindCrmSearchResult: function () {
                    var searchResult = this.bindCrm.searchResult,
                        result = [];
                    if (searchResult.id != "") result.push("id:" + searchResult.id);
                    if (searchResult.nick_name != "") result.push("昵称:" + searchResult.nick_name);
                    return result.join(" ");
                },
                bindGroupSearchResult: function () {
                    var searchResult = this.bindGroupCtl.searchResult,
                        result = [];
                    //if(searchResult.id != "") result.push("id:" + searchResult.id);
                    if (searchResult.name != "") result.push(searchResult.name);
                    return result.join(" ");
                }
            },
            methods: {
                initUpateNew : function(){
                    var localNewFlag = localStorage.getItem("localNewFlag");
                    if(!localNewFlag) localStorage.setItem("localNewFlag", JSON.stringify(this.newFnTips));
                    localNewFlag = JSON.parse(localStorage.getItem("localNewFlag"));
                    // 设置新功能
                    var newFlag = {
                        main : ["1", "2"],
                        chatSingle : ["1", "2"],
                        chatGroup : ["1", "2"],
                        infoSingle : ["1", "2"],
                        infoGroup : ["1", "2"]
                    }
                    // 从本地数据读取已点过的功能 删除需要设置的
                    $.map(newFlag, function(ele, key){
                        var arrDel = localNewFlag[key];
                        $.map(arrDel, function(el, idx){
                            var index = ele.indexOf(el);
                            if(index > -1){
                                ele.splice(index, 1);
                            }
                        });
                    });
                    // 合并
                    Object.assign(this.newFnTips, newFlag);
                },
                updateNew : function(event){
                    var relNew = $(event.target).closest("[relNew]");
                    if(!relNew[0]) return;
                    console.log(relNew);
                    relNew = relNew.attr("relNew").split("|");
                    var type = relNew[0],
                        arr = this.newFnTips[type],
                        key = relNew[1],
                        index = arr.indexOf(key);
                    if(index > -1){
                        arr.splice(index, 1);
                        // 将已删除的记录在本地
                        addKey(type, key);
                    }

                    function addKey(type, key){
                        var localNewFlag = localStorage.getItem("localNewFlag");
                        if(!localNewFlag) return;
                        localNewFlag = JSON.parse(localNewFlag);
                        localNewFlag[type].push(key);
                        localStorage.setItem("localNewFlag", JSON.stringify(localNewFlag));
                    }
                },
                // 是否是新功能
                isNew : function(type, tag){
                    var newFnTips = this.newFnTips[type];
                    if(!tag){
                        var length = newFnTips.length;
                        // 如果有特殊 功能的出现 取决于某个条件的
                        /*if(type == "chatGroup" && newFnTips.indexOf("3") > -1 && !this.wxData.showOwnnerBtn){
                         length--;
                         }*/
                        return length > 0;
                    }
                    return newFnTips.indexOf(tag) > -1;
                },
                //发送文章给组件
                parentSendFn: function (x) {
                    if(x == 'send'){
                        var msg = $.extend({}, this.temShareMsg, {
                            forwardText : $.trim(this.forwardText)
                        });
                        this.$broadcast("shareMsg",{
                            msg:msg
                        });
                    }else{
                        this.$broadcast("userSelClose");
                        this.setGroupChat.flag = false;
                        this.parentSend = false;
                        this.forwardText = "";
                    }
                },
                // 黑鸟小助手消息加载
                openHelperLink : function(data){
                    this.$broadcast("helperLinkOpen", data);
                },
                //分享文章按钮显示
                showShareMenu: function(x,y){
                    if(y == 'show'){
                        this.showShare = x.content.urlStr || x.content.url;
                    }else{
                        this.showShare = '';
                    }
                 },
                //点击绑定学员头像进入个人中心
                operationLog: function(t){
                    wxHeck.getData({
                        url:'/OperationLog/addOperationLog',
                        data:{
                            operation_type: t
                        },
                        success:function(r){},
                        error:function(r){}
                    })
                },
                isHelper : function(x){
                    return this.wxData.helpList.indexOf(x) > -1;
                },
                //达拉斯群右上角菜单详情
                groupBindMenu:function(){
                    this.bindGroupCtl.menu = !this.bindGroupCtl.menu;
                },
                //点击当前学员，右上角菜单Start
                showBindMenuList:function(){
                    this.cutUserMenuList = !this.cutUserMenuList;
                },
                hideBindMenuList:function(){
                    this.cutUserMenuList = false;
                },
                recommendUser:function(){
                    this.$broadcast("recommendFn",{
                        user_id: this.wxData.msgList[this.wxData.curUserId].crmInfo.user_id
                    });
                },
                //转介绍二维码
                introWechat: function (a,b) {

                    //获取当前二维码
                    var that = this;
                    wxHeck.getData({
                        url:'/SendQrCode/getQrCode',
                        data:{
                            user_id:b
                        },
                        success: function (data) {
                            if(data.status == 10000){
                                that.introImg.img = data.message;
                                //显示隐藏层
                                that.introImg.show = a == 'show' ? true : false;
                            }else{
                                _alert(data.message);
                            }
                        }
                    });
                },
                //发送转介绍二维码
                introWechatImg: function () {
                    var obj = {
                        action: "chat",
                        id: localInfo.id,
                        type: "web",
                        to_id: this.wxData.curUserId,
                        to_type: "ios",
                        content: this.introImg.img,
                        // 图片发送cnt_type 为1
                        cnt_type: 1
                    }

                    // 在页面上放置图片
                    wxHeck.pushMsg({
                        pushId: this.wxData.curUserId,
                        isCC: true,
                        msg: [this.introImg.img, this.introImg.img],
                        time: (new Date).getTime(),
                        cnt_type: 9999
                    });

                    wxHeck.sendMsg(obj);
                    this.introImg.show = false;

                    var _con = '亲爱的孩子家长，您只要将二维码图片和三张孩子上课图片配上走心文字一起分享到朋友圈，朋友通过您分享的二维码注册并付费，1990元的10节外 教课就到账哦！朋友也能获得3节外教课哦！比如您可以这样发朋友圈： 我和宝贝正在51Talk学习，宝贝从开始支支吾吾到如今已经能与外教老师流畅沟通，快带孩子一起来学习吧！';
                    //发送文字
                    var objText = {
                        action: "chat",
                        id: localInfo.id,
                        type: "web",
                        to_id: this.wxData.curUserId,
                        to_type: "ios",
                        content: _con,
                        // 图片发送cnt_type 为1
                        cnt_type: 0
                    }
                    //wxHeck.sendMsg(objText);//2017-07-19 liliang

                    // 页面插入cc发送的消息
                    wxHeck.pushMsg({
                        pushId: this.wxData.curUserId,
                        isCC: true,
                        msg: _con,
                        time: (new Date).getTime()
                    });
                },
                //点击当前学员，右上角菜单end
                mesBack : function(){
                    var obj = {
                        "action": "revoke_last_msg",
                        "id": localInfo.id,
                        "type": "web",
                        "to_id" : this.wxData.curUserId.split("$")[1]
                    }
                    wxHeck.sendMsg(obj);
                },
                mesBackShowFn : function(hasMesBack, flag){
                    if(!hasMesBack) return;
                    this.mesBackShow = flag == 1;
                },
                getLabel : function(id, getId){
                    return;//20170719 liliang
                    var label = this.wxData.msgList[id].userInfo.label.split(",");
                    var nameMap = wxHeck.labelFn.nameMap;
                    var idMap = wxHeck.labelFn.idMap;
                    return $.map(label, function(ele, index){
                        if(ele in nameMap){
                            var _id = nameMap[ele]["id"];
                            var result = getId ? _id : idMap[_id];
                            return result;
                        }
                    });
                },
                setHWShow : function(id){
                    this.$broadcast("showSetHW", {
                        groupId: id,
                        isGroupOwner : this.wxData.msgList[id].isGroupOwner
                    });
                },
                scrollShow : function(event, max){
                    if(max == 0) return;
                    var target = event.target;
                    var userListByType = this.showLength.userListByType;
                    var cH = target.clientHeight;
                    var sT = target.scrollTop;
                    var sH = target.scrollHeight;
                    if(cH + sT >= sH - userListByType.buffer){
                        var newLength = userListByType.start + userListByType.step;
                        newLength = newLength >= max ? max : newLength;
                        userListByType.start = newLength;
                    }
                    if((sH - (cH + sT)) > (userListByType.step * userListByType.cH + userListByType.buffer)){
                        var newLength = userListByType.start - userListByType.step;
                        newLength = newLength <= userListByType.startMark ? userListByType.startMark : newLength;
                        userListByType.start = newLength;
                    }
                },
                getFileClass: function (url) {
                    var _url = url.split(".").slice(-1)[0];
                    if (_url == "doc" || _url == "docx") return "fileWord";
                    if (_url == "xls" || _url == "xlsx") return "fileExcel";
                    if (_url == "ppt" || _url == "pptx") return "filePpt";
                    if (_url == "pdf") return "filePdf";
                },
                gotoBottom: function () {
                    var that = this;
                    window.setTimeout(function () {
                        wxHeck.scrollToBottom();
                        wxHeck.sendMsg({
                            "action": "chat_ok",
                            "id": localInfo.id,
                            "type": "web",
                            "to_id": that.wxData.curUserId
                        });
                    }, 0);
                },
                scrollFn: function (event) {
                    var target = event.target;
                    if ((target.scrollTop + target.clientHeight + 5) >= target.scrollHeight) {
                        this.wxData.msgList[this.wxData.curUserId].noRead = 0;
                        this.noReadAll = 0;
                        //20170719 liliang
                        // wxHeck.sendMsg({
                        //     "action": "chat_ok",
                        //     "id": localInfo.id,
                        //     "type": "web",
                        //     "to_id": this.wxData.curUserId
                        // });
                    }
                },
                homeWorkShow: function (id) {
                    this.$broadcast("showHomeWork", {
                        localInfo: this.wxData.localInfo,
                        groupId: id,
                        groupData: this.wxData.groupUserLists[id]
                    });
                },
                homeWorkOneShow : function(id){
                    this.$broadcast("showHomeWorkOne", {
                        localInfo: this.wxData.localInfo,
                        groupId: id,
                        groupData: this.wxData.msgList
                    });
                },
                homeWorkShowDetail : function(id){
                    this.$broadcast("showHomeWorkDetail", {
                        localInfo: this.wxData.localInfo,
                        groupId: id,
                        groupData: this.wxData.groupUserLists[id]
                    });
                },
                getMyFriend: function () {
                    this.userOpHide();
                    this.$broadcast("myFriendShow");
                    wxHeck.sendMsg({
                        "action": "hello_list",
                        "id": localInfo.id,
                        "type": "web"
                    });
                    this.newFriCount = 0;
                },
                closeGroupChat: function () {
                    this.$broadcast("userSelClose");
                    this.setGroupChat.flag = false;
                    // 还原消息
                    this.wxData.msgList[this.wxData.curUserId].msgContent = this.setGroupChat.msg;
                },
                //私聊
                isMyFriend: function (data) {
                    var id = data.wxid;
                    if (data.result == 1) {
                        wxHeck.toTop(id);
                        this.changeUser(id);
                        wxHeck.userBoxTop();
                    } else {
                        //添加群内好友相关
                        wxHeck.wxInit.$broadcast("addFriendGoNext", data);
                    }
                },
                //群聊天头像点击
                quickTab: function (event, x, isGroup) {
                    console.log(x);
                    // 本人
                    if (x.isCC) return;
                    // 如果不是群
                    if (!isGroup) return;
                    //当前成员信息
                    this.groupUserInfo.from_id = x.from_id;
                    this.groupUserInfo.mem_id = x.mem_id;
                    this.groupUserInfo.name = x.name;
                    //子组建需要数据
                    this.$broadcast("openQuickTab", {
                        from_id: x.from_id || x.curtId,
                        name: x.name || x.wechat_nick,
                        event: event,
                        mem_id: x.mem_id || x.wechat_id,
                        wechat_id: x.wechat_id || x.mem_id,
                        wechat_nick: x.wechat_nick || x.name,
                        curtId: this.wxData.curUserId
                    });
                },
                crmRemarkOpen: function (userid) {
                    this.$broadcast("crmRemarkOpen", {
                        user_id: userid
                    });
                },
                getSelCon: function (event) {
                    var txt = "";
                    if (document.selection) {
                        txt = document.selection.createRange().text;
                    } else {
                        txt = document.getSelection();
                    }
                    txt = txt.toString();
                    if (!txt) return;
                    this.$broadcast("openFnTab", {
                        pos: {
                            left: event.x,
                            top: event.y
                        },
                        sendSelData: txt
                    });
                },
                showLabelTab: function ($event, data) {
                    return;//20170719 liliang
                    if(data.length == 0) return;
                    this.labelsWrap.data = data;
                    this.labelsWrap.show = true;

                    this.$nextTick(function(){
                        var h = $(".labels_wrap").outerHeight();
                        var t = $($event.target).offset().top;

                        this.labelsWrap.pos.top = (t - h - 5) + "px";
                        this.labelsWrap.showvis = true;
                    }.bind(this));
                },
                getSys : function(obj){
                    return;//20170719 liliang
                    var labelList = this.wxData.localInfo.labelList;
                    var curUserId = this.wxData.curUserId;
                    if(!obj.labelData && !curUserId) return;
                    var labelData = obj.labelData || this.getLabel(this.wxData.curUserId, true);
                    var syslist = labelList["1"];
                    if(!syslist) return [];
                    return $.map(syslist, function(ele, index){
                        if(labelData.indexOf(ele.id) > -1){
                            if(obj.getId) return ele.id;
                            return ele;
                        }
                    });
                },
                showLabelEdit : function($event, id){
                    if(id == this.showLabelEditorBlur){
                        this.showLabelEditorBlur = "";
                        return;
                    }
                    this.showLabelEditorBlur = "";
                    if(id == this.showLabelEditor){
                        this.showLabelEditor = "";
                        this.$broadcast("closeLabelEditor");
                    }else{
                        var labelList = this.wxData.localInfo.labelList;
                        var labelData = this.getLabel(id, true);
                        var sysList = this.getSys({
                            labelData : labelData
                        });
                        this.showLabelEditor = id;
                        this.$broadcast("openLabelEditor", {
                            labelList : labelList,
                            labelData : labelData,
                            sysList : sysList,
                            wechatId : id,
                            target : $($event.target)
                        });
                    }
                },
                hideLabelTab: function () {
                    this.labelsWrap.showvis = false;
                    this.labelsWrap.show = false;
                },
                sendCircleFriend: function () {
                    wxHeck.sendMsg({
                        "action": "receive_wcmsg",
                        "id": localInfo.id,
                        "type": "web",
                        "action_type": 1
                    });
                },
                enNameEdit: function (event, crmInfo) {
                    var newName = $.trim(event.target.innerText);
                    if (newName == crmInfo.nick_name) return;
                    if (newName == "") {
                        alert("修改英文名不能为空");
                        event.target.innerText = crmInfo.nick_name;
                        return;
                    }
                    wxHeck.getData({
                        url: "/UserContact/ajaxUpdateUserNickName",
                        data: {
                            user_id: crmInfo.user_id,
                            nick_name: newName
                        },
                        success: function (r) {
                            if (r.status != 10000) {
                                _alert(r.message);
                                event.target.innerText = crmInfo.nick_name;
                            } else {
                                crmInfo.nick_name = newName;
                            }
                        },
                        error: function () {
                            alert("网络错误请重试！");
                            event.target.innerText = crmInfo.nick_name;
                        }
                    });
                },
                contentTipShow: function () {
                    clearTimeout(wxHeck.contentTipMT);
                },
                contentTipHide: function () {
                    var that = this;
                    wxHeck.contentTipMT = setTimeout(function () {
                        that.contentTip = "";
                    }, 3000);
                },
                sendMsgForce: function () {
                    this.sendMsg(event, true);
                    this.contentTip = "";
                },
                updateSelectMember: function (wechat_id, crmInfo) {
                    wxHeck.getData({
                        url: "/UserContact/ajaxUpdateUserWechat",
                        data: {
                            member: crmInfo.selectMember,
                            wechat_id: wechat_id
                        },
                        success: function (r) {
                            if (r.status != 10000) {
                                // 失败
                                crmInfo.selectMember = crmInfo.selectMemberMark;
                                return _alert(r.message);
                            } else {
                                // 成功
                                crmInfo.selectMemberMark = crmInfo.selectMember;
                            }
                        },
                        error: function () {
                            crmInfo.selectMember = crmInfo.selectMemberMark;
                            alert("网络错误请重试！");
                        }
                    });
                },
                updateInfo: function () {
                    this.userOpHide();
                    this.$broadcast("showUpdate");
                },
                blackUseTips:function(arg){
                    if(arg == 'show'){
                        this.blackUseTip = true;
                        this.userOp.show = false;
                    }else{
                        this.blackUseTip = false;
                    }
                },
                addFriend: function (data) {
                    if (data.type == 0) this.userOpHide();
                    this.$broadcast("showAddFriend", data);
                },
                myStudy: function () {
                    var endTime = wxHeck.Util.setDate(0);
                    if(wxHeck.isCC()){
                        endTime = wxHeck.Util.setDate(2)
                    }
                    var reqUrl = '';
                    var that = this;
                    //请求数据参数
                    var dataArg = {
                        start_time: wxHeck.Util.setDate(-90),
                        end_time:  endTime,
                        page_num: 1,
                        page_size: 10,
                        appoint_status:1
                    }
                    if(wxHeck.isSS()){
                        reqUrl = '/UserContact/getCrmUser';
                        that.$broadcast("setStudyTypeBoolean",{
                            cc: false,
                            ss:true
                        });
                    }
                    if(wxHeck.isCC()){
                        reqUrl = '/UserContact/getCrmUserByCc';
                        that.$broadcast("setStudyTypeBoolean",{
                            ss: false,
                            cc:true
                        });
                    }
                    wxHeck.getData({
                        url: reqUrl,
                        data:dataArg,
                        success: function (r) {
                            var dataList = r.message;
                            if (r.status != 10000) return _alert(dataList);
                            that.$broadcast("showMyStudyLayer", {
                                user_info: localInfo.wechat_id,
                                myStudyData: dataList
                            });
                        }
                    });
                    that.userOpHide();
                },
                // 播放声音
                playVoice: function (src) {
                    this.voicePlay.voiceSrc = src;
                    this.$nextTick(function () {
                        voiceMsgPlayer.play();
                    });
                },
                isPlaying: function () {
                    this.voicePlay.playVoiceSrc = this.voicePlay.voiceSrc;
                },
                isEnded: function () {
                    this.voicePlay.playVoiceSrc = "";
                },
                // 增加群成员 打开联系人搜索菜单
                // addUsers: function () {
                //     this.$broadcast("userSelOpen", {
                //         type: "add_group_mem"
                //     });
                // },
                // 打开编辑名字
                editNameShow: function (isGroup, reMark) {
                    this.$broadcast("editNameOpen", {
                        isGroup: isGroup,
                        reMark: reMark
                    });
                    this.contentGroupLayer.del = false;
                    this.contentGroupLayer.show = false;
                },
                //显示当前学员微信信息
                showUserDetail:function(id){
                    if(!id) return;
                    wxHeck.sendMsg({
                        "action": "get_contact_details",
                        "u_id": id.split("$")[1],
                        "type": "web",
                        "id": localInfo.id
                    });
                },
                //群面板菜单相关
                groupMenuSet: function(b,c){
                    var that = this;
                    var msg = {
                        "action": "",
                        "u_id": this.wxData.curUserId.split("$")[1],
                        "type": "web",
                        "id": localInfo.id
                    }
                    switch (b){
                        //开启屏蔽群消息
                        case 'open':
                            msg.action = 'mute_session',
                            msg.mute_session = 0;
                            wxHeck.sendMsg(msg);
                            that.contentGroupLayer.show = false;
                            break;
                        //屏蔽群消息
                        case 'close':
                            _confirm("确定要屏蔽该群的消息提醒吗？",function(){
                                console.log(0);
                                that.contentGroupLayer.show = false;
                                msg.action = 'mute_session',
                                msg.mute_session = 1;
                                wxHeck.sendMsg(msg);
                            });
                            break;
                        //置顶聊天
                        case 'toTop':
                            msg.action = 'top_chat_session',
                            msg.set_to_top = 1;
                            wxHeck.sendMsg(msg);
                            break;
                        //取消置顶聊天
                        case 'closeTop':
                            msg.action = 'top_chat_session',
                            msg.set_to_top = 0;
                            wxHeck.sendMsg(msg);
                            break;
                        //打开群公告编辑框
                        case 'announce':
                            that.$broadcast("showAnnLayer", that.wxData.curUserId.split("$")[1]);
                            that.contentGroupLayer.show = false;
                            break;
                        //群主管理权转让
                        case 'power':
                            that.$broadcast('showChangeOwner', {
                                groupOwnner: that.wxData.groupOwnner,
                                groupList : that.wxData.groupUserLists[that.wxData.curUserId],
                                groupId:that.wxData.curUserId.split("$")[1]
                            });
                            break;
                        //群成员列表删除
                        case 'delIco':
                            that.contentGroupLayer.show = true;
                            that.$nextTick(function () {
                                $(".content-group-list").wxScroll();
                            });
                            that.contentGroupLayer.del = true;

                            that.$broadcast("showDelBtn", that.contentGroupLayer.show);
                            $(".content-group-show-layer").focus();
                            break;
                        //修改群昵称
                        case 'myNicker':
                            //当前所在的群
                            var groupCutUserLists = that.wxData.groupUserLists[that.wxData.curUserId] || [];
                            var temNicker = '';
                            $.map(groupCutUserLists, function (ele, index) {
                                var wechat_id = ele.wechat_id.split("$")[1];
                                var wechat_nick = ele.wechat_nick;
                                if(wechat_id == localInfo.wechat_id){
                                    temNicker = wechat_nick;
                                }
                            });
                            console.log('当前昵称：'+temNicker);
                            that.$broadcast("editMyNicker",{
                                show:true,
                                u_id:this.wxData.curUserId.split("$")[1],
                                nicker:temNicker
                            });
                            break;
                            //群聊邀请确认
                        case 'invite':
                            // 0 关 1 开
                            console.log(c)
                            if(c){
                                _confirm("确认关闭【群聊邀请确认】功能？", function () {
                                    msg.action = 'allow_owner_approve';
                                    msg.allow_owner_approve_value = 0;
                                    wxHeck.sendMsg(msg);
                                });
                            }else {
                                _confirm("确认开启【群聊邀请确认】功能？", function () {
                                    msg.action = 'allow_owner_approve';
                                    msg.allow_owner_approve_value = 1;
                                    wxHeck.sendMsg(msg);
                                });
                            }
                            break;
                        case 'quit':
                                _confirm('退出后不会通知群聊中其他成员，且不会再接受此群聊信息', function () {
                                    msg.action = 'quit_chatroom';
                                    wxHeck.sendMsg(msg);
                                });
                            break;
                        case 'vip':
                            var _con = '亲爱的孩子家长，您只要将二维码图片和三张孩子上课图片配上走心文字一起分享到朋友圈，朋友通过您分享的二维码注册并付费，1990元的10节外 教课就到账哦！朋友也能获得3节外教课哦！ 比如您可以这样发朋友圈： 我和宝贝正在51Talk学习，宝贝从开始支支吾吾到如今已经能与外教老师流畅沟通，快带孩子一起来学习吧！',
                                datas = {
                                    user_id:c,
                                    wechat_id:that.wxData.curUserId.split("$")[1]
                                };
                            _confirm(_con, function (){
                                wxHeck.getData({
                                    url: "/RemindMainWechat/addRemindMainWechat",
                                    data:datas,
                                    success:function (data) {
                                        switch(data.status){
                                            //正常
                                            case 10000 :
                                                _alert(data.message);
                                                break;
                                            case 10003:
                                                _confirm('该学员主跟进微信号已经被指定,要确定本次更改吗？', function () {
                                                    wxHeck.getData({
                                                        url:'/RemindMainWechat/updateRemindMainWechat',
                                                        data:datas,
                                                        success: function (data) {
                                                            if(data.status !=10000) return _alert(data.message);
                                                            _alert(data.message);
                                                        }
                                                    });
                                                });
                                                break;
                                            default:
                                                _alert(data.message);
                                        }
                                    },
                                    error: function () {
                                        console.log("请求失败")
                                    }
                                });
                            });
                            break;
                        default:
                    }
                },
                // 打开操作菜单
                userOpShow: function () {
                    this.userOp.show = !this.userOp.show;
                },
                // 点击除了菜单的其他区域关闭操作菜单
                userOpHide: function () {
                    this.userOp.show = false;
                },
                //弹开修改备注&删除联系人
                userOptShow: function () {
                    this.userOpt.show = !this.userOpt.show;
                },
                // 点击除了备注菜单的其他区域关闭操作菜单
                userOptHide: function () {
                    this.userOpt.show = false;
                },
                //删除好友
                delFriend: function (id, name) {
                    _confirm("将联系人【" + name + "】删除，将同时删除与该联系人的聊天记录", function () {
                        wxHeck.sendMsg({
                            "action": "remove_users",
                            "wxid": id,
                            "type": "web",
                            "id": localInfo.id
                        });
                    });
                    //重新获取列表
                },
                //显示群列表层
                showGroupLayer: function () {
                    this.contentGroupLayer.show = !this.contentGroupLayer.show;
                    this.contentGroupLayer.del = false;
                    this.$nextTick(function () {
                        $(".content-group-list").wxScroll();

                    });
                    this.$broadcast("showDelBtn", this.contentGroupLayer.show);
                    $(".content-group-show-layer").focus();
                },

                delGroupDetailUser: function (x) {
                    console.log(x.wechat_id, x.wechat_nick)
                    var userCurrent = x.wechat_id.split("$");
                    if (userCurrent[0] == userCurrent[1]) {//groupUserInfo.groupUserWechat_id == localInfo.id
                        _alert("不能踢出自己");
                        return;
                    } else {
                        var groupId = this.wxData.curUserId.split("$")[1];
                        _confirm("将群成员【" + x.wechat_nick + "】删除？", function () {
                            wxHeck.sendMsg({
                                "action": "del_group_mem",
                                "u_id": groupId,
                                "type": "web",
                                "wxids": x.wechat_id,
                                id: localInfo.id
                            });
                        });
                    }
                    this.contentGroupLayer.show = !this.contentGroupLayer.show;
                },
                // 发起聊天
                getChat: function (type, chatType) {
                    // 群发个人次数限制
                    if(chatType == '0'){
                        _alert('为保障学员的体验，黑鸟每周只允许使用3次【群发个人】（其中：只允许使用1次单发话术，只允许使用2次发送文章或图片）。请认真编辑你发给学员的话术，黑鸟会监控群发的内容。');
                    }
                    this.setGroupChat.chatType = chatType || "";
                    this.userOpHide();
                    this.$broadcast("userSelOpen", {
                        type: type,
                        listPerson: this.wxData.userListPerson,
                        listGroup: this.wxData.userListGroup,
                        chatType : chatType
                    });
                    // 群发到群
                    if (type == "getGroupChat") {
                        if (this.wxData.curUserId == "") this.changeUser(this.userListByType[0]);
                        // 存储当前消息
                        this.setGroupChat.msg = this.wxData.msgList[this.wxData.curUserId].msgContent;
                        this.wxData.msgList[this.wxData.curUserId].msgContent = "";
                        this.setGroupChat.flag = true;
                    }
                    //添加群成员
                    if (type == "add_group_mem") {
                        this.contentGroupLayer.show = false;
                        this.contentGroupLayer.del = false;
                    }
                },
                userLogout: function () {
                    this.userOpHide();
                    if (!window.confirm("确认退出？")) return;
                    //确认提示
                    wxHeck.Util.closeTab();
                },
                //托管
                logoutTrust: function(){
                    this.$broadcast("crmTrust");
                    this.userOpHide();
                },
                // 退出并使用自己的微信托管
                userLogoutTrustByWX: function () {
                    this.userOpHide();
                    var that = this;
                    wxHeck.getData({
                        url: "/AdminContact/getSelfWechat",
                        data: {
                            admin_id: localInfo.id
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            if (r.message == undefined) {
                                r.message = "";
                            }
                            that.$broadcast("logoutShowFn", r.message);
                        }
                    });
                },
                // 点击时从后端 更新标签 暂取消
                getLabels: function (id) {
                    // 获取标签
                    return;
                    wxHeck.getData({
                        url: "/UserContact/getTag",
                        data: {
                            admin_id: localInfo.id,
                            wechat_id: id
                        },
                        success: function (r) {
                            if (r.status != 10000) return;
                            wxHeck.sendMsg({
                                "action": "modify_label",
                                "u_id": id,
                                "id": localInfo.id,
                                "type": "web",
                                "labels": r.message
                            });
                        }
                    });
                },
                setHeight : function(){
                    var allHeight = $(window).height();
                    // 上面盒子高度
                    var topBlockHeight = $('.user_mes_boxc').outerHeight();
                    // 下面盒子的上部分高度
                    var bottomDtHeight = $('.user_mes_con dt').outerHeight();
                    // 下面盒子的下部分高度
                    var bottomDdHeight = allHeight - topBlockHeight - bottomDtHeight - 10;
                    $('.user_mes_con dd').height(bottomDdHeight);
                    console.log('底部高度：'+bottomDdHeight);
                },
                // 拉取用户信息
                getCrmInfo: function (isForce, userid) {
                    var that = this;
                    var id = userid || that.wxData.curUserId;
                    var wid_remark_name = that.wxData.msgList[id].userInfo.c_remark;
                    // 获取标签
                    if (that.wxData.msgList[id].crmInfo.isGet) that.getLabels(id);
                    // 拉取crm信息
                    // 如果没有信息的情况下才发请求
                    // isForce 强制刷新
                    // 强制刷新
                    if (!that.wxData.msgList[id].crmInfo.isGet || isForce || true) {
                        return;//20170719 liliang
                        // console.log(this.getSys({
                        //     getId : true
                        // }))
                        var that = this;
                        wxHeck.getData({
                            url: "/UserContact/showUserInfo",
                            data: {
                                wechat_id: id,
                                wid_remark_name: wid_remark_name,
                                label_list:that.getSys({
                                    getId : true
                                })
                            },
                            success: function (r) {
                                // 如果是true 则为备注匹配
                                if (r.status == 10000) {
                                    //点击自动绑定crm
                                    // ;(function () {
                                    //     var crmid = r.message.user_id;
                                    //     if(!crmid) return;
                                    //     var _remark = wid_remark_name || that.wxData.msgList[id].userInfo.nick;
                                    //     var reg = new RegExp("^"+crmid);
                                    //     if(reg.test(_remark)) return;
                                    //     //console.log("do " +  _remark);
                                    //     wxHeck.sendMsg({
                                    //         "id": localInfo.id,
                                    //         "action": "modify_remark",
                                    //         "type": "web",
                                    //         "to_id": that.wxData.curUserId,
                                    //         "to_type": "ios",
                                    //         "new_name": crmid + "-" + _remark
                                    //     });
                                    // })();
                                    //主要跟进人
                                    that.mainwechat = !!r.mainwechat;


                                    if (r.message.selectMember == null) r.message.selectMember = "0";
                                    // 备份
                                    r.message.selectMemberMark = r.message.selectMember;
                                    that.wxData.msgList[id].crmInfo = $.extend({}, that.wxData.msgList[id].crmInfo, r.message);
                                    that.$broadcast("setTagList",{
                                        labelList: that.wxData.msgList[id].crmInfo.tag_list || ''
                                    });
                                    var user_id = r.message.user_id;
                                    // 获取课程信息
                                    wxHeck.getData({
                                        url: "/Course/getRecentlyLast",
                                        data: {
                                            user_id: user_id
                                        },
                                        success: function (r) {
                                            if (r.message.combo && r.message.combo.length > 0) {
                                                r.message.comboSel = "0";
                                            }
                                            that.wxData.msgList[id].crmInfo = $.extend({}, that.wxData.msgList[id].crmInfo, r.message, {isGet: true});
                                            // 有信息的
                                            that.bindCrm.showBindCon = false;
                                            that.bindCrm.showBindBtn = false;
                                            that.bindCrm.showBindInfo = true;
                                            // 获取标签
                                            that.getLabels(id);
                                            //发送课程链接
                                            //if(r.message.recent.constructor == Object){
                                                that.$broadcast("sendLinkClassName",r.message.recent);
                                            //}

                                            that.$nextTick(that.setHeight);

                                        }
                                    });
                                    // 发送微信id 跟 群列表 获取是否在达拉斯群
                                    ;(function(){
                                        // 如果当前人的作业标识不为初始值
                                        if(that.wxData.msgList[id].showHW != 999) return;
                                        var group_list = r.message.group_list;
                                        if(group_list.length == 0) return;
                                        console.log("get show homework");
                                        var data = {
                                            id : id.split("$")[1],
                                            grouparray : group_list
                                        }
                                        // 去手机端取
                                        var msgObj = {
                                            "id": localInfo.id,
                                            "action": "is_contact_in_grouparray",
                                            "type": "web",
                                            "to_type": "ios",
                                            "groupdata" : data
                                        }
                                        wxHeck.sendMsg(msgObj);
                                    })();

                                } else {
                                    // 没有信息的
                                    that.bindCrm.showBindCon = true;
                                    that.bindCrm.showBindBtn = true;
                                    that.bindCrm.showBindInfo = false;
                                    // 复原crm
                                    that.wxData.msgList[id].crmInfo = {
                                        isGet: false
                                    };
                                    that.$broadcast("setTagList",{
                                        labelList:''
                                    });

                                    that.$nextTick(that.setHeight);

                                }
                            }
                        });
                    } else {
                        // 如果已经有信息
                        that.bindCrm.showBindCon = false;
                        that.bindCrm.showBindBtn = false;
                        that.bindCrm.showBindInfo = true;
                    }
                },
                getGroupInfo: function () {
                    var reqUri = '';
                    if(localInfo.user_group == '6'){
                        reqUri ='/UserWorkGroup/showBoundClass';
                    }else{
                        this.bindGroupCtl.groupType.dls = true;
                        reqUri ='/BoundCommodity/showBoundCommodity';
                    }
                    var that = this;
                    wxHeck.getData({
                        url: reqUri,
                        data: {
                            group_id: that.wxData.curUserId.split("$")[1].split("@")[0]
                        },
                        success: function (r) {
                            var dataMes = r.message;
                            // if (r.status != 10000) return _alert(dataMes);
                            //群二维码
                            if (dataMes.code != '') {
                                that.bindGroupCtl.wechatCode = dataMes.code;
                            }
                            if (localInfo.user_group == "7" || localInfo.user_group == "9" || localInfo.user_group == "10" || localInfo.user_group == "11") {
                                if (dataMes.isBound) {
                                    //显示绑定信息
                                    that.bindGroupCtl.canselBindGroup = true;
                                    that.bindGroupCtl.showBindGroup = false;
                                    // 渲染群信息数据
                                    that.bindGroupCtl.groupDetail = dataMes;
                                } else {
                                    that.bindGroupCtl.showBindGroup = true;
                                    that.bindGroupCtl.canselBindGroup = false;
                                }
                            }
                            if(localInfo.user_group == "6"){
                                //班级群 设置
                                if (r.status == 10001){
                                    that.classGroupInfo.bindBtn = true;
                                }else{
                                    that.classGroupInfo.bindBtn = false;
                                }
                                that.bindGroupCtl.groupType.cst = true;
                            }
                        }
                    });
                },
                // 切换用户
                changeUser: function (id) {
                    var isHelper = this.isHelper(id);
                    this.contentGroupLayer.show = false;
                    this.contentGroupLayer.del = false;
                    if (this.wxData.curUserId == id) return;
                    // 如果是替代者身份 并且 没有未读消息 返回
                    var that = this;
                    if (localInfo.is_trust == 1) {
                        var isNotInTrust = $.inArray(id, that.wxData.trustList) == -1;
                        if (isNotInTrust && that.wxData.msgList[id].noRead == 0) return;
                        isNotInTrust && that.wxData.trustList.push(id);
                    }
                    // 更新当前用户id
                    this.wxData.curUserId = id;
                    // 隐藏绑定所有层
                    this.bindCrm.showBindCon = false;
                    this.bindCrm.showBindBtn = false;
                    this.bindCrm.showBindInfo = false;
                    that.bindCrm.isRebind = false;

                    // 小助手
                    ;(function(){
                        that.$broadcast("setOtherList", isHelper);
                    })();
                    // 渲染后的
                    this.$nextTick(function () {
                        // 消息框滚动条
                        if (!wxHeck.msgBox) {
                            // 这个时候message 输入框刚渲染
                            wxHeck.msgBox = $(".content_message");
                            wxHeck.msgBox.wxScroll();
                            $(".user_mes_con>dd").wxScroll();
                            // 上传图片初始化
                            wxHeck.upLoadImgInit(that);
                            // 上传文件初始化
                            wxHeck.upLoadFileInit(that);
                            // 粘贴上传
                            $(".send_text").on("paste", function (e) {
                                wxHeck.Util.pasteFn(e.originalEvent, function (result) {
                                    that.$broadcast("openSendPaste", {
                                        imgSrc: result
                                    });
                                });
                            });
                        }
                        // 如果是群
                        if (that.wxData.msgList[id].isGroup) {
                            that.getGroupInfo();
                            // 群列表请求
                            wxHeck.sendMsg({
                                "action": "group_user_list",
                                "u_id": id.split("$")[1],
                                "type": "web",
                                "id": localInfo.id
                            });
                            //验证群主
                            wxHeck.sendMsg({
                                "action": "group_ownner_id",
                                "u_id": id.split("$")[1],
                                "type": "web",
                                "id": localInfo.id
                            });
                            setTimeout(function () {
                                if (localInfo.wechat_id == wxHeck.dataSource.groupOwnner) {
                                    wxHeck.dataSource.showOwnnerBtn = true;
                                    wxHeck.wxInit.wxData.msgList[id].isGroupOwner = true;
                                } else {
                                    wxHeck.dataSource.showOwnnerBtn = false;
                                }
                            }, 500);
                            //Vue.set(wxHeck.dataSource.groupUserLists, data.from_id, data.list)
                        } else {
                            // 如果不是群 拉取crm信息
                            that.getCrmInfo();
                        }
                        // 切换消息框后 滚动到底部
                        wxHeck.scrollToBottom();
                       
                        // 拉取未读
                        ;
                        (function () {
                            // 如果没有未读
                            if (that.wxData.msgList[id].noRead <= 0) return;
                            var time = that.wxData.msgList[id].time;
                            // 如果是小助手
                            var noReadApi = isHelper ? "/BlackBirdHelper/ajaxUnreadHelperMessage" : "/WechatMessage/ajaxUnreadMessage";

                            if (!!time && time > 0) {
                                // 如果是首次加载
                                // 拉取未读消息
                                that.getHistoryFn({
                                    url: noReadApi,
                                    data: {
                                        score: time
                                    },
                                    cb: function () {
                                        that.noReadAll -= that.wxData.msgList[id].noRead;
                                        that.wxData.msgList[id].noRead = 0;
                                        that.wxData.msgList[id].time = 0;
                                        // 发送确认消息
                                        wxHeck.sendMsg({
                                            "action": "chat_ok",
                                            "id": localInfo.id,
                                            "type": "web",
                                            "to_id": id
                                        });
                                    },
                                    isGetNoRead: true
                                });
                            } else {
                                // 非首次加载
                                that.noReadAll -= that.wxData.msgList[id].noRead;
                                that.wxData.msgList[id].noRead = 0;
                                // 发送确认消息
                                wxHeck.sendMsg({
                                    "action": "chat_ok",
                                    "id": localInfo.id,
                                    "type": "web",
                                    "to_id": id
                                });
                            }
                        })();
                        //快捷标签滚动条
                        //$('.system-label').wxScroll();
                    });
                    //清除@显示
                    this.clearAtUs();
                    //重置快捷标签
                    wxHeck.wxInit.$refs.quickcon.tagSel.selName = '';
                    wxHeck.wxInit.$refs.quickcon.inputData = '';
                    //重置选取的标签
                    wxHeck.wxInit.$refs.quickcon.conList=[];
                },
                // 发送消息
                sendMsg: function (event, isForce, sendId, sendCon) {
                    // console.log(arguments);
                    var that = this;
                    // 当前用户ID
                    var curId = sendId || this.wxData.curUserId;
                    if (!curId) return;
                    var msg = sendCon || $.trim(that.wxData.msgList[curId].msgContent);
                    // console.log(msg);
                    if (msg == "") return;
                    // 如果是群发到群
                    if (this.setGroupChat.flag && this.setGroupChat.list.length == 0) return;
                    // 如果是enter键加上shift键 换行
                    if (event && event.which == 13 && event.shiftKey) return;
                    // 如果只是enter键 阻止换行
                    if (event && event.which == 13) {
                        event.preventDefault();
                    }
                    // 标签过滤
                    var tipVerify = (function (m, r) {
                        if (isForce) return true;
                        var conMatch = m.match(r);
                        if (!conMatch) return true;
                        that.contentTip = "请根据学员情况更改" + conMatch.join("，") + "的内容后再发送";
                        that.contentTipShow();
                        that.contentTipHide();
                    })(msg, wxHeck.Util.conReg);
                    if (!tipVerify) return;
                    var _msg;
                    //检测@他人
                    var msgObj = {
                        action: "chat",
                        id: localInfo.id,
                        type: "web",
                        to_id: curId,
                        to_type: "ios"
                    }
                    //根据场景转换数据
                    if (this.at_id.length != 0) {
                        // 如果是@
                        msgObj.content = JSON.stringify({
                            "atwxid": this.at_id.join(","),
                            "content": msg
                        })
                        msgObj.cnt_type = 3100;
                        this.at_id = [];
                    } else {
                        msgObj.content = msg;
                    }
                    // 群发到群
                    if (this.setGroupChat.flag) {
                        this.sendGroupChat(msgObj);
                        return;
                    }
                    // 单聊
                    // 发送消息
                    //点击发送按钮发送消息***********/
                    // 发送消息 20170717 liliang
                    // wxHeck.sendMsg(msgObj);
                    wxHeck.getData({
                        url: wxHeck.PROJECT_DOMAIN + '/kunpeng/message/send',
                        data: {
                            weixinId: that.wxData.curUserId,
                            msgType : 1,
                            msgContent: that.wxData.msgList[curId].msgContent
                        },
                        success: function (data) {
                            if (data.errNo != 0) return alert(data.errstr);
                            that.curMsg = '';
                            console.log("↑↑↑↑↑↑↑↑send message success↑↑↑↑↑↑↑↑")
                        },
                        error: function () {
                            console.log('connect failer');
                        }
                    })
                    /***************************/


                    // 页面插入cc发送的消息
                    //根据作业帮业务更改
                    wxHeck.pushMsg({
                        pushId: curId,
                        isCC: true,
                        msg: msg,
                        msg_content: msg,
                        //作业帮长连接消息格式
                        cur_ver_id: null,
                        from_uid: localInfo.wechat_id,
                        msg_flag: null,
                        msg_id: null,
                        msg_time: (new Date).getTime(),
                        time : (new Date).getTime(),
                        msg_type: 1,
                        pre_ver_id: null,
                        to_group_id: 0,
                        to_group_id_str: "",
                        to_uid: curId
                    });
                    // 移到第一位
                    wxHeck.toTop(curId);
                    that.wxData.msgList[curId].msgContent = "";
                },
                //清除群@我，我们
                clearAtUs: function () {
                    this.wxData.msgList[this.wxData.curUserId].at_fg = 0;
                    this.wxData.msgList[this.wxData.curUserId].atshow = false;
                },
                // 群发
                sendGroupChat: function (data, isArticle) {
                    var that = this;
                    var list = that.setGroupChat.list;
                    var length = list.length;
                    if(list.length == 0) return _alert("请选择联系人！");
                    // "0" 群发个人 "1" 群发到群
                    var chatType = that.setGroupChat.chatType;
                    // 是否通过转发助手发送
                    // 规则 群发个人 且不能为发送文章 则使用转发助手
                    var isForward = (chatType == "0" && !isArticle);

                    //限制群发个人次数
                    if(chatType == "0"){
                        //获取已群发次数
                        var that = this;
                        wxHeck.getData({
                            url: "/MassMessageLog/getMassMessageCount",
                            data: {
                                admin_id: localInfo.admin_id
                            },
                            success: function (r) {
                                if (r.status != 10000) return _alert(r.message);
                                if(isForward && data.cnt_type != 1){
                                    // 验证文本次数
                                    if(parseInt(r.message[0]) > 0){
                                        _alert('本周已经无法通过【群发个人】发送话术给学员，你还可以尝试发送文章或图片');
                                    }else{
                                        //发送文字或者图片
                                        sendGroupMes();
                                    }
                                }else{
                                    // 验证文章次数
                                    if(parseInt(r.message[1]) > 1){
                                        _alert('本周已经无法【群发个人】发送文章或图片给学员');
                                    }else {
                                        //发送文章
                                        var sendTip = "选择"+ length +"人群发消息需等待"+ Math.ceil(length * 3 / 60) +"分钟，频繁群发会被微信限制，是否群发？";
                                        _confirm(sendTip ,function (){
                                            sendGroupMes();
                                        });
                                    }
                                }
                            }
                        });
                    }else{
                        var sendTip = "选择"+ length +"人群发消息需等待"+ Math.ceil(length * 3 / 60) +"分钟，频繁群发会被微信限制，是否群发？";
                        _confirm(sendTip ,function (){
                            sendGroupMes();
                        });
                    }
                    
                    // 提示信息
                    // var sendTip = "";
                    // if(isForward){
                    //     // 转发助手
                    //     sendTip = "频繁群发会被微信限制，而且学员也不喜欢经常收到和营销相关的内容，是否群发？";
                    // }else{
                    //     // 单聊接口
                    //     sendTip = "选择"+ length +"人群发消息需等待"+ Math.ceil(length * 3 / 60) +"分钟，频繁群发会被微信限制，是否群发？";
                    // }
                    // _confirm(sendTip ,function (){
                    //     that.loading.show = true;
                    //     data.to_id = list.join(",")
                    //     if(isForward){
                    //         // 转发助手
                    //         // 适用 群发个人 文字 图片
                    //         wxHeck.getData({
                    //             url: "/WechatMessage/ajaxMassMessage",
                    //             data: {
                    //                 "id": localInfo.id,
                    //                 "wechat_id": localInfo.wechat_id,
                    //                 "action": "group_chat",
                    //                 "type": "web",
                    //                 "to_type": "ios",
                    //                 "u_ids": data.to_id,
                    //                 "content": data.content,
                    //                 "cnt_type" : data.cnt_type,
                    //                 "chatType":chatType
                    //             },
                    //             success: function (r) {
                    //                 if(r.status != 10000) return _alert(r.message);
                    //                 _alert("转发成功");
                    //                 // 关闭群发
                    //                 that.closeGroupChat();
                    //             },
                    //             complete:function(){
                    //                 that.loading.show = false;
                    //             }
                    //         });
                    //     }else{
                    //         // 单聊接口
                    //         // 适用 群发个人 文章
                    //         // 适用 群发给群 文字 图片 文章
                    //         data.chatType = chatType;
                    //         wxHeck.getData({
                    //             url:"/WechatMessage/ajaxChangeMessage",
                    //             data:data,
                    //             success:function(r){
                    //                 if(r.status != 10000) return _alert(r.message);
                    //                 _alert("转发成功");
                    //                 // 关闭群发
                    //                 that.closeGroupChat();
                    //             },
                    //             complete:function(){
                    //                 that.loading.show = false;
                    //             }
                    //         });
                    //     }
                    //     //群发统计次数
                    //     wxHeck.getData({
                    //         url:"/OperationLog/addOperationLog",
                    //         data:{
                    //             operation_type :1
                    //         },
                    //         success:function(r){
                    //             console.log("统计群发到群次数")
                    //         },
                    //         error:function(){
                    //             console.log("请求出错")
                    //         }
                    //     });
                    // });
                    
                    function sendGroupMes() {
                        that.loading.show = true;
                        data.to_id = list.join(",")
                        if(isForward){
                            // 转发助手
                            // 适用 群发个人 文字 图片
                            wxHeck.getData({
                                url: "/WechatMessage/ajaxMassMessage",
                                data: {
                                    "id": localInfo.id,
                                    "wechat_id": localInfo.wechat_id,
                                    "action": "group_chat",
                                    "type": "web",
                                    "to_type": "ios",
                                    "u_ids": data.to_id,
                                    "content": data.content,
                                    "cnt_type" : data.cnt_type,
                                    "chatType":chatType
                                },
                                success: function (r) {
                                    if(r.status != 10000) return _alert(r.message);
                                    _alert("转发成功");
                                    // 关闭群发
                                    that.closeGroupChat();
                                },
                                complete:function(){
                                    that.loading.show = false;
                                }
                            });
                        }else{
                            // 单聊接口
                            // 适用 群发个人 文章
                            // 适用 群发给群 文字 图片 文章
                            data.chatType = chatType;
                            wxHeck.getData({
                                url:"/WechatMessage/ajaxChangeMessage",
                                data:data,
                                success:function(r){
                                    if(r.status != 10000) return _alert(r.message);
                                    _alert("转发成功");
                                    // 关闭群发
                                    that.closeGroupChat();
                                },
                                complete:function(){
                                    that.loading.show = false;
                                }
                            });
                        }
                        //群发统计次数
                        wxHeck.getData({
                            url:"/OperationLog/addOperationLog",
                            data:{
                                operation_type :1
                            },
                            success:function(r){
                                console.log("统计群发到群次数")
                            },
                            error:function(){
                                console.log("请求出错")
                            }
                        });
                    }
                },
                // 绑定crm信息弹层
                bindUser: function () {
                    this.bindCrm.showBindPop = true;
                },
                // 解绑crm用户
                unbindUser: function () {
                    var that = this;
                    wechat_id = that.wxData.curUserId,
                        user_id = that.wxData.msgList[wechat_id].crmInfo.user_id,
                        wid_remark_name = that.wxData.msgList[wechat_id].userInfo.c_remark;
                    _confirm("确认解除绑定？",function(){
                        wxHeck.getData({
                            url: "/UserContact/deleteUserInfo",
                            data: {
                                user_id: user_id,
                                wechat_id: wechat_id,
                                wid_remark_name: wid_remark_name
                            },
                            success: function (r) {
                                if (r.status != 10000) return _alert(r.message);
                                _alert("解绑成功");
                                // 强制 拉取crm信息
                                that.getCrmInfo(true);
                            }
                        });
                    });
                },
                // 关闭crm信息弹层
                hideBindPop: function () {
                    this.bindCrm.showBindPop = false;
                    // 复原绑定框
                    this.bindCrm.searchKey = "";
                    this.bindCrm.searchResult.id = "";
                    this.bindCrm.searchResult.nick_name = "";
                },
                // 根据电话或ID搜索
                bindSearch: function () {
                    var key = $.trim(this.bindCrm.searchKey),
                        that = this;
                    if (key == "") return alert("请输入搜索电话号码或ID号");
                    wxHeck.getData({
                        url: "/UserContact/searchUserInfo",
                        data: {
                            user_num: key,
                            admin_id: localInfo.admin_id
                        },
                        success: function (r) {
                            if(!r) return alert("返回数据为空，请保留现场，联系黑鸟技术！");
                            if (r.status != 10000) return alert(r.message);
                            that.bindCrm.searchResult.id = r.message.id;
                            that.bindCrm.searchResult.nick_name = r.message.nick_name;
                        }
                    });
                },
                // 绑定crm用户
                bindCrmFn: function () {
                    var that = this,
                        user_id = that.bindCrm.searchResult.id,
                        wechat_id = that.wxData.curUserId;
                    if (!user_id) return alert("请提供绑定信息！");
                    wxHeck.getData({
                        url: "/UserContact/addUserWechatContact",
                        data: {
                            wechat_id: wechat_id,
                            user_id: user_id
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            alert("绑定成功");
                            // 关闭弹层
                            that.hideBindPop();
                            // 拉取crm信息
                            that.getCrmInfo(true);
                        }
                    });
                },
                bindGroupBtn: function () {
                    this.bindGroupCtl.showbindLayer = true;
                },
                hideBindGroupLayer: function () {
                    this.bindGroupCtl.showbindLayer = false;
                    // 复原绑定框
                    this.bindGroupCtl.searchKey = "";
                    this.bindGroupCtl.searchResult.id = "";
                    this.bindGroupCtl.searchResult.name = "";
                },
                bindGroupSearch: function () {
                    var key = $.trim(this.bindGroupCtl.searchKey),
                        that = this;
                    if (key == "") return alert("请输入商品ID");
                    if (!/^[0-9]*$/.test(key)) {
                        return alert("商品ID只能是数字！");
                    }
                    wxHeck.getData({
                        url: "/BoundCommodity/getCommodityById",
                        data: {
                            id: key,
                            group_id: that.wxData.curUserId.split("$")[1].split("@")[0]
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            that.bindGroupCtl.searchResult.id = key;
                            that.bindGroupCtl.searchResult.name = r.message.name;
                            if (r.message.name == '') {
                                alert("暂无该ID商品！");
                            }
                        }
                    });
                },
                bindGroupFn: function () {
                    var that = this,
                        user_id = that.bindGroupCtl.searchResult.id,
                        group_id = that.wxData.curUserId.split("$")[1].split("@")[0],
                        name = that.bindGroupCtl.searchResult.name;
                    console.log("提交群绑定参数：" + user_id, group_id, name, localInfo.admin_id);
                    if (!user_id) return alert("请提供绑定商品ID！");
                    wxHeck.getData({
                        url: "/BoundCommodity/boundCommodity",
                        data: {
                            commodity_id: user_id,
                            commodity_name: name,
                            wechat_id: localInfo.wechat_id,
                            group_id: group_id
                            // group_id : 2147483647
                        },
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            alert("绑定成功");
                            // 关闭弹层
                            that.hideBindGroupLayer();
                            // 拉取crm信息
                            that.getGroupInfo();
                        }
                    });
                },
                //群解绑
                unbindGroup: function () {
                    var that = this;
                    group_id = that.wxData.curUserId.split("$")[1].split("@")[0];
                    if (window.confirm("确认解除群绑定？")) {
                        wxHeck.getData({
                            url: "/BoundCommodity/canserBound",
                            data: {
                                group_id: group_id
                                // group_id : 2147483647
                            },
                            success: function (r) {
                                if (r.status != 10000) return alert(r.message);
                                alert("群解绑成功");
                                // 强制 拉取crm信息
                                that.getGroupInfo();
                            }
                        });
                    }
                },
                // 拉取历史纪录
                getHistoryFn: function (opts) {
                    var that = this;
                    curUserId = that.wxData.curUserId;
                    score = that.wxData.msgList[curUserId].historyMsg.score;
                    that.historyMsg.isLoading = true;
                    // 是否是小助手
                    var isHelper = that.isHelper(curUserId);
                    var defaults;
                    if(isHelper){
                        // 如果是小助手
                        defaults = {
                            url: "/BlackBirdHelper/ajaxHelperMessage",
                            data: {
                                helper_id: curUserId,
                                score: score,
                                cc_id: localInfo.id
                            }
                        }
                    }else{
                        defaults = {
                            url: "/WechatMessage/ajaxMessageList",
                            data: {
                                wechatId: curUserId,
                                score: score,
                                ccId: localInfo.id
                            }
                        }
                    }
                    var configs = $.extend(true, {}, defaults, opts);
                    wxHeck.getData({
                        url: configs.url,
                        data: configs.data,
                        success: function (r) {
                            if (r.status != 10000) return alert(r.message);
                            if (r.message.length == 0) {
                                // 已经全部拉取
                                that.wxData.msgList[curUserId].historyMsg.isGetAll = true;
                            } else {
                                $.map(r.message, function (ele, index) {
                                    ;
                                    (function () {
                                        /*// 如果为获取未读 则不需要给score赋值
                                        if (configs.isGetNoRead) return;*/
                                        // 取第一条的时间戳作为新的score
                                        if (index == r.message.length - 1) {
                                            that.wxData.msgList[curUserId].historyMsg.score = ele.time;
                                        }
                                    })();
                                    ;
                                    (function (data) {
                                        // 如果是cc自己的消息
                                        var isCC = data.from_id == localInfo.id;
                                        var pushId = isCC ? data.to_id : data.from_id;
                                        if (!wxHeck.wxInit.wxData.msgList[pushId]) return;
                                        var content = typeof(data.content) == "object" ? JSON.stringify(data.content) : data.content;
                                        // 如果是卡片 且有留言
                                        if(data.cnt_type == 3000 && data.content.forward_text && data.content.forward_text != ""){
                                            wxHeck.pushMsg({
                                                pushId: pushId,
                                                isCC: isCC,
                                                msg: data.content.forward_text,
                                                pushType: "unshift",
                                                isGetHistory: true,
                                                time: data.time,
                                                name: data.name,
                                                c_remark: data.c_remark,
                                                source: data
                                            });
                                        }
                                        // 插入历史纪录
                                        wxHeck.pushMsg({
                                            pushId: pushId,
                                            isCC: isCC,
                                            msg: content,
                                            pushType: "unshift",
                                            isGetHistory: true,
                                            time: data.time,
                                            name: data.name,
                                            c_remark: data.c_remark,
                                            cnt_type: data.cnt_type,
                                            source: data
                                        });
                                    })(ele);
                                });
                            }
                            (typeof configs.cb == "function") && configs.cb();
                        },
                        complete: function () {
                            that.historyMsg.isLoading = false;
                        }
                    });
                },
                getChatPar: function (data) {
                    var that = this;
                    var selectList = data.selectList;
                    if (selectList.length == 1) {
                        // 如果是单聊
                        var userId = selectList[0];
                        wxHeck.toTop(userId);
                        that.changeUser(userId);
                        // 滚动到顶部
                        wxHeck.userBoxTop();
                    } else {
                        // 建群
                        wxHeck.sendMsg({
                            "id": localInfo.id,
                            "action": "create_group",
                            "type": "web",
                            "wxids": selectList.join(",")
                        });
                    }
                    // 关闭选择框
                    this.$broadcast("userSelClose");
                },
                //群添加成员
                add_group_memPar: function (data) {
                    var that = this;
                    var selectList = data.selectList;
                    //群成员重复处理
                    // var groupList = this.wxData.groupUserLists[this.wxData.curUserId];
                    // console.log(selectList);
                    // console.log(groupList);
                    // return;
                    // 群聊加人
                    wxHeck.sendMsg({
                        "id": localInfo.id,
                        "action": "add_group_mem",
                        "type": "web",
                        "to_id": that.wxData.curUserId,
                        "to_type": "ios",
                        "wxids": selectList.join(",")
                    });
                    // 关闭选择框
                    this.$broadcast("userSelClose");
                },
                addUsersPar: function (data) {
                    var that = this;
                    var selectList = data.selectList;
                    // 群聊加人
                    wxHeck.sendMsg({
                        "id": localInfo.id,
                        // "action": "add_users",
                        "action": "add_group_mem",
                        "type": "web",
                        "to_id": that.wxData.curUserId,
                        "to_type": "ios",
                        "wxids": selectList.join(",")
                    });
                    // 关闭选择框
                    this.$broadcast("userSelClose");
                },
                // 群发
                getGroupPar: function (data) {
                    var that = this;
                    var selectList = data.selectList;
                    var inputMsg = data.inputMsg;
                    // 操作Pending
                    this.$broadcast("userSelPending", "正在群发中...");
                    wxHeck.getData({
                        url: "/WechatMessage/ajaxMassMessage",
                        data: {
                            "id": localInfo.id,
                            "wechat_id": localInfo.wechat_id,
                            "action": "group_chat",
                            "type": "web",
                            "to_type": "ios",
                            "u_ids": selectList.join(","),
                            "content": inputMsg
                        },
                        success: function (r) {
                            if (r.status != 10000) alert(r.message);
                            else alert("群发成功"), that.$broadcast("userSelClose");
                            that.$broadcast("userSelPendingDefault");
                        }
                    });
                },
                hideContentTip: function () {
                    this.contentTips.show = false;
                },
                //打电话
                handCall: function () {
                    wxHeck.getData({
                        url: "/Call/handCall",
                        data: {
                            "user_id":this.wxData.msgList[this.wxData.curUserId].crmInfo.user_id,
                            "wechat_id": localInfo.wechat_id
                        },
                        success: function (r) {
                            if (r.status != 10000) alert(r.message);
                            else _alert("拨打成功！");
                        }
                    });
                },
                //发送课程链接
                sendClassLink: function(){
                    var course_id = '';
                    if(wxHeck.wxInit.wxData.msgList[wxHeck.wxInit.wxData.curUserId].crmInfo.recent.course_id){
                        course_id = wxHeck.wxInit.wxData.msgList[wxHeck.wxInit.wxData.curUserId].crmInfo.recent.course_id
                    }
                    this.$broadcast("sendLinkLayer",{
                        id : wxHeck.wxInit.wxData.curUserId,
                        course_id: course_id
                    });
                },
                //展示自动发送层
                setAutoSend: function () {
                    var that = this;
                    wxHeck.getData({
                        url: "/UserContact/getRemindSwitch",
                        data: {
                            "uid": that.wxData.msgList[that.wxData.curUserId].crmInfo.user_id,
                            "admin_id": localInfo.admin_id
                        },
                        success: function (r) {
                            if (r.status != 10000) _alert(r.message);
                            that.$broadcast("setTimeAjax", r.message, that.wxData.msgList[that.wxData.curUserId].crmInfo.user_id)
                        }
                    });
                    this.$broadcast("showAutoLayer");
                },
                //分享文章&朋友圈相关
                shareMenu: function (x,y,z) {
                    switch (y){
                        // 分享文章
                        case 'article':
                            this.shareArticle.dig = this.shareArticle.videoUrl = "";
                            this.shareArticle.show = true;
                            this.shareArticle.title = x.title;
                            this.shareArticle.desc = x.desc;
                            this.shareArticle.icon = x.thumbUrl;
                            this.shareArticle.urlStr = x.urlStr;
                            break;
                        // 粉线视频
                        case 'video':
                            var wechat_version = this.wxData.wechat_version;
                            if(x.size > 1048576 && wechat_version <= '6.3.23') return _alert("该视频超出分享限制,大小不能超过1M");
                            this.shareArticle.dig =  this.shareArticle.title = this.shareArticle.desc = this.shareArticle.icon =  this.shareArticle.urlStr = "";
                            this.shareArticle.show = true;
                            this.shareArticle.videoUrl = x.url;
                            break;
                        // 转发个人
                        case 'single':
                            this.parentSend = true;
                            this.showShare = '';
                            this.getChat('getGroupChat', '0');
                            this.temShareMsg = x;
                            break;
                        // 转发给群
                        case 'group':
                            this.parentSend = true;
                            this.showShare = '';
                            this.getChat('getGroupChat', '1');
                            this.temShareMsg = x;
                            break;
                        // 转发视频
                        case 'videoSend':
                            this.parentSend = true;
                            this.showShare = '';
                            this.getChat('getGroupChat', z == 'single' ? '0' : '1');
                            this.temShareMsg = {
                                desc : "",
                                // 封面
                                thumbUrl : "http://useoss.51talk.com/images/5C84hnaJsdmJpzadXiiW.jpg",
                                title : "视频分享",
                                urlStr : x.url.replace(/^http:.+com/, "http://useoss.51talk.com")
                            };
                            break;
                        default:
                            break;
                    }
                },
                shareArticleBtn : function () {
                    // if(this.shareArticle.dig=='') return _alert("请输入一句话！");
                    var that = this;
                    // alert("坐等后端提供接口参数")
                    wxHeck.getData({
                        url: "/CircleFriend/publishShareArticle",
                        data: {
                            "title": that.shareArticle.title,
                            "introduction": that.shareArticle.desc,
                            "icon": that.shareArticle.icon,
                            "link": that.shareArticle.urlStr || that.shareArticle.videoUrl ,
                            "shareword" : that.shareArticle.dig
                        },
                        success: function (r) {
                            if (r.status != 10000)  _alert(r.message);
                            _alert(r.message);
                            that.shareArticle.show = false;
                        }
                    });
                },
                hideShareBtn : function () {
                    this.shareArticle.show = false;
                },
                //邀请进群相关
                inviteGroupMem:function(x){
                    var that = this;
                    _confirm('确定接受邀请进群吗？',function(){
                        console.log(x,that.wxData.curUserId);
                        msgObj = {
                            "id": localInfo.id,
                            "action": "invite_group_mem",
                            "type": "web",
                            "to_type": "ios",
                            "u_id": that.wxData.curUserId.split("$")[1],
                            "localMsgId":x
                        }
                        wxHeck.sendMsg(msgObj);
                    });

                },
                //被删除，申请添加好友
                addDelFriend: function(){
                    this.addDelFriendInfo.nameTitle = wxHeck.checkUserType('','');
                    this.addDelFriendInfo.show = true;
                },
                //删除后申请添加好友
                sendAddFriendBtn :function(){
                    msgObj = {
                        "id": localInfo.id,
                        "action": "add_friend",
                        "type": "web",
                        // "to_id": this.wxData.curUserId,
                        "to_type": "ios",
                        "wxid": this.wxData.curUserId.split("$")[1],
                        "verify_msg":this.addDelFriendInfo.msg,
                        "user_id": '',
                        "mobile": '',
                        "remark": '',
                        "cnt_type":400
                    }
                    wxHeck.sendMsg(msgObj);
                },
                //隐藏删除添加好友层
                hideSendfriendBtn:function(){
                    this.addDelFriendInfo.show = false;
                },
                //个人信息弹层开始
                showPersonalMask: function(){
                    wxHeck.sendMsg({
                        "action": "user_info",
                        "type": "web",
                        "id": localInfo.id,
                        "to_type": "ios"
                    });
                    this.personalInfo.personalMask = true;
                },
                hidePersonalMask:function(){
                    this.personalInfo.personalMask = false;
                    this.personalInfo.id = this.personalInfo.qrcode_url = this.personalInfo.nick = '';
                },
                copyImgOk: function(){
                    this.personalInfo.copyWechatImg = false;
                },
                showCopyBtn: function(){
                    this.personalInfo.copyImgBtn = true;
                },
                hideCopyBtn:function(){
                    this.personalInfo.copyImgBtn = false;
                },
                copyImgBtn:function(){
                },
                copyWechatText:function(){
                },
                //个人信息弹层功能结束
                //设置群为班级群Start
                setGroupToClass: function(arg){
                    if(arg == 'bind'){
                        this.classGroupInfo.show = true;
                    }else{
                        var that = this;
                        wxHeck.getData({
                            url: "/UserWorkGroup/cancelBound",
                            data: {
                                group_id:that.wxData.curUserId.split("$")[1].split("@")[0]
                            },
                            success: function (data) {
                                if (data.status != 10000) return _alert(data.message);
                                _alert(data.message);
                                that.classGroupInfo.bindBtn = true;
                            }
                        });
                    }
                },
                confirmClassGroup: function(arg){
                    if(arg == 'yes'){
                        var that = this;
                        wxHeck.getData({
                            url: "/UserWorkGroup/boundWorkClass",
                            data: {
                                wechat_id: localInfo.wechat_id,
                                group_id:that.wxData.curUserId.split("$")[1].split("@")[0]
                            },
                            success: function (data) {
                                if (data.status != 10000) return _alert(data.message);
                                _alert(data.message);
                            }
                        });
                        this.classGroupInfo.show = false;
                        this.classGroupInfo.bindBtn = false;
                    }else{
                        this.classGroupInfo.show = false;
                    }
                },
                //设置群为班级群End
                //右上角绑定信息收缩 start
                showInfoFn:function(arg){
                    //console.log(arg);
                    switch(arg){
                        case 'recent':
                            this.showInfo.recent = !this.showInfo.recent;
                            //console.log(arg,this.showInfo.recent);
                            break;
                        case 'last':
                            this.showInfo.last = !this.showInfo.last;
                            break;
                        default:
                    }
                },
                //右上角绑定信息收缩 end

                // 查询老师缺席
                checkTea : function(wechatId, msgList){
                    var crmInfo = msgList.crmInfo;
                    if(!crmInfo) _alert("该学员未被绑定！");

                    wxHeck.getData({
                        url : "/Ifttt/AbsenceJudgment",
                        data : {
                            user_id : crmInfo.user_id,
                            wechat_id : wechatId
                        },
                        success : function(r){
                            if(r.status != 10000) return _alert(r.message);
                        }
                    });
                },
                initHiddenNoRead: function(){
                    $(document).on("visibilitychange", function(){
                        if(document.hidden) return;
                        var wxData = this.wxData;
                        var curUserId = wxData.curUserId;
                        // 如果没有当前user
                        if(!curUserId) return;
                        var noRead = wxData.msgList[curUserId].noRead;
                        // 如果当前user没有未读消息
                        if(noRead == 0) return;
                        var content_message = $(".content_message")[0];
                        // 如果没有对话框
                        if (!content_message) return;
                        // 如果没有滚动条
                        var isNoScroll = content_message.clientHeight == content_message.scrollHeight;
                        if(!isNoScroll) return;
                        wxData.msgList[curUserId].noRead = 0;
                        this.noReadAll -= noRead;
                        // 发送确认消息
                        wxHeck.sendMsg({
                            "action": "chat_ok",
                            "id": localInfo.id,
                            "type": "web",
                            "to_id": curUserId
                        });
                    }.bind(this));
                }
            },
            events: {
                changeLabel: function (data) {
                    var labelFn = wxHeck.labelFn;
                    // 当前操作的标签 包含非黑鸟标签
                    var labelAll = this.wxData.msgList[data.wechatId].userInfo.label;
                    // 当前修改标签操作后 生成的标签id列表 并且转成实际文字标签列表
                    var labelData = $.map(data.labelData, function(ele, index){
                        return labelFn.idMap[ele].tag_name;
                    });

                    if(labelAll == ""){
                        // 如果标签原来为空 直接为文字标签列表
                        labelAll = labelData;
                    }else{
                        // 如果标签不为空
                        // 先滤掉原来的黑鸟标签
                        labelAll = labelAll.split(",");
                        labelAll = $.map(labelAll, function(ele, index){
                            if(!(ele in labelFn.nameMap)) return ele;
                        });
                        // 为滤掉黑鸟标签后的 + 修改标签操作后黑鸟标签列表
                        labelAll = labelAll.concat(labelData);

                    }
                    // 发送标签
                    wxHeck.sendMsg({
                        "action": "modify_label",
                        "u_id": data.wechatId,
                        "id": localInfo.id,
                        "type": "web",
                        "labels": labelAll.join(",")
                    });
                    return;
                },
                //重新获取我的学员数据
                reGetMyStudy:function(){
                  this.myStudy();
                },
                getSelList: function (data) {
                    this.setGroupChat.list = data;
                },
                getAt: function (name, id, content) {
                    if ($.inArray(id, this.at_id) == -1) {
                        this.at_id.push(id);//@人的微信id临时存储
                    }
                    this.wxData.msgList[this.wxData.curUserId].msgContent += " @" + name + " ";
                    if (!!content) this.wxData.msgList[this.wxData.curUserId].msgContent += content;
                },
                oneChat: function (id) {
                    //验证是否好友
                    var msgObj = {
                        "id": localInfo.id,
                        "action": "is_myfriend",
                        "type": "web",
                        "to_type": "ios",
                        "wxid": id
                    }
                    wxHeck.sendMsg(msgObj);
                },
                groupListUserDelete: function (groupUserInfo) {
                    var userCurrent = groupUserInfo.groupUserWechat_id.split("$");
                    console.log(userCurrent)
                    if (userCurrent[0] == userCurrent[1]) {//groupUserInfo.groupUserWechat_id == localInfo.id
                        _alert("不能踢出自己");
                        return;
                    } else {
                        var groupId = this.wxData.curUserId.split("$")[1];
                        _confirm("将群成员【" + groupUserInfo.groupUserWechat_nick + "】删除？", function () {
                            wxHeck.sendMsg({
                                "action": "del_group_mem",
                                "u_id": groupId,
                                "type": "web",
                                "wxids": groupUserInfo.groupUserWechat_id,
                                id: localInfo.id
                            });
                        });
                    }
                },
                getSelData: function (data) {
                    this.$broadcast("setSelData", data);
                },
                setListType: function (x) {
                    this.userListType = x;
                },
                userLogoutTrust: function (id) {
                    wxHeck.getData({
                        url: "/AdminContact/saveSelfWechat",
                        data: {
                            wechat_id: id,
                            admin_id: localInfo.id
                        },
                        success: function (data) {
                            if (data.status != 10000) return alert(r.message);
                            // if(!window.confirm("确认退出并托管？")) return;
                            wxHeck.sendMsg({
                                "action": "chat_trust_set",
                                "id": localInfo.id,
                                "type": "web",
                                "trust_id": id
                            });
                        }
                    })
                },
                // 发送粘贴图片
                getSendPaste: function (data) {
                    var that = this,
                        imgSrc = data.imgSrc;
                    wxHeck.getData({
                        url: "/UploadFile/screenImg",
                        data: {
                            file_base64: imgSrc,
                            admin_id: localInfo.admin_id,
                            wechat_id: localInfo.wechat_id
                        },
                        success: function (r) {
                            if (r.status == 10000) {
                                // 上传成功
                                // 消息体
                                var msgObj = {
                                    action: "chat",
                                    id: localInfo.id,
                                    type: "web",
                                    to_id: that.wxData.curUserId,
                                    to_type: "ios",
                                    content: r.message,
                                    // 图片发送cnt_type 为1
                                    cnt_type: 1
                                }
                                // 如果是群发到群
                                if (that.setGroupChat.flag) {
                                    that.sendGroupChat(msgObj);
                                    that.$broadcast("hideSendPaste");
                                    return;
                                }
                                // 在页面上放置图片
                                wxHeck.pushMsg({
                                    pushId: that.wxData.curUserId,
                                    isCC: true,
                                    msg: [imgSrc, r.message],
                                    time: (new Date).getTime(),
                                    cnt_type: 9999
                                });
                                // 发送消息
                                wxHeck.sendMsg(msgObj);
                                // 关闭发送
                                that.$broadcast("hideSendPaste");
                            } else {
                                alert("上传失败请重试！");
                                that.$broadcast("enableSendPaste");
                            }
                        },
                        error: function () {
                            alert("网络错误请重试！");
                            that.$broadcast("enableSendPaste");
                        }
                    });
                },
                // 添加好友第一步
                addFriendNextCb: function (data) {
                    var msgObj = {
                        "id": localInfo.id,
                        "action": "find_contact_keywd",
                        "type": "web",
                        "to_type": "ios",
                        "keyword": data.keyword
                    }
                    wxHeck.sendMsg(msgObj);
                },
                // 添加好友
                addFriendCb: function (data) {
                    var actionConfig = {
                            "0": "add_friend",
                            "1": "add_card_friend"
                        },
                        msgObj = {
                            "id": localInfo.id,
                            "action": actionConfig[data.type],
                            "type": "web",
                            // "to_id": this.wxData.curUserId,
                            "to_type": "ios",
                            "wxid": data.wxid,
                            "verify_msg": data.verify_msg,
                            "user_id": data.user_id,
                            "mobile": data.mobile,
                            "remark": data.remark
                        }
                    wxHeck.sendMsg(msgObj);

                    //记录当前学员添加者信息
                    wxHeck.getData({
                        url:'/WechatUserInfo/addUserInfo',
                        data:{
                            // crmid
                            stu_id :data.user_id,
                            // 搜素微信用关键词 手机号 or 微信id
                            wechat_id:data.wxid,
                            // crm手机号
                            mobile: data.mobile
                        },
                        success:function(data){
                            console.log("记录当前学员添加者信息OK")
                        },
                        error : function(){}
                    });
                },
                //添加学员好友
                addListFriend: function (crmMobile, crmId, addType, trialStatus) {
                    this.$broadcast("showAddFriend", {
                        type: 0,
                        acc: crmMobile,
                        crmMobile : crmMobile,
                        crmId: crmId,
                        addType : addType,
                        trialStatus: trialStatus
                    });
                },
                // 发送表情
                getFace: function (data) {
                    if (data.type == 0) {
                        var getTextPos = wxHeck.getTextPos();
                        if (!getTextPos) return;
                        var con = data.con,
                            startPos = getTextPos.startPos,
                            endPos = getTextPos.endPos,
                            cursorPos = startPos,
                            msgContent = this.wxData.msgList[this.wxData.curUserId].msgContent,
                            newMsgContent = msgContent.slice(0, startPos) + con + msgContent.slice(endPos);
                        this.wxData.msgList[this.wxData.curUserId].msgContent = newMsgContent;
                        this.$nextTick(function () {
                            getTextPos.setPos(cursorPos + con.length);
                        });
                    }
                },
                // 更新个人信息
                infoUpdateCb: function (data) {
                    $.extend(this.wxData.localInfo, data);
                    this.$broadcast("hideUpdate");
                },
                // 联系人搜索
                getSearch: function (userId) {
                    wxHeck.toTop(userId);
                    this.changeUser(userId);
                    // 滚动到顶部
                    wxHeck.userBoxTop();
                },
                // 知识库
                getQuickCon: function (data) {
                    // var data = "#nickName# 123 #Relationship# 456 #studENtname# #123#";
                    var that = this,
                        conRegArr = wxHeck.Util.conRegArr,
                        replaceRule = {},
                        wxData = that.wxData,
                        crmInfo = wxData.msgList[wxHeck.wxInit.wxData.curUserId].crmInfo,
                        replaceData = [
                            // cc英文名
                            wxData.localInfo.nick_name,
                            // 关系 4为本人 替换为""
                            crmInfo.member ? (crmInfo.selectMember == 4 ? "" : crmInfo.member[crmInfo.selectMember]) : crmInfo.member,
                            // 孩子英文名
                            crmInfo.nick_name
                        ],
                        _data = data.replace(/{[^{}]*}/, "");
                    $.map(conRegArr, function (ele, index) {
                        replaceRule[ele] = replaceData[index];
                    });
                    that.wxData.msgList[this.wxData.curUserId].msgContent = wxHeck.Util.conFilter(_data, replaceRule);
                },
                // 联系人搜索返回
                userSelSure: function (data) {
                    var that = this;
                    if(data.openType == "getGroup"){
                        _confirm("黑鸟不会限制群发，但频繁群发会被微信限制，而且学员也不喜欢经常收到和营销相关的内容，你是否要急需群发？", function () {
                            // 触发事件
                            that[data.openType + "Par"](data.returnData);
                        });
                    }else{
                        that[data.openType + "Par"](data.returnData);
                    }
                },
                // 修改群名字
                editNameSure: function (data) {
                    console.log(data);
                    // return;
                    this.$broadcast("editNameClose");
                    // return console.log(data);
                    if(data.nickInfo == 'nicker'){
                        wxHeck.sendMsg({
                            "id": localInfo.id,
                            "action": "modify_self_groupname",
                            "type": "web",
                            "u_id": this.wxData.curUserId.split("$")[1],
                            "to_type": "ios",
                            "displayname": data.editValue
                        });
                    }else{
                        wxHeck.sendMsg({
                            "id": localInfo.id,
                            "action": data.isGroup ? "modify_name" : "modify_remark",
                            "type": "web",
                            "to_id": this.wxData.curUserId,
                            "to_type": "ios",
                            "new_name": data.editValue
                        });
                    }
                    // wxHeck.sendMsg({
                    //     "id": localInfo.id,
                    //     "action": data.isGroup ? "modify_name" : "modify_remark",
                    //     "type": "web",
                    //     "to_id": this.wxData.curUserId,
                    //     "to_type": "ios",
                    //     "new_name": data.editValue
                    // });
                },
                //我的学员备注
                crmRemarkTableOpen : function (id) {
                    this.$broadcast("crmRemarkOpen", {
                        user_id: id
                    });
                },
                //我的学员打电话
                callTelpnone:function (id,pnone) {
                    wxHeck.getData({
                        url: "/Call/handCall/",
                        data: {
                            "user_id":id,
                            "wechat_id": localInfo.wechat_id
                        },
                        success: function (r) {
                            if (r.status != 10000) alert(r.message);
                            else _alert("拨打成功！");
                        }
                    });
                },
                //跟我的学员聊天
                studyChat:function (id) {
                    wxHeck.toTop(localInfo.wechat_id+ "$" + id);
                    this.changeUser(localInfo.wechat_id+ "$" + id);
                    wxHeck.userBoxTop();
                },
                changePage:function (page) {
                    this.$broadcast("pageOK",page);
                }
                //原来
                // studyChat: function (id) {
                //     wxHeck.toTop(id);
                //     this.changeUser(id);
                //     wxHeck.userBoxTop();
                // }
            },
            //监控是否有新消息并设置滚动标题
            watch: {
                userListType : function (value) {
                    var that = this;
                    if(value != "todayFocus") return;
                    // 今日关注
                    wxHeck.getData({
                        url: "/UserContact/getFollowUserDate",
                        success: function (r) {
                            if (r.status != 10000)  return false;
                            var userLength = r.message.length;
                            var result = [];
                            for(var i = 0; i < userLength; i++){
                                result.push(localInfo.wechat_id+ "$" +r.message[i].wechat_id);
                            }
                            that.todayFocusUser = result;
                        }
                    });
                },
                noReadAll: function (value) {
                    if (value > 0) {
                        wxHeck.flashTitleFn.set("您有新的消息！");
                    } else {
                        wxHeck.flashTitleFn.reset();
                    }
                }
            },
            created : function(){
                this.initHiddenNoRead();
                this.initUpateNew();
            },
            ready : function () {
                new LiveMsger(wxHeck.connArgs).connect();

                // var that = this;
                // //获取用户列表
                // wxHeck.getData({
                //     url : wxHeck.PROJECT_DOMAIN + "/kunpeng/staff/studentlist",
                //     data : {
                //         page : page,
                //         aid : page
                //     },
                //     success : function (data) {
                //         // if(data.status != 10000) return alert(data.message);
                //         that.wxData.setMsgList(data.hasWeixinList);
                //     }
                // });
            }
        });
        // ;
        // (function () {
        //     // 是否登上过
        //     wxHeck.entered = false;
        //     wxHeck.wb = (function () {
        //         return root.WebSocket || root.MozWebSocket;
        //     })();
        //     if (!wxHeck.wb) return;
        //     wxHeck.sendMsg = function (msg) {
        //
        //         // 如果是小助手 修改消息体
        //         if(wxHeck.isHelper()){
        //             var helperConfig = {};
        //
        //             switch(msg.action){
        //                 // 如果为chat
        //                 case "chat":
        //                 helperConfig = {
        //                     to_type : "helper",
        //                     name : localInfo.admin_name,
        //                     helper_fg : "1"
        //                 }
        //                 break;
        //
        //                 // 如果是chat_ok
        //                 /*case "chat_ok":
        //                 helperConfig = {
        //                     helper_fg : "1"
        //                 }
        //                 break;
        //                 */
        //
        //                 default: break;
        //             }
        //
        //             $.extend(msg, helperConfig);
        //         }
        //
        //         if (wxHeck.wb.OPEN == wxHeck.socket.readyState) {
        //             wxHeck.socket.send(JSON.stringify(msg));
        //         } else {
        //             console.log("The socket is not open.");
        //         }
        //     }
        //     // socket message 处理
        //     wxHeck.msgHandler = new function () {
        //         var that = this;
        //         // 心跳
        //         that.heartbeat = function (data) {
        //             wxHeck.heartbeat = 0;
        //         }
        //         // 登入成功
        //         that.enter = function (data) {
        //             // enter时间
        //             wxHeck.enterTime = data.time || (new Date).getTime();
        //             // 关闭net err
        //             wxHeck.wxInit.$broadcast("setErrors", {
        //                 netErr: false,
        //                 iscc : wxHeck.isCC(),
        //                 isss : wxHeck.isSS()
        //             });
        //             // 心跳计数器
        //             wxHeck.heartbeat = 0;
        //             // 心跳
        //             clearInterval(wxHeck.interVal);
        //             wxHeck.interVal = window.setInterval(function () {
        //                 // 心跳超时
        //                 if (wxHeck.heartbeat >= 3) {
        //                     // 弹出net err
        //                     wxHeck.wxInit.$broadcast("setErrors", {
        //                         netErr: true,
        //                         iscc : wxHeck.isCC(),
        //                         isss : wxHeck.isSS()
        //                     });
        //                     // 关闭
        //                     wxHeck.socket.close();
        //                     // 重连
        //                     // 取消重连
        //                     /*
        //                      if (window.location.hostname.indexOf("local") > -1) {
        //                      // 如果是本地环境
        //                      wxHeck.args.callee();
        //                      } else {
        //                      // 线上
        //                      wxHeck.getData({
        //                      url: "/AdminContact/sendHeardContact",
        //                      data: {
        //                      admin_id: localInfo.admin_id,
        //                      wechat_id: localInfo.wechat_id,
        //                      admin_name: localInfo.admin_name
        //                      },
        //                      success: function (r) {
        //                      if (r.status == 10000) {
        //                      localInfo.ws_host = r.message.ws_host;
        //                      localInfo.v_code = r.message.v_code;
        //                      wxHeck.args.callee();
        //                      }
        //                      }
        //                      });
        //                      }
        //                      */
        //                 } else {
        //                     wxHeck.sendMsg({
        //                         "action": "heartbeat",
        //                         "id": localInfo.id,
        //                         "type": "web"
        //                     });
        //                     wxHeck.heartbeat++;
        //                 }
        //             }, 5000);
        //         }
        //         // 设备在线
        //         that.ios_online = function () {
        //             wxHeck.wxInit.$broadcast("setErrors", {
        //                 phoneErr: false,
        //                 iscc : wxHeck.isCC(),
        //                 isss : wxHeck.isSS()
        //             });
        //             // 获取列表
        //             wxHeck.getUserList();
        //         }
        //         // 设备下线
        //         that.ios_offline = function () {
        //             wxHeck.wxInit.$broadcast("setErrors", {
        //                 phoneErr: true,
        //                 iscc : wxHeck.isCC(),
        //                 isss : wxHeck.isSS()
        //             });
        //         }
        //         // 添加好友调用第二步
        //         that.find_contact_keywd = function (data) {
        //             wxHeck.wxInit.$broadcast("addFriendToNext", data);
        //         }
        //         // 添加好友
        //         that.add_friend = that.add_card_friend = function (data) {
        //             // 1。添加成功 2。在好友列表里面
        //             // if(data.flag == "0"){
        //             // //    添加成功
        //             // }else{
        //             //     // 绑定
        //             // }
        //             //alert("发送添加好友请求成功，可能需要对方验证您的身份后才可添加成功，请耐心等待！");
        //             // 调用后端添加好友计数接口
        //             wxHeck.getData({
        //                 url : "/UserContact/addFriendAndRmark",
        //                 data : {
        //                     admin_id : localInfo.id,
        //                     user_id : wxHeck.wxInit.$refs.addfriend.crmId
        //                 },
        //                 success : function(){
        //                     //判断添加来源是否为正常添加
        //                     if(!wxHeck.wxInit.$refs.addfriend.addType) return;
        //                     // 刷新我的学员
        //                     wxHeck.wxInit.$broadcast("studySearch");
        //                 },
        //                 error : function(){}
        //             });
        //             // 关闭添加弹窗
        //             wxHeck.wxInit.$broadcast("hideAddFriend");
        //             wxHeck.wxInit.$root.$data.addDelFriendInfo.show = false;
        //
        //         }
        //         //删除好友
        //         that.remove_users = function (data) {
        //             var index = $.inArray(data.wxid, wxHeck.dataSource.userList);
        //             var _index = index == wxHeck.dataSource.userList.length - 1 ? index - 1 : index + 1;
        //             var _curId = wxHeck.dataSource.userList[_index];
        //             wxHeck.dataSource.userList.$remove(data.wxid);
        //             wxHeck.dataSource.userListPerson.$remove(data.wxid);
        //             wxHeck.wxInit.changeUser(_curId);
        //             _alert("删除成功！");
        //         }
        //         //设置群成员列表
        //         that.group_user_list = function (data) {
        //             Vue.set(wxHeck.dataSource.groupUserLists, data.from_id, data.list);
        //         }
        //         //是否是群主返回
        //         that.group_ownner_id = function (data) {
        //             wxHeck.dataSource.groupFromId = data.from_id;
        //             wxHeck.dataSource.groupOwnner = data.owner_id;
        //         }
        //         //添加群成员
        //         that.add_group_mem = function (data) {
        //             $.map(data.infoList,function(ele,index){
        //                 wxHeck.dataSource.groupUserLists[data.from_id].push(ele);
        //             })
        //             //wxHeck.dataSource.groupUserLists[data.from_id].push(data.infoList[0]);
        //         }
        //         //删除群列表成员
        //         that.del_group_mem = function (data) {
        //             wxHeck.wxInit.$broadcast("delGroupListUser", data);
        //         }
        //         // 展示个人作业标识
        //         that.is_contact_in_grouparray = function(data){
        //             var isShowHW = data.result;
        //             var id = wxHeck.getFullId(data.groupdata.id);
        //             wxHeck.wxInit.wxData.msgList[id].showHW = isShowHW;
        //         }
        //         // 增加成员 群
        //         that.add_helper = that.user_list = that.add_users_res = function (data) {
        //             // ttflag
        //             /*var config = ["新购买", "快到期", "已过期", "断课"];
        //              for(var i=0;i<1500;i++){
        //              wxHeck.dataSource.userList.push(i);
        //              var index = i%4;
        //              Vue.set(wxHeck.dataSource.msgList, i, {
        //              userInfo : {
        //              label : config[index],
        //              nick : "test" + index
        //              }
        //              });
        //              }
        //              wxHeck.wxInit.userProgress.isFirst = false;
        //              return;*/
        //             ;
        //             (function () {
        //                 // 如果是在群列表中增加人
        //                 if (data.action_type == 10000) return;
        //                 var isaddUsers = data.action == "add_users_res";
        //                 var isuserList = data.action == "user_list";
        //                 var isHelper = data.action == "add_helper";
        //                 // 更新消息列表 当前只有增加消息列表成员 不会删除消息列表成员
        //                 ;
        //                 (function (dataList, msgList) {
        //                     $.map(dataList, function (ele, index) {
        //                         var userid = ele.id;
        //                         var time = ele.time;
        //
        //                         //如果是屏蔽的群
        //                         var mute_session = ele.mute_session;
        //                         if(mute_session){
        //                             wxHeck.dataSource.muteList.push(userid);
        //                         }
        //
        //                         // 如果time存在 且 time > 0 则首次加载有未读消息
        //                         var isNoRead = (!!time && time > 0),
        //                             noReadCount = ele.num;
        //                         // 是否是群
        //                         var isGroup = ele.c_type == 1;
        //                         // 是否是公众号
        //                         var isGZ = ele.c_type == 2;
        //                         // 如果列表中已有此id
        //                         if (userid in msgList) return true;
        //                         // 更新noReadAll20170515
        //                         if (isNoRead && !mute_session) {
        //                             wxHeck.wxInit.noReadAll += noReadCount;
        //                         }
        //                         if (!ele.label) ele.label = "";
        //                         ele.labelOpen = false;
        //                         // 先增量更新消息跟数据列表
        //                         Vue.set(msgList, userid, {
        //                             // 是否显示达拉斯作业
        //                             showHW : 999,
        //                             at_fg: 0,
        //                             atshow: false,
        //                             // 微信个人信息
        //                             userInfo: ele,
        //                             // 消息列表
        //                             userMsg: [],
        //                             // 未读
        //                             noRead: (isNoRead ? noReadCount : 0),
        //                             // 最后一条消息
        //                             lastMsg: "",
        //                             // 输入消息
        //                             msgContent: "",
        //                             // crm信息
        //                             crmInfo: {
        //                                 isGet: false
        //                             },
        //                             historyMsg: {
        //                                 // 是否拉取完所有的历史纪录
        //                                 isGetAll: false,
        //                                 // score
        //                                 score: wxHeck.enterTime
        //                             },
        //                             // 未读消息中的第一条的时间戳
        //                             time: time,
        //                             // 是否是群
        //                             isGroup: isGroup,
        //                             // 是否置顶
        //                             isTop: false,
        //                             // 是否是群主
        //                             isGroupOwner : false
        //                         });
        //                         // 更新成员列表
        //                         // 如果是新加入的
        //                         if (isaddUsers) {
        //                             wxHeck.toTop(userid);
        //                             // wxHeck.wxInit.changeUser(userid);
        //                             wxHeck.userBoxTop();
        //                         } else {
        //                             //如果是屏蔽消息直接塞入消息
        //                             var arrStr = (!isNoRead || ele.mute_session) ? "push" : "unshift";
        //                             // 第一次全量更新列表 如果有未读消息的 置顶
        //                             wxHeck.dataSource.userList[arrStr](userid);
        //                             // 暂时不用进度百分比
        //                             // if(wxHeck.wxInit.userProgress.isFirst) wxHeck.wxInit.userProgress.progress = Math.round(wxHeck.dataSource.userList.length / dataList.length) * 100;
        //                         }
        //                         // 如果不是小助手 也不是公众号 更新群发用列表
        //                         if(!isHelper && !isGZ){
        //                             wxHeck.dataSource[isGroup ? "userListGroup" : "userListPerson"].push(userid);
        //                         }
        //                     });
        //                     // 遍历完成 将初次加载置为false
        //                     if(wxHeck.wxInit.userProgress.isFirst) wxHeck.wxInit.userProgress.isFirst = false;
        //                     wxHeck.wxInit.$nextTick(function(){
        //                         wxHeck.userBox = $(".user_lists").wxScroll();
        //                     });
        //                 })(data.list, wxHeck.dataSource.msgList);
        //                 // 如果是user_list 获取置顶
        //                 if (isuserList) {
        //                     wxHeck.sendMsg({
        //                         "action": "top_session_list",
        //                         "id": localInfo.id,
        //                         "type": "web"
        //                     });
        //
        //                     // if(!wxHeck.getHelper){
        //                     var wxData = wxHeck.wxInit.wxData;
        //                     var wxHelper = localInfo.wxHelper;
        //                     if(!wxHelper) wxHelper = localInfo.wxHelper = [];
        //                     //增加小助手列表
        //                     $.map(wxHelper, function(ele, index){
        //                         wxData.helpList.push(ele.id);
        //                     });
        //                     // 模拟新增好友的方式
        //                     // 增加微信小助手
        //                     that.add_helper({
        //                         action : "add_helper",
        //                         list : wxHelper
        //                     });
        //                 }
        //
        //                 if(isHelper){
        //                     // 如果是增加小助手
        //                     // 获取小助手的未读状态
        //                     wxHeck.sendMsg({
        //                         "action" : "chat_helper_msg_st",
        //                         "id": localInfo.id,
        //                         "type" : "web",
        //                         "to_ids" : wxHeck.wxInit.wxData.helpList.join(",")
        //                     });
        //                 }
        //             })();
        //         }
        //         // 获取小助手的未读信息
        //         that.chat_helper_msg_st = function(data){
        //             var list = data.list;
        //             if(list.length == 0) return;
        //             $.map(list, function(ele, index){
        //                 var msg = wxHeck.wxInit.wxData.msgList[ele.id];
        //                 if(!msg) return;
        //                 msg.noRead = ele.num;
        //                 msg.time = ele.time;
        //             });
        //         }
        //         // 修改群名字
        //         that.modify_name = function (data) {
        //             var from_id = data.from_id;
        //             wxHeck.dataSource.msgList[from_id].userInfo.nick = wxHeck.dataSource.msgList[from_id].userInfo.c_remark = data.new_name;
        //         }
        //         // 修改个人备注
        //         that.modify_remark = function (data) {
        //             var from_id = data.from_id;
        //             wxHeck.dataSource.msgList[from_id].userInfo.c_remark = data.c_remark;
        //             // 更新crm
        //             wxHeck.wxInit.getCrmInfo();
        //         }
        //         // 标签
        //         that.modify_label = function (data) {
        //             wxHeck.dataSource.msgList[data.from_id].userInfo.label = data.labels;
        //         }
        //         // 获取消息
        //         // 获取消息
        //         that.chat = function (data) {
        //             //@人消息
        //             if (data.cnt_type == 3100) {
        //                 var getAt_fg = JSON.parse(data.content);
        //                 var that = wxHeck.wxInit;
        //                 that.wxData.msgList[data.from_id].at_fg = parseInt(getAt_fg.at_fg);
        //                 that.wxData.msgList[data.from_id].atshow = true;
        //             }
        //             ;
        //             (function () {
        //                 // 如果是cc自己的消息
        //                 var isCC = data.from_id == localInfo.id;
        //                 var pushId = isCC ? data.to_id : data.from_id;
        //                 if (!wxHeck.wxInit.wxData.msgList[pushId]) return;
        //
        //                 // ifttt
        //                 ;(function(){
        //                     if(data.cnt_type != 0 || isCC) return;
        //                     var key = new RegExp("老师没来|老师缺席");
        //                     if(data.content.search(key) < 0) return;
        //                     wxHeck.getData({
        //                         url : "/Ifttt/sendCustMessage",
        //                         data : {
        //                             wechat_id : pushId,
        //                             admin_id : localInfo.id,
        //                             // 是否缺席
        //                             cust_type : '1'
        //                         },
        //                         success : function(){},
        //                         error : function(){}
        //                     });
        //                 })();
        //
        //                 // 满足未读+1的条件
        //                 // 滚动条是否在底部
        //                 var isnotDown = (function () {
        //                     var content_message = $(".content_message")[0];
        //                     if (!content_message) return false;
        //                     return content_message.scrollTop + content_message.clientHeight < content_message.scrollHeight;
        //                 })();
        //                 // 如果不是当前user 且不是cc自己发的
        //                 var flag1 = (wxHeck.wxInit.wxData.curUserId != pushId && !isCC);
        //                 // 如果是公告消息
        //                 var flag2 = (function(){
        //                     // 如果是公告消息
        //                     var isGG = data.cnt_type == 4000 || data.cnt_type == 5000;
        //                     // 如果是公告消息且不是当前user 或者 如果是公告消息是当前user但是不在底部
        //                     return (isGG && wxHeck.wxInit.wxData.curUserId != pushId) || (isGG && wxHeck.wxInit.wxData.curUserId == pushId && isnotDown);
        //                 })();
        //                 // 如果是当前user 且不是cc自己发的 且滚动条不在底部
        //                 var flag3 = wxHeck.wxInit.wxData.curUserId == pushId && !isCC && isnotDown;
        //                 // 如果是当前user 且当前页面未激活状态
        //                 var flag4 = wxHeck.wxInit.wxData.curUserId == pushId && document.hidden;
        //                 // 更新已读 未读
        //                 // 如果不是当前user 且不是cc自己发的
        //                 if (flag1 || flag2 || flag3 || flag4) {
        //                     //屏蔽ss，cst提醒
        //                     if (data.cnt_type == 5000 && (localInfo.admin_type == 'is' || localInfo.user_group == '2' || localInfo.user_group == '4' || localInfo.user_group == '6' || data.visible == 1)){
        //                         console.log('SS，CST消息不提醒！')
        //                     }else{
        //                         // 未读加1
        //                         wxHeck.wxInit.wxData.msgList[pushId].noRead++;
        //                         //不是屏蔽消息20170515
        //                         if(!wxHeck.wxInit.wxData.msgList[pushId].userInfo.mute_session){
        //                             // 更新noReadAll
        //                             wxHeck.wxInit.noReadAll++;
        //                         }
        //                     }
        //
        //                     // 置顶操作
        //                     // 利用当前接受消息用户的id对列表进行置顶操作
        //                     // 先删除 再从数组前端压入
        //                     wxHeck.toTop(pushId);
        //                 }
        //                 // 如果是当前user 且不是cc自己发的 且页面为激活状态
        //                 if (wxHeck.wxInit.wxData.curUserId == pushId && !isCC && !flag3 && !flag4) {
        //                     // 发送确认消息
        //                     wxHeck.sendMsg({
        //                         "action": "chat_ok",
        //                         "id": localInfo.id,
        //                         "type": "web",
        //                         "to_id": pushId
        //                     });
        //                 }
        //                 // 滚动条是否在底部
        //                 var isBottom = (function (msgBox) {
        //                     if (!msgBox) return false;
        //                     return msgBox[0].scrollTop == msgBox[0].scrollHeight - msgBox[0].clientHeight;
        //                 })(wxHeck.msgBox);
        //                 // 插入接收到的消息
        //                 wxHeck.pushMsg({
        //                     pushId: pushId,
        //                     isCC: isCC,
        //                     msg: data.content,
        //                     gotoBottom: isBottom,
        //                     time: data.time,
        //                     name: data.name,
        //                     c_remark: data.c_remark,
        //                     cnt_type: data.cnt_type,
        //                     source: data
        //                 });
        //             })();
        //         }
        //         //获取朋友圈评论数
        //         that.receive_wcmsg = function (data) {
        //             //推送的评论
        //             wxHeck.wxInit.wxData.comment = data.number;
        //         }
        //         //版本接收
        //         that.get_version = function (data) {
        //             wxHeck.dataSource.clientVersion = data.client_version;
        //             wxHeck.dataSource.cloudVersion = data.cloud_version;
        //             wxHeck.dataSource.wechat_version = data.wechat_version || "";
        //             //wxHeck.dataSource.dylib_version = data.dylib_version;
        //         }
        //         // 托管账号
        //         that.chat_trust_set = function () {
        //             _alert("托管成功！");
        //             wxHeck.Util.closeTab();
        //         }
        //         //验证群内是否为好友
        //         that.is_myfriend = function (data) {
        //             wxHeck.wxInit.isMyFriend(data);
        //         }
        //         // 新加好友数量
        //         that.hello_number = function (data) {
        //             wxHeck.wxInit.newFriCount = data.number;
        //         }
        //         // 新加好友列表
        //         that.hello_list = function (data) {
        //             wxHeck.wxInit.$broadcast("myFriendData", data.arr);
        //         }
        //         // 确认新加好友
        //         that.add_hello_friend = function (data) {
        //             wxHeck.wxInit.$broadcast("myFriendSure", data.encryptusername);
        //         }
        //         // 置顶列表
        //         that.top_session_list = function (data) {
        //             // setTimeout(function(){
        //             var _e = localInfo.wechat_id + "$";
        //             // 置顶列表
        //             var topList = $.map(data.list, function (ele, index) {
        //                 var _ele = _e + ele;
        //                 var removeEle = wxHeck.wxInit.wxData.userList.$remove(_ele);
        //                 if(removeEle) return _ele;
        //             });
        //             // 微信小助手列表
        //             var helpList = $.map(wxHeck.wxInit.wxData.helpList, function (ele, index) {
        //                 var removeEle = wxHeck.wxInit.wxData.userList.$remove(ele);
        //                 if(removeEle) return ele;
        //             });
        //             // 最终的用户列表
        //             var userList = helpList.concat(topList.concat(wxHeck.wxInit.wxData.userList));
        //             wxHeck.wxInit.wxData.userList = userList;
        //             wxHeck.wxInit.wxData.topList = topList;
        //             // }, 0);
        //         }
        //         //接收文件
        //         that.receive_file = function (data) {
        //             console.log(data);
        //         }
        //         //接收视频
        //         // that.receive_video = function (data) {
        //         //
        //         // }
        //         //接收个人信息
        //         that.user_info = function (data) {
        //             //console.log(data);
        //             wxHeck.wxInit.$root.$data.personalInfo.id = data.id == undefined ? '': data.id;
        //             wxHeck.wxInit.$root.$data.personalInfo.wechat_username = data.wechat_username == undefined ? '': data.wechat_username;
        //             wxHeck.wxInit.$root.$data.personalInfo.img = data.img == undefined ? '': data.img;
        //             wxHeck.wxInit.$root.$data.personalInfo.nick = data.nick == undefined ? '': data.nick;
        //             wxHeck.wxInit.$root.$data.personalInfo.qrcode_url = data.qrcode_url == undefined ? '': data.qrcode_url;
        //         }
        //
        //         //群主权利转让
        //         that.change_chatroom_owner = function(data){
        //             wxHeck.wxInit.$broadcast("changeOwnerOk")
        //         }
        //
        //         //屏蔽群消息
        //         that.mute_session = function(data){
        //             if(data.mute_session == 1){
        //                 _alert("屏蔽群消息设置成功");
        //                 wxHeck.dataSource.muteList.push(data.from_id);
        //             }else{
        //                 _alert("开启群消息成功");
        //                 wxHeck.dataSource.muteList.$remove(data.from_id);
        //             }
        //             wxHeck.wxInit.wxData.msgList[data.from_id].userInfo.mute_session = data.mute_session == 1;
        //         }
        //         //群置顶相关
        //         that.top_chat_session = function (data) {
        //         //
        //         //     var topList = wxHeck.wxInit.wxData.topList
        //         //     if(data.set_to_top == 1){
        //         //         //删除当前置顶的数据
        //         //         wxHeck.wxInit.wxData.userList.$remove(data.from_id);
        //         //         //将当前选取置顶的插入置顶列表
        //         //         topList.unshift(data.from_id);
        //         //     }else{
        //         //         topList.$remove(data.from_id);
        //         //         wxHeck.wxInit.wxData.userList.unshift(data.from_id);
        //         //     }
        //         //
        //         //     // 微信小助手列表
        //         //     //var helpList = wxHeck.wxInit.wxData.helpList;
        //         //     // 最终的用户列表
        //         //     var userList = topList.concat(wxHeck.wxInit.wxData.userList);
        //         //     wxHeck.wxInit.wxData.userList = userList;
        //         //     wxHeck.wxInit.wxData.topList = topList;
        //         //
        //         //
        //         //     // if(data.set_to_top == 1){
        //         //     //     var topList = wxHeck.wxInit.wxData.userList.$remove(data.from_id);
        //         //     //     wxHeck.wxInit.wxData.userList.unshift(topList);
        //         //     //     _alert("置顶设置成功");
        //         //     // }else{
        //         //     //     _alert("取消置顶成功");
        //         //     // }
        //         //     //
        //             wxHeck.wxInit.wxData.msgList[data.from_id].userInfo.set_to_top = data.set_to_top == 1;
        //         }
        //         //群昵称修改
        //         that.modify_self_groupname = function (data) {
        //             var groupListTem = wxHeck.wxInit.wxData.groupUserLists[data.from_id];
        //             $.map(groupListTem, function (elm, index) {
        //                 if(elm.wechat_id.split("$")[1] == localInfo.wechat_id){
        //                     groupListTem[index].wechat_nick = data.displayname;
        //                 }
        //             });
        //         }
        //
        //         //当前学员微信信息
        //         that.get_contact_details = function(data){
        //             wxHeck.wxInit.$broadcast("showCutUserLayer",{
        //                 details:data.details
        //             })
        //         }
        //
        //         //开启关闭【群聊邀请确认】
        //         that.allow_owner_approve = function (data) {
        //             console.log(data.allow_owner_approve_value);
        //             wxHeck.wxInit.wxData.msgList[data.from_id].userInfo.allow_owner_approve_value = data.allow_owner_approve_value == 1;
        //         }
        //
        //         //退出群聊
        //         that.quit_chatroom =  function (data) {
        //             var index = $.inArray(data.from_id, wxHeck.dataSource.userList);
        //             var _index = index == wxHeck.dataSource.userList.length - 1 ? index - 1 : index + 1;
        //             var _curId = wxHeck.dataSource.userList[_index];
        //             wxHeck.dataSource.userList.$remove(data.from_id);
        //             wxHeck.dataSource.userListGroup.$remove(data.from_id);
        //             wxHeck.wxInit.changeUser(_curId);
        //             _alert("退出群聊成功！");
        //         }
        //     }
        //
        //     // 连接websocket
        //     ;
        //     (function () {
        //         wxHeck.args = arguments;
        //         wxHeck.wsHost = (function () {
        //             if (localInfo.isLocal) return "ws://172.16.0.92:8801/websocket";
        //             if (!!localInfo.ws_host) return "ws://" + localInfo.ws_host + "/websocket";
        //         })();
        //         if (!wxHeck.wsHost) {
        //             if (window.confirm("连接失败，请刷新重试？")) window.location.reload();
        //             return;
        //         }
        //         // 连接
        //         wxHeck.socket = new wxHeck.wb(wxHeck.wsHost);
        //         // 连接成功
        //         wxHeck.socket.onopen = function (e) {
        //             // 第一次连接成功
        //             wxHeck.entered = true;
        //             // 清除定时器
        //             clearInterval(wxHeck.interFirstEnter);
        //             // 发送当前人的信息
        //             wxHeck.sendMsg({
        //                 "action": "enter",
        //                 "id": localInfo.id,
        //                 "type": "web",
        //                 "v_code": localInfo.v_code
        //             });
        //         }
        //         wxHeck.socket.onclose = function (e) {
        //             console.log("The socket is closed");
        //         }
        //         wxHeck.socket.onerror = function () {
        //             // 弹出net err
        //             wxHeck.wxInit.$broadcast("setErrors", {
        //                 netErr: true,
        //                 iscc : wxHeck.isCC(),
        //                 isss : wxHeck.isSS()
        //             });
        //             // 如果第一次连接失败 发起重试
        //             // 取消重连
        //             /*if (!wxHeck.entered) {
        //              // 关闭
        //              wxHeck.socket.close();
        //              wxHeck.interFirstEnter = setTimeout(function () {
        //              wxHeck.args.callee();
        //              }, 5000);
        //              }*/
        //         }
        //         wxHeck.socket.onmessage = function (e) {
        //             var data = JSON.parse(e.data);
        //             if(data.action == "web_update_msg"){
        //                 _alert("有新版本上线，请刷新浏览器更新", function(){
        //                     window.location.reload(true);
        //                 });
        //                 return;
        //             }
        //             // 发送图片回调
        //             if(data.action == "proc_comp"){
        //                 if(data.status == 10000){
        //                     wxHeck.wxInit.$broadcast("hwSetSuccess");
        //                 }else{
        //                     wxHeck.wxInit.$broadcast("hwSetFail", data.msg);
        //                 }
        //                 return;
        //             }
        //             if (data.status == 10005 && data.action == "enter") {
        //                 // 停止重连
        //                 clearInterval(wxHeck.interVal);
        //                 // 替代者被迫下线
        //                 if (localInfo.is_trust == 1) {
        //                     alert("托管身份被取消！");
        //                     wxHeck.Util.closeTab();
        //                 } else {
        //                     //原来被挤下来逻辑
        //                     // if (window.confirm("此账号已在别处登录，刷新页面重新登录？")) {
        //                     //     window.location.reload();
        //                     // }
        //                     //alert('此账号已在别处登录，刷新页面重新登123123');
        //                     wxHeck.dataSource.repeatEnter = true;
        //                 }
        //                 return;
        //             }
        //
        //             // 无法找到学员的微信
        //             if(!!data.status && data.status == 20000 && data.action == "find_contact_keywd"){
        //                 //如果是从我的学员过来的
        //                 // 取添加好友组件
        //                 var addFriend = wxHeck.wxInit.$refs.addfriend;
        //                 if(addFriend.addType && addFriend.crmId){
        //                     wxHeck.getData({
        //                         url : "/WechatUserInfo/getUserInfoByUserId",
        //                         data : {
        //                             stu_id : addFriend.crmId
        //                         },
        //                         success : function(r){
        //                             if (r.status != 10000) return alert(r.message);
        //                             if(!!r.message && r.message.wechat_id){
        //                                 // 如果有数据 用这个数据进行搜索
        //                                 _alert("上一个手机号未搜索到微信号，系统从CRM库中换一个手机号继续搜索。");
        //                                 // 更换搜索条件
        //                                 addFriend.wxAcc = r.message.wechat_id;
        //                             }else{
        //                                 // 如果没有数据
        //                                 _alert(data.message);
        //                             }
        //                         }
        //                     });
        //                     return;
        //                 }
        //             }
        //
        //             // 学员已在好友列表
        //             if(!!data.status && data.status == 20000 && data.action == "add_friend"){
        //                 //如果是从我的学员过来的
        //                 // 取添加好友组件
        //                 var addFriend = wxHeck.wxInit.$refs.addfriend;
        //                 var wechat_id = localInfo.wechat_id + "$" + data.wxid;
        //                 if(addFriend.addType){
        //                     var user_id = addFriend.crmId;
        //                     // 绑定学员
        //                     wxHeck.getData({
        //                         url: "/UserContact/addUserWechatContact",
        //                         data: {
        //                             wechat_id: wechat_id,
        //                             user_id: user_id
        //                         },
        //                         success: function (r) {
        //                             if (r.status != 10000) return alert(r.message);
        //                             _alert("学员已在你的好友列表中，现已成功绑定！");
        //                             // 修改该学员的备注
        //                             wxHeck.sendMsg({
        //                                 "id": localInfo.id,
        //                                 "action": "modify_remark",
        //                                 "type": "web",
        //                                 "to_id": wechat_id,
        //                                 "to_type": "ios",
        //                                 "new_name": addFriend.remark
        //                             });
        //                             // 拉取crm信息
        //                             wxHeck.wxInit.getCrmInfo(true, wechat_id);
        //                             // 关闭添加好友组件
        //                             addFriend.addFriendHide();
        //                             // 刷新我的学员
        //                             wxHeck.wxInit.$broadcast("studySearch");
        //                         }
        //                     });
        //                 }else{
        //                     // 如果不是从我的学员过来的
        //                     _alert(data.message);
        //                     // 关闭添加好友组件
        //                     addFriend.addFriendHide();
        //                     // 置顶这个微信号
        //                     wxHeck.toTop(wechat_id);
        //                 }
        //
        //                 return;
        //             }
        //
        //             if (!!data.status && data.status != 10000) {
        //                 var msg = data.message || data.msg;
        //                 return _alert(msg);
        //             }
        //             typeof(wxHeck.msgHandler[data.action]) == "function" && wxHeck.msgHandler[data.action](data);
        //         }
        //     })();
        // })();
    })(window);
});