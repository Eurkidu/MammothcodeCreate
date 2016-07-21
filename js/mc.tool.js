const dialog = remote.dialog;
const clipboard = remote.clipboard;

const iconv = require('iconv-lite');
const fs = require("fs");

function showMsg(type, title, msg, detail){
    type = type || "none";
    title = title || "消息";
    msg = msg || "内容";
    detail = detail || "内容详情";
    dialog.showMessageBox({
        type: type, //"none", "info", "error", "question" or "warning"
        title: title,
        message: msg,
        buttons: ["确定"],
        detail: detail
    });
}

/**
 * [getConfigInfo 获取配置信息]
 * @param  {[string]} configPath [配置信息文件路径]
 * @return {[object]}            [配置信息对象]
 */
function getConfigInfo(configPath){
    var configObj = {};
    //同步读取
    var data = fs.readFileSync(configPath, {encoding:'binary'});
    var buf = new Buffer(data, 'binary');
    var configStr = iconv.decode(buf, 'UTF-8');
    configObj = JSON.parse(configStr);
    return configObj;
}

/**
 * [setConfigInfo 保存配置信息]
 * @param {[string]} configPath [配置信息文件路径]
 * @param {[object]} configObj  [配置信息对象]
 */
function setConfigInfo(configPath, configObj){
    fs.writeFile(configPath, JSON.stringify(configObj),  function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("配置文件保存成功！");
    });
}

/**
 * [selectPath 选择路径]
 */
function selectPath(){
    var curPath = dialog.showOpenDialog({ properties: ['openDirectory']});
    if(curPath){
        return curPath[0];
    }else{
        return null;
    }
}

/**
 * [selectFilePath 选择文件]
 */
function selectFilePath(filters){
    filters = filters || [
        {name: 'All Files', extensions: ['*']}
    ]
    var curPath = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: filters
    });
    if(curPath){
        return curPath[0];
    }else{
        return null;
    }
}

/**
 * [saveFilePath 保存文件]
 */
function saveFilePath(title, filters){
    title = title || "newfile";
    filters = filters || [
        {name: 'All Files', extensions: ['*']}
    ];
    var curPath = dialog.showSaveDialog({
        title : title,
        filters: filters
    });
    if(curPath){
        return curPath;
    }else{
        return null;
    }
}

function copy(txt){
    clipboard.writeText(txt);
}

//暴露外部接口
exports.showMsg = showMsg;
exports.getConfigInfo = getConfigInfo;
exports.setConfigInfo = setConfigInfo;
exports.selectPath = selectPath;
exports.selectFilePath = selectFilePath;
exports.saveFilePath = saveFilePath;
exports.copy = copy;
