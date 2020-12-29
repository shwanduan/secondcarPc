import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    //搜索记录
    query: {
      //城市
      city: {
        id: 0,
        key:'city',
        name: '全国',
      },
      //搜索
      search: {
        id: 0,
        name: '',
      },
      //品牌id
      car_brand_id: {
        id: null,
        name: '',
      },
      //车系id
      car_series_id: {
        id: null,
        start:null,
        name: '',
      },
      // 价格
      query_trade_price: {
        id: null,
        name: '',
        start: '',
        end: '',
      },
      //车型id
      car_category_id: {
        id: null,
        name: ''
      },
      //编号
      codename: {
        id: 0,
        name: '',
      },
      //变速箱id
      speed_typeid: {
        id: null,
        name: '',
      },
      //排量
      output: {
        id: 0,
        name: '',
        start: '',
        end: '',
      },
      mileage: {
        id: 0,
        name: '',
        start: '',
        end: '',
      },
      car_color_id: {
        id: null,
        name: '',
      },
      year:{
        id: 0,
        name: '',
        start: '',
        end: '',
      }
    },
    header: '', //个人资料 头像
    banner: '', //轮播图
    admin:null,//是否是总账号
    sort:1,//排序 默认 1
    signtime:null,//年份 默认0 2 由低到高 1 由高到低
    trade_price:null,//价格 1由低到高，2由高到低
  },
  mutations: {
    //修改头像
    changeheader (state, data) {
      state.header = data
    },
    //修改轮播图
    changebanner (state, data) {
      state.banner = data
    },
    //是否是总账号
    changeadmin (state, data) {
      state.admin = data
    },
    //排序
    changesort (state, data) {
      state.sort = data
    },
    //年份
    changesigntime (state, data) {
      state.signtime = data
    },
    //价格
    changetrade_price (state, data) {
      state.trade_price = data
    },
    changequery (state, data) {
      window.console.log(data)
      state.query = { ...state.query, ...data }
    },
  },

})
export default store
