import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [{
  path: '/home',
  component: () => import('@/components/index'),
  children: [
    //除了登录注册 路由写在这里
    {
      path: '/home',
      name: 'home',
      component: resolve => require(['@/views/home/Home.vue'], resolve),
    },
    {
      path: '/news', //新闻资讯
      name: 'news',
      component: resolve => require(['@/views/news/news.vue'], resolve),
    },
    {
      path: '/newsDetail', //新闻资讯
      name: 'newsDetail',
      component: resolve => require(['@/views/news/newsDetail.vue'], resolve),
    },

    {
      path: '/personalPage', //个人主页
      name: 'personalPage',
      component: resolve => require(['@/views/personalPage/personalPage.vue'], resolve),
      children: [{
        path: '/soldInOptions', //在售车源
        name: 'soldInOptions',
        component: resolve => require(['@/views/personalPage/soldInOptions.vue'], resolve),
      },
      {
        path: '/soldEditor', //在售车源编辑
        name: 'soldEditor',
        component: resolve => require(['@/views/personalPage/soldEditor.vue'], resolve),
      },
      {
        path: '/employeesList', //员工列表
        name: 'employeesList',
        component: resolve => require(['@/views/personalPage/employeesList.vue'], resolve),
      },
      {
        path: '/employeesDetails', //员工详情
        name: 'employeesDetails',
        component: resolve => require(['@/views/personalPage/employeesDetails.vue'], resolve),
      },
      {
        path: '/addEmployees', //添加员工
        name: 'addEmployees',
        component: resolve => require(['@/views/personalPage/addEmployees.vue'], resolve),
      },
      {
        path: '/basicInformation', //基本信息
        name: 'basicInformation',
        component: resolve => require(['@/views/personalPage/basicInformation.vue'], resolve),
      },
      {
        path: '/exit', //基本信息
        name: 'exit',
        component: resolve => require(['@/views/personalPage/exit.vue'], resolve),
      },
      {
        path: '/addCarSource', //添加车源
        name: 'addCarSource',
        component: resolve => require(['@/views/personalPage/addCarSource.vue'], resolve),
      }
      ]
    },
    {
      path: 'soldInOptionsDetails', //在售车源详情
      name: 'soldInOptionsDetails',
      component: resolve => require(['@/views/personalPage/soldInOptionsDetails.vue'], resolve),
    },
    {
      path: '/contactUs', //联系我们
      name: 'contactUs',
      component: resolve => require(['@/views/personalPage/contactUs.vue'], resolve),
    },
    {
      path: '/aboutUs', //关于我们
      name: 'aboutUs',
      component: resolve => require(['@/views/personalPage/aboutUs.vue'], resolve),
    },
    {
      path: '/privacyPolicy', //隐私政策
      name: 'privacyPolicy',
      component: resolve => require(['@/views/personalPage/privacyPolicy.vue'], resolve),
    },
    {
      path: '/releaseCarSource', //发布车源
      name: 'releaseCarSource',
      component: resolve => require(['@/views/home/releaseCarSource.vue'], resolve),
    },

    {
      path: '/carInfoPages', //详情
      name: 'carInfoPages',
      component: resolve => require(['@/views/home/carInfoPages.vue'], resolve),
    }
  ]
},
//登录
{
  path: '/',
  name: 'login',
  component: resolve => require(['@/views/login/login.vue'], resolve),
},
{
  path: '/privacy',
  name: 'privacy',
  component: resolve => require(['@/views/home/privacy.vue'], resolve),
},
]

const router = new VueRouter({
  routes
})


export default router