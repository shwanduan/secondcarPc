<template>
  <div div class="personal-box">
    <div class="personalBox-title">
      <span>添加车源</span>
    </div>
    <div class="beingCarList-box">
      <Form :model="formItem" :label-width="80">
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
          <Select
            style="width:220px; margin-right:20px;"
            clearable
            @on-change="getRegion"
            v-model="formItem.province"
          >
            <Option v-for="item in regionData" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Select style="width:220px" clearable v-model="formItem.area_id">
            <Option v-for="item in get_city" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="车系品牌:">
          <Cascader
            :data="cascader"
            style="width:100%"
            clearable
            :disabled="disabled"
            @on-change="getCascader"
            v-model="paulBrand"
          ></Cascader>
        </FormItem>
        <FormItem label="排量(T/L):">
          <InputNumber :min="0" v-model="formItem.output" style="width:100%;" placeholder="请输入排量(T/L)"></InputNumber>
        </FormItem>
        <!-- <FormItem label="排量(T/L):">
          <Input
            v-model="formItem.output"
            type="text"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入排量(T/L)"
          />
        </FormItem> -->
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
        <FormItem label="价格">
          <Input v-model="formItem.trade_price" type="number" placeholder="请输入价格" />
        </FormItem>
        <FormItem label="公里数(万公里):">
          <Input v-model="formItem.mileage" type="number" placeholder="请输入公里数(万公里)" />
        </FormItem>
        <FormItem label="车身颜色:">
          <Select clearable v-model="formItem.car_color_id">
            <Option v-for="item in searchcolor" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="上牌日期:">
          <FormItem prop="date">
            <DatePicker
              type="date"
              format="yyyy-MM"
              v-model="formItem.signtime"
              @on-change="changeTimestart"
              placeholder="请选择上牌日期"
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
          <Button type="warning" @click="set_user">重新发布</Button>
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
      id: this.$route.query.id,
      formItem: {
        area: "",
        user_id: "", //车商id
        area_id: "", //市id
        province: "",
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
      paulBrand: [],
      disabled: true,
      cascader: [], //车系品牌
      regionData: [], //省列表
      get_city: [], //市列表
      discharge: [], //排放标准
      searchcolor: [], //车身颜色
      searchcategory: [], //车辆类型
      fue: [], //动力类型
      gearbox: [], //变速箱类型
      enterpriseList: [], //我的员工
      loading: false
    };
  },
  mounted() {
    window.scrollTo(0, 100);
    this.$dragging.$on("dragged", ({ value }) => {
      console.log(value.item);
    });
    //批发联系人
    this.$get({
      url: "/app/product/enterpriseList",
      data: { pagesize: 10000 },
      success: res => {
        window.console.log("我的员工", res);
        this.enterpriseList = res.data.data.data.data;
        this.enterpriseList.push(res.data.data.user);
      }
    });
    //获取
    this.$get({
      url: "/app/product/styleDetails",
      data: {
        id: this.id
      },
      success: res => {
        window.console.log("车系品牌", res);
        this.paulBrand = res.data.data;
      }
    });
    //车系品牌
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
    //省
    this.$get({
      url: "/app/auth/getProvince",
      success: res => {
        window.console.log("省列表", res);
        this.regionData = res.data.data;
      }
    });
    //排放标准
    this.$get({
      url: "/app/product/discharge",
      success: res => {
        window.console.log("排放标准", res);
        this.discharge = res.data.data;
      }
    });
    //车身颜色
    this.$get({
      url: "/app/product/searchcolor",
      success: res => {
        window.console.log("车身颜色", res);
        this.searchcolor = res.data.data;
      }
    });
    //车辆类型
    this.$get({
      url: "/app/product/searchcategory",
      success: res => {
        window.console.log("车辆类型", res);
        this.searchcategory = res.data.data;
      }
    });
    //动力类型
    this.$get({
      url: "/app/product/fue",
      success: res => {
        window.console.log("动力类型", res);
        this.fue = res.data.data;
      }
    });
    //变速箱类型
    this.$get({
      url: "/app/product/gearbox",
      success: res => {
        window.console.log("变速箱类型", res);
        this.gearbox = res.data.data;
      }
    });
    this.getInit();
  },
  methods: {
    getInit() {
      this.loading = true;
      let that = this;
      //获取编辑车源信息
      this.$get({
        url: "/app/product/modify",
        data: {
          id: this.id
        },
        success: res => {
          window.console.log(res.data.data, res.data.code);
          if (res.data.code === 1) {
            that.formItem = res.data.data;
            window.console.log("修改车源列表", res.data.data);
            that.getRegion(that.formItem.province);
            this.loading = false;
          }
        }
      });
    },
    // 获取市
    getRegion(item) {
      this.$get({
        url: "/app/auth/getCity",
        data: { id: item },
        success: res => {
          window.console.log("市列表", res.data.data);
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
    //提交修改信息
    set_user() {
      window.console.log(this.formItem);
      this.loading = true;
      this.$post({
        url: "/app/product/modify",
        data: {
          id: this.id,
          area_id: this.formItem.area_id,
          discharge_id: this.formItem.discharge_id,
          car_style_id: this.formItem.car_style_id,
          car_color_id: this.formItem.car_color_id,
          car_category_id: this.formItem.car_category_id,
          trade_price: this.formItem.trade_price,
          images: this.formItem.images,
          output: this.formItem.output,
          fuel_type: this.formItem.fuel_type,
          speed_type: this.formItem.speed_type,
          signtime: this.formItem.signtime,
          mileage: this.formItem.mileage,
          user_id: this.formItem.user_id,
          is_shelf: 2
        },
        success: res => {
          window.console.log("修改", res);
          this.loading = false;
          if (res.data.code == 1) {
            this.$Message.success("修改车源信息成功！");
            setTimeout(() => {
              this.$router.replace("soldInOptions");
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
.ivu-input {
  font-size: 16px;
}
.ivu-form-item-content {
  margin-left: 135px !important;
  display: flex;
}

.ivu-form-item-label {
  width: 116px;
  text-align: right;
}
.ivu-form .ivu-form-item-label {
  font-size: 16px;
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
<style lang="scss" scoped>
/deep/.ivu-upload-drag {
  background: url("../../assets/img/add.png") no-repeat;
  background-size: 100% 100%;
  width: 150px;
  height: 150px;
}
/deep/.ivu-form-item-label {
  width: 147px !important;
}
.ivu-form {
  width: 80%;
}
.ivu-form-item {
  margin-bottom: 20px;
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
.personal-box {
  width: 820px;
  height: 100%;

  // 管理中心右边部分标题
  .personalBox-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 61px;
    border: 1px solid #eeeeee;
    border-radius: 8px;
    color: #ffcc45;
    span {
      margin-left: 10px;
      font-size: 18px;
    }
  }

  .beingCarList-box {
    position: relative;
    width: 800px;
    margin: 20px auto;
    height: auto;
    background: #fff;
    padding: 40px 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
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
    .button {
      text-align: center;
      height: 50px;
      button {
        border: none;
        width: 200px;
        height: 40px;
        border-radius: 5px;
        background: #f2a500;
        color: #ffffff;
        font-size: 16px;
        cursor: pointer;
        outline: none;
      }
    }
  }
}
</style>
