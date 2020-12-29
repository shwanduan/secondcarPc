<template>
  <div class="home">
    <Carousel :autoplay="autoplay" loop class="top_img" dots="none" v-model="bannerindex">
      <CarouselItem v-for="(val,index) in banner" :key="index">
        <img :src="httpPath+val.img[0]" alt />
      </CarouselItem>
    </Carousel>
    <div class="contetn_box">
      <div class="query_user">
        <!-- 品牌 -->
        <div class="list">
          <span>品牌</span>
          <div class="list_box">
            <div
              v-for="(val,index) in hotbrand"
              :key="index"
              @click="add_car_brand_id(val,index)"
              :class="hotbrand_index==index?'tit_hov':''"
            >
              <div class="img_box">
                <img :src="httpPath+val.img[0]" alt />
              </div>
              <span>{{val.name}}</span>
            </div>
          </div>
          <span style="color:#ffcc45;cursor: pointer;" @click="more_car_brand_show=true">
            更多
            <Icon type="ios-arrow-down" />
          </span>
        </div>
        <!-- 更多品牌 -->
        <div class="more_car_brand" :class="more_car_brand_show?'hover_class':'none_class'">
          <div class="is_show">
            <span style="color:#ffcc45;cursor: pointer;" @click="more_car_brand_show=false;">
              收起
              <Icon type="ios-arrow-up" />
            </span>
          </div>
          <div class="more_car_box" v-for="(val, key) in more_car_brand" :key="val.index">
            <span>{{key}}</span>
            <div class="right_box">
              <div v-for="item in val" :key="item.id" @click="add_car_brand_id(item)">
                <div class="img_box">
                  <img :src="httpPath+item.img[0]" alt />
                </div>
                <span>{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 车系 -->
        <div class="list" v-if="car_series&&car_series.length>0">
          <span>车系</span>
          <div class="list_box">
            <div
              v-for="(val,index) in car_series"
              :key="val.id"
              class="models"
              :class="car_series_id_index==index?'tit_hov':''"
            >
              <span @click="add_car_series_id(val,index)">{{val.name}}</span>
            </div>
          </div>
          <span
            style="color:#ffcc45;cursor: pointer;"
            @click="add_more_seriesPc"
            v-if="car_brand_id"
          >
            更多
            <Icon type="ios-arrow-down" />
          </span>
        </div>
        <!-- 更多车系-->
        <div class="more_car_brand" :class="more_seriesPc_show?'hover_class':'none_class'">
          <div class="is_show">
            <span style="color:#ffcc45;cursor: pointer;" @click="more_seriesPc_show=false;">
              收起
              <Icon type="ios-arrow-up" />
            </span>
          </div>
          <div
            class="more_car_box"
            style="padding:10px;"
            v-for="val in more_seriesPc"
            :key="val.id"
          >
            <span style="margin-right:10px;">{{val.name}}</span>
            <div class="right_box">
              <div v-for="item in val.models" :key="item.id" @click="add_car_series_id(item)">
                <span>{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="list">
          <span>价格</span>
          <div class="list_box">
            <div
              v-for="(val,index) in trade_price_list"
              :key="val.id"
              :class="trade_price_list_index==index?'tit_hov':''"
            >
              <span @click="add_trade_price_inp(0,val,index)" v-if="val.key==2">{{val.end}}万以下</span>
              <span
                @click="add_trade_price_inp(0,val,index)"
                v-if="val.key==0"
              >{{val.start}}-{{val.end}}万</span>
              <span @click="add_trade_price_inp(0,val,index)" v-if="val.key==1">{{val.start}}万以上</span>
            </div>
            <div class="mory">
              <span>自定义（万）</span>
              <Input
                v-model="price_start	"
                style="width:80px;"
                size="small"
                clearable
                placeholder="最低"
              />
              <span style="margin: 0 4px;">万 -</span>
              <Input
                v-model="price_end"
                size="small"
                clearable
                style="width:80px;"
                placeholder="最高"
              />
              <span style="margin: 0 4px;">万</span>
              <Button
                size="small"
                v-if="!price_start||!price_end"
                style="margin-left:10px;"
                disabled
              >确定</Button>
              <Button
                size="small"
                type="primary"
                v-if="price_start&&price_end"
                style="margin-left:10px;"
                @click="add_trade_price_inp(1)"
              >确定</Button>
            </div>
          </div>
        </div>
        <div class="list">
          <span>车型</span>
          <div class="list_box">
            <div
              v-for="(val,index) in searchcategory"
              :key="val.id"
              @click="add_car_category_id(val,index)"
              :class="searchcategory_index==index?'tit_hov':''"
            >
              <span>{{val.name}}</span>
            </div>
          </div>
        </div>
        <div class="list">
          <span>其他</span>
          <div class="list_box">
            <div class="mory code_box" style="width:18%;margin:4px 4px 4px 0">
              <span style="margin:0 6px 0 0;">编号</span>
              <Input
                search
                enter-button
                v-model="codeinp"
                placeholder="请输入编号"
                style="width:70%"
                @on-search="add_code"
                @on-enter="add_code"
              />
            </div>
            <div class="mory" style="margin:4px 6px 4px 0">
              <span style="margin:0 6px 0 0;">变速箱</span>
              <Select
                size="small"
                style="width:80px"
                :label-in-value="true"
                clearable
                @on-change="add_speed_type"
              >
                <Option v-for="item in gearbox" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="mory" style="margin:4px 6px 4px 0">
              <span style="margin:0 6px 0 0;">排量</span>
              <Select
                size="small"
                style="width:80px"
                :label-in-value="true"
                @on-change="add_output"
              >
                <Option
                  v-for="item in output_list"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <span style="margin:0 0 0 3px;">L / T</span>
            </div>
            <div class="mory" style="margin:4px 6px 4px 0">
              <span style="margin:0 6px 0 0;">里程</span>
              <Select
                size="small"
                style="width:80px"
                :label-in-value="true"
                @on-change="add_course"
              >
                <Option
                  v-for="item in course_list"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <span style="margin:0 0 0 3px;">万公里</span>
            </div>
            <div class="mory" style="margin:4px 6px 4px 0">
              <span style="margin:0 6px 0 0;">颜色</span>
              <Select
                size="small"
                style="width:80px"
                :label-in-value="true"
                clearable
                @on-change="add_car_color_id"
              >
                <Option v-for="item in searchcolor" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="mory" style="margin:4px 6px 4px 0">
              <span style="margin:0 6px 0 0;">年份</span>
              <DatePicker
                type="year"
                placeholder="最低"
                style="width: 75px"
                format="yyyy"
                class="yearbox"
                @on-change="getyear_start"
                v-model="year_start"
              ></DatePicker>
              <span style="margin: 0 4px;">-</span>
              <DatePicker
                type="year"
                placeholder="最高"
                style="width: 75px"
                format="yyyy"
                class="yearbox"
                v-model="year_end"
                @on-change="getyear_end"
              ></DatePicker>
              <span style="margin: 0 4px;">年</span>
              <Button
                size="small"
                v-if="!year_start||!year_end"
                style="margin-left:10px;"
                disabled
              >确定</Button>
              <Button
                size="small"
                type="primary"
                v-if="year_start&&year_end"
                style="margin-left:10px;background-color:#f2a500;border-color:#f2a500;"
                @click="car_age()"
              >确定</Button>
            </div>
          </div>
        </div>
      </div>
      <div class="have_item">
        <span>您已经选择:</span>
        <transition v-for="(val,index) in list" :key="index">
          <Tag closable v-if="list&&val.name" @on-close="handleClose(val,index)">{{val.name}}</Tag>
        </transition>
      </div>
      <div class="tit_box">
        <div class="tit">
          <p style="color: #ffcc45;" v-if="admin">全部车源 ( {{tableData.total}} 条)</p>
          <p style="color: #ffcc45;" v-else>全部车源</p>
          <Icon
            type="ios-apps-outline"
            :size="25"
            style="margin-right:15px;"
            :color="color_index==1?'#ffcc45':''"
            @click="add_color_index(1)"
          />
          <Icon
            type="ios-list"
            :size="40"
            :color="color_index==2?'#ffcc45':''"
            @click="add_color_index(2)"
          />
        </div>
        <div class="order">
          <span :class="trade_price==0&&signtime==0?'tit':''" @click="add_trade_price(0)">默认排序</span>
          <p class="hove">
            <span style="margin-right:2px;">年份</span>
            <span class="box">
              <Icon
                size="20"
                style="box-sizing: border-box;margin-top:5px;"
                type="md-arrow-dropup"
                @click="add_signtime(2)"
                :class="signtime==2?'tit':''"
              />
              <Icon
                size="20"
                style="box-sizing: border-box;margin-bottom:5px;"
                type="md-arrow-dropdown"
                @click="add_signtime(1)"
                :class="signtime==1?'tit':''"
              />
            </span>
          </p>
          <p class="hove">
            <span style="margin-right:2px;">价格</span>
            <span class="box">
              <Icon
                size="20"
                style="box-sizing: border-box;margin-top:5px;"
                type="md-arrow-dropup"
                @click="add_trade_price(2)"
                :class="trade_price==2?'tit':''"
              />
              <Icon
                size="20"
                style="box-sizing: border-box;margin-bottom:5px;"
                type="md-arrow-dropdown"
                @click="add_trade_price(1)"
                :class="trade_price==1?'tit':''"
              />
            </span>
          </p>
        </div>
      </div>
      <div class="content_list" v-if="color_index==1">
        <div
          class="item"
          v-for="(val,index) in tableData.data"
          :key="index"
          @click="add_orderlist(val.id)"
        >
          <div class="imgbox">
            <img v-lazy="httpPath+val.images[0]" />
          </div>
          <div class="user">
            <h5 class="h5">{{val.car_year_name}}</h5>
            <h5 class="h6">{{val.mileage}}万公里/{{val.signtime | gettime}}/{{val.area}}</h5>
            <p>
              <span style=" color: #FF0000;">{{val.trade_price}}万</span>
              <span style=" color: #999999;">{{val.computing_time }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="content_list" v-if="color_index==2">
        <div class="item_listtit">
          <span>编号</span>
          <span>品牌型号</span>
          <span>颜色</span>
          <span>车型</span>
          <span>上牌时间</span>
          <span>价格</span>
          <span>发布时间</span>
        </div>
        <div
          class="item_list"
          v-for="(val,index) in tableData.data"
          :key="index"
          @click="add_orderlist(val.id)"
        >
          <span>{{val.code }}</span>
          <span>{{val.car_year_name }}</span>
          <span>{{val.color }}</span>
          <span>{{val.car_series }}</span>
          <span>{{val.signtime | gettime }}</span>
          <span style=" color: #FF0000;">{{val.trade_price }}万</span>
          <span>{{val.create_time }}</span>
        </div>
      </div>
      <div class="page_box">
        <Page
          :total="tableData.total"
          :page-size="Number(tableData.per_page)"
          :current="tableData.current_page"
          prev-text="上一页"
          next-text="下一页"
          @on-change="getDatapage"
        />
      </div>
    </div>
    <Spin fix v-if="loading" style="z-index:5">
      <Icon type="ios-loading" size="20" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: {
        total: 0,
        per_page: 0,
        current_page: 0,
        last_page: 0,
        data: []
      },
      bannerindex: 0,
      //查询条件
      page: 1, //页数
      codeinp: "", //编号
      // end
      loading: false,
      // 数据列表
      hotbrand: {}, //品牌列表
      hotbrand_index: null,
      more_car_brand_show: false, //更多品牌
      more_car_brand: {}, //更多品牌
      car_series: [], //车系列表
      car_series_id_index: null,
      more_seriesPc_show: false, //更多车系
      more_seriesPc: {}, //更多车系
      searchcategory: {}, //车辆类型
      searchcategory_index: null,
      trade_price_list: [
        { id: 1, start: "", end: "5", key: 2 },
        { id: 2, start: "5", end: "10", key: 0 },
        { id: 3, start: "10", end: "15", key: 0 },
        { id: 4, start: "15", end: "20", key: 0 },
        { id: 5, start: "20", end: "30", key: 0 },
        { id: 6, start: "30", end: "", key: 1 }
      ], //价格列表
      //自定义价格
      price_start: "", //价格起始
      price_end: "", //价格终
      trade_price_list_index: null,
      //end
      output_list: [
        {
          value: "1",
          label: "1.0及以下"
        },
        {
          value: "2",
          label: "1.1-1.6"
        },
        {
          value: "3",
          label: "1.7-2.0"
        },
        {
          value: "4",
          label: "2.1-2.5"
        },
        {
          value: "5",
          label: "2.6-3.0"
        },
        {
          value: "6",
          label: "3.1-4.0"
        },
        {
          value: "7",
          label: "4.0以上"
        }
      ], //排量列表
      searchcolor: {}, //车身颜色
      gearbox: {}, //变速箱类型
      course_list: [
        {
          value: "1",
          label: "1以内"
        },
        {
          value: "2",
          label: "1-3"
        },
        {
          value: "3",
          label: "3-5"
        },
        {
          value: "4",
          label: "5-8"
        },
        {
          value: "5",
          label: "8-10"
        },
        {
          value: "6",
          label: "10以上"
        }
      ], //历程
      year_start: "", //车龄起
      year_end: "" //车龄终
    };
  },
  computed: {
    banner() {
      return this.$store.state.banner;
    },
    autoplay() {
      if (
        this.$store.state.banner.length == 1 &&
        this.$store.state.banner.length > 0
      )
        return false;
      else return true;
    },
    list() {
      return this.$store.state.query;
    },
    admin() {
      if (this.$store.state.admin === 1) return true;
      else return false;
    },
    //城市
    cityName() {
      if (this.$store.state.query.city.name == "全国") return "";
      else return this.$store.state.query.city.name;
    },
    //输入搜索的内容
    search_name() {
      return this.$store.state.query.search.name;
    },
    //品牌id
    car_brand_id() {
      return this.$store.state.query.car_brand_id.id;
    },
    //车型id
    car_model_id() {
      return this.$store.state.query.car_series_id.id;
    },
    //车系id
    car_series_id() {
      return this.$store.state.query.car_series_id.start;
    },
    //价格起始
    trade_price_start() {
      return this.$store.state.query.query_trade_price.start;
    },
    //价格终
    trade_price_end() {
      return this.$store.state.query.query_trade_price.end;
    },
    //车型id
    car_category_id() {
      return this.$store.state.query.car_category_id.id;
    },
    //编码
    codename() {
      return this.$store.state.query.codename.name;
    },
    //变速箱
    speed_typeid() {
      return this.$store.state.query.speed_typeid.id;
    },
    //排量
    output_start() {
      return this.$store.state.query.output.start;
    },
    //排量
    output_end() {
      return this.$store.state.query.output.end;
    },
    //历程起
    mileage_start() {
      return this.$store.state.query.mileage.start;
    },
    //里程终
    mileage_end() {
      return this.$store.state.query.mileage.end;
    },
    //车体颜色id
    car_color_id() {
      return this.$store.state.query.car_color_id.id;
    },
    //排序
    color_index() {
      return this.$store.state.sort;
    },
    //年份 1由低到高，2由高到低
    signtime() {
      return this.$store.state.signtime;
    },
    //价格 1由低到高，2由高到低
    trade_price() {
      return this.$store.state.trade_price;
    },
    //车龄
    yearstart() {
      return this.$store.state.query.year.start;
    },
    yearend() {
      return this.$store.state.query.year.end;
    },
    sign_time_arr() {
      let sign_time = [
        this.$store.state.query.year.start,
        this.$store.state.query.year.end
      ];
      return sign_time;
    }
  },
  watch: {
    list() {
      this.get_list();
    },
    car_brand_id() {
      this.get_car_series();
    }
  },
  filters: {
    gettime(data) {
      return data.split("-")[0] + "-" + data.split("-")[1];
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.get_list();
    this.get_order();
    this.add_more_car_brand(); //更多品牌
    this.get_car_series(); //默认10条车系
  },
  methods: {
    //获取条件数据
    get_order() {
      this.$get({
        url: "/app/car_brand/hotbrand",
        success: res => {
          console.log("品牌列表", res);
          this.hotbrand = res.data.data;
        }
      });
      this.$get({
        url: "/app/product/searchcolor",
        success: res => {
          window.console.log("车身颜色", res);
          this.searchcolor = res.data.data;
        }
      });
      this.$get({
        url: "/app/product/searchcategory",
        success: res => {
          window.console.log("车辆类型", res);
          this.searchcategory = res.data.data;
        }
      });
      this.$get({
        url: "/app/product/gearbox",
        success: res => {
          window.console.log("变速箱类型", res);
          this.gearbox = res.data.data;
        }
      });
    },
    //品牌
    add_car_brand_id(val, key) {
      this.hotbrand_index = key;
      this.more_car_brand_show = false;
      this.more_seriesPc_show = false; //更多车系隐藏
      // this.car_brand_id = val.id;
      this.$store.commit("changequery", {
        search: { id: "", name: "" }
      });
      this.$store.commit("changequery", {
        car_series_id: { id: '', start: '', name: '' }
      });
      this.$store.commit("changequery", {
        car_brand_id: { id: val.id, name: val.name }
      });
    },
    //更多品牌
    add_more_car_brand() {
      this.$get({
        url: "/app/car_brand/index",
        success: res => {
          window.console.log("更多品牌", res);
          this.more_car_brand = res.data.data;
        }
      });
    },
    //获取10条车系
    get_car_series() {
      this.$get({
        url: "/app/car_style/serNew",
        data: { brands: this.car_brand_id },
        success: res => {
          window.console.log("车系10条", res.data.data);
          this.car_series = res.data.data;
        }
      });
    },
    //更多车系
    add_more_seriesPc() {
      this.$get({
        url: "/app/car_style/seriesPc",
        data: { brands: this.car_brand_id },
        success: res => {
          window.console.log("更多车系", res);
          this.more_seriesPc = res.data.data;
          this.more_seriesPc_show = true;
        }
      });
    },
    //车系 click
    add_car_series_id(val, key) {
      this.car_series_id_index = key;
      this.more_seriesPc_show = false;
      // this.car_model_id = val.id;
      // this.car_series_id = val.car_series_id;
      this.$store.commit("changequery", {
        car_series_id: { id: val.id, start: val.car_series_id, name: val.name }
      });
    },
    //车型
    add_car_category_id(val, index) {
      this.searchcategory_index = index;
      // this.car_category_id = val.id;
      this.$store.commit("changequery", {
        car_category_id: { id: val.id, name: val.name }
      });
    },
    //价格 0- 选择 1- 自定义
    add_trade_price_inp(key, val, index) {
      this.trade_price_list_index = index;
      if (key == 0) {
        this.price_start = "";
        this.price_end = "";
        // this.trade_price_start = val.start;
        // this.trade_price_end = val.end;
        if (val.key == 2) {
          let endname = val.end + "万以下";
          this.$store.commit("changequery", {
            query_trade_price: {
              id: val.id,
              name: endname,
              start: val.start,
              end: val.end
            }
          });
        } else if (val.key == 1) {
          let startname = val.start + "万以上";
          this.$store.commit("changequery", {
            query_trade_price: {
              id: val.id,
              name: startname,
              start: val.start,
              end: val.end
            }
          });
        } else {
          let name = val.start + "-" + val.end + "万元";
          this.$store.commit("changequery", {
            query_trade_price: {
              id: val.id,
              name: name,
              start: val.start,
              end: val.end
            }
          });
        }
      } else {
        // this.trade_price_start = this.price_start;
        // this.trade_price_end = this.price_end;
        let name = this.price_start + "-" + this.price_end + "万元";
        console.log(this.price_start, this.price_end);
        this.$store.commit("changequery", {
          query_trade_price: {
            id: 1,
            name: name,
            start: this.price_start,
            end: this.price_end
          }
        });
      }
      window.console.log(this.$store.state.query.query_trade_price);
    },
    //变速箱
    add_speed_type(val) {
      window.console.log("变速箱", val);
      this.$store.commit("changequery", {
        speed_typeid: { id: val.value, name: val.label }
      });
    },
    //排量
    add_output(val) {
      window.console.log("排量", val);
      if (val.value == "1") {
        let name = "1.0 L/T 及以下";
        this.$store.commit("changequery", {
          output: { id: 0, name: name, start: "", end: "1.0" }
        });
      } else if (val.value == "7") {
        let name = "4.0 L/T 以上";
        this.$store.commit("changequery", {
          output: { id: 0, name: name, start: "4.0", end: "" }
        });
      } else {
        let name = val.label + " L/T";
        let start = val.label.split("-")[0];
        let end = val.label.split("-")[1];
        this.$store.commit("changequery", {
          output: { id: 0, name: name, start: start, end: end }
        });
      }
    },
    //历程
    add_course(val) {
      window.console.log("历程", val);
      if (val.value == "1") {
        let name = "1万公里以下";
        this.$store.commit("changequery", {
          mileage: { id: 0, name: name, start: "", end: "1" }
        });
      } else if (val.value == "6") {
        let name = "10万公里以上";
        this.$store.commit("changequery", {
          mileage: { id: 0, name: name, start: "10", end: "" }
        });
      } else {
        let name = val.label + "万公里";
        let start = val.label.split("-")[0];
        let end = val.label.split("-")[1];

        this.$store.commit("changequery", {
          mileage: { id: 0, name: name, start: start, end: end }
        });
      }
    },
    //颜色
    add_car_color_id(val) {
      window.console.log("颜色", val);
      this.$store.commit("changequery", {
        car_color_id: { id: val.value, name: val.label }
      });
    },
    //车龄
    getyear_start(data) {
      this.year_start = data;
    },
    getyear_end(data) {
      this.year_end = data;
    },
    car_age() {
      let name = "年份：" + this.year_start + "-" + this.year_end + "年";
      console.log(name);
      this.$store.commit("changequery", {
        year: {
          id: 0,
          name: name,
          start: this.year_start,
          end: this.year_end
        }
      });
    },
    //编号
    add_code() {
      window.console.log(this.codeinp);
      this.$store.commit("changequery", {
        codename: { id: 0, name: this.codeinp }
      });
    },
    //年份 排序
    add_signtime(key) {
      this.$store.commit("changesigntime", key);
      this.get_list();
    },
    //价格 排序
    add_trade_price(key) {
      if (key == 0) {
        this.$store.commit("changesigntime", key);
        this.$store.commit("changetrade_price", key);
      } else {
        this.$store.commit("changetrade_price", key);
      }
      this.get_list();
    },
    //删除已选择
    handleClose(val, index) {
      window.console.log("删除已选择", val);
      if (val.key == "city") {
        let data = {};
        data[index] = { id: "", name: "全国", key: "city" };
        this.$store.commit("changequery", data);
      } else {
        let data = {};
        data[index] = { id: "", name: "", start: "", end: "" };
        this.$store.commit("changequery", data);
      }
    },
    //首页数据
    get_list() {
      this.loading = true;
      this.$get({
        url: "/app/product/pcproduct",
        data: {
          name: this.search_name, //输入搜索的内容
          car_brand_id: this.car_brand_id, //品牌id
          car_model_id: this.car_model_id, //品牌 车型id
          car_series_id: this.car_series_id, //车系id
          trade_price_start: this.trade_price_start, //价格起始
          trade_price_end: this.trade_price_end, //价格终
          car_category_id: this.car_category_id, //车型id
          car_color_id: this.car_color_id, //车体颜色id
          mileage_start: this.mileage_start, //里程起始
          mileage_end: this.mileage_end, //里程终
          trade_price: this.trade_price, //1由低到高，2由高到低
          output_start: this.output_start, //排量起始
          output_end: this.output_end, //排量终
          speed_type: this.speed_typeid, //变速箱id
          area: this.cityName, //市名称
          code: this.codename, //编码
          signtime: this.signtime, //年份
          sign_time_arr: this.sign_time_arr, //车龄
          page: this.page,
          pageSize: 40
        },
        success: res => {
          window.console.log("首页列表", res);
          this.loading = false;
          this.tableData = res.data.data;
        }
      });
    },
    //列表排序
    add_color_index(key) {
      this.$store.commit("changesort", key);
      this.get_list();
    },
    //分页
    getDatapage(page) {
      window.scrollTo(0, 100);
      this.page = page;
      this.get_list();
    },
    //跳转详情页
    add_orderlist(id) {
      let routeData = this.$router.resolve({
        name: "carInfoPages",
        query: { id }
      });
      window.open(routeData.href, "_blank");

      // this.$router.resolve({ name: "carInfoPages", query: { id } });
    }
  }
};
</script>
<style lang='scss' scoped>
// .ivu-input-wrapper {
//     width: 100% !important;
//     margin-right: 5px;
// }
.ivu-spin-fix {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.home {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-top: -8px;
  .top_img {
    width: 100%;
    img {
      display: inline-block;
      width: 100%;
    }
  }
  .contetn_box {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    height: auto;
    background: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-top: -60px;
    z-index: 5;
    box-shadow: 0px 2px 12px 1px rgba(153, 153, 153, 0.3);
    .query_user {
      width: 100%;
      .list {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        padding: 10px 0;
        justify-content: flex-start;
        align-items: center;
        > span {
          display: inline-block;
          width: 6%;
          color: #333333;
          font-size: 18px;
        }
        .list_box {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 4px 10px;
            .img_box {
              width: 28px;
              height: 28px;
              margin-bottom: 10px;
              cursor: pointer;
              > img {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
            }

            > span {
              color: #666666;
              font-size: 14px;
              cursor: pointer;
            }
          }
          > div > span:hover {
            color: rgb(255, 204, 69);
          }
          .tit_hov {
            color: rgb(255, 204, 69);
            > span {
              color: rgb(255, 204, 69);
            }
          }
          .models {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            > span {
              color: #666666;
              font-size: 14px;
              cursor: pointer;
              margin-right: 5px;
            }
          }
          .mory {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            > span {
              display: inline-block;
              color: #666666;
              font-size: 14px;
              cursor: pointer;
            }
          }
          .code_box {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            > spna {
              display: inline-block;
            }
            /deep/ .ivu-input-search {
              background: #f2a500 !important;
              border-color: #f2a500 !important;
            }
          }
          /deep/ .ivu-input-wrapper {
            width: 100%;
            margin-right: 5px;
          }
        }
      }
      .more_car_brand {
        box-sizing: border-box;
        background: #ffffff;
        opacity: 1;
        height: 0;
        transition: height 2s ease;
        overflow-x: auto !important;
        position: relative;
        .is_show {
          font-size: 16px;
          color: #ffcc45;
          padding: 2px 5px;
          position: absolute;
          top: 10px;
          right: 10px;
        }
        .more_car_box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          > span {
            display: inline-block;
            font-size: 16px;
            color: #ffcc45;
            width: 5%;
          }
          .right_box {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            > div {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 5px 8px;
              .img_box {
                width: 30px;
                height: 30px;
                margin-bottom: 5px;
                cursor: pointer;
                > img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
              }
              > span {
                color: #666666;
                font-size: 14px;
                cursor: pointer;
              }
            }
            > div:hover {
              border-radius: 4px;
              box-shadow: 0px 2px 12px 1px rgba(153, 153, 153, 0.3);
            }
            > div:hover > span {
              color: #ffcc45;
            }
          }
        }
      }
      //更多
      .hover_class {
        width: 100%;
        border: 1px solid #ffcc45;
        padding: 4px 10px;
        height: 400px;
      }
      .none_class {
        border: 1px solid #fff;
        height: 0;
        padding: 0 10px;
      }
      /*滚动条样式*/
      .more_car_brand::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;
      }
      .more_car_brand::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 8px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
      }
      .more_car_brand::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }
    }
    .have_item {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 0;
      border-top: 1px solid #eeeeee;
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      > span {
        display: inline-block;
        margin-right: 15px;
        color: #666666;
        font-size: 14px;
      }
    }
  }
  .tit_box {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    padding: 10px 15px;
    border: 1px solid rgba(238, 238, 238, 1);
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tit {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > p {
        color: #666666;
        font-size: 18px;
        margin-right: 20px;
      }
    }

    .order {
      width: 25%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #666666;
      font-size: 18px;
      .hove {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .box {
          display: inline-block;
          display: flex;
          flex-direction: column;
          align-items: center;
          > i:hover {
            cursor: pointer;
          }
        }
      }
      > span {
        cursor: pointer;
      }
      .tit {
        color: #ffcc45;
      }
    }
  }
  .content_list {
    width: 100%;
    box-sizing: border-box;
    padding: 15px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-end;
    .item {
      width: 23%;
      margin: 10px;
      background: #fff;
      border-radius: 10px;
      display: flex;
      transition: all 0.5s;
      flex-direction: column;
      align-items: center;
      box-shadow: 0px 2px 12px 1px rgba(153, 153, 153, 0.3);
      cursor: pointer;
      overflow: hidden;
      .imgbox {
        width: 100%;
        height: 214px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .user {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 10px;
        border-radius: 0px 0px 10px 10px;
        .h5 {
          color: #333333;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          font-weight: normal;
        }
        .h6 {
          color: #999999;
          font-size: 16px;
          padding: 5px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          font-weight: normal;
        }
        > p {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }
      }
    }
    .item:hover {
      transform: scale(1.1);
    }
    .item_listtit {
      width: 100%;
      background: #fff;
      box-shadow: 0px 2px 12px 1px rgba(153, 153, 153, 0.3);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      box-sizing: border-box;
      padding: 8px 20px;
      margin-bottom: 5px;
      transition: all 0.5s;
      > span:nth-child(1) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 10%;
      }
      > span:nth-child(2) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 30%;
      }
      > span:nth-child(3) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 12%;
      }
      > span:nth-child(4) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 12%;
      }
      > span:nth-child(5) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 12%;
      }
      > span:nth-child(6) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 12%;
      }
      > span:nth-child(7) {
        display: inline-block;
        font-size: 16px;
        text-align: right;
        color: #333333;
        width: 10%;
      }
    }
    .item_list {
      width: 100%;
      background: #fff;
      border-bottom: 1px solid #cccccc;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      box-sizing: border-box;
      padding: 8px 20px;
      > span:nth-child(1) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 10%;
      }
      > span:nth-child(2) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 30%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        font-weight: normal;
      }
      > span:nth-child(3) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 12%;
      }
      > span:nth-child(4) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 12%;
      }
      > span:nth-child(5) {
        display: inline-block;
        font-size: 16px;
        width: 12%;
      }
      > span:nth-child(6) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 12%;
      }
      > span:nth-child(7) {
        display: inline-block;
        font-size: 16px;
        color: #333333;
        width: 10%;
        text-align: right;
      }
    }
    .item_list:last-child {
      border-bottom: none;
    }

    .item_list:hover {
      transform: scale(1.1);
      cursor: pointer;
    }
    .item_list:hover > span {
      color: #f2a500;
    }
  }
  .page_box {
    width: 100%;
    text-align: center;
  }
}
</style>
