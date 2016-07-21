//node的mammothcode_avalon布局生成模块
//Create by Zero
//Create Time 2016-2-18 15:34:07

const fs = require("fs");

//测试数据
var testData = {
    _m: "v", _p: "content",
    _c: [{
        _m: "h", w: "100%", _p: "content0",
        _c: [{
            _m: "v", w: "250", _p: "content00",
            _c: []
        }, {
            _m: "v", w: "100%", _p: "content01",
            _c: [{
                _m: "v", w: "100%", _p: "content010",
                _c: []
            }, {
                _m: "v", w: "50", _p: "content011",
                _c: []
            }]
        }]
    }]
}

/**
 * [buildLayout 构建布局HTML]
 * @param  {[type]} layoutData [布局数据对象]
 * @return {[type]}            [description]
 */
function buildLayout(layoutData){
    var html = '';
    html += '<div class="mc-layout-cotar">';

    html += '<div class="mc-layout-manager-cotar">';
    for(var i = 0; i < layoutData._c.length; i++){
        html += buildAbsoluteLayoutContent(layoutData, i);
    }
    html += '</div>';

    html += '<div class="mc-linearlayout-cotar ' + calClass(layoutData, 'v') + '">'
    for(var i = 0; i < layoutData._c.length; i++){
        html += buildLinearLayoutContent(layoutData, i);
    }
    html += '</div>';

    html += '</div>';
    return html;
}

/**
 * [buildAbsoluteLayoutContent 递归构建绝对布局层级内容]
 * @param  {[type]} parentData [父节点数据对象]
 * @param  {[type]} idx        [当前节点的index]
 * @return {[type]}            [description]
 */
function buildAbsoluteLayoutContent(parentData, idx){
    var nodeData = parentData._c[idx]; //当前节点数据对象
    var html = '';
    html += '<div class="mc-absolute-item" ' + calStytle(parentData, idx) + '>';
    for(var i = 0; i < nodeData._c.length; i++){
        html += buildAbsoluteLayoutContent(nodeData, i);
    }
    html += '</div>';
    return html;
}

/**
 * [buildLinearLayoutContent 递归构建线性布局层级内容]
 * @param  {[type]} parentData [父节点数据对象]
 * @param  {[type]} idx        [当前节点的index]
 * @return {[type]}            [description]
 */
function buildLinearLayoutContent(parentData, idx){
    var nodeData = parentData._c[idx]; //当前节点数据对象
    var parentType = parentData._m; //节点排列方式
    var html = '';
    html += '<div class="mc-linear-item ' + calClass(nodeData, parentType) + '">';
    for(var i = 0; i < nodeData._c.length; i++){
        html += buildLinearLayoutContent(nodeData, i);
    }
    html += '</div>';
    return html;
}

/**
 * [calClass 计算class名]
 * @param  {[type]} nodeData       [当前节点数据对象]
 * @param  {[type]} parentType [节点排列方式]
 * @return {[type]}            [description]
 */
function calClass(nodeData, parentType){
    var className = '';
    if(parentType === 'h'){
        className += 'ftp ';
    }
    if(nodeData._c.length && nodeData._m === 'h'){
        className += 'hf ';
    }
    return className;
}

/**
 * [calStytle 计算行内样式]
 * @param  {[type]} parentData [父节点数据对象]
 * @param  {[type]} idx        [当前节点的index]
 * @return {[type]}            [description]
 */
function calStytle(parentData, idx){
    var nodeData = parentData._c[idx]; //当前节点
    var parentType = parentData._m; //节点排列方式
    var style = '';
    style += 'style="';
    //width
    if(nodeData.w && parentType === 'h' && nodeData.w.indexOf('%') === -1){
        style += 'width:' + nodeData.w + 'px;';
    }

    //height
    if(nodeData.w && parentType === 'v' && nodeData.w.indexOf('%') === -1){
        style += 'height:' + nodeData.w + 'px;';
    }

    //top
    var topValue = calPosition('top', parentData, idx);
    if(topValue !== false){
        style += 'top:' +  topValue + (topValue ? 'px;' : ';');
    }

    //left
    var leftValue = calPosition('left', parentData, idx);
    if(leftValue !== false){
        style += 'left:' +  leftValue + (leftValue ? 'px;' : ';');
    }

    //right
    var rightValue = calPosition('right', parentData, idx);
    if(rightValue !== false){
        style += 'right:' +  rightValue + (rightValue ? 'px;' : ';');
    }

    //bottom
    var bottomValue = calPosition('bottom', parentData, idx);
    if(bottomValue !== false){
        style += 'bottom:' +  bottomValue + (bottomValue ? 'px;' : ';');
    }

    style += '"';
    return style;
}

/**
 * [calPosition description]
 * @param  {[type]} pType [类型]
 * @param  {[type]} data  [父节点数据对象]
 * @param  {[type]} idx   [当前节点的index]
 * @return {[type]}       [description]
 */
function calPosition(pType, data, idx){
    //todo 支持多个百分比
    var tmp, i;
    if (pType === "top") {
        if (data._m === "h") {
            return 0;
        } else {
            tmp = 0;
            for (i = 0; i < idx; i++) {
                if (data._c[i].w.indexOf("%") !== -1) return false;
                tmp += data._c[i].w >>> 0;
            }
            return tmp;
        }
    } else if (pType === "bottom") {
        if (data._m === "h") {
            return 0;
        } else {
            tmp = 0;
            for (i = idx + 1; i < data._c.length; i++) {
                if (data._c[i].w.indexOf("%") !== -1) return false;
                tmp += data._c[i].w >>> 0;
            }
            return tmp;
        }
    } else if (pType === "left") {
        if (data._m === "v") {
            return 0;
        } else {
            tmp = 0;
            for (i = 0; i < idx; i++) {
                if (data._c[i].w.indexOf("%") !== -1) return false;
                tmp += data._c[i].w >>> 0;
            }
            return tmp;
        }
    } else if (pType === "right") {
        if (data._m === "v") {
            return 0;
        } else {
            tmp = 0;
            for (i = idx + 1; i < data._c.length; i++) {
                if (data._c[i].w.indexOf("%") !== -1) return false;
                tmp += data._c[i].w >>> 0;
            }
            return tmp;
        }
    }
}

var base = {};

base.heredoc = function(fn){
    return fn.toString()
        .replace(/^[^\/]+\/\*!?\s?/, '')
        .replace(/\*\/[^\/]+$/, '')
};

var htmlHead = base.heredoc(function () {
    /*
     <!DOCTYPE html>
     <html>
     <head>
     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
     <title>测试</title>
     <script type="text/javascript" src="http://libs.baidu.com/jquery/1.8.3/jquery.min.js"></script>
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <style>
     .ftp {
       display: inline-block;
       font-size: 16px;
       vertical-align: top;
     }
     .fp {
       display: inline-block;
       font-size: 16px;
       vertical-align: middle;
     }
     .fbp {
       display: inline-block;
       font-size: 16px;
       vertical-align: bottom;
     }
     .hf {
       font-size: 0;
     }
     .mc-layout-cotar {
       width: 100%;
       height: 100%;
     }
     .mc-layout-manager-cotar {
       position: absolute;
       top: 0;
       left: 0;
       right: 0;
       bottom: 0;
       overflow: auto;
       z-index: -1;
     }
     .mc-layout-manager-cotar .mc-absolute-item {
       position: absolute;
       overflow: auto;
     }
     .mc-linearlayout-cotar {
       position: relative;
       width: 100%;
       height: 100%;
       z-index: 1;
     }
     </style>
     </head>
     <body class="test">
     */
});

var htmlBottom = base.heredoc(function(){
    /*
     </body>
     </html>
     <script type="text/javascript">
     $(function(){
         //初始化布局
         iniLayout($(".mc-layout-cotar"));
     });
     //初始化布局
     function iniLayout(elem) {
        //把线性布局与布局管理器关联
        var $mamager = $(elem).find(".mc-absolute-item");
        var $linear = $(elem).find(".mc-linear-item");
        $mamager.each(function (i, val) {
            $linear.eq(i).css({
                height: val.offsetHeight,
                width: val.offsetWidth
            });
        });
     }
     </script>
     */
});

var htmlHead2 = base.heredoc(function () {
    /*
    <style>
    .mc-layout-cotar {
      width: 100%;
      height: 100%;
    }
    .mc-layout-manager-cotar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: auto;
      z-index: -1;
    }
    .mc-layout-manager-cotar .mc-absolute-item {
      position: absolute;
      overflow: auto;
    }
    .mc-linearlayout-cotar {
      position: relative;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    </style>
     <div class="mc-cotar">
     */
});

var htmlBottom2 = base.heredoc(function(){
    /*
     </div>
     */
});

var scriptHtml = base.heredoc(function(){
    /*
     <script type="text/javascript">
     $(function(){
         //初始化布局
         iniLayout($(".mc-layout-cotar"));
     });
     //初始化布局
     function iniLayout(elem) {
        //把线性布局与布局管理器关联
        var $mamager = $(elem).find(".mc-absolute-item");
        var $linear = $(elem).find(".mc-linear-item");
        $mamager.each(function (i, val) {
            $linear.eq(i).css({
                height: val.offsetHeight,
                width: val.offsetWidth
            });
        });
     }
     </script>
     */
});

var outputStr = htmlHead2 + buildLayout(testData) + htmlBottom2;

//写入文件
fs.writeFile('D:/Workspace/曼码科技/Mammothcode/Demarcia/Mammothcode.Sandwich/Mammothcode.Sandwich.AdminWeb/Views/Home/NodeCreateTest.cshtml',
    outputStr, function(err) {
        if (err) {
            //typeof msgHandle == "function" && msgHandle(infoType.error, err);
            return console.error(err);
        }
        console.log("数据写入成功");
        //typeof msgHandle == "function" && msgHandle(infoType.log, outFileName + "数据写入成功！");
    });
