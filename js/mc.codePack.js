//const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const dialog = remote.dialog;

const mctool = require('../js/mc.tool');
const docHandle = require('../js/mc.node.docHandle');

//曼码后台配置文件路径及全局对象
var mcConfigPath = __dirname + '/config.json';
var mcConfigObj = mctool.getConfigInfo(mcConfigPath); //获取配置

$(function(){
    //vue 绑定
    new Vue({
        el: "#app",
        data: {
            workPath: mcConfigObj.mcAvalonSourcePath,
            outputPath: mcConfigObj.mcAvalonPackOutputPath
        },
        methods: {
            //选择源代码路径
            selectWorkPath: function(){
                var workPath = getUserSelectPath();
                if(workPath){
                    this.workPath = workPath;
                    mcConfigObj.mcAvalonSourcePath = workPath;
                    //保存配置信息
                    mctool.setConfigInfo(mcConfigPath, mcConfigObj);
                }
            },
            //选择打包完的文件保存路径
            selectOutputPath: function(){
                var outputPath = getUserSelectPath();
                if(outputPath){
                    this.outputPath = outputPath;
                    mcConfigObj.mcAvalonPackOutputPath = outputPath;
                    //保存配置信息
                    mctool.setConfigInfo(mcConfigPath, mcConfigObj);
                }
            }
        }
    });

    //注册滚动条
    $(".opt-box").mCustomScrollbar({
        theme: "dark"
    });
    $(".msg-box").mCustomScrollbar({
        theme: "dark"
    });
});

//显示之前的配置文件里面的配置
// function showConfigPath(){
//     $("#work_path").html(mcConfigObj.mcAvalonWorkSpace);
//     $("#output_path").html(mcConfigObj.mcAvalonDocOutputPath);
// }

//选择路径
function getUserSelectPath(){
    var userSelectPath = dialog.showOpenDialog({ properties: [ 'openDirectory']});
    if(userSelectPath){
        return userSelectPath[0];
    }else{
        return null;
    }
}

//生成文档
function createDoc(){
    //调用文档处理模块的创建文档函数
    docHandle.createDoc(mcConfigObj.mcAvalonWorkSpace,
        mcConfigObj.mcAvalonDocOutputPath,
        function(msgType, msg){
            mcMsg(msgType, msg);
            $("#msg_content").append("<p>" + msg + "<p/>");
            $(".msg-box").mCustomScrollbar("scrollTo","last");
        }
    );
}
