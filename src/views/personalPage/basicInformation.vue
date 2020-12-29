<template>
  <div div class="personal-box">
    <div class="personalBox-title">
      <span>基本信息</span>
    </div>
    <div class="personalList-box">
      <div class="form-box">
        <Form :model="formRight" label-position="right" :label-width="100">
          <FormItem label="姓名：">
            <Input v-model="formRight.nickname" />
          </FormItem>
          <FormItem label="头像：" class="avactor">
            <div @click.stop="uploadHeadImg">
              <img
                :src=" httpPath + avatar"
                alt
                v-if="avatar"
                style="width:55px;height:54px;border-radius:50%;"
              />
              <img src="../../assets/img/header_logo.png" v-if="!avatar" />
              <input
                type="file"
                accept="image/*"
                @change="handleFile"
                class="hiddenInput"
                ref="front"
                name="file"
              />
            </div>
          </FormItem>
          <FormItem label="身份证号：">
            <p>{{ user.idcard }}</p>
          </FormItem>
          <FormItem label="所在地区：">
            <p>{{ province_name }}{{ city_name }}</p>
          </FormItem>
          <FormItem label="所在公司：">
            <p>{{ user.company }}</p>
          </FormItem>
        </Form>
      </div>
      <div class="save-btn">
        <button @click="save_info">保存</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "basicInformation",
  data() {
    return {
      formRight: {
        nickname: ""
      },
      user: {
        idcard: "",
        province_id: "",
        city_id: "",
        company: ""
      },
      avatar: "",
      province_name: "",
      city_name: "",
      province: [],
      city: [],
      name: ""
    };
  },
  //初始化
  mounted() {
    this.get_info();
  },
  methods: {
    // 打开图片上传
    uploadHeadImg: function() {
      this.$el.querySelector(".hiddenInput").click();
    },
    handleFile() {
      var DOM = this.$refs.front;
      var file = DOM.files[0];
      window.console.log("图片", file);
      var formData = new FormData();
      formData.append("image[]", file);
      this.$post({
        url: "/app/tool/uploadImage",
        data: formData,
        upload: true,
        success: res => {
          window.console.log("图片", res);
          this.avatar = res.data.data[0];
        }
      });
    },
    //省
    getProvince() {
      this.$get({
        url: "/app/auth/getProvince",
        data: {},
        success: res => {
          this.province = res.data.data;
          this.province.forEach(v => {
            //id一样赋值
            if (this.user.province_id === v.id) {
              this.province_name = v.name;
            }
          });
        }
      });
    },
    //市
    getCity() {
      this.$get({
        url: "/app/auth/getCity",
        data: {
          id: this.user.province_id
        },
        success: res => {
          this.city = res.data.data;
          this.city.forEach(v => {
            if (this.user.city_id === v.id) {
              this.city_name = v.name;
            }
          });
        }
      });
    },
    // 获取个人信息
    get_info() {
      this.$get({
        url: "/app/user/details",
        data: {},
        success: res => {
          window.console.log("个人信息", res);
          this.formRight.nickname = res.data.data.nickname;
          this.user = res.data.data;
          this.avatar = this.$store.state.header;
          //请求省市列表接口
          this.getProvince();
          this.getCity();
        }
      });
    },
    // 保存修改的个人信息
    save_info() {
      this.$post({
        url: "/app/user/personal",
        data: {
          nickname: this.formRight.nickname,
          avatar: this.avatar,
          idcard: this.user.idcard,
          province_id: this.user.province_id,
          city_id: this.user.city_id,
          company: this.user.company
        },
        success: res => {
          window.console.log("修改成功", res);
          this.$Message.success("修改成功");
          this.$store.commit("changeheader", this.avatar);
          setTimeout(() => {
            this.get_info();
          }, 200);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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
    border: 1px solid rgba(238, 238, 238, 1);
    border-radius: 8px;
    span {
      margin-left: 10px;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 204, 69, 1);
    }
  }

  .personalList-box {
    width: 100%;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    padding-bottom: 100px;
    .form-box {
      width: 500px;
      margin: 0 auto;
      /deep/.ivu-form-item-label:before {
        content: "";
      }
      /deep/.ivu-input {
        color: #999999;
      }
      /deep/.ivu-form .ivu-form-item-label {
        font-size: 16px;
        color: #000000;
      }
      .avactor {
        display: flex;
        align-items: center;
        div {
          display: flex;
          align-items: center;
          position: relative;
          left: 180px;
          img {
            margin: 0 5px;
          }
          .hiddenInput {
            display: none;
          }
        }
      }
      p {
        font-size: 16px;
        color: #000000;
      }
    }
    .save-btn {
      width: 100%;
      text-align: center;
      button {
        width: 201px;
        height: 52px;
        background: rgba(242, 165, 0, 1);
        border-radius: 10px;
        border: none;
        outline: none;
        font-size: 18px;
        color: #ffffff;
        margin-top: 100px;
      }
    }
  }
}
</style>
