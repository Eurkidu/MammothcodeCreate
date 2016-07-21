//加载布局生成模块
const mctool = require('../js/mc.tool');
var beautify_js = require('js-beautify');
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;
//const layoutCreate = require('../js/mc.node.layoutCreate');

Vue.component('mcaccordion', McVue.accordion);

//注册Vue组件
Vue.component('accordion', VueStrap.accordion);
Vue.component('panel', VueStrap.panel);

//自定义过滤器
Vue.filter('isObject', function (value) {
    //Array不算作object
    return Vue.util.isObject(value) && !Vue.util.isArray(value);
})
Vue.filter('isArray', function (value) {
    return Vue.util.isArray(value);
})

$(function(){
    var vmain = new Vue({
        el: '#app',
        data: {
            checked: false,

            codeCotarShow: false,
            //右键菜单 - 是否显示
            menuShow: false,
            //右键菜单 - 位置
            menuStyleObj: {
                top: '0',
                left: '0'
            },
            //CRUDOutput
            CRUDOutput: "",
            //showPanel
            showPanel: "none", //html,js
            //htmlData
            $htmlData: "",
            //jsData
            $jsData: "",
            //可选属性类型
            $getFieldType: function (type){
                var typeList = {
                    common: [
                        { label: "isHide", key: "is-hide", value: false },
                        { label: "isReadonly", key: "readonly", value: false },
                    ],
                    text: [
                        { label: "mult", key: "mult", value: false },
                    ],
                    selectbox: [
                    ],
                    datepicker: [
                    ],
                    editor: [
                    ],
                    switch: [
                    ],
                    upload: [
                        { label: "mult", key: "mult", value: false },
                    ]
                };
                //返回新的对象
                return $.extend(true, [], typeList.common.concat(typeList[type]));
            },
            //可选x显示位置
            $getShowPosition: function (type){
                var positionList = {
                    common: [
                        { label: "表格", key: "datagrid", value: false },
                        { label: "新增表单", key: "addForm", value: false },
                        { label: "修改表单", key: "editForm", value: false },
                    ],
                    text: [
                    ],
                    selectbox: [
                    ],
                    datepicker: [
                    ],
                    editor: [
                    ],
                    switch: [
                    ],
                    upload: [
                    ]
                };
                //返回新的对象
                return $.extend(true, [], positionList.common.concat(positionList[type]));
            },
            //可选表单类型
            formType: [
                { label: "文本框", value: "text" },
                { label: "下拉选择框", value: "selectbox" },
                { label: "日期选择", value: "datepicker" },
                { label: "文本编辑器", value: "editor" },
                { label: "开关", value: "switch" },
                { label: "上传", value: "upload" }
            ],
            $defaultCRUDdata: {
                version: "0.1.2",
                controllerName: { //页面控制器名称
                    label: "页面控制器名称",
                    value: ""
                },
                pageName: { //页面名
                    label: "页面名",
                    value: ""
                },
                datagridUrl: { //数据表请求url
                    label: "数据表请求url",
                    value: ""
                },
                addFormUrl: { //新增表单请求url
                    label: "新增表单请求url",
                    value: ""
                },
                editFormUrl: { //修改表单请求url
                    label: "修改表单请求url",
                    value: ""
                },
                searchList: [], //搜索列表
                operateList: [], //操作列表
                fieldList: [] //字段列表
            },
            //CRUD data
            CRUDdata: {
                version: "0.1.2",
                controllerName: { //页面控制器名称
                    label: "页面控制器名称",
                    value: ""
                },
                pageName: { //页面名
                    label: "页面名",
                    value: ""
                },
                datagridUrl: { //数据表请求url
                    label: "数据表请求url",
                    value: ""
                },
                addFormUrl: { //新增表单请求url
                    label: "新增表单请求url",
                    value: ""
                },
                editFormUrl: { //修改表单请求url
                    label: "修改表单请求url",
                    value: ""
                },
                searchList: [], //搜索列表
                operateList: [], //操作列表
                fieldList: [] //字段列表
            }
        },
        methods: {
            //添加布局
            addLayout: function(){

            },
            //创建CRUD
            addCRUD: function(){

            },
            //载入配置文件
            loadConfigFile: function(){
                path = mctool.selectFilePath([
                    {name: 'mcPageConfig', extensions: ['json']}
                ]);
                if(path){
                    fileConfig = mctool.getConfigInfo(path)
                    if(fileConfig.version === this.CRUDdata.version){
                        this.CRUDdata = fileConfig;
                    }else{
                        mctool.showMsg("error", "载入失败", "配置文件版本不匹配", "当前配置文件的版本为 "+fileConfig.version+"\n程序需求配置文件版本为 "+this.CRUDdata.version);
                    }
                }
            },
            //保存配置文件
            saveConfigFile: function(){
                path = mctool.saveFilePath("testconfig", [
                    {name: 'mcPageConfig', extensions: ['json']}
                ]);
                if(path){
                    mctool.setConfigInfo(path, this.CRUDdata)
                }
            },
            //新建配置文件
            newConfigFile: function(){
                this.CRUDdata = this.$data.$defaultCRUDdata;
                //默认显示一个字段
                this.addField();
            },

            //======= 搜索方法 START =======//
            //排序手势
            sortSearch: function(){
                //生成新数组,否则formtype不会选中,应该是vue没更新字列表的bug
                var arr = $.extend(true, [], this.CRUDdata.searchList);
                this.CRUDdata.searchList = arr.sort(function(a,b){
                    return a.sort - b.sort;
                });
            },
            //添加搜索
            addSearch: function(){
                this.CRUDdata.searchList.push({
                    sort: 1000, //排序字段
                    text: "", //搜索条件文本
                    value: "" //搜索条件字段值
                });
            },
            //删除搜索
            delSearch: function(item){
                this.CRUDdata.searchList.$remove(item);
            },
            //======= 搜索方法 END =======//

            //======= 操作方法 START =======//
            //排序操作
            sortOperate: function(){
                //生成新数组,否则formtype不会选中,应该是vue没更新字列表的bug
                var arr = $.extend(true, [], this.CRUDdata.operateList);
                this.CRUDdata.operateList = arr.sort(function(a,b){
                    return a.sort - b.sort;
                });
            },
            //添加操作
            addOperate: function(){
                this.CRUDdata.operateList.push({
                    sort: 1000, //排序字段
                    headTxt: "", //表头文本
                    label: "", //按钮文本
                    url: "" //该操作请求的url
                });
            },
            //删除操作
            delOperate: function(item){
                this.CRUDdata.operateList.$remove(item);
            },
            //======= 操作方法 END =======//

            //======= 字段方法 START =======//
            //排序字段
            sortField: function(){
                //生成新数组,否则formtype不会选中,应该是vue没更新字列表的bug
                var arr = $.extend(true, [], this.CRUDdata.fieldList);
                this.CRUDdata.fieldList = arr.sort(function(a,b){
                    return a.sort - b.sort;
                });
            },
            //添加字段
            addField: function(){
                var formType = "text";
                this.CRUDdata.fieldList.push({
                    sort: 1000, //排序字段
                    label: "", //文本
                    dataId: "", //dataId
                    width: "", //在表格中的宽度
                    formType: formType, //表单元素类型
                    fieldType: this.$data.$getFieldType(formType), //对应的表单元素的属性字段
                    showPosition: this.$data.$getShowPosition(formType) //对呀的表单元素可显示的位置字段
                });
            },
            //删除字段
            delField: function(item){
                this.CRUDdata.fieldList.$remove(item);
            },
            //======= 字段方法 END =======//

            //更改表单元素类型
            changeFormType: function(idx, type){
                this.CRUDdata.fieldList[idx].fieldType = this.$data.$getFieldType(type);
                this.CRUDdata.fieldList[idx].showPosition = this.$data.$getShowPosition(type);
            },
            //显示数据输出结果
            showCRUDOutput: function(templateId){
                return template(templateId, {
                    data: this.CRUDdata
                }).replace(/^\s*[\r\n]+/gm, "").replace(/\/\/#endregion/gm, "//#endregion\n");
            },
            //显示页面代码
            showCRUDHtml: function(){
                var data = beautify_html(this.showCRUDOutput("CRUDHtml"));
                this.showPanel = "html";
                $("#html_content").text(data);
                Prism.highlightAll(); //高亮代码
                this.$data.$htmlData = data;
                this.codeCotarShow = true;
            },
            //显示Js代码
            showCRUDCode: function(){
                var data = beautify_js(this.showCRUDOutput("CRUDJs"));
                this.showPanel = "js";
                $("#js_content").text(data);
                Prism.highlightAll(); //高亮代码
                this.$data.$jsData = data;
                this.codeCotarShow = true;
            },
            //复制数据
            copyData: function(){
                if(this.showPanel === 'html'){
                    mctool.copy(this.$data.$htmlData);
                    alert("复制成功");
                }else if(this.showPanel === 'js'){
                    mctool.copy(this.$data.$jsData);
                    alert("复制成功");
                }else{
                    alert("复制失败");
                }
            },
            //复制html
            copyHtmlData: function(){
                mctool.copy(beautify_html(this.showCRUDOutput("CRUDHtml")));
                alert("复制成功");
            },
            //复制js
            copyJsData: function(){
                mctool.copy(beautify_js(this.showCRUDOutput("CRUDJs")));
                alert("复制成功");
            },
            codeCotarHide: function(){
                this.codeCotarShow = false;
            },
            //显示右键菜单
            showMenu: function(ev){
                this.menuShow = true;
                this.menuStyleObj.left = ev.pageX + 'px';
                this.menuStyleObj.top = ev.pageY + 'px';
            },
            //右键菜单点击
            menuClick: function(){
                this.menuShow = false;
            }
        }
    });

    //默认显示一个字段
    vmain.addField();

    // //当html数据变化时重新高亮代码
    // vmain.$watch('htmlData', function (val) {
    //     Prism.highlightAll(); //高亮代码
    // });
    // //当js数据变化时重新高亮代码
    // vmain.$watch('jsData', function (val) {
    //     Prism.highlightAll(); //高亮代码
    // });

    // vmain.$watch('CRUDOutput', function (val) {
    //     Prism.highlightAll(); //高亮代码
    // });

    //文档点击事件,关闭右键菜单
    $(document).on("click",function(){
        vmain.menuShow = false;
    });
});
