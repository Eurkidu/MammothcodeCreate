var McVue = {};

var base = {};

base.heredoc = function(fn){
    return fn.toString()
        .replace(/^[^\/]+\/\*!?\s?/, '')
        .replace(/\*\/[^\/]+$/, '')
};

//定义Vue组件
McVue.accordion = Vue.extend({
    template: base.heredoc(function(){
        /*
    <div class="mc-accordion-cotar">
        <div class="panel-wrap" v-for="el in panels" v-bind:class="{'first':$index==0, 'active':$index==active}">
            <div class="panel-header" v-on:click="clickPanel($event, $index)">
                <a href="javascript:void(0)">{{el.title}}</a>
            </div>
            <div class="panel-body" v-bind:style="{'padding':padding}">
                <slot name="content{{$index}}"></slot>
            </div>
        </div>
    </div>
         */
    }),
    props: ['panels', 'active'],
    renderContent: function(idx){
        console.log(idx);
    }
});
