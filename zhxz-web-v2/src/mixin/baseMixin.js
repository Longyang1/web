import { getToken } from '@/api/token'
import bus from '@/assets/js/event.js'

export default {
    data () {
        return {
            token: null,
            verifyNotPassName: null,
        }
    },
    props: {
        enableFlow: {
            type: Boolean,
            default: false,
        },
        taskName: {
            type: String,
            default: ""
        }
    },
    mounted () {
        bus.$on('verifyNotPass', (name) => {
            if (!this.verifyNotPassName) {
                this.verifyNotPassName = name;
            }
        });
    },
    methods: {
        startVerify: function(name) {
            this.verifyNotPassName = null;
            bus.$emit('startVerify', name);
            setTimeout(() => {
                
            }, 5000);
            return !this.verifyNotPassName;
        },
        submitHandler: function (func, checkToken) {
            if (this.token == null || checkToken == false) {
                getToken().then((res) => {
                    this.token = res.data;
                    func(this.token);
                }).catch((error) => {
                    if (error && error.status == 404) {
                        return;
                    }
                    console.log(error)
                    msg('网络错误');
                    this.resetToken();
                });
            }
        },
        resetToken: function () {
            this.token = null;
        },
        backListView: function(isDestoryListView, listViewName, params, func) {
            console.log(isDestoryListView + "-" + this.$route.name);
            var formViewName = this.$route.name;
            this.$parent.closeTabByName(formViewName);
            var _listViewName = formViewName;
            if (!listViewName) {
                if (formViewName.endWith('Form')) {
                    _listViewName = _listViewName.substring(0, formViewName.length - 4) + "List";
                } else if (formViewName.endWith('Add')) {
                    _listViewName = _listViewName.substring(0, formViewName.length - 3) + "List";
                }
            }
            if (_listViewName == "TransactionSubjectList" || _listViewName == "ProjectSubjectList") {
                _listViewName = "MeetingSubjectList";
            }
            console.log(_listViewName + " ----");
            this.$parent.refreshTabByName((listViewName || _listViewName), isDestoryListView, params);
            // setTimeout(() => {
            // }, 100);
        },
        reset: function(backUp) {
            if (backUp.titles) {
                this.titles = Object.assign([], JSON.parse(JSON.stringify(backUp.titles)));
            }
            if (backUp.paramNames) {
                this.paramNames = Object.assign([], backUp.paramNames);
            }
            if (backUp.otherParam) {
                this.otherParam = Object.assign({}, backUp.otherParam);
            }
            if (backUp.dicts) {
                this.dicts = Object.assign([], JSON.parse(JSON.stringify(backUp.dicts)));
            }
        },
        toClick: function (ref, func) {
            if (!func || func()) {
                this.$refs[ref].click();
            } else {
                if (this.verifyNotPassAfter) {
                    this.verifyNotPassAfter(this.verifyNotPassName);
                }
                msg("必填项不能为空");
            }
        },
    }
}