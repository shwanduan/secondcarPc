<template>
  <div id="index">
    <Layout>
      <Header class="header">
        <div class="header_con">
          <div class="box" style="width:30%;">
            <img src="@/assets/img/header_logo.png" class="logo" @click="nav('home')" />
            <p class="tit" style="width:160px;">汽车服务平台</p>
            <p class="addres" @click="add_send">
              <span>{{city}}</span>
              <Icon type="ios-arrow-down" />
            </p>
          </div>
          <div class="box" style="padding:10px 0;width:30%;">
            <Input
              search
              style="width:90%;"
              enter-button
              v-model="search"
              @on-search="add_search"
              @on-enter="add_search"
              placeholder="请输入关键词搜索"
            />
          </div>
          <div class="router_box">
            <div class="tit" :class="{ on: 'home' === $route.name }" @click="switchTo('home')">首页</div>
            <div
              class="tit"
              :class="{ on: 'releaseCarSource' === $route.name }"
              @click="switchTo('releaseCarSource')"
            >发布车源</div>
            <div
              class="tit"
              :class="{ on: '/news?key=0' === $route.fullPath }"
              @click="newsnav('news',0)"
            >资讯公告</div>
          </div>
          <div class="header_box">
            <Icon type="ios-notifications" size="24" @click="newsnav('news',1)" />
            <img
              :src="httpPath+header"
              v-if="header"
              class="headerimg"
              @click="switchTo('soldInOptions')"
            />
            <img
              src="@/assets/img/header_logo.png"
              v-if="!header"
              class="headerimg"
              @click="switchTo('soldInOptions')"
            />
          </div>
        </div>
        <Modal v-model="show" title="选择城市" :footer-hide="true" @on-ok="ok" @on-cancel="show=false">
          <Select filterable :label-in-value="true" clearable @on-change="changecity">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <div class="city_item">
            <span>推荐城市:</span>
            <p
              v-for="(val,index) in city_recomn"
              :key="index"
              style="cursor: pointer;"
              :class="city_recomn_index==index?'index_tit':''"
              @click="cityseach_name(val.name,index,0)"
            >{{val.name}}</p>
          </div>
          <div class="city_item">
            <span>热门地区:</span>
            <p
              v-for="(val,index) in city_hots"
              :key="index"
              style="cursor: pointer;"
              :class="city_hots_index==index?'index_tit':''"
              @click="cityseach_name(val.name,index,1)"
            >{{val.name}}</p>
          </div>
          <div class="city_item">
            <p
              v-for="(val,key,index) in city_list"
              :key="index"
              class="zimu"
              :class="city_list_index==index?'index_tit':''"
              @click="nav_tit(key,index)"
              style="cursor: pointer;"
            >{{key}}</p>
          </div>
          <div class="city_item wrapper" style="height:200px;overflow:hidden;" ref="list">
            <div class="city_box content" style="height:auto;">
              <div
                class="item"
                :class="'dom'+key"
                v-for="(val,key) in city_list"
                :key="val.id"
                :ref="'dom'+key"
              >
                <p class="tit">{{key}}</p>
                <div>
                  <p
                    v-for="(val,index) in val"
                    :key="index"
                    @click="navcity(val.name,index)"
                  >{{val.name}}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </Header>
      <Content class="contetn">
        <router-view />
        <BackTop class="backup">
          <div>
            <Icon type="ios-arrow-dropup" style="color: #f2a500;padding:0;margin-bottom: 10px;" />
          </div>
          <p>回</p>
          <p>到</p>
          <p>顶</p>
          <p>部</p>
        </BackTop>
      </Content>
      <Footer class="footer">
        <div class="footer_con">
          <div class="box_tit">
            <div>
              <p @click="buttomnav('aboutUs')" style="margin-bottom:0;">关于我们</p>
              <p class="img"></p>
            </div>
            <div>
              <p @click="buttomnav('contactUs')" style="margin-bottom:0;">联系我们</p>
              <p class="img"></p>
            </div>
            <div>
              <p @click="buttomnav('privacyPolicy')" style="margin-bottom:0;">隐私政策</p>
              <p class="img"></p>
            </div>
            <div>
              <p>官方微信</p>
              <img :src="httpPath+getwx" alt class="img" />
            </div>
            <div>
              <p>官方公众号</p>
              <img :src="httpPath+getqrCode" alt class="img" />
            </div>
          </div>
          <p>&copy; {{getcopyright}}</p>
        </div>
      </Footer>
    </Layout>
  </div>
</template>
<script>
import citys from "@/citys";
import Bscroll from "better-scroll";
export default {
  data() {
    return {
      show: false,
      color: "",
      search: "", //搜索
      cityList: citys,
      cityid: "", //城市id
      cityName: "", //城市
      city_recomn: [], //推荐地区
      city_recomn_index: null,
      city_hots: [], //热门地区
      city_hots_index: null,
      city_list: [],
      city_list_index: null,
      city_index: null,
      getwx: {},
      getqrCode: {},
      getcopyright: ""
    };
  },
  computed: {
    header() {
      return this.$store.state.header;
    },
    //市名称
    city() {
      return this.$store.state.query.city.name;
    }
  },
  created() {
    this.getcitylist();
    this.$get({
      url: "/app/user/details",
      success: res => {
        window.console.log("我的", res.data.data);
        this.$store.commit("changeheader", res.data.data.avatar[0]);
        this.$store.commit("changeadmin", res.data.data.id);
      }
    });
    this.$get({
      url: "/app/banner/index",
      data: { type: 2 },
      success: res => {
        window.console.log("轮播", res.data.data);
        this.$store.commit("changebanner", res.data.data.data);
      }
    });
    this.$get({
      url: "/app/product/recomn",
      success: res => {
        window.console.log("推荐地区", res);
        this.city_recomn = res.data.data;
      }
    });
    this.$get({
      url: "/app/product/hots",
      success: res => {
        window.console.log("热门地区", res);
        this.city_hots = res.data.data;
        let data = {
          name: "全国"
        };
        this.city_hots.unshift(data);
      }
    });
    this.$get({
      url: "/app/product/cities",
      success: res => {
        window.console.log("字母", res);
        this.city_list = res.data;
      }
    });
    this.$get({
      url: "/app/auth/getwx",
      success: res => {
        window.console.log("微信二维码", res);
        this.getwx = res.data.data;
      }
    });
    this.$get({
      url: "/app/auth/getcopyright",
      success: res => {
        window.console.log("版权", res);
        this.getcopyright = res.data.data;
      }
    });
    this.$get({
      url: "/app/auth/getqrCode",
      success: res => {
        window.console.log("公众号", res);
        this.getqrCode = res.data.data;
      }
    });
  },
  methods: {
    getcitylist() {
      let that = this;
      AMap.plugin("AMap.CitySearch", function() {
        let citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function(status, result) {
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            // 当前result中包含 查询到的城市编码以及经纬度等信息
            console.log("定位", result);
            that.$store.commit("changequery", {
              city: { id: 0, name: result.city, key: "city" }
            });
          }
        });
      });
    },
    //搜索添加热度
    seachs(id) {
      this.$post({
        url: "/app/product/seachs",
        data: { id },
        success: res => {
          window.console.log("搜索添加热度", res);
        }
      });
    },
    //路由跳转
    switchTo(routeName) {
      if (this.$route.name === routeName) return;
      this.$router.replace({ name: routeName });
    },
    buttomnav(routeName) {
      let routeData = this.$router.resolve({
        name: routeName
      });
      window.open(routeData.href, "_blank");
    },
    newsnav(val, key) {
      let routeData = this.$router.resolve({
        name: "news",
        query: { key }
      });
      window.open(routeData.href, "_blank");

      // this.$router.replace({ name: "news", query: { key } });
    },
    //显示选择城市
    add_send() {
      this.show = true;
      setTimeout(() => {
        this.scroll = new Bscroll(this.$refs.list, {
          scrollY: true,
          click: true,
          mouseWheel: {
            speed: 20,
            invert: false,
            easeTime: 300
          }
        });
      }, 800);
    },
    //搜索内容传值
    add_search() {
      if (this.$route.name !== "home") {
        this.$router.push({ name: "home" });
      }
      this.$store.commit("changequery", {
        car_brand_id: { id: '', name: '' }
      });
      
      this.$store.commit("changequery", {
        car_series_id: { id:'', start: '', name: '' }
      });

      this.$store.commit("changequery", {
        car_category_id: { id: '', name: '' }
      });

      this.$store.commit("changequery", {
        search: { id: 0, name: this.search }
      });
      this.search = "";
    },
    // 城市 搜索下来
    changecity(data) {
      console.log(data);
      this.cityName = data.label;
      this.cityid = data.value;
      this.ok(0);
    },
    //热门城市 推荐城市
    cityseach_name(val, index, key) {
      //0  热门城市 1 推荐城市
      this.cityName = "";
      this.cityid = "";
      this.city_list_index = null;
      if (key == 0) {
        this.city_hots_index = null;
        this.city_recomn_index = index;
      } else {
        this.city_recomn_index = null;
        this.city_hots_index = index;
      }
      let city = val;
      this.cityName = city;
      this.ok(1);
    },
    //字母选择
    navcity(val, key) {
      this.city_recomn_index = null;
      this.city_hots_index = null;
      this.cityid = "";
      this.city_index = key;
      this.cityName = val;
      this.ok(1);
    },
    nav_tit(key, index) {
      this.city_recomn_index = null;
      this.city_hots_index = null;
      this.city_list_index = index;
      this.cityName = "";
      this.scroll.scrollToElement(
        document.querySelector(".dom" + key),
        500,
        true,
        true
      );
    },
    //选择城市 确认 0 城市搜索 1- 推荐 热门
    ok(cityindex) {
      if (this.$route.name == "home" || this.$route.name !== "home")
        this.$router.push({ name: "home" });
      if (cityindex == 0) {
        window.console.log("城市搜索");
        this.seachs(this.cityid);
        this.item = this.cityName;
        this.$store.commit("changequery", {
          city: { id: 0, name: this.cityName, key: "city" }
        });
        this.show = false;
      } else {
        window.console.log("推荐、热门");
        this.$store.commit("changequery", {
          city: { id: 0, name: this.cityName, key: "city" }
        });
        this.show = false;
      }
    },
    go() {
      this.$router.go(-1);
    },
    nav(name) {
      this.$router.push({ name });
    }
  }
};
</script>
<style lang="scss" scoped>
.city_item {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 0;
  border-bottom: 1px solid #eeeeee;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  > span {
    display: inline-block;
    margin-right: 15px;
    color: #666666;
    font-size: 14px;
  }

  > p {
    border-radius: 3px;
    // background: #19be6b;
    color: #999999;
    font-size: 14px;
    padding: 2px 5px;
    margin: 2px;
  }
  .zimu {
    padding: 2px 5px;
    color: #999999;
    background: rgba(238, 238, 238, 1);
    border: 1px solid rgba(153, 153, 153, 1);
  }
  .index_tit {
    color: #fff;
    background: rgba(242, 165, 0, 1);
    border: 1px solid rgba(242, 165, 0, 1);
  }
  .city_box {
    width: 100%;
    height: 200px;
    overflow-y: auto;
    box-sizing: border-box;
    .item {
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 10px 0 10px 10px;
      border-bottom: 1px solid #eee;
      .tit {
        font-size: 16px;
        color: #999999;
        cursor: pointer;
        margin-right: 15px;
      }
      > div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        > p {
          border-radius: 3px;
          // background: #19be6b;
          color: #999999;
          font-size: 14px;
          padding: 2px 5px;
          margin: 4px;
          cursor: pointer;
        }
      }
    }
    & .item:last-child {
      border: none;
    }
  }
}
.header {
  width: 100%;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  .header_con {
    box-sizing: border-box;
    height: 100%;
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .box {
      box-sizing: border-box;
      width: 30%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .logo {
        width: 85px;
        height: 40px;
      }
      .tit {
        color: #000000;
        font-size: 16px;
        padding: 0 10px;
        font-weight: 540;
      }
      .addres {
        width: 200px;
        color: #666666;
        font-size: 16px;
        padding: 0 15px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        > span {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          font-weight: normal;
          margin-right: 5px;
        }
      }
      /deep/ .ivu-input-search {
        background: #f2a500 !important;
        border-color: #f2a500 !important;
      }
    }
    .router_box {
      width: 20%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0 15px;
      .tit {
        font-size: 16px;
        color: #333333;
        cursor: pointer;
      }
      .on {
        color: #ffcc45;
        cursor: pointer;
      }
    }
    .header_box {
      width: 10%;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 20px;
      cursor: pointer;
      .headerimg {
        width: 22px;
        height: 24px;
        border-radius: 4px;
        margin-left: 20px;
      }
    }
  }
}
.contetn {
  width: 100%;
  min-height: 100vh;
  height: auto;
  background: #f9f9f9;
  padding: 75px 0 30px 0;
  .back {
    position: fixed;
    top: 80px;
    left: 80px;
    z-index: 10000;
  }
  .backup {
    position: fixed;
    top: 50% !important;
    right: 80px !important;
    bottom: 0 !important;
    background: #fff;
    border: 1px solid #f2a500;
    box-sizing: border-box;
    padding: 10px 6px;
    display: flex;
    height: 150px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    /deep/ .ivu-back-top-inner {
      display: none;
    }
    p {
      color: #f2a500;
      font-size: 15px;
    }
  }
}
.footer {
  width: 100%;
  background: #333333;
  .footer_con {
    width: 1200px;
    margin: 0 auto;
    .box_tit {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        > p {
          font-size: 20px;
          font-weight: bold;
          color: #fff;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .img {
          width: 82px;
          height: 82px;
        }
      }
    }
    > p {
      margin-top: 50px;
      width: 100%;
      text-align: center;
      font-size: 16px;
      color: #fff;
    }
  }
}
</style>
