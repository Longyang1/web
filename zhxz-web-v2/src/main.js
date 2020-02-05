// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
let moment = require('moment-timezone')
require('moment/locale/cs')
import '@/permission'
import layer from 'vue-layer'
import * as comps from '@/components/index'

import VueDND from 'awe-dnd'

Vue.use(VueDND)

import VeLine from 'v-charts/lib/line.common'
import VeBar from 'v-charts/lib/bar.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import VePie from 'v-charts/lib/pie.common'
import VeRing from 'v-charts/lib/ring.common'

Vue.component(VeLine.name, VeLine)
Vue.component(VeBar.name, VeBar)
Vue.component(VeHistogram.name, VeHistogram)
Vue.component(VePie.name, VePie)
Vue.component(VeRing.name, VeRing)
import 'v-charts/lib/style.css';

Vue.prototype.$layer = layer(Vue);

for (let key in comps) {
    Vue.use(comps[key])
}

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)
import 'vue-json-viewer/style.css'

// import tinymce from 'vue-tinymce-editor'
// Vue.component('tinymce', tinymce)

Vue.config.productionTip = false

Vue.prototype.$http = axios;

Vue.directive('anchor', {
    inserted : function(el, binding) {
        el.onclick = function() {
            $('html,body').animate({
                scrollTop:($('#' + binding.value).offset().top + 'px')
            }, 800);
        }
    }
})

Vue.directive('authorize', {
    inserted: function(el, binding) {
        var authorities = store.state.home.authorities;
        var auth = binding.value;
        var authArr = auth.split(',');
        var hasAuth = false;
        authArr.forEach(element => {
            var index = authorities.indexOf(element, 'authority');
            if (index != -1) {
                hasAuth = true;
                return;
            }
        });
       
        if (!hasAuth) {
            el.parentNode.removeChild(el);
        }
    }
})


// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el, binding) {
        // 聚焦元素
        var focus = binding.value;
        if (focus) {
            el.focus()
        }
    }
})

//全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive('real-img', {
    inserted: async function (el, binding) {//指令名称为：real-img
        let imgURL = binding.value;//获取图片地址
        if (imgURL) {
            let exist = await imageIsExist(imgURL);
            if (exist) {
                el.setAttribute('src', imgURL);
            } else if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    }
})

/**
 * 检测图片是否存在
 * @param url
 */
let imageIsExist = function(url) {
    return new Promise((resolve) => {
        var img = new Image();
        img.onload = function () {
            if (this.complete == true){
                resolve(true);
                img = null;
            }
        }
        img.onerror = function () {
            resolve(false);
            img = null;
        }
        img.src = url;
    })
}

Vue.directive('highlight', function (el, binding) {
        let obj = binding.value || {};
        var keyword = obj.keyword;
        var value = obj.value;
        if (value && keyword) {
            el.innerHTML = value.replaceAll(keyword, '<k style="color:#FF5722">' + keyword + '</k>')
        } else {
            el.innerHTML = value || ''
        }
    }
)

Vue.filter('highlight', function (value, keyword, defaultString) {
    if (!value || !keyword) {
        return value || '';
    }
	return value.replaceAll(keyword, '<k style="color:#FF5722">' + keyword + '</k>');
});

Vue.filter('moment', function (value, formatString, defaultString) {
    var val = value;
    if (!isNaN(value)) {
        val = Number(val);
    }
	return formatDate(val, formatString, defaultString);
});

Vue.filter('pv', function (value, property, defaultString) {
	return value ? value[property] : '';
});

Vue.filter('thousand', function (num) {
    if (num == 0) {
        return num;
    }
    if (!num) {
        return "";
    }
	return num.toString().replace(/\d+/, function (n) { // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { // 对整数部分添加分隔符
            return $1 + ",";
        });
    });
});

function formatDate(value, formatString, defaultString){
	if(value == null){
		return defaultString ? defaultString : "";
	}
    formatString = formatString || 'YYYY-MM-DD HH:mm';
    return moment(value).tz('Asia/Shanghai').format(formatString);
}

Vue.filter('dictValue', function (dicts, dictValue) {
	if(dicts){
		for(var i = 0; i < dicts.length; i++){
			if(dicts[i].value == dictValue){
				return dicts[i].label;
			}
		}
	}
    return "";
});

// 定义全局点击函数
Vue.prototype.globalClick = function (callback) {
    document.getElementById('app').onclick = function (e) {
        callback(e);
    };
};

Array.prototype.indexOf = function (val, property) {
	for (var i = 0; i < this.length; i++) {
		if (!property && this[i] == val) {
			return i;
		} else if (property && this[i][property] == val) {
			return i;
		}
	}
	return -1;
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
