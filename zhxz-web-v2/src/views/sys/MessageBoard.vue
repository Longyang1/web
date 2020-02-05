<template>
  <div class="view-product">
        <div class="info-center">
            <div class="manage-head row">
                <h6 class="padding-left manage-head-con col-sm-10">消息看板</h6>
                 <a href="javaScript:void(0)" @click="switchover" class="toggle-btn col-sm-2 text-right" title="切换为列表模式">
                    <i class="fa fa-list-ul">&nbsp;切换为列表模式</i>
                </a>         
            </div>
            <div class="row wrapper wrapper-content animated fadeInRight">
                <div class="col-sm-12 ">                 
					<div class="col-sm-3" v-for="(dict,index) in dicts[0]">
                        <div class="ibox float-e-margins" style="margin-left:-8px;margin-right:-8px">
                            <div class="mytitle" >
                                <h5 v-if="dict.label == toApprove">&nbsp;&nbsp;{{dict.label}}({{toApproveCount}})</h5>
                                <h5 v-if="dict.label == toRead">&nbsp;&nbsp;{{dict.label}}({{toReadCount}})</h5>
                                <h5 v-if="dict.label == todo">&nbsp;&nbsp;{{dict.label}}({{todoCount}})</h5>
                                <h5 v-if="dict.label == sysMessage">&nbsp;&nbsp;{{dict.label}}({{sysMessageCount}})</h5>
                                <div class="ibox-tools" v-if="dict.label == toApprove" style="margin-right:-5px">
                                    <div   class="label label-primary btn-rounded"  @click="updateAllStatus(todoTypeDicts.APPROVAL)">一键审批</div>
                                </div>
                                <div class="ibox-tools" v-else-if="dict.label == toRead" style="margin-right:-5px">
                                    <div class="label label-primary btn-rounded" @click="updateAllStatus(todoTypeDicts.READ)">全部标识为已读</div> 
                                </div>
                                <div class="ibox-tools" v-else-if="dict.label == sysMessage" style="margin-right:-5px">
                                    <div class="label label-primary btn-rounded" @click="updateAllStatus(todoTypeDicts.MESSAGE)" >全部标识为已读</div> 
                                </div>
                            </div>
                            <div class="ibox-content" style="height:480px;overflow: auto;">                           
                                <ul v-for="item in list[0]" v-if="dict.label== item.todoType">
                                    <li>
                                        <i class="fa fa-circle"></i><a href="javascrip:void(0)" @click="deal(item,true)">{{item.todoTitle}}</a>
                                        <div class="agile-detail"><i class="layui-icon layui-icon-username"></i>{{userNameMap[item.createBy].userName}}  </div>
                                        <div class="agile-detail"><i class="layui-icon layui-icon-log"></i>{{item.createDate | moment}}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    </div>
</template>
<script>
import { getDicts } from '@/api/dict';
import { delMeetingConfLinkage } from '@/api/meeting/confLinkage'
import OfficeTree from '@/components/OfficeTree'
import {get,updateStatus} from '@/api/sys/sysTodo'
import Base from '@/views/base/Base'
export default {
    extends: Base,
    data () {
        return {
            toApprove: '待我审批',
            toRead: '待我阅读',
            todo: '待我办理',
            sysMessage: '系统消息',
            toApproveCount:'',
            toReadCount:'',
            todoCount:'',
            sysMessageCount:'',
            todoTypeDicts:{
                APPROVAL:'APPROVAL',
                READ:'READ',
                MESSAGE:'MESSAGE'
            },
            dicts: [],
            refresh: true,
            list: [],
            officeNameMap: {},
            dictLabelsMap: {},
            officeName: '',
            toReadIds:'',
            sysMessageIds:'',
            userNameMap:[],
        }
       
    },
    computed: {
        linkageTypeMap: function() {
            return this.dicts[0].array2Obj('value', 'label');
        }
    },
    mounted () {
        this.initData();
    },
    methods: {     
        initData: function() {
            //初始化,调用dict.js的getDicts()方法发送请求
            getDicts('TODO_TYPE_DICT,TODO_STATUS_DICT').then(result => {
                // 调取控制台信息
                console.log(result);
                //获取data数组的第一列
                var linkageTypes = result.data[0];
                 // 推送数据到dicts
                this.dicts.push(linkageTypes);
            });
            //初始化,调用systodo.js的getAll()方法发送请求
		    get('').then(result=>{
                 //从控制台获取结果
                console.log(result);
                var todos=result.data.sysTodos;
                this.list.push(todos);      
                this.userNameMap=result.data.userNameMap;       
                this.toApproveCount = result.data.listToApproveCount;
                this.toReadCount = result.data.listToReadCount;
                this.todoCount = result.data.listTodoCount;
                this.sysMessageCount = result.data.listSysMessageCount;
            });
		},	
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.meetingConfLinkages || [];
            this.officeNameMap = data.officeNameMap || {};
            this.dictLabelsMap = data.dictLabelsMap || {};
        },
        del: function(confLinkage) {
            //删除前询问是否确认删除
            confirm('确定删除该消息吗？', () => {
                delMeetingConfLinkage(confLinkage.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        },
        //修改事项状态方法（一键审批，全部标识为已读）
        updateAllStatus:function(todoTypeDicts){
            updateStatus(todoTypeDicts).then(result => {
                alert(result.msg);
                this.backListView(this.sysSerialNumber.id==null);
            });
        },
        switchover:function(){
            //跳转到消息页面
            // this.$router.push({
            //     path:'sysToDoList',
            //     name:'SysToDoList',
            //     params:{
            //         mode:'LIST'
            //     }
            // })
            
            
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysTodoList",
                "name": "SysToDoList",
                "parentId": "4",
                "text": "新增",
                "children": [
                ]
            }, 3,{
                mode:'modify'
            });
        
        },     
         //处理任务
        deal: function(item) {
            //this.$parent.closeTabByName("WtDealWorkTaskInfo");          
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "id",
                "name": "WtDealWorkTaskInfo",
                "parentId": "4",
                "text": "处理",
                "children": [
                ]
            }, 3, {
                item:item.businessId,
            });
        },
    }
}
</script>

<style scoped>
    .row {
        margin-left: 0;
        margin-right: 0;
    }
    .ibox-content /deep/ .search-box {
        padding-left: 0;
        margin-left: 0;
    }
.manage-head{
    padding:8px 0;
    margin:10px;
    background-color: #f0f0f0;
    border-left:4px solid #0078ad;
}
.manage-head-con{
    position:relative;
    height:18px;
    line-height:18px;
    color:#363636;
    font-size:16px;
}
.manage-head a i{
    font-size: 14px; 
    color: #9c9c9c;
}

.col-sm-12{
    margin-top: -5px;
    padding-right: 5px;
    padding-left: 5px;
}
.mytitle{
    cursor: move;
    height: 31px;
    border-color: #e9e9e9; 
    background-color: #edf1f2;
    color: #333;
    font-weight: 700;
    border-radius: 2px 2px 0 0;
    padding: 7px;
    border-bottom: 1px solid transparent;
    display: block;
    clear: both;
}
.mytitle h5 {
    display: inline-block;
    font-size: 14px;
    margin: 0;
    padding: 0;
    text-overflow: ellipsis;
    float: left;
    border-left:1px solid #0078ad;
    color:#305894; 
}
.mytitle label{
    font-size: 11px;
    padding: 5px 12px;
}
.ibox-content{
    padding-right: 10px;
    padding-left: 10px;
}
.ibox-content ul li{
    padding: 0 5px 5px 0;
    border-bottom: 1px solid #d4d4d4;
    font-size: 12.5px;
    margin-bottom: 10px;
}
.ibox-content ul li i{
    font-size: 6px;
    vertical-align: middle;
    margin-top: -2px;
    padding-right: 5px;
    color: #24b7e5;
}
.ibox-content ul li .agile-detail i{
    font-size: 16px;
    color: #c1c1c1;
}
.ibox-content ul li .agile-detail{
    padding-left: 12px;
}
.btn{
    padding-right: 12px;
    padding-left: 12px;
}
.btn-orange{
    color: #ffffff !important;
    background-color: #f8ac59;
    border-color: #f8ac59;
}
.ibox-content ul li .agile-detail .end-time-text{
    color: red;
}


.layui-view-body{
    background-color: #f0f2f5;
}

.layui-content{
    padding: 0 20px 20px 20px;
}

.layui-tab-title{
    border-bottom-color: #e8e8e8;
}
.layui-card .layui-tab-brief .layui-tab-title li{
    margin:0 15px;
    padding: 0;
}
.layui-card-body{
    padding: 0;
}
.layui-form-mid{
    width: 100px;
    text-align: right;
    color: #000000;
}
.layui-input-inline{
    text-align: center;
}
.primary-title{
    border: 0;
}
.primary-title:hover{
    border-bottom: 2px solid #C9C9C9;
}

.layui-btn-primary:hover,
.layui-form-onswitch,
.layui-form-checked[lay-skin=primary] i,
.layui-form-checkbox[lay-skin=primary]:hover i,
.layui-form-checked, .layui-form-checked:hover,
.layui-tab-brief>.layui-tab-more li.layui-this:after,
.layui-tab-brief>.layui-tab-title .layui-this:after{
    border-color: #177ce3;
}

.layui-checkbox-disbaled[lay-skin=primary]:hover i {
    border-color: #d2d2d2!important;
}

.layui-form-onswitch,
.layui-form-checked[lay-skin=primary] i,
.layui-form-select dl dd.layui-this,
.layui-laypage .layui-laypage-curr .layui-laypage-em,
.layui-form-checked span, .layui-form-checked:hover span{
    background-color: #177ce3;
}
.layui-btn-blue{
    background-color: #177ce3;
    background-repeat: repeat-y;
    background-image: -moz-linear-gradient(left,#29adeb,#177ce3);
    background-image: -webkit-linear-gradient(left,#29adeb,#177ce3);
    background-image: -o-linear-gradient(left,#29adeb,#177ce3);
    background-image: linear-gradient(left,#29adeb,#177ce3);
}

.layui-form-checkbox[lay-skin=primary]:hover span{
    background: 0 0!important;
}

.layui-page-header{
    margin: -20px -20px 20px;
}

.layui-page-header .pagewrap{
    padding: 15px 20px;
    background-color: #fff;
}

.layui-page-header .title{
    margin-top: 15px;
}

.chart-card{
    padding: 20px 24px 8px;
}

.chart-card .chart-header{
    position: relative;
    width: 100%;
    overflow: hidden;
}

.chart-card .metawrap{
    float: left;
}

.chart-card .metawrap .meta{
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
    height: 22px;
}

.chart-card .metawrap .total{
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: rgba(0,0,0,.85);
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 30px;
    line-height: 38px;
    height: 38px;
}

.chart-card .chart-body{
    margin-bottom: 12px;
    position: relative;
    width: 100%;
}

.chart-card .chart-footer{
    padding-top: 9px;
    margin-top: 8px;
    border-top: 1px solid #e8e8e8;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.chart-card .field{

}

.chart-card .field span{
    font-size: 14px;
    line-height: 22px;
}

.chart-card .field span:last-child{
    margin-left: 8px;
    color: rgba(0,0,0,.85);
}

.form-box{
    padding: 10px 0;
}

.hr-line-dashed{
    border-top: 1.5px dashed #c1c1c1;
    margin:5px 0 8px 0; 
}

.layui-table-page .layui-laypage span,
.layui-laypage-btn{
    color: #000000;
}
.layui-table-page>div{
    float: right;
}
</style>


