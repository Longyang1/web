<template>
    <div :class="{'user-input-box': true, block: block}">
        <layui-inline-input
            v-if="type == 'layui'"
            :label="label" 
            :placeholder="placeholder"
            func="selectMember"
            @selectMember="selectMember"
            v-model="name"
            :block="block"
            :layVerify="layVerify"
            :readonly="true"></layui-inline-input>
        <input
            v-if="type == 'simple'"
            type="text" 
            v-model="name" 
            :placeholder="placeholder"
            @click="selectMember"
            :readonly="true">
    </div>
</template>

<script>
import UserSelectList from '@/components/UserSelectList'
export default {
    data() {
        return {
            name: this.userName || '',
        }
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        func: {
            type: String,
            default: null
        },
        value: {
            type: [String, Number],
            default: ''
        },
        userName: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '点击选择'
        },
        type: {
            type: String,
            default: 'layui'
        },
        block: {
            type: Boolean,
            default: false
        },
        layVerify: {
            type: String,
            default: ''
        }
    },
    watch: {
        userName() {
            this.name = this.userName;
        },
        value() {
            if (!this.value) {
                this.name = "";
            }
        }
    },
    mounted() {

    },
    methods: {
        selectMember: function(){
			this.$layer.iframe({
				content: {
					content: UserSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
						isMultiUser: false
					}
				},
				area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title: "人员选择"
            });
        },
        getSelectUser: function(user, office, layerid) {
            this.name = user.userName;
            this.$emit('input', user.userId);
            this.$layer.close(layerid);
        },
    }
}
</script>

<style scoped>
.user-input-box {
    display: inline-block;
}
.block {
    width: 100%;
}
.user-input-box > input {
    color: #595e56;
    font-size: 12px;
    border: 1px solid #ced2d7;
    margin-right: 0.1rem;
    margin-right: 10px;
    padding: 0 10px;
    height: 26px;
    line-height: 28px;
}
</style>