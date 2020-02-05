export default {
    filters: {

    },
    props: {
        personnelId: {
            type: String,
            default: ''
        },
        comIndex: {
            type: [Number, String],
            default: 0
        },
        layerid: {
            type: String,
            default: ''
        },
        order: {
            type: [Number, String],
            default: 1
        },
        canEdit: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            default: ''
        },
        userType: {
            type: [String, Number],
            default: ''
        }
    },
    methods: {
        add: function (params) {
            
        },
        refreshComp: function () {
            this.initData();
        }
    }
}