<template>
    <layui-inline-tag
        :label="label"
        v-model="users"
        labelKey="userName"
        valKey="userId"
        :layVerify="layVerify"
        :placeholder="placeholder"
        :readonly="readonly"
        @clickTagContainerAfter="clickTagContainerAfter"></layui-inline-tag>
</template>

<script>
import UserSelectList from "@/components/UserSelectList"

export default {
    data () {
        return {
            users: this.value || [],
            selectUserOfficeMap: this.userOfficeMap || {},
        }
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        value: {
            type: Array,
            default: () => {
                return [];
            }
        },
        userOfficeMap: {
            type: Object,
            default: function() {
                return {};
            }
        },
        layVerify: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '点击选择人员'
        },
        readonly: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        value: function() {
            this.users = this.value || [];
        },
        users: function() {
            this.$emit('input', this.users);
        },
        userOfficeMap: function() {
            this.selectUserOfficeMap = this.userOfficeMap || {}
        }
    },
    mounted () {
        this.users = this.value || [];
    },
    methods: {
        clickTagContainerAfter: function() {
            this.$layer.iframe({
				content: {
					content: UserSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						
					}//props
				},
				area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title:"人员选择"
			});
        },
        getSelectUsers: function(users, selectUserOfficeMap, layid){
            users.forEach(element => {
                this.users.remove(element.userId, 'userId');
                this.users.push(element);
            });
            Object.assign(this.selectUserOfficeMap, selectUserOfficeMap);
            this.$layer.close(layid);
        },
        getTagLabel(item, labelKey) {
            var orgName = this.selectUserOfficeMap[item.userId] ? (this.selectUserOfficeMap[item.userId].orgName + "/") : '';
            return orgName + item[labelKey];
        }
    }
}
</script>

