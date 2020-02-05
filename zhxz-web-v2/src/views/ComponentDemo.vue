<template>
    <content-box>
        <input type="email" name="user_email" />
        <layui-form>
            <layui-fieldset
                label="默认关闭"
                :close="true">
                <template slot="main">
                    <h1>如何设置默认关闭状态</h1>
                </template>
            </layui-fieldset>
            <layui-fieldset
                label="多选下拉框 [默认选中的值为item.value valKey自定义 显示的为item.label 可通过labelKey 自定义要显示的属性值]">
                <template slot="main">
                    <layui-inline-input
                        v-model="n"
                        type="number"></layui-inline-input>
                   
                    <div class="layui-form layui-form-pane">
                        <div class="layui-form-item">
                            <label class="layui-form-label">多选框</label>
                            <div class="layui-input-block">
                                <select name="city" xm-select="select2">
                                    <option value="1" disabled="disabled">北京</option>
                                    <option value="2" selected="selected" disabled="disabled">上海</option>
                                    <option value="3">广州</option>
                                    <option value="4" selected="selected">深圳</option>
                                    <option value="5">天津</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="layui-form">
                        <div class="layui-form layui-form-pane">
                            <div class="layui-form-item">
                                <label class="layui-form-label">多选框</label>
                                <div class="layui-input-block">
                                    <select name="city" xm-select="select15">
                                        <option value="">请选择, 此处是联动多选</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <layui-inline-linkage-select
                        label="联动选择"
                        :items="dicts"></layui-inline-linkage-select>

                    <layui-inline-dict-linkage-select
                        type="WORK_TASK_TYPE_DICT"
                        label="字典联动选择"
                        v-model="dictValue"></layui-inline-dict-linkage-select>
                    
                    <layui-inline-mutil-select
                        label="多选下拉框"
                        :items="mutilSelectItems"
                        v-model="checkedVals"></layui-inline-mutil-select>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="标签"
                :close="true">
                <template slot="main">
                    <layui-item>
                        <layui-inline-tag
                        label="标签显示"
                        v-model="tags"></layui-inline-tag>
                    </layui-item>
                    <layui-item>
                        <layui-inline-user-tag
                        label="用户标签"
                        v-model="users"></layui-inline-user-tag>
                    </layui-item>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="选择用户后关闭单个模态框"
                :close="true">
                <template slot="main">
                    <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
    getSelectUsers: function(users, officeMap, layerid){
        /****/
        this.$layer.close(layerid);
    },
                    </pre>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="分页"
                :close="true">
                <template slot="main">
                    <page url="./sys/authUsers"></page>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="复选框树"
                :close="true">
                <template slot="main">
                    <tree
                        v-if="zTreeNodes"
                        :nodes="zTreeNodes"
                        :checkEnable="true"
                        :parent="parent"></tree>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="必填项layVerify=required（必填项）phone（手机号）email（邮箱）url（网址）number（数字）date（日期）identity（身份证）自定义值"
                :close="true">
                <template slot="main">
                <layui-form>
                        <layui-inline-input
                            label="议题名称" 
                            placeholder="请输入标题"
                            lay-verify="required"
                            :cssStyle="{width: '513px'}"></layui-inline-input>
                </layui-form>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="ueditor v-model 绑值  无需手动设置属性值">
                <template slot="main">
                    <layui-item>
                        <layui-inline-ue
                            label="备注"
                            v-model="ue.remark"></layui-inline-ue>
                    </layui-item>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="菜单后任务数字">
                <template slot="main">
                    <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
1. 需要菜单后显示数字的 在自己的服务中写一个接口 返回格式正确的数据
  GET SERVICE/work{模块名称}/menu/getCount  返回 Result { data: MAP(key: 组件名称，value: count)}
  例如:
  Map&lt;String, String> data = Maps.newHashMap();
  data.put("SysToDoList", new Random().nextInt() + "");
  data.put("MyApply", new Random().nextInt() + "");
  return Result.ok(data);
  2. 【暂定】页面中处理某件事应改变的数字的 调用方法 updateMenuNum 三个参数 1：组件名称 2：运算类型（add/sub）3: 差值
  调用一般形式为 this.$parent.updateMenuNum('组件名称‘, 'add', 1); (n + 1)
                    </pre>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="TEXTAREA">
                <template slot="main">
                    <layui-item>
                        <layui-inline-textarea
                            label="textarea 禁止输入+++"
                            :disabled="true"
                            v-model="textareaVal"></layui-inline-textarea>
                    </layui-item>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="弹出层模态框组件需继承BaseModal组件【非必需】{如有下拉框等组件时 点击空白处组件自动关闭 需继承该组件}">
                <template slot="main">
                    <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
import BaseModal from '@/views/base/BaseModal'

export default {
    extends: BaseModal,
                    </pre>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="列表页复选框的全选/取消全选 前提该组件继承Base且 data中含有page属性 当前默认key属性名为'id'">
                <template slot="main">
                    <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
//  checkedKeys为当前选中的key值集合
&lt;thead>
    &lt;tr>
        &lt;th width="5%" style="text-align:center;">
            &lt;layui-simple-checkbox 
                @clickCheckboxAfter="checkAll"
                :defautValue="2"
                v-model="checkType"
                :val="1"/>
        &lt;/th>
    &lt;/tr>
&lt;/thead>

&lt;tbody id="meetingTbody" class="footable_table">
    &lt;template v-for="(item, index) in page.list">
        &lt;tr 
            :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
            style="display: table-row;"
            :key="item.id">
            &lt;td style="text-align:center;">
                &lt;layui-simple-checkbox
                    :checkedVals="checkedKeys"
                    @clickCheckboxAfter="check"
                    :val="item.id"/>
            &lt;/td>
        &lt;/tr>
    &lt;/template>
&lt;/tbody>
                    </pre>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="TAG">
                <template slot="main">
                    <span class="label"><font>SSS</font><i data-v-499c5bac="" class="xm-iconfont icon-close"></i></span>
                </template>
            </layui-fieldset>
            <layui-fieldset
                label="axios 下载文件"
                :close="true">
                <template slot="main">
                    <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
返回头
headers content-disposition:"attachment;filename="test.xls""
api:
export const testExport = () => {
    return request({
        url: "xxx/exportFile",
        method: 'post',
        data: data,
        responseType: 'blob'
    });
}
view:
testExport().then(res => {
    this.download(res)
}).catch(err => {
    console.log(err);
});
                    </pre>
                </template>
            </layui-fieldset>
            <layui-fieldset
                label="Iconfont-阿里巴巴矢量图标"
                :close="true">
                <template slot="main">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-number-b-1"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-number-b-2"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-number-b-3"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-number"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-number1"></use>
                    </svg>
                </template>
            </layui-fieldset>
            <layui-fieldset
                label="列表页调整右对齐"
                :close="true">
                <template slot="main">
                    <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
  1. 确定组件生成的title宽度大还是你自己手写的宽度大 一般比较文字个数即可看出 若自己手写的宽度(如170px)大
     则须在使用的分页组件中加属性width="最大的宽度" 
     &lt;pagination
        width="170"
        ref="pagination">
	 若自己定义的不是最长的 则只需要知道最大的宽度即可 如85px
  2. 在自己手写的标题标签中加入class title title-text(可自定义名称)
     &lt;template slot="searchBtnBefore">
         &lt;span class="title title-text">关键字： &lt;/span>
         &lt;input type="text" v-model="otherParam.keyword" placeholder="输入标题或事项编号">
     &lt;/template>
     // 如果title都为四个字中文时 可无需在自己文件中定义该class
     .title-text {
         width: 85px;
     }
  3. 查看效果
                    </pre>
                </template>
            </layui-fieldset>
            <layui-fieldset
                label="文件上传<file-upload></file-upload>"
                :close="true">
                <template slot="main">
                    <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
1. id 可自定义 一般无需自定义
2. attachmentBusinessId 业务对象ID
3. attachmentBusinessType 业务对象类型
4. type 文件页面展示的形式 1. 图标 2. 列表 3. 自定义
5. module 模块名称 用于存储文件的路径 pub/{module}/随机生成的路径
6. canUpload 能否上传 默认true, false 禁止上传
7. label 上传图标前的文字说明 默认 文件上传切换为组件模式
8. notInModal 默认true, 如该组件用于模态框中 必须设置为false
9. deleteServiceName 删除文件默认是组件删除的,如果需要删除文件时干其他必要的事情，请定义该属性值，一般为 表名s
    最终的删除的地址为 表名s/{attachmentBusinessId}/sysAttachmentInfos/attachmentId, 携带有文件名称{attachmentName}
    例如：authUsers/1000/sysAttachmentInfos/f7e4b801f53b11e88964000c292da113 请求方式：DELETE
    后台调用：
    SysUtils.deleteAttachment(f7e4b801f53b11e88964000c292da113)
                    </pre>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="按钮">
                <template slot="main">
                    <layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-save"></i> 保存</button>
                        <button class="layui-btn layui-btn-lg layui-btn-orange"><i class="fa fa-paper-plane" aria-hidden="true"></i> 发布</button>
                        <button class="layui-btn layui-btn-lg layui-btn-danger"><i class="fa fa-trash"></i> 删除</button>
                        <button class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                        <button class="layui-btn layui-btn-lg layui-btn-blue"><i class="iconfont icon-Inserttopic"></i> 插入变量</button>
                        <button class="layui-btn layui-btn-lg layui-btn-light-blue"><i class="iconfont icon-shenpi2"></i> 审批后发布</button>
                        <button class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-check" aria-hidden="true"></i> 确认选择</button>
                        <button class="layui-btn layui-btn-lg layui-btn-orange"><i class="fa fa-save" aria-hidden="true"></i> 保存为模版</button>
                        <button class="layui-btn layui-btn-lg"><i class="iconfont  icon-zengjiaxiaji"></i> 增加下级</button>
                       
                    </layui-inline>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="防止重复提交"
                :close="true">
                <template slot="main">
                    <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
改造相关的api方法（post,put,patch）
1. /api/xxx.js
export function 某个请求方法(p1, p2, token) {//额外添加token参数
    return request({
        url: './xxxx',
        method: 'post', // or put or patch
        headers: { // 新增处 设置请求头
            token
        },    
        data: qs.stringify({
           p1，
           p2
        })
    })
}
2. /views/xxx.vue
methods: {
    // 此处 自定义表单 验证放于 this.submitHandler方法前 不能再其内部验证
    某个方法(关于新增或者更新的): function() {
        this.submitHandler((token) => {
            xxxApi.postOrPutOrPatch(p1, p2, token).then((res) => {
                // 此处你的业务代码

                // 如果当前页更新或新增后并不关闭，手动重置token
                this.resetToken(res);
            }).catch((error) => { // catch 原先可能有的地方并没有添加 请补上
                // 此处你的业务代码
                this.resetToken(error);
            })
        });
    }
}
3. 后台，新增或修改相关的接口方法上加上注解@Idempotent
例
@PostMapping("")
@Idempotent
public Result save(@RequestBody Xxx xxx) {
    return saveOrUpdate(xxx);
}
// 备注：前提你的组件继承Base 或者 BaseModal
// 请将各自负责的模块更改
                    </pre>
                </template>
            </layui-fieldset>

            <layui-fieldset
                    label="查看页面"
                    :close="true">
                    <template slot="main">
                        <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
** 所有输入选择控件 设为只读 状态 组件添加:readonly="globalReadonly" 加完后验证效果 如果还能输入或选择 请及时反馈
例
&lt;layui-item>
    &lt;layui-inline-radio
        name="voteFlag"
        label="是否投票"
        v-model="meetingSubject.subjectVoteFlag"
        :readonly="globalReadonly"
        :items="voteFlags"> &lt;/layui-inline-radio>
    &lt;layui-inline-select
        label="议题类型"
        v-model="meetingSubject.meetingSubjectTypeDict"
        :readonly="globalReadonly"
        :items="subjectTypes"> &lt;/layui-inline-select>
&lt;/layui-item>
** 如果是点击组件 调用自定义方法的 可添加 :disabledFunc="globalReadonly" 或 自己解决
例
&lt;layui-inline-input
    label="上会部门" 
    placeholder="点击选择上会部门"
    :value="officeNameMap[meetingSubject.officeId]"
    func="officeClick"
    :disabledFunc="globalReadonly"
    :readonly="true"
    @officeClick="officeClick(1)"
    :cssStyle="{width: '190px', 'margin-right': '8px'}">&lt;/layui-inline-input>
** 其他 非 调用 组件库中的组件 如何设为只读效果 自行解决

注意：如果组件继承Base，可直接使用globalReadonly属性，无需自己再自定义一个属性，当然如果不想用这个属性 也可自定义
                    </pre>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="查询页tab联动"
                :close="true">
                <template slot="main">
                    <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
// 在列表查询页使用过handleLevelTab 方法的 必须再添加resetNextLevel方法 返回true表示我点击的该行后 会将下一行条件重置，false不重置
// 不添加该方法 默认都不重置
// 原则出现handleLevelTab 必须出现resetNextLevel方法 请自行添加 
resetNextLevel: function(paramName) {
    return paramName == "center";
},
handleLevelTab: function(paramName, dictValue) {  
    ****
}    
                    </pre>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="字典选择输入框"
                :close="true">
                <template slot="main">
                    <layui-inline-dict-input
                        label="字典名称"
                        dictType="APTITUDE_DICT"
                        v-model="dictLabel"></layui-inline-dict-input>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="示例 or 提示"
                :close="true">
                <template slot="main">
                   <example title="需求背景-示例" text="为了解决XX问题，开展XX业务，实现XX目标......"></example>
                   <prompt title="需求背景-提示" text="跨境电商巨大的市场空间正吸引越来越多的银行加速布局，2017年达到7.5万亿元，同比增长19%。为进一步完善我行在电子商务跨境支付领域的系统功能，实现与支付机构、试点地区单一窗口平台、外贸综服企业等平台类客户对接，建立多场景应用模块，提出2018年跨境电商平台系统需求。"></prompt>
                </template>
            </layui-fieldset>

            <layui-fieldset
                label="字典选择输入框"
                :close="true">
                <template slot="main">
                    <layui-inline-dict-input
                        label="字典名称"
                        dictType="APTITUDE_DICT"
                        v-model="dictLabel"></layui-inline-dict-input>
                </template>
            </layui-fieldset>
        </layui-form>
         
    </content-box>
</template>

<script>
import { getDicts } from '@/api/dict'
import Page from '@/components/PaginationSimple'
import { getOfficeNodes } from '@/api/office'
import Tree from '@/components/Tree'
import Base from "@/views/base/Base"
var jsSHA = require("jssha");

export default {
    name: 'ComponentDemo',
	extends: Base,
    components: {
        Page, Tree
    },
    data () {
        return {
            tags: [],
            users: [],
            dicts: [],
            dictValue: '1A',

            mutilSelectItems: [],
            checkedVals: [1],

            parent: null,
            zTreeNodes: null,

            ue: {
                remark: 'ue v-model'
            },

            textareaVal: '测试-测试',

            n: 0,

            dictLabel: 'ss',
        }
    },
    mounted () {
        for(var i = 0; i < 10; i++) {
            this.tags.push({
                value: i,
                label: 'tag' + i
            });
        }

        this.users =  [{
            userId: 1,
            userName: "gag"
        }],

        getDicts("WORK_TASK_TYPE_DICT").then(res => {
            this.dicts = res.data[0] || [];
        });
      
        for (let index = 0; index < 10; index++) {
            this.mutilSelectItems.push({
                label: ('ss-' + index),
                value: index
            });
        }
        layui.use('code', function(){
  
        //layui.code(); 实际使用时，执行该方法即可。而此处注释是因为修饰器在别的js中已经执行过了
        });

        this.parent = this;
        getOfficeNodes(this.params).then(result => {
            this.zTreeNodes = result.data;
        });

        var shaObj = new jsSHA("SHA-512", "TEXT");
        shaObj.update("This is a ");
        shaObj.update("test");
        var hash = shaObj.getHash("HEX");
        console.log(hash);
    },
    methods: {
        checkNodeAfter: function(treeNode) {
            alert(JSON.stringify(treeNode));
        }
    }
}
</script>

<style scoped>

</style>


