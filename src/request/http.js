import Vue from 'vue'
import axios from 'axios';
import router from './../router'
import qs from 'qs';
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);
//复制
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
//图像验证
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify)
//图片懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)
//拖拽
import VueDND from 'awe-dnd'
Vue.use(VueDND)
// axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.timeout = 10000;
const no_login_code = -1;

//http://8yi.al.qwangluo.net

//http://pc.whby666.com

if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = "http://pc.whby666.com";
    Vue.prototype.httpPath = "http://pc.whby666.com";
    // axios.defaults.baseURL = "http://dev.bayi.com";
    // Vue.prototype.httpPath = "http://dev.bayi.com";
} else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = "http://pc.whby666.com";
    Vue.prototype.httpPath = "http://pc.whby666.com";
} else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = "http://pc.whby666.com";
    Vue.prototype.httpPath = "http://pc.whby666.com";
}
Vue.prototype.$axios = axios
Vue.prototype.$get = params => {
    const token = localStorage.getItem("token") || "";
    axios
        .get(params.url, { params: Object.assign({}, params.data, token ? { token } : "") })
        .then(res => {
            if (res.data.code == no_login_code) {
                Vue.prototype.$Message.error('未登录');
                if (token) localStorage.removeItem("token");
                setTimeout(() => {
                    router.replace({ name: 'login' })
                }, 1500);
            } else {
                if (params.success)
                    params.success(res);
            }
        })
        .catch(err => {
            if (params.fail)
                params.fail(err);
        })
}
// build powerful applications using modern open source code.
Vue.prototype.$post = params => {
    const token = localStorage.getItem("token") || "";
    let $axios;
    if (params.upload) {
        params.data.append('token', token ? token : "")
        let config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };
        $axios = axios.post(params.url, params.data, config)
    } else if (params.noToken) {
        let data = qs.stringify(Object.assign({}, params.data))
        $axios = axios.post(params.url, data)
    } else {
        let data = qs.stringify(Object.assign({}, params.data, token ? { token } : {}))
        $axios = axios.post(params.url, data)
    }

    $axios
        .then(res => {
            if (res.data.code == no_login_code) {
                Vue.prototype.$Message.error('未登录');
                if (token) localStorage.removeItem("token");
                setTimeout(() => {
                    router.replace({ name: 'login' })

                }, 1500);
            } else {
                if (params.success)
                    params.success(res);
            }
        })
        .catch(err => {
            if (params.fail)
                params.fail(err);
        })
}

export { Vue, router }
