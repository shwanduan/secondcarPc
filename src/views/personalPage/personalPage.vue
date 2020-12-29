<template>
  <div class="personnal-box">
    <!-- 头部背景图 -->
    <Carousel :autoplay='autoplay' loop class="banner" dots="none"  v-model="bannerindex">
      <CarouselItem v-for="(val,index) in banner" :key="index">
        <div class="demo-carousel">
          <img :src="httpPath+val.img[0]" alt />
        </div>
      </CarouselItem>
    </Carousel>
    <!-- 个人中心管理中心内容 -->
    <div class="management-content">
      <!-- 管理中心菜单 -->
      <div class="management-menu">
        <Menu :active-name="activeName" ref="activeName" @on-select="showList">
          <span>管理中心</span>
          <MenuGroup title="车源管理">
            <MenuItem name="soldInOptions">在售车源</MenuItem>
            <MenuItem name="addCarSource">添加车源</MenuItem>
          </MenuGroup>
          <MenuGroup title="员工管理">
            <MenuItem name="employeesList">员工列表</MenuItem>
            <MenuItem name="addEmployees">添加员工</MenuItem>
          </MenuGroup>
          <MenuGroup title="账号管理">
            <MenuItem name="basicInformation">基本信息</MenuItem>
            <MenuItem name="exit">退出</MenuItem>
          </MenuGroup>
        </Menu>
      </div>
      <!-- 默认在售车源 -->
      <!-- 管理中心右边部分盒子 -->
      <div class="personal-box">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "personalPage",
  data() {
    return {
      activeName: "soldInOptions",
      bannerindex: 0
    };
  },
  computed:{
    banner() {
      return this.$store.state.banner;
    },
    autoplay(){
      if (this.$store.state.banner.length == 1 && this.$store.state.banner.length > 0) return false;
      else return true;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.activeName = this.$route.path.slice(1);
      this.$refs.activeName.updateActiveName();
    });
  },
  created() {
    this.$get({
      url: "/app/banner/index",
      data: { type: 2 },
      success: res => {
        window.console.log("轮播", res.data.data.data);
        if (res.data.data.total == 1 && res.data.data.total > 0) {this.autoplay = false;}
          else {this.autoplay = true;}
        this.banner = res.data.data.data;
      }
    });
  },
  methods: {
    showList(name) {
      this.$router.replace({ name });
    }
  }
};
</script>

<style lang="scss" scoped>
.personnal-box {
  width: 100%;
  .banner {
    width: 100%;
    img {
      display: inline-block;
      width: 100%;
    }
  }
  // 个人中心管理中心内容
  .management-content {
    position: relative;
    top: -60px;
    left: 0;
    right: 0;
    z-index: 10;
    margin: auto;
    width: 1200px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 12px 1px rgba(153, 153, 153, 0.3);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    // 管理中心菜单
    .management-menu {
      width: 300px;
      height: 100%;
      span {
        display: inline-block;
        width: 300px;
        height: 48px;
        color: #ffffff;
        font-size: 20px;
        text-align: center;
        background: #f2a500;
        line-height: 48px;
      }
      /deep/.ivu-menu {
        z-index: 2;
      }
      /deep/.ivu-menu-light {
        background: #6a6969;
        width: 300px !important;
      }
      /deep/.ivu-menu-vertical .ivu-menu-item-group-title {
        padding-left: 15px;
        color: #f2a500;
        font-size: 18px;
        background: #252323;
      }
      /deep/.ivu-menu-light.ivu-menu-vertical
        .ivu-menu-item-active:not(.ivu-menu-submenu) {
        color: #ffffff;
        background: #f2a500;
      }
      /deep/.ivu-menu-vertical .ivu-menu-item:hover {
        color: #ffffff;
        background: #f2a500;
      }
      /deep/.ivu-menu-vertical .ivu-menu-item {
        text-align: center;
        font-size: 16px;
        color: #ffffff;
      }
      /deep/.ivu-menu-light.ivu-menu-vertical
        .ivu-menu-item-active:not(.ivu-menu-submenu):after {
        background-color: transparent;
        width: 0;
      }
    }
    // 管理中心右边部分盒子
    .personal-box {
      width: 820px;
      height: 100%;
    }
  }
}
</style>
