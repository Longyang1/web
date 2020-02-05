<template>
    
</template>

<script>
import bus from '@/assets/js/event.js'
import baseMixin from '@/mixin/baseMixin'

export default {
    mixins: [baseMixin],
    data () {
        return {
            menuId: this.$route.name,
        }
    },
    props: {
        layerid: {
            type: String,
            default: null
        }
    },
    computed: {
       	curUser() {
            return this.$parent.$store.state.user.user;
        }
	},
	watch: {
       
    },
    mounted () {
        this.$nextTick(() => {
            if (this.layerid) {
                document.getElementById(this.layerid).onclick = function (e) {
                    bus.$emit('selectClose', this);
                };
            }
        });
    },
    methods: {
        close: function () {
            if (this.layerid) {
                this.$layer.close(this.layerid);
            } else {
                this.backListView(false);
            }
        },
    },
    destroyed () {
        
    }
}
</script>

