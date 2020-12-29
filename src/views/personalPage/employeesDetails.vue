<template>
  <div div class="personal-box" @click="get_staffInfo">
    <div class="personalBox-title">
      <span>员工详情</span>
    </div>
    <div class="personalList-box">
      <Form :model="user" label-position="right" :label-width="100">
        <FormItem label="姓名：">
          <p style="color:#F2A500;">{{ user.nickname }}</p>
        </FormItem>
        <FormItem label="手机号：">
          <p style="color:#000000;">{{ user.mobile }}</p>
        </FormItem>
        <FormItem label="身份证号：">
          <p style="color:#000000;">{{ user.idcard }}</p>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  name: "employeesDetails",
  data() {
    return {
      user: {
        nickname: "",
        mobile: "",
        idcard: ""
      },
      id: this.$route.query.id
    };
  },
  created() {
    this.get_staffInfo();
  },
  methods: {
    get_staffInfo() {
      this.$get({
        url: "/app/user/enterpriseList",
        data: {
          id: this.id
        },
        success: res => {
          window.console.log("员工列表", res);
          this.user = res.data.data;
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
    /deep/.ivu-form-item-label:before {
      content: "";
    }
    /deep/.ivu-form-item-label {
      width: 120px !important;
    }
    /deep/.ivu-form .ivu-form-item-label {
      font-size: 18px;
      color: #000000;
    }
    /deep/.ivu-form-label-right{
      width: 40%!important;
      margin: 0 auto;
    }
    p {
      font-size: 18px;
    }
  }
}
</style>
