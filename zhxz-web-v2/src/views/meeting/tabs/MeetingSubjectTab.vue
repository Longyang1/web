<template>
    <div>
        <div id="target-top" class="tab-title">{{ subject.subjectName }}</div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div class="wrapper wrapper-content">
                        <div class="row row-background">
                            <div class="col-lg-3 col-md-3 visible-lg-block left-border" :style="{height: rolHeight + 'px'}">
                                <div class="middle">
                                    <img class="" src="/img/meeting/metting4.png"/>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3 visible-md-block left-border" :style="{height: rolHeight + 'px'}">
                                <div class="middle">
                                    <img class="visible-md-block" height="170" src="/img/meeting/metting4.png"/>
                                </div>
                            </div>
    
                            <div v-if="manage" class="col-lg-2 col-md-3 middle" :style="{height: rolHeight + 'px'}">
                                <div class="o-btn-group">
                                    <button @click="tabSwitch({index: subjectSelectedIndex + subTabIndex})" :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': curTabStatus != noStartStatus, 'btn-disabled': isEnd}"><i class="fa fa-circle-o" aria-hidden="true"></i>启动议题</button>
                                    <img src="/img/meeting/m_btn_bottom.png" alt="">
                                    <span>点击启动议题按钮后参会人员进入该议题页面</span>
                                    <button v-if="manage" @click="next(subjectSelectedIndex + subTabIndex)" :class="{'layui-btn layui-btn-radius m-btn-next': true, 'm-btn-next-active': curTabStatus == 4}">下一项</button>
                                </div>
                            </div>
                            <div :class="{'col-lg-7 col-md-6': manage, 'col-lg-9 col-md-9': !manage}" :style="{height: rolHeight + 'px'}">
                                <div class="top row" ref="meetingContent">
                                    <!-- 事务类议题特殊部分 start -->
                                    <span v-if="!subject.projectId">{{ subject.subjectName}}</span>
                                    <img 
                                        v-if="manage && !disabled && !subject.projectId && subject.subjectVoteFlag == 'y'" 
                                        @click="subjectVote(subject.id, subjectSelectedIndex + subTabIndex)" 
                                        src="/img/meeting/subject-vote.png"
                                        style="float:right;padding-right: 10px;"/>
                                    <div v-if="!subject.projectId" class="meeting-content" v-html="subject.remark"></div>
                                    <!-- 事务类议题特殊部分 end -->
                                    <!-- 项目类议题特殊部分1 start -->
                                    <fieldset v-if="subject.projectId" class="layui-elem-field subject-title">
                                        <legend>
                                            <i class="fa fa-file-text-o text-warning"></i> 
                                            {{ project.projectName}}
                                            <div v-if="manage && !disabled && subject.subjectVoteFlag == 'y'">
                                                <img @click="subjectVote(subject.id, subjectSelectedIndex + subTabIndex)" src="/img/meeting/subject-vote.png"/>
                                            </div>
                                        </legend>
                                        <div class="layui-field-box">
                                            <div class="col-sm-12">
                                                <div class="agile-detail visible-lg-block">
                                                    <table class="subject-table">
                                                        <tbody>
                                                            <tr>
                                                                <td>牵头部门：{{ officeNameMap[project.officeId] }}</td>
                                                                <td>牵头部门联系人：{{ userMap[project.officeContactUserId] ? userMap[project.officeContactUserId] : ''}}</td>
                                                                <td>项目类型：
                                                                     {{ projectTypeMap[project.projectTypeDict]}}
                                                                </td>
                                                            </tr>
                                                            <tr v-if="false">
                                                                <td>总预算（万元）：
                                                                    <em v-if="project.projectTotalFund" class="text-roseo">￥{{ project.projectTotalFund}}</em>
                                                                </td>
                                                                <td>项目工期：{{ project.projectDuration}}<span v-if="project.projectDuration">个月</span></td>
                                                                <td>是否后评价：{{ project.evaluateFlag == 'y' ? '是' : '否'}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>项目概算（万元）：
                                                                    <em v-if="projectPlanInfo.budgetFundAdjust" class="text-roseo">￥{{ projectPlanInfo.budgetFundAdjust | thousand }}</em>
                                                                </td>
                                                                <td>项目优先级：{{ projectPriorityMap[projectPlanInfo.projectPriorityDict] }}</td>
                                                                <td>项目实施方式：{{ projectActualizeMap[projectPlanInfo.projectActualizeDict] }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>项目工期：{{ project.projectDuration }}<span v-if="project.projectDuration">个月</span></td>
                                                                <td>投产实施时间：{{ project.projectCommissioningDate | moment('YYYY-MM-DD') }}</td>
                                                                <td>涉及CR：{{ project.crInfo }}</td>
                                                            </tr>
                                                            <tr v-if="project.projectRemark">
                                                                <td colspan="3">备注：{{ project.projectRemark }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="agile-detail visible-md-block">
                                                    <table class="subject-table">
                                                         <tbody>
                                                            <tr>
                                                                <td>牵头部门：{{ officeNameMap[project.officeId] }}</td>
                                                                <td>牵头部门联系人：{{ userMap[project.officeContactUserId] ? userMap[project.officeContactUserId] : ''}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>项目类型：
                                                                     {{ projectTypeMap[project.projectTypeDict]}}
                                                                </td>
                                                                <td>项目概算（万元）：
                                                                    <em v-if="projectPlanInfo.budgetFundAdjust" class="text-roseo">￥{{ projectPlanInfo.budgetFundAdjust | thousand }}</em>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>项目优先级：{{ projectPriorityMap[projectPlanInfo.projectPriorityDict] }}</td>
                                                                <td>项目实施方式：{{ projectActualizeMap[projectPlanInfo.projectActualizeDict] }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>项目工期：{{ project.projectDuration }}<span v-if="project.projectDuration">个月</span></td>
                                                                <td>投产实施时间：{{ project.projectCommissioningDate | moment('YYYY-MM-DD') }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="3">涉及CR：{{ project.crInfo }}</td>
                                                            </tr>
                                                            <tr v-if="project.projectRemark">
                                                                <td colspan="3">备注：{{ project.projectRemark }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <!-- 项目类议题特殊部分1 end -->
                                </div>
                            </div>
                        </div>
                        <div v-if="subject.projectId" class="row row-background">
                            <div class="col-lg-12 col-md-12 left-border">
                                <fieldset class="layui-elem-field subject-title">
                                    <legend>
                                        <i class="fa fa-file-text-o text-warning"></i> 项目预算信息
                                        <div>
                                            <button @click="viewProjectInfo" type="button" class="btn btn-info vote-pdf"><i class="fa fa-hand-o-up" aria-hidden="true"></i> 更多项目信息</button>
                                        </div>    
                                    </legend>
                                    <div class="layui-field-box">
                                        <div class="col-sm-12">
                                            <ul class="sortable-list connectList agile-list ui-sortable">
                                                <li class="success-element">
                                                    <div class="agile-detail">
                                                        <table class="subject-child-table">
                                                            <tbody>
                                                                <tr>
                                                                    <th>立项申请预算（万元）</th>
                                                                    <th>使用本项目预算（万元）</th>
                                                                    <th>使用其他项目预算（万元）</th>
                                                                </tr>
                                                                <tr>
                                                                    <td class="text-roseo">{{ project.projectBudgetFund }}</td>
                                                                    <td class="text-roseo">{{ project.selfProjectBudgetFund }}</td>
                                                                    <td class="text-roseo">{{ project.otherProjectBudgetFund }}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="subject-child-table">
                                                            <tbody>
                                                                <tr data-v-41735e5b="">
                                                                    <td :rowspan="project.totalSystemFunds ? 7 : 6" style="width: 30.3%;">预算明细（万元）</td> 
                                                                    <td style="width: 33.4%;">软件开发预算</td> 
                                                                    <td class="text-roseo">{{ project.budgetSoftDevelop }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>硬件及系统软件采购预算</td>
                                                                    <td class="text-roseo">{{ project.budgetHardware }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>软件产品采购预算</td>
                                                                    <td class="text-roseo">{{ project.budgetSoftPurchase }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>咨询预算</td>
                                                                    <td class="text-roseo">{{ project.budgetConsult }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>其他预算</td>
                                                                    <td class="text-roseo">{{ project.budgetOther }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="ys-total">总计</td>
                                                                    <td class="ys-total text-roseo">{{ totalProjectBudget }}</td>
                                                                </tr>
                                                                <tr v-if="project.totalSystemFunds">
                                                                    <td class="ys-total">自建设以来总投入</td>
                                                                    <td class="ys-total text-roseo">{{ project.totalSystemFunds }}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <div id="bar" :style="{width: '100%', height: (barDivHeight + 'px')}"></div>
                                                        <div class="clear"></div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <!-- 项目类议题特殊部分2 start -->
                        <div v-if="subject.projectId && subitemMap[subject.id] && subitemMap[subject.id].length > 0" class="row row-background">
                            <div class="col-lg-12 col-md-12 left-border">
                                <fieldset class="layui-elem-field subject-title">
                                    <legend><i class="fa fa-file-text-o text-warning"></i> 分项预算信息</legend>
                                    <div class="layui-field-box">
                                        <div class="col-sm-12">
                                            <ul class="sortable-list connectList agile-list ui-sortable">
                                                <li class="success-element">
                                                    <div class="agile-detail">
                                                        <table class="subject-child-table">
                                                            <tbody>
                                                                <tr>
                                                                    <th :width="(subject.meetingSubjectTypeDict == 2 || subject.meetingSubjectTypeDict == 9) ? '50%' : '20%'">预算内容</th>
                                                                    <th width="10%">预算类型</th>
                                                                    <th width="15%">预算金额（万元）</th>
                                                                    <th v-if="subject.meetingSubjectTypeDict != 2 && subject.meetingSubjectTypeDict != 9" width="15%">采购方式</th>
                                                                    <th v-if="subject.meetingSubjectTypeDict != 2 && subject.meetingSubjectTypeDict != 9" width="40%">入围公司</th>
                                                                    <th v-if="subject.meetingSubjectTypeDict == 2 || subject.meetingSubjectTypeDict == 9" width="25%">合同类型</th>
                                                                    <!-- <th v-if="subject.meetingSubjectTypeDict == 2 || subject.meetingSubjectTypeDict == 9" width="40%">知识产权归属</th> -->
                                                                </tr>
                                                                <tr v-for="subitem in subitemMap[subject.id]" :key="subitem.id">
                                                                    <td>{{ subitem.subitemName }}</td>
                                                                    <td>{{ budgetaryTypeDicts | dictValue(subitem.budgetaryTypeDict) }}</td>
                                                                    <td class="text-roseo"><span v-if="subitem.subitemBudgetFund">￥</span>{{ subitem.subitemBudgetFund}}</td>
                                                                    <td v-if="subject.meetingSubjectTypeDict != 2 && subject.meetingSubjectTypeDict != 9">{{ procurementStyleDicts | dictValue(subitem.procurementStyleDict) }}</td>
                                                                    <td v-if="subject.meetingSubjectTypeDict != 2 && subject.meetingSubjectTypeDict != 9">{{ subitem.enteringCompany}}</td>
                                                                    <td v-if="subject.meetingSubjectTypeDict == 2 || subject.meetingSubjectTypeDict == 9">{{ contractTypeDicts | dictValue(subitem.contractTypeDict) }}</td>
                                                                    <!-- <td v-if="subject.meetingSubjectTypeDict == 2 || subject.meetingSubjectTypeDict == 9">{{ subitem.intellectualPropertyOwnership}}</td> -->
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <span style="float:right">合计：{{ totalBudget }}万元</span>
                                                        <div class="clear"></div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>

                         <!-- 项目类议题特殊部分2 end -->
                        <div v-if="projectAttachments && projectAttachments.length > 0" class="row row-background">
                            <div class="col-lg-12 col-md-12 left-border">
                                <fieldset class="layui-elem-field subject-title">
                                    <legend><i class="fa fa-file-text-o text-warning"></i> 立项材料</legend>
                                    <div class="layui-field-box">
                                        <div class="col-sm-12">
                                            <ul class="sortable-list connectList agile-list ui-sortable">
                                                <li class="success-element">
                                                    <div class="agile-detail">
                                                        <table class="subject-child-table">
                                                            <tbody>
                                                                <tr>
                                                                    <th width="60%">立项材料</th>
                                                                    <!-- <th>负责人</th>
                                                                    <th>汇报部门</th>
                                                                    <th>汇报时间(分钟)</th> -->
                                                                </tr>
                                                                <template v-for="(item, index) in projectAttachments">
                                                                    <tr :key="item.id + index">
                                                                        <!-- v-on:click="showFile(subject, reportMember, (memSubAttachmentMap[reportMember.id] ? memSubAttachmentMap[reportMember.id][0] : null))" -->
                                                                        <td style="text-align: left">
                                                                            <a @click="showFile(subject, null, item)" target="_blank">
                                                                            <i :class="fileIconClass([item])" aria-hidden="true"></i>
                                                                            {{ item['attachmentName'].substring(0, item['attachmentName'].lastIndexOf('.')) }}
                                                                            </a>
                                                                        </td>
                                                                        <!-- <td>{{ reportMember.memberId ? userMap[reportMember.memberId] : '' }}</td>
                                                                        <td>{{ reportMember.officeId ? officeNameMap[reportMember.officeId] : ''}}</td>
                                                                        <td>{{ reportMember.reportTime > 0 ?  reportMember.reportTime : '' }}</td> -->
                                                                    </tr>
                                                                </template>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        
                        <!-- 项目类议题特殊部分2 end -->
                        <div v-if="subitemMap['mems_' + subject.id] && subitemMap['mems_' + subject.id].length > 0" class="row row-background">
                            <div class="col-lg-12 col-md-12 left-border">
                                <fieldset class="layui-elem-field subject-title">
                                    <legend><i class="fa fa-file-text-o text-warning"></i> 汇报材料、汇报人列表</legend>
                                    <div class="layui-field-box">
                                        <div class="col-sm-12">
                                            <ul class="sortable-list connectList agile-list ui-sortable">
                                                <li class="success-element">
                                                    <div class="agile-detail">
                                                        <table class="subject-child-table">
                                                            <tbody>
                                                                <tr>
                                                                    <th width="60%">汇报材料</th>
                                                                    <th>负责人</th>
                                                                    <th>汇报部门</th>
                                                                    <th>汇报时间(分钟)</th>
                                                                </tr>
                                                                <template v-for="(reportMember, index) in subitemMap['mems_' + subject.id]">
                                                                    <tr 
                                                                        :key="'dir_' + index"
                                                                        v-if="minDirIndexs.indexOf(index, 'index') != -1">
                                                                        <td 
                                                                            style="text-align: left"
                                                                            @click="openOrCloseDir(minDirIndexs[minDirIndexs.indexOf(index, 'index')].dirName)">
                                                                            <i :class="{'fa': true, 'fa-folder': minDirIndexs[minDirIndexs.indexOf(index, 'index')].dirName != curDirName, 'fa-folder-open': minDirIndexs[minDirIndexs.indexOf(index, 'index')].dirName == curDirName}" aria-hidden="true" style="color: #e2b25d;"></i> {{ minDirIndexs[minDirIndexs.indexOf(index, 'index')].dirName }}
                                                                        </td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>
                                                                    <tr 
                                                                        :key="reportMember.id" 
                                                                        :class="{'hidden': ((memSubAttachmentMap[reportMember.id] && memSubAttachmentMap[reportMember.id][0]) && memSubAttachmentMap[reportMember.id][0]['dirName'] && memSubAttachmentMap[reportMember.id][0]['dirName'] != curDirName)}">
                                                                        <!-- v-on:click="showFile(subject, reportMember, (memSubAttachmentMap[reportMember.id] ? memSubAttachmentMap[reportMember.id][0] : null))" -->
                                                                        <td 
                                                                            style="text-align: left"
                                                                            :class="{'child-padding': ((memSubAttachmentMap[reportMember.id] && memSubAttachmentMap[reportMember.id][0]) && memSubAttachmentMap[reportMember.id][0]['dirName'])}">
                                                                            <a @click="showFile(subject, reportMember, (memSubAttachmentMap[reportMember.id] ? memSubAttachmentMap[reportMember.id][0] : null))" target="_blank">
                                                                            <i :class="fileIconClass(memSubAttachmentMap[reportMember.id])" aria-hidden="true"></i>
                                                                            {{ (memSubAttachmentMap[reportMember.id] && memSubAttachmentMap[reportMember.id][0]) ? memSubAttachmentMap[reportMember.id][0]['attachmentName'].substring(0, memSubAttachmentMap[reportMember.id][0]['attachmentName'].lastIndexOf('.')) : ''}}
                                                                            </a>
                                                                        </td>
                                                                        <td>{{ reportMember.memberId ? userMap[reportMember.memberId] : '' }}</td>
                                                                        <td>{{ reportMember.officeId ? officeNameMap[reportMember.officeId] : ''}}</td>
                                                                        <td>{{ reportMember.reportTime > 0 ?  reportMember.reportTime : '' }}</td>
                                                                    </tr>
                                                                </template>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>

                        <!-- 投票草稿 start -->
                        <div v-if="false && meeting.meetingTypeDict != 6 && !isEnd && !manage && canVote && subject.subjectVoteFlag == 'y'" class="row row-background">
                            <div class="col-lg-12 col-md-12 left-border">
                                <fieldset class="layui-elem-field subject-title">
                                    <legend><i class="fa fa-file-text-o text-warning"></i> 投票草稿</legend>
                                    <div class="layui-field-box">
                                        <div class="col-sm-12">
                                            <ul class="sortable-list connectList agile-list ui-sortable">
                                                <li class="success-element">
                                                    <div class="agile-detail">
                                                        <table class="subject-child-table">
                                                            <tbody>
                                                                <tr>
                                                                    <th v-if="hasRatingItem" colspan="2" style="min-width: 315px;"><!-- 项目立项可行性研究 -->评分项</th> 
                                                                    <th style="min-width: 135px;">表决意见</th> 
                                                                    <th>意见说明</th>
                                                                </tr>
                                                                <tr>
                                                                    <td v-if="subject.ratingItem">{{ ratingItemMap[subject.ratingItem.split(',')[0]] }}</td>
                                                                    <td v-if="subject.ratingItem" style="text-align: left;">
                                                                        <star-rate 
                                                                            v-if="refresh" 
                                                                            v-model="memberVote['scoreResultJson'][subject.ratingItem.split(',')[0]]" 
                                                                            :name="subject.id"
                                                                            :disabled="myVoteDetailMap[subject.id] ? true : false"
                                                                            :on-change="ratingChange" 
                                                                            type="star1" 
                                                                            active-color="#fadb14" 
                                                                            inactive-color="#ccc" 
                                                                            hover-color="#fadb14"/>
                                                                        <span class="text rating-text">您的评分：{{ memberVote['scoreResultJson'][subject.ratingItem.split(',')[0]] }} 分</span>
                                                                    </td>
                                                                    <td v-if="memberVote" :rowspan="subject.ratingItem ? subject.ratingItem.split(',').length : 1" :colspan="subject.voteOptions.split(',').indexOf(2) != -1 ? 1 : 1" style="text-align: left;">
                                                                        <layui-radio-group
                                                                            v-if="refresh"
                                                                            :textMap="voteOptionMap" 
                                                                            :vals="subject.voteOptions.split(',')"
                                                                            :name="subject.id"
                                                                            :disabled="myVoteDetailMap[subject.id] ? true : false"
                                                                            :val="memberVote.voteOpinionDict"
                                                                            formRadioClass="form-radio"
                                                                            v-model="memberVote.voteOpinionDict"
                                                                            @checkedAfter="voteOpinionChange"/>
                                                                    </td>
                                                                    <td v-if="subject.voteOptions.split(',').indexOf(2) != -1 || true" :rowspan="subject.ratingItem ? subject.ratingItem.split(',').length : 1" style="min-width: 160px;">
                                                                        <form class="form-horizontal m-t" id="commentForm">
                                                                            <div class="form-group">
                                                                                <div class="col-sm-12">
                                                                                    <textarea v-model="memberVote.remark" class="form-control" required="" :disabled="myVoteDetailMap[subject.id] ? true : false" aria-required="true" rows="4" placeholder="请写下您的宝贵意见..."></textarea>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </td>
                                                                </tr>
                                                                <template v-for="(dict,dIndex) in (subject.ratingItem ? subject.ratingItem.split(',') : [])">
                                                                    <tr 
                                                                        v-if="dIndex != 0" 
                                                                        :key="subject.id + '-' + dIndex">
                                                                        <td>{{ ratingItemMap[dict] }}</td>
                                                                        <td  v-if="memberVote" style="text-align: left;">
                                                                            <star-rate 
                                                                                v-if="refresh" 
                                                                                v-model="memberVote['scoreResultJson'][dict]" 
                                                                                :name="subject.id"
                                                                                :on-change="ratingChange" 
                                                                                :disabled="myVoteDetailMap[subject.id] ? true : false"
                                                                                :value="memberVote['scoreResultJson'][dict]"
                                                                                class="test" 
                                                                                type="star1" 
                                                                                active-color="#fadb14" 
                                                                                inactive-color="#ccc" 
                                                                                hover-color="#fadb14"/>
                                                                            <span class="text rating-text">您的评分：{{ memberVote['scoreResultJson'][dict] }} 分</span>
                                                                        </td>
                                                                    </tr>
                                                                </template>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <!-- 投票草稿 end -->
                    </div>
                    <br class="clear">
                </dd>
            </dl>
        </div>
        <div v-if="disabled" class="watermark-image"></div>
        <a id="fileA" ref="attaTag" :href="attaUrl" target="_blank"></a>
    </div>
</template>

<script>
import { getTabIndex, getMeeting, getManage, getCurTabStatus, getSubjectSelectedIndex, getUserMap, getOfficeNameMap, getDicts } from '@/utils/meetingUtils'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import StarRate from '@/components/StarBtn'
import LayuiRadioGroup from '@/components/LayuiRadioGroup'
import meetingTabMixin from '@/mixin/meetingTabMixin'
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
import 'echarts/theme/macarons.js'
// import * as projectPlanInfoApi from '@/api/project/projectPlanManager/projectPlanInfo'
// import { getProjectEsCostShares } from '@/api/project/projectInfo'
import { getAttaments } from '@/api/file'

export default {
    mixins: [meetingTabMixin],
    components: {
        StarRate,
        LayuiRadioGroup
    },
    data () {
        return {
            rolHeight: 100270,
            isshowpdf:false,
            curDirName: '',
            minDirIndexs: [],
            memberVote: {
                subjectId: '',
                scoreResultJson: '',
                voteOpinionDict: '',
                remark: ''
            },
            refresh: true,
            canChangeScore: true,
            attaUrl: '',
            projectPlanInfo: {},
            barDivHeight: 0,
            projectAttachments: [],
        }
    },
    computed: {
        ...mapGetters({
            votingCandidates: 'meeting/votingCandidates',
        }),
        curTabStatus: function(){
            return getCurTabStatus(this, this.subjectSelectedIndex + this.comIndex);
        },
        canVote() {
            return this.votingCandidates.indexOf(this.user.userId, 'userId') != -1;
        },
        subjectSelectedIndex: function(){
            return getSubjectSelectedIndex(this);
        },
        subject: function(){
            return this.inSelectSubjects[this.subjectSelectedIndex];
        },
        subitemMap: function(){
            return this.$store.state.meeting.subitemMap;
        },
        memSubAttachmentMap: function(){
            return this.$store.state.meeting.memSubAttachmentMap;
        },
        budgetaryTypeDicts: function(){
            return getDicts(this, 6);
        },
        procurementStyleDicts: function(){
            return getDicts(this, 7);
        },
        contractTypeDicts: function() {
            return getDicts(this, 8);
        },
        projectInfoMap: function(){
            return this.$store.state.meeting.projectInfoMap;
        },
        projectTypes: function() {
            return getDicts(this, 5);
        },
        projectTypeMap: function() {
            return this.projectTypes.array2Obj("value", 'label');
        },
        projectPriorityMap: function() {
            return getDicts(this, 9).array2Obj("value", 'label');
        },
        projectActualizeMap() {
            return getDicts(this, 10).array2Obj("value", 'label');
        },
        hasRatingItem: function(){
            var sub = this.subject;
            return sub.ratingItem && sub.ratingItem != "" && sub.ratingItem.trim().split(',').length > 0;
        },
        memberSubjectVotes: function() {
            return this.$store.state.meeting.memberSubjectVotes || [];
        },
        disabled () {
            return false;//this.disabledSubjectIds.indexOf(this.subject.id) != -1;
        },
        votingDraftRefresh() {
            return this.$store.state.meeting.votingDraftRefresh;
        },
        votingDraftDestory() {
            return this.$store.state.meeting.votingDraftDestory;
        },
        totalBudget() {
            var totalBudget = 0;
            this.subitemMap[this.subject.id].forEach(subitem => {
                if (subitem.subitemBudgetFund) {
                    totalBudget += parseFloat(subitem.subitemBudgetFund);
                }
            });
            var nums = (totalBudget + "").split(".");
            if (nums.length <= 1 || (nums[1] + "").length <= 3) {
                return totalBudget;
            }
            return totalBudget.toFixed(3);
        },
        project(){
            return this.projectInfoMap[this.subject.id] || {};
        },
        totalProjectBudget: function() {
            var totalProjectBudget = 0;
            var project = this.project;
            totalProjectBudget += project.budgetSoftDevelop ? parseFloat(project.budgetSoftDevelop) : 0;
            totalProjectBudget += project.budgetHardware ? parseFloat(project.budgetHardware) : 0;
            totalProjectBudget += project.budgetSoftPurchase ? parseFloat(project.budgetSoftPurchase) : 0;
            totalProjectBudget += project.budgetConsult ? parseFloat(project.budgetConsult) : 0;
            totalProjectBudget += project.budgetOther ? parseFloat(project.budgetOther) : 0;
            var nums = (totalProjectBudget + "").split(".");
            if (nums.length <= 1 || (nums[1] + "").length <= 3) {
                return totalProjectBudget;
            }
            return totalProjectBudget.toFixed(3);
        }
    },
    watch: {
        subject: function() {
            this.projectAttachments = [];
            this.projectPlanInfo = {};
            this.updateMinDirIndex();
            var index = this.memberSubjectVotes.indexOf(this.subject.id, 'subjectId');
            if (index != -1) {
                this.memberVote = this.memberSubjectVotes[index];
            } else {
                this.initMeetingVote(this.subject);
            }

            this.canChangeScore = true;
           
            if (this.subject.projectId && this.projectInfoMap[this.subject.id]) {
                var projectPlanId = this.projectInfoMap[this.subject.id].projectPlanId;
                // projectPlanInfoApi.get(projectPlanId).then(res => {

                //     if (res.data) {
                //         this.projectPlanInfo = res.data.projectPlanInfo || {};
                //     }

                //     this.refresh = false;
                //     this.$nextTick(function(){
                //         this.refresh = true;
                //         if(this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
                //             this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000);
                //         }
                //     });
                // });

                getAttaments({
                    attachmentBusinessId: this.subject.projectId,
                    attachmentBusinessType: 'project_info'
                }).then(res => {
                    var data = res.data;
                    if (data) {
                        this.projectAttachments = data.attachmentInfos || [];
                    }
                });
            } else {
                this.refresh = false;
                this.$nextTick(() => {
                    this.refresh = true;
                    if(this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
                        this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000);
                    }
                });
            }
            if (this.tabIndex == this.subTabIndex) {
                this.drawBar();
            }
        },
        memberVote: {
            handler() {
                this.$nextTick(() => {

                    if (this.votingDraftDestory != 2) {
                        this.updateMemberSubjectVotes(this.memberVote);
                    }
                });
            },
            deep: true
        },
        votingDraftRefresh: function() {
            var index = this.memberSubjectVotes.indexOf(this.subject.id, 'subjectId');
            if (index != -1) {
                this.memberVote = this.memberSubjectVotes[index];
                this.refresh = false;
                this.$nextTick(function(){
                    this.refresh = true;
                });
            } 
        },
        subjectVoteRefresh: function () {
            this.refresh = false;
            this.$nextTick(function(){
                this.refresh = true;
            });
        },
    },
    mounted () {
        console.log("会议开始tab-" + this.meetingId);

        this.updateMinDirIndex();

         if (this.subject.projectId && this.projectInfoMap[this.subject.id]) {
            var projectPlanId = this.projectInfoMap[this.subject.id].projectPlanId;
            projectPlanInfoApi.get(projectPlanId).then(res => {
                if (res.data) {
                    this.projectPlanInfo = res.data.projectPlanInfo;
                }

                this.refresh = false;
                this.$nextTick(function(){
                    this.refresh = true;
                    if(this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
                        this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000);
                    }
                    this.drawBar();
                });
            });
       
            getAttaments({
                attachmentBusinessId: this.subject.projectId,
                attachmentBusinessType: 'project_info'
            }).then(res => {
                var data = res.data;
                if (data) {
                    this.projectAttachments = data.attachmentInfos || [];
                }
            });
        } else {
            if(this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
                this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000);
            }
        }

        this.initMeetingVote(this.subject);

        var index = this.memberSubjectVotes.indexOf(this.subject.id, 'subjectId');
        if (index != -1) {
            this.memberVote = this.memberSubjectVotes[index];
            this.refresh = false;
            this.$nextTick(function(){
                this.refresh = true;
                this.drawBar();
            });
        }
    },
    methods: {
        ...mapActions({
            doTabSwitch: 'meeting/TAB_SWITCH',
            next: 'meeting/NEXT',
        }),
        ...mapMutations({
            setVoteSubjectIds: 'meeting/UPDATE_VOTE_SUBJECTIDS',
            setTabIndex: 'meeting/SET_TAB_INDEX',
            saveCurVoteSubjectTabIndex: 'meeting/SET_CUR_VOTE_SUBJECT_TAB_INDEX',
            //updateMemberSubjectVotes: 'meeting/UPDATE_MEMBER_SUBJECT_VOTES'
        }),
        updateMemberSubjectVotes: function(votes) {
            this.$store.commit('meeting/UPDATE_MEMBER_SUBJECT_VOTES', votes);
        },
        updateMinDirIndex: function() {
            this.curDirName = null;
            var reportMembers = this.subitemMap['mems_' + this.subject.id];
            if(!reportMembers){
                return;
            }
            this.minDirIndexs = [];
            reportMembers.forEach((ele, index) => {
                var memSubAttachment = this.memSubAttachmentMap[ele.id];
                if (memSubAttachment) {
                    var dirName = null;
                    if(memSubAttachment[0] && (dirName = memSubAttachment[0]['dirName']) && this.minDirIndexs.indexOf(dirName, 'dirName') == -1){
                        this.minDirIndexs.push({
                            index,
                            dirName
                        });
                    }
                }
            });
        },
        tabSwitch: function(param) {
            this.doTabSwitch(param).then(() => {
                // 非部务会不需弹出倒计时页面
                if(this.meeting.meetingTypeDict != 3){
                    return;
                }
                var minite = 0;
                if(this.subitemMap){
                    for(const key in this.subitemMap){
                        if(key == 'mems_' + this.subject.id){
                            this.subitemMap[key].forEach(item => {
                                minite += item.reportTime;
                            });
                            break;
                        }
                    }
                }
                this.$store.commit("meeting/UPDATE_MINUTE", minite);
                
                this.$store.commit("meeting/UPDATE_COUNTDOWN_SHOW", false);

                this.$store.commit("meeting/UPDATE_SHOW", {
                    show: 5
                });
                this.$nextTick(() => {
                    this.$store.commit("meeting/UPDATE_COUNTDOWN_SHOW", true);
                });

            });
        },
        fileIconClass: function(data){
            
            var atta = null;
            if (!data || !data[0]) {
               return '';
            }
            var atta = data[0];
        	var _class = 'fa file-icon ';
        	var suff = atta.attachmentSavePath.split('.')[1];
        	if("doc" == suff || "docx" == suff){
        		_class += 'fa-file-word-o file-icon-doc';
        	} else if("xlsx" == suff || suff == "xls"){
        		_class += 'fa-file-excel-o file-icon-excel';
        	} else if("pdf" == suff){
        		_class += 'fa-file-pdf-o file-icon-pdf';
        	} else if("ppt" == suff || "pptx" == suff){
        		_class += 'fa-file-powerpoint-o file-icon-ppt';
        	} else {
        		_class += 'fa-file-o';
        	}
        	return _class;
        },
        closepdf(){
            this.isshowpdf = false
        },
        pdferr(errurl) {
            console.log(errurl);
        },
        showFile: function(subject, reportMember, atta){

            if (!atta) {
                return;
            }
            var attaUrl = "";
            //this.isshowpdf = true;
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var isMobile = u.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var suff = atta.attachmentSavePath.substring(atta.attachmentSavePath.lastIndexOf(".") + 1 , atta.attachmentSavePath.length);
            if((suff == 'doc' || suff == "docx" || suff == 'xls' || suff == "xlsx" || suff == "ppt" || suff == "pptx" || suff == "pdf") && (!isMobile || isAndroid)){//!isMobile && 
                var show = 2;
                this.$store.commit("meeting/UPDATE_SHOW", {
                    show,
                    subject,
                    reportMember,
                    atta
                });
            } else {
        		if(isiOS && (suff == 'doc' || suff == "docx")){
        			//location.href =  process.env.API_HOST + "/pub/upload/" + atta.attachmentSavePath.substring(0, atta.attachmentSavePath.lastIndexOf(".")) + ".pdf";
                    attaUrl = "/api/file/pub/" + atta.attachmentSavePath.substring(0, atta.attachmentSavePath.lastIndexOf(".")) + ".pdf";                 
        		} else if (suff == 'xls' || suff == "xlsx") {
                    attaUrl = "/api/file/pub/" + atta.attachmentSavePath.substring(0, atta.attachmentSavePath.lastIndexOf(".")) + ".html";                 
                } else {
                    attaUrl = "/api/file/pub/" + atta.attachmentSavePath;
                }
                // location.href = process.env.API_HOST + "/pub/upload/" + atta.attachmentSavePath;
                // alert(this.attaUrl);
                //this.attaUrl = attaUrl;
                //alert(this.attaUrl);
                // var obj = document.getElementById('fileA');
                // obj.href = attaUrl;
                // obj.click();
                window.open(attaUrl)
                // this.$nextTick(() => {
                //     alert(this.$refs.attaTag.href);
                //     this.$refs.attaTag.click();
                //     // window.open(this.attaUrl)
                //     //$("#fileA").trigger('click');
                //     $("#fileA").trigger('click');
                // });
                //return th
                return attaUrl;
            }
        },
        subjectVote: function(subjectId, index){
            this.setVoteSubjectIds([subjectId]);
            this.setTabIndex(this.inSelectSubjects.length + this.subTabIndex);
            this.saveCurVoteSubjectTabIndex(index);
        },
        openOrCloseDir: function(dirName) {
            this.curDirName  = this.curDirName == dirName ? null : dirName;
        },
        initMeetingVote: function(element) {
            this.memberVote = {
                subjectId: element.id,
                scoreResultJson: defaultScoreResult(element),
                voteOpinionDict: null,
                remark: null
            }
            function defaultScoreResult(subject){
                if(!subject.ratingItem){
                    return null;
                }
                var ratingItems = subject.ratingItem.trim().split(',');
                var res = {};
                ratingItems.forEach(ele => {
                    res[ele] = 0;
                });
                return res;
            }
        },
        ratingChange: function(score, subjectId){
            this.canChangeScore = false;
        },
        voteOpinionChange: function(data) {
            
            if(!this.canChangeScore) {
                return;
            }
            var memberVote = this.memberVote;
            
            var defaultScore = getDefaultScore(data.val);
            for(const key in memberVote.scoreResultJson) {
                memberVote.scoreResultJson[key] = defaultScore;
            }
            memberVote.voteOpinionDict = data.val;
            this.$set(this.memberVote, 'voteOpinionDict', data.val);
            this.refresh = false;
            this.$nextTick(function(){
                this.refresh = true;
            });
            function getDefaultScore(voteOpinion){
                if(voteOpinion == 1){
                    return 4;
                }
                if(voteOpinion == 2){
                    return 3;
                }
                if(voteOpinion == 3){
                    return 1;
                }
                return 0;
            }
        },
        viewProjectInfo: function() {
            var projectId = this.subject.projectId;
            var projectInfo = this.projectInfoMap[this.subject.id] || {};
            var projectPlanId = projectInfo.projectPlanId;
            if (!projectPlanId) {
                msg("该项目关联的项目计划不存在，无法进行查看。");
                return;
            }
            // this.$layer.iframe({
            //     content: {
            //         content: ProjectAllFormForMeeting, //传递的组件对象
            //         parent: this,//当前的vue对象
            //         data: {
            //             projectPlanId
            //         }//props
            //     },
            //     area: ['90%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.9 + "px")],
            //     title: "更多项目信息"
            // });
        },
        drawBar: function() {
            if (!this.subject.projectId) {
                this.barDivHeight = 0;
                return;
            }
            // 'a25a28b3ff7c11e88964000c292da113'
            // var projectId = this.subject.projectId;
            // getProjectEsCostShares(projectId).then(res => {
            //     console.log(res)
            //     var data = res.data;
            //     if (data) {
            //         var projectEsCostShares = data.projectEsCostShares || [];
            //         if (projectEsCostShares.length <= 0) {
            //             this.barDivHeight = 0;
            //             echarts.init(document.getElementById('bar')).dispose();
            //             return;
            //         }
  
            //         var officeNameMap = data.officeNameMap || {};
            //         var barDiv = document.getElementById('bar');
            //         this.barDivHeight = 25 * projectEsCostShares.length + 80;
            //         this.$nextTick(() => {
            //             echarts.init(document.getElementById('bar')).dispose();
            //             var myChart = echarts.init(barDiv, 'macarons');
            //             // 绘制图表
            //             var yStyle = { 
            //                 normal: {
            //                     label : {
            //                         show: true, 
            //                         position: 'insideRight',
            //                         formatter:'{c} %'
            //                     }
            //                 }
            //             };
    
            //             var showData = [];
            //             var barData = [];
            //             var ynames = [];
            //             projectEsCostShares.forEach(item => {
            //                 barData.push(item.percentNumber);
            //                 ynames.push(officeNameMap[item.departmentId]);
            //                 // ynames.push(item.departmentId);
            //             });
            //             var t = {};
            //             t.name = '成本分摊占比';
            //             t.type = 'bar';
            //             t.stack = '总量';
            //             t.itemStyle = yStyle;
            //             t.data = barData;
            //             t.barWidth= 15;
            //             t.barCategoryGap = 20;
            //             showData.push(t);
    
            //             var option = {
            //                 title: {
            //                     text: '成本分摊',
            //                 },
            //                 tooltip : {
            //                     trigger: 'axis',
            //                     axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            //                         type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            //                     },
            //                     formatter: function (params, ticket, callback) {
            //                         var res = params[0].name;
            //                         for (var i = 0, l = params.length; i < l; i++) {
            //                             res += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + "%";
            //                         }
            //                         return res;
            //                     }
            //                 },
            //                 legend: {
            //                     x : 'right',
            //                     y : 'top',
            //                     padding: [5, 5, 5, 5],
            //                     data: ['成本分摊占比']
            //                 },
            //                 calculable: true,
            //                 grid: {y: 40, y2:30, x:100, x2:10},
            //                 xAxis : [
            //                     {
            //                         type : 'value',
            //                     }
            //                 ],
            //                 yAxis : [
            //                     {
            //                         type : 'category',
            //                         data : ynames,
            //                         axisLabel:{interval: 0}
            //                     }
            //                 ],
            //                 series : showData
            //             };
                                            
            //             myChart.setOption(option, true); 
            //         });
                    
            //     } else {
            //         this.barDivHeight = 0;
            //         echarts.init(document.getElementById('bar')).dispose();
            //     }
            // });
            
        }
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style lang="less" scoped>
    fieldset.subject-title {
       border: none;
       text-align: left;
    }
    .subject-table {
       font-size: 14px;
    }
    .subject-table tr td {
       height: 32px;
       line-height: 32px;
    }
   /* .subject-table .visible-md-block tr td {
       width: 50%;
   } */
    .top {
       padding-top: 20px;
    }
    .col-lg-9 .subject-table .visible-lg-block tr td {
       width: 33%;
    }
    fieldset.subject-title {
        margin-top: 0px;
    }
    .file-icon {
        margin-right: 4px;
    }
    .file-icon-doc {
        color: #2564A9;
    }
    .file-icon-excel {
        color: #549F3B;
    }
    .file-icon-pdf {
        color: #EE7B24;
    }
    .file-icon-ppt {
        color: #E65618;
    }
    legend {
        width: 100%;
    }
    legend > div {
        display: inline-block;
        padding-right: 40px;
        float: right;
    }
    .child-padding {
        padding-left: 24px;
    }
    td {
        vertical-align: middle;
    }
    td /deep/ .layui-unselect.layui-form-radio {
        display: block;
        padding-bottom: 10px;
    }
    td /deep/ .star-full {
        margin-right: 0px;
    }
    td /deep/ .star-main {
        margin: 0;
    }
    td /deep/ .icon-star1 {
        font-size: 26px;
    }
    .watermark-image {
        position: relative;

        width: 100%;
        height: 100%;

        /* background: url("/img/meeting/timg.jpg") no-repeat; */
        background-size: 300px;
    }

    .watermark-image:before {
        content: "该议题已失效.";
        font-size: 33pt;

        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -170px;

        background-color: rgba(255, 255, 0, 0.7);
        -webkit-transform:rotate(-45deg);
    }
    .ys-total {
        background: #0b92e4;
        color: #fff;
        font-weight: bold;
    }
</style>
