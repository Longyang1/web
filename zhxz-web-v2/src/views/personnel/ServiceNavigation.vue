<template>
    <div class="wrapper wrapper-content">
        <div class="row animated fadeInRight">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <!-- 表头 -->
                    <div class="ibox-title">
                        <h5>行员服务助手</h5>
                    </div>
                    <!-- 内容 -->
                    <div class="ibox-content clearfix">
                        <!-- 个人信息维护服务 -->
                        <div class="main-msg col-sm-4">
                            <div class="logo-box">
                                <img src="/img/personnel/gerenxinxiweihu.png" alt="">
                            </div>
                            <div class="content-btn">
                                <div class="content-text">
                                    <h3>个人信息维护服务</h3>
                                    <p>提供个人简历信息的自助维护服务、个人调休假、年假剩余天数的查询服务等</p>
                                </div>
                                <div class="content-title">
                                    <div v-if="reqEnd" class="bottom_box_btn">
                                        <div v-if="personnel.id" @click="toView('PersonnelProfile', '信息档案', {id: personnel.id, userType: personnel.userType, canEdit: (personnel.userUid == curUser.username)})" class="btn"><span><img src="/img/personnel/guanliwodegerenxinxi.png" alt="" class="vt"></span> 管理我的个人信息</div>
                                        <div v-if="!personnel.id" @click="linkMy()" class="btn" style="color: red;font-weight: bold;"><span><img src="/img/personnel/guanlianwodejianli.png" alt="" class="vt"></span> 关联我的简历</div>
                                        <div v-if="false" class="btn"><span><img src="" alt=""></span> 我的考勤查询</div><br>
                                        <div v-if="false" class="btn"><span><img src="" alt=""></span> 我的假期查询（年假：8天/调休：21天）</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="main-msg col-sm-4" v-if="false">
                            <div class="logo-box">
                                <img src="/img/personnel/gerenxinxiweihu.png" alt="">
                            </div>
                            <div class="content-btn">
                                <div class="content-text">
                                    <h3>事项申请服务</h3>
                                    <p>提供年假、事假、调休等各类事项申请服务</p>
                                </div>
                                <div class="content-title">
                                    <div class="btn">我的申请（2）</div><br>
                                        <div class="btn">事假申请</div>
                                        <div class="btn">病假申请</div><br>
                                        <div class="btn">调休申请</div>
                                        <div class="btn">出差申请</div><br>
                                    </div>
                            </div>
                        </div>

                        <!-- 其他服务 -->
                        <div class="main-msg col-sm-4">
                            <div class="logo-box">
                                <img src="/img/personnel/qita.png" alt="">
                            </div>
                            <div class="content-btn">
                                <div class="content-text">
                                    <h3>其他服务</h3>
                                    <p>提供通讯录查询等其他服务</p>
                                </div>
                                <div class="content-title">
                                    <div class="bottom_box_btn">
                                        <div v-authorize="'ITIM.PERSONNEL.MYADDRESS'" @click="toView('PersonnelAddressBookList', '通讯录')" class="btn" style="margin-right:10px;"><span><img src="/img/personnel/tongxunlu.png" alt="" class="vt"></span> 通讯录</div>
                                        <!-- <div v-authorize="'ITIM.PERSONNEL.INFOSTATISTICS'" @click="toView('PersonnelStatistics', '行员信息统计')" class="btn"><span><img src="/img/personnel/hangyuanxinxitongji.png" alt="" class="vt"></span> 行员信息统计</div> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Base from "@/views/base/Base"
import * as personnelApi from '@/api/personnel/personnel'
import LinkMyList from '@/views/personnel/LinkMyList'

export default {
    name: 'ServiceNavigation',
    extends: Base,
    data () {
        return {
            personnel: {},
            reqEnd: false,
        }
    },
    mounted () {
        personnelApi.getMe().then(res => {
            var data = res.data;
            if (data) {
                this.personnel = Object.assign({}, data);
            }
            this.reqEnd = true;
        }).catch(error => {
            this.reqEnd = true;
        });
    },
    methods: {
        toView: function (view, title, data) {
            this.$parent.closeTabByName(view);
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "personnel",
                "name": view,
                "parentId": "4",
                "text": title,
                "children": [

                ]
            }, 3, data);
        },
        linkMy: function() {
            this.$layer.iframe({
                content: {
                    content: LinkMyList, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        name: this.curUser.realName
                    }
                },
                area:['auto', 'auto'],
                title: "关联我的简历"
			});
        }
    }
}
</script>

<style scoped>
/* 引入的字体 */
/* @font-face {
    font-family: "SourceHanSansCN-Light";
    src: url("../../../static/fonts/SourceHanSansCN-Light.ttf");
} */
/* 新版开始 */
.main-msg {
    display: flex;
    background: #fff;
    height: 250px;
    width: 550px;
    margin-right: 70px;
    box-shadow: 0 0 15px #5f6f85;
    border-radius: 10px;
    margin-top: 35px;
    /* min-height:  */
}
.logo-box {
    height: auto;
    text-align: center;
    width: 110px;
    border-radius: 55px;
    margin: auto;
    /* margin-left: 42px; */
    line-height: 110px;
    /* border: 1px solid #e1e7ec; */
    vertical-align: middle;
    background: #f5f9fe;
    position: relative;
    margin-right: 30px;
    margin-left: 20px;
}

.content-btn {
    position: relative;
    width: 100%;
    flex: 1;
    padding-top: 10px;
}
.content-btn .content-text {
    padding-left: 10px;
}
.content-btn .content-text p {
    color: #A19F9E;
}
.content-btn .content-text h3 {
    color: #437BAE;
    font-weight: 400;
}
/* 新版结束 */
.wrapper-content {
    background-color: #f6f9fd;
    height: 100%;
}
.ibox-title h3 {
    margin: 0;
}
.ibox-title {
    height: 50px;
    padding: 0;
}
.ibox-title h5 {
    height: 50px;
    line-height: 50px;
    padding: 0;
    padding-left: 20px;
    margin: 0;
    text-overflow: ellipsis;
    float: none;
}

.ibox-title h5 {
    display: inline-block;
    font-size: 14px;
    /* margin: 0 0 7px; */
    /* padding: 0; */
    text-overflow: ellipsis;
}
.wrapper-content {
    padding-top: 23px;
}
.ibox-content {
    background-color: #f6f9fd;
    /* padding-top: 38px; */
    padding-bottom: 55px;
}
.ibox-content .dd {
    /* float: left; */
    width: 350px;
    height: 560px;
    margin-left: 45px;
    background-color: #fff;
    box-shadow: 0 0 15px #5f6f85;
    border-radius: 10px;
    margin-top: 23px;
}
.ibox-content > div h3 {
    color: #333;
    font-weight: 800;
}
.ibox-content .top_box {
    text-align: center;
    height: 278px;
}
.ibox-content .box_img {
    width: 134px;
    height: 134px;
    line-height: 134px;
    border-radius: 50%;
    background-color: #f5f9fe;
    margin: 36px auto;
}
.ibox-content .box_text {
    margin-top: 20px;
    margin-bottom: 26px;
    /* font-family: SourceHanSansCN-Light; */
    font-size: 14px;
    color: #b1bac3;
    font-weight: 800;
}
.ibox-content .bottom_box {
    border-top: 1px solid #d4e3f8;
    padding-bottom: 42px;
    text-align: center;
}
.ibox-content .bottom_box span {
    color:#36aa23;
}

.ibox-content .box3 .bottom_box .bottom_box_btn div {
    /* width: 213px; */
}
.ibox-content .box2 .bottom_box {
    text-align: center;
}
.ibox-content .box3 .bottom_box {
    text-align: center;
}
.ibox-content .box2 .bottom_box_btn .changeColor {
    width: 213px;
    background-color: #5f8df2;
    color: #fff;
}
.ibox-content .box2 .bottom_box_btn .changeColor:hover+.position_box {
    display: block;
}
/* calendar.css 的覆盖 */
.ibox-content h4 {
    margin-top: 0px;
}
/* laiui按钮的覆盖 */
.bottom_box .layui-btn-primary {
    border: 1px solid #4f8cf9;
    margin-top: 30px;
    font-size: 14px;
    color: #4f8cf9;
    min-width: 146px;
    padding-left: 15px;
    padding-right: 15px;
}
.layui-btn {
    padding: 0px;
}
.btn {
      margin-top: 10px;
      /* min-width: 144px; */
      /* border: 1px solid #4f8cf9; */
      font-size: 14px;
      /* color: #4f8cf9; */
      border-radius: 5px;
      padding: 9px 4px;
  }
.vt {
    vertical-align: sub;
}
/* bootstrap的覆盖 */
.p_m {
    padding: 0px;
}
/* 定位的box */
.box2 {
    position: relative;
}
.position_box {
    display: none;
    position: absolute;
    width: 227px;
    height: 220px;
    left: 80%;
    top: 70%;
    background-color: #fafafa;
    text-align: left;
}
.position_box h4 {
    font-size: 14px;
    height: 46px;
    line-height: 46px;
    color: #89949f;
    padding-left: 20px;
}
.position_box ul li {
    margin-top: 16px;
    /* font-family: SourceHanSansCN-Light; */
    font-size: 14px;
    padding-left: 20px;
}
.position_box ul li img {
    margin-right: 8px;
}
.position_box .position_box_content_bottom {
    width: 227px;
    border-top: 1px solid #ccc;
}

</style>



