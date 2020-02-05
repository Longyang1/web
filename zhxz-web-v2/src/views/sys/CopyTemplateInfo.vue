<template>
    <div class="view-product" v-cloak>
    <div class="animated fadeInRight">
      <layui-form>
        <dd>
          <div style="border: 1px solid #e7e9ee;padding-left:20px;padding-top: 20px ">
            <layui-item>
                 <layui-inline-input
                  label="源表单模板" :readonly="true"
                  :cssStyle="{width:'542px'}"
                  v-model="sourceTemp"/>
            </layui-item>
            <layui-fieldset label="目标模版信息" style="margin-right:20px">
                <template slot="main">
                <layui-item>
                    <layui-inline-radio
                        v-model="selectYear"
                        label="年度"
                        :items="years"></layui-inline-radio>
                </layui-item>
                <layui-item>
                     <layui-inline-checkbox
                        label="不存在模版"
                        :items="notExistTemp"
                        v-model="selectTemp"
                        ></layui-inline-checkbox>
                <layui-item>
                </layui-item>
                    <layui-inline-checkbox
                        label="已存在模版(未发布状态)"
                        :items="existTemp"
                        v-model="selectTemp"
                        ></layui-inline-checkbox>
                </layui-item>
                     <div style="margin-top: 20px;padding-left: 40%">
                        <layui-inline>
                            <button class="layui-btn layui-btn-lg layui-btn-blue" @click="letscopy"><img class="custom-img" src="/static/images/btn/save.png"/>复制</button>
                            <button class="layui-btn layui-btn-lg layui-btn-red" @click="closeIframe()"><img class="custom-img" src="/static/images/btn/close.png"/>关闭</button>
                        </layui-inline>
                    </div>
                </template>
            </layui-fieldset>
          </div>
          
        </dd>
        
      </layui-form>
    </div>
  </div>
</template>
<script>
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
import {getExistTemp,letscopy } from '@/api/sys/formTemplateInfo'


export default {
    name:"CopyTemplateInfo",
	extends: Base,
    data() {
        return {
            sourceTemp:'',
            projectSubtypeDicts:[],
            years:[],
            selectYear:'',
            notExistTemp:[],
            existTemp:[],
            selectTemp:[],

        }
    },
    computed: {
        projectSubtypeMap:function () {
            return this.projectSubtypeDicts ? this.projectSubtypeDicts.array2Obj("value", 'label') : [];
        }
    },
    watch: {
        'selectYear':function(curVal){
            getExistTemp(curVal).then(result=>{
                if(result.data){
                    this.notExistTemp=result.data.notExistTemp;
                    this.existTemp=result.data.existTemp;
                }
            });
        }
    },
     props: {
      formTemplateInfo: {
        type: Object,
        default: null
      },
    },
     mounted() {
      this.initData();
      this.$nextTick(() => {
        //this.layuiInit();
      });

    },
    methods: {
        initData:function () {
            getDicts('PROJECT_SUBTYPE_DICT').then(result => {
                this.projectSubtypeDicts = result.data[0] || [];

                this.sourceTemp=this.formTemplateInfo.templateYear+'-'+this.projectSubtypeMap[this.formTemplateInfo.templateBizType];
            });
            var curYear = new Date().getFullYear();
            this.years.push({label:curYear+"",value:curYear+""});
            this.years.push({label:curYear+1+"",value:curYear+1+""});
        },
        closeIframe: function () {
            this.$layer.closeAll();
        },
        letscopy:function () {
            confirm("确定要复制么？", () => {
                this.submitHandler((token) => {
                    loading();
                    letscopy(this.formTemplateInfo.id,this.selectYear, JSON.stringify(this.selectTemp),token
                            ).then(result=>{
                                closeLoading();
                                alert(result.data);
                                this.$layer.closeAll();
                    }).catch(function(reason) {
                        console.log('catch:', reason);
                        this.resetToken(reason);
                    });
                });
            });
            
        }
    }
}
</script>
<style scoped>

</style>


