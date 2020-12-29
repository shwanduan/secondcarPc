<template>
  <div class="box">
    <Carousel :autoplay="autoplay" loop class="banner" dots="none" v-model="bannerindex">
      <CarouselItem v-for="(val,index) in banner" :key="index">
        <div class="demo-carousel">
          <img :src="httpPath+val.img[0]" alt />
        </div>
      </CarouselItem>
    </Carousel>
    <div class="box-form">
      <Form :model="formItem" :label-width="150">
        <FormItem :label="'上传照片（'+formItem.images.length+'/9)'" class="imgbox">
          <div
            class="show_img"
            v-for="(val,index) in formItem.images"
            :key="index"
            v-dragging="{ item: val, list: formItem.images, group: 'show_imgs' }"
          >
            <img :src="httpPath+val" alt class="up_img" />
            <img src="@/assets/img/zhuye_addtu_close.png" class="close" @click="close(index)" />
          </div>
          <label for="img" class="img_box" v-if="formItem.images.length<9">
            <input type="file" id="img" ref="front" name="file" multiple @change="changeFiles" />
            <img src="@/assets/img/add.png" v-if="formItem.images.length<9" />
          </label>
        </FormItem>
        <FormItem label="车源区域:">
          <Select style="width:220px; margin-right:20px;" clearable @on-change="getRegion">
            <Option v-for="item in regionData" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Select style="width:220px" clearable v-model="formItem.area_id">
            <Option v-for="item in get_city" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="车系品牌:">
          <Cascader
            :data="cascader"
            :disabled="disabled"
            style="width:100%"
            clearable
            @on-change="getCascader"
          ></Cascader>
        </FormItem>
        <FormItem label="排量(T/L):">
          <InputNumber :min="0" v-model="formItem.output" style="width:100%;" placeholder="请输入排量(T/L)"></InputNumber>
        </FormItem>
        <FormItem label="变速箱:">
          <Select clearable v-model="formItem.speed_type">
            <Option v-for="item in gearbox" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="车辆类型">
          <Select clearable v-model="formItem.car_category_id">
            <Option v-for="item in searchcategory" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="排放标准">
          <Select clearable v-model="formItem.discharge_id">
            <Option v-for="item in discharge" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="价格(万元)">
          <InputNumber :min="0" v-model="formItem.trade_price" style="width:100%;" placeholder="请输入价格(万元)"></InputNumber>
          <!-- <Input v-model="formItem.trade_price" type="number" placeholder="请输入价格(万元)" /> -->
        </FormItem>
        <FormItem label="公里数(万公里):">
          <InputNumber :min="0" v-model="formItem.mileage" style="width:100%;" placeholder="请输入公里数(万公里)"></InputNumber>
          <!-- <Input v-model="formItem.mileage" type="number" placeholder="请输入公里数(万公里)" /> -->
        </FormItem>
        <FormItem label="车身颜色:">
          <Select clearable v-model="formItem.car_color_id">
            <Option v-for="item in searchcolor" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="上牌年月:">
          <FormItem prop="date">
            <DatePicker
              type="month"
              format="yyyy-MM"
              :options="options"
              @on-change="changeTimestart"
              placeholder="请选择上牌年月"
            ></DatePicker>
          </FormItem>
        </FormItem>
        <FormItem label="动力类型:">
          <Select clearable v-model="formItem.fuel_type">
            <Option v-for="item in fue" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="批发联系人:">
          <Select clearable v-model="formItem.user_id">
            <Option
              v-for="item in enterpriseList"
              :value="item.id"
              :key="item.id"
            >{{ item.nickname }}</Option>
          </Select>
        </FormItem>
        <div class="button">
          <Button type="warning" @click="set_user">提交</Button>
        </div>
      </Form>
      <Spin fix v-if="loading">
        <Icon type="ios-loading" size="20" class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: {
        disabledDate(date) {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          var now = new Date();
          var yearn = now.getFullYear();
          var monthn = now.getMonth() + 1;
          if (year > yearn) return true;
          else if (year < yearn) return false;
          else if (month > monthn) return true;
          else return false;
        }
      },
      bannerindex: 0,
      formItem: {
        user_id: "", //车商id
        area_id: "", //市id
        discharge_id: "", //排放标准
        car_style_id: "", //第五系主键Id
        car_color_id: "", //车体颜色
        car_category_id: "", //车辆类型
        trade_price: "", //批发价
        images: [], //图片组
        output: "", //排量
        fuel_type: "", //动力类型
        speed_type: "", //变速箱类型
        signtime: "", //上牌时间
        mileage: "" //里程
      },
      cascader: [], //车系品牌
      disabled: true,
      regionData: {}, //省列表
      get_city: {}, //市列表
      discharge: {}, //排放标准
      searchcolor: {}, //车身颜色
      searchcategory: {}, //车辆类型
      fue: {}, //动力类型
      gearbox: {}, //变速箱类型
      enterpriseList: {}, //我的员工
      loading: false
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
    }
  },
  created() {
    window.scrollTo(0, 0);
    this.$get({
      url: "/app/product/cascader",
      success: res => {
        window.console.log("车系品牌", res);
        this.cascader = res.data.data;
        if (res.data.data.length > 0) {
          this.disabled = false;
        }
      }
    });
    this.$get({
      url: "/app/auth/getProvince",
      success: res => {
        window.console.log("省列表", res);
        this.regionData = res.data.data;
      }
    });
    this.$get({
      url: "/app/product/discharge",
      success: res => {
        window.console.log("排放标准", res);
        this.discharge = res.data.data;
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
      url: "/app/product/fue",
      success: res => {
        window.console.log("动力类型", res);
        this.fue = res.data.data;
      }
    });
    this.$get({
      url: "/app/product/gearbox",
      success: res => {
        window.console.log("变速箱类型", res);
        this.gearbox = res.data.data;
      }
    });
    this.$get({
      url: "/app/product/enterpriseList",
      data: { pagesize: 10000 },
      success: res => {
        window.console.log("我的员工", res);
        this.enterpriseList = res.data.data.data.data;
        this.enterpriseList.push(res.data.data.user);
      }
    });
  },
  mounted() {
    this.$dragging.$on("dragged", ({ value }) => {
      console.log(value.item);
    });
  },
  methods: {
    //市
    getRegion(item) {
      window.console.log(item);
      this.$get({
        url: "/app/auth/getCity",
        data: { id: item },
        success: res => {
          window.console.log("市列表", res);
          this.get_city = res.data.data;
        }
      });
    },
    getCascader(value, selectedData) {
      window.console.log("品牌", value, selectedData);
      this.formItem.car_style_id = value[4];
      this.$get({
        url: "/app/product/defaultSet",
        data: { id: this.formItem.car_style_id },
        success: res => {
          window.console.log("发布车源默认选项", res);
          this.formItem.discharge_id = res.data.data.discharge_id; //排放标准
          this.formItem.car_category_id = res.data.data.car_category_id; //车辆类型
          this.formItem.output = res.data.data.output; //排量
          this.formItem.speed_type = res.data.data.speed_type; //变速箱类型
        }
      });
    },
    changeFiles() {
      var DOM = this.$refs.front;
      let data = DOM.files;
      console.log(data);
      for (let index = 0; index < data.length; index++) {
        if (index < Number(9 - this.formItem.images.length)) {
          var file = data[index];
          var formData = new FormData();
          formData.append("image[]", file);
          this.$post({
            url: "/app/tool/uploadImage",
            data: formData,
            upload: true,
            success: res => {
              window.console.log("图片", res);
              this.formItem.images.push(res.data.data[0]);
            }
          });
        } else {
          this.$Message.info("最多上传9张图片！");
        }
      }
    },
    close(index) {
      this.formItem.images.splice(index, 1);
    },
    changeTimestart(date) {
      window.console.log(date);
      this.formItem.signtime = date;
    },
    //提交
    set_user() {
      if (!this.formItem.images.length > 0)
        return this.$Message.warning("请上传图片");
      if (!this.formItem.area_id) return this.$Message.warning("请选择区域");
      if (!this.formItem.car_style_id)
        return this.$Message.warning("请选择车系品牌");
      if (!this.formItem.output) return this.$Message.warning("请输入排量");
      if (!this.formItem.speed_type)
        return this.$Message.warning("请选择变速箱");
      if (!this.formItem.car_category_id)
        return this.$Message.warning("请选择车辆类型");
      if (!this.formItem.discharge_id)
        return this.$Message.warning("请选择排放标准");
      if (!this.formItem.trade_price)
        return this.$Message.warning("请输入价格");
      if (!this.formItem.mileage) return this.$Message.warning("请输入公里数");
      if (!this.formItem.car_color_id)
        return this.$Message.warning("请选择车体颜色");
      if (!this.formItem.signtime)
        return this.$Message.warning("请选择上牌年月");
      if (!this.formItem.fuel_type)
        return this.$Message.warning("请选择动力类型");
      if (!this.formItem.user_id)
        return this.$Message.warning("请选择批发联系人");
      window.console.log(this.formItem);
      this.loading = true;
      this.$post({
        url: "/app/product/release",
        data: this.formItem,
        success: res => {
          window.console.log("发布", res);
          this.loading = false;
          if (res.data.code == 1) {
            this.$Message.info("添加车源成功！");
            setTimeout(() => {
              this.$router.replace("/home");
            });
          } else {
            this.$Message.info(res.data.msg);
          }
        }
      });
    }
  }
};
</script>
<style>
.ivu-form-item-content {
  margin-left: 135px !important;
  display: flex;
}

.ivu-form-item-label {
  width: 116px;
  text-align: right;
}
.ivu-form-item-label:before {
  content: "*";
  color: red;
  display: inline-block;
  width: 5px;
  height: 5px;
}
.flex .ivu-select {
  width: 48%;
}
.flex .ivu-select:first-child {
  margin-right: 4%;
}
.ivu-form .ivu-form-item-label {
  color: #000000;
}
</style>

<style scoped lang="scss">
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

.ivu-form {
  width: 50%;
  margin: 0 auto;
}

.ivu-btn {
  width: 200px;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  background: #f2a500;
  color: #ffffff;
}
.ivu-btn-success {
  border: none;
}
.box {
  width: 100%;
  margin-top: -10px;
  .banner {
    width: 100%;
    img {
      display: inline-block;
      width: 100%;
    }
  }
  .box-form {
    box-sizing: border-box;
    width: 1200px;
    margin: 0 auto;
    height: auto;
    background: #fff;
    padding: 40px 20px 60px 20px;
    margin-top: -60px;
    z-index: 10;
    position: relative;
    .button {
      text-align: center;
    }
    .imgbox {
      /deep/.ivu-form-item-content {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
      }
      .show_img {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        position: relative;
        width: 125px;
        height: 120px;
        margin: 0 8px 8px 0;
        border: 1px dashed #eee;
        text-align: center;
        background: #eee;
        .up_img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .close {
          position: absolute;
          right: -5px;
          top: -5px;
          width: 20px;
          height: 20px;
        }
      }
      .img_box {
        width: 125px;
        height: 120px;
        > input {
          display: none;
        }
        > img {
          width: 125px;
          height: 120px;
        }
      }
    }
  }
}
</style>