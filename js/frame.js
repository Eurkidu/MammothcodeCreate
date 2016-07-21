const remote = require('electron').remote;

//窗口管理器
var windowsManager = {};

//窗口事件注册
function registerWindowsEvent(){
    //获取当前窗口
    var mainWindow = remote.getCurrentWindow();

    //窗口失去焦点
    mainWindow.on('blur', function() {
        $("#app").removeClass("app-focus");
    });
    //窗口获取焦点
    mainWindow.on('focus', function() {
        $("#app").addClass("app-focus");
    });
    //打开开发者工具事件
    $("#dev_windows_btn").on("click",function(){
        mainWindow.webContents.openDevTools();
    });
    //窗口最小化事件
    $("#min_windows_btn").on("click",function(){
        mainWindow.minimize();
    });
    //窗口最大化事件
    $("#max_windows_btn").on("click",function(){
        mainWindow.maximize();
    });
    //窗口关闭事件
    $("#close_windows_btn").on("click",function(){
        //判读是否有当前窗口创建的子窗口有就最小化,否则就关闭
        //因为如果子窗口未关闭的情况下先关闭了创建该窗口的父窗口,那么这时候关闭子窗口会报错
        //所有当有子窗口存在的情况下关闭窗口会最小化
        var hasChildWindows = false;
        $.each(windowsManager,function(i,val){
            if(val){
                hasChildWindows = true;
            }
        });
        if(!hasChildWindows){
            mainWindow.close();
        }else{
            mainWindow.minimize();
        }
    });

    //跳转路由
    $("body").on("click","a[href]",function(){
        var $this = $(this);
        var hrefPath = $this.attr("href"); //获取路径
        var windowsWidth = $this.attr("mc-window-width")>>0 || 800; //获取窗口宽度,默认800
        var windowsHeight = $this.attr("mc-window-height")>>0 || 700; //获取窗口高度,默认700
        var routeObj = hrefPath.replace(".html","").replace(/\//g,"_"); //根据路径生成路由对象
        //创建窗口
        windowsManager[routeObj] = new BrowserWindow({
            width: windowsWidth,
            height: windowsHeight,
            frame: false,
            transparent: true
        });
        //windowsManager[routeObj].webContents.openDevTools(); 打开相应页面的开发者工具
        windowsManager[routeObj].loadURL('file://' + __dirname + "/" + hrefPath); //加载页面
        //注册关闭事件
        windowsManager[routeObj].on('closed', function() {
            windowsManager[routeObj] = null;
        });
        window.event.preventDefault(); //阻止a标签默认的动作
    });
}

//提示信息类型
const infoType = {
    log: 'log', //日志
    info: 'info', //信息
    warn: 'warn', //警告
    error: 'error' //错误
};

//输出提示信息
function mcMsg(msgType, msg){
    if(msgType) console[msgType](msg);
}


$(function(){
    //窗口事件注册
    registerWindowsEvent();
});
