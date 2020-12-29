<template>
  <div div class="personal-box">
    <div class="personalBox-title">
      <span>添加员工</span>
    </div>
    <div class="personalList-box">
      <div class="form-box">
        <Form :model="formRight" label-position="right" :label-width="100">
          <FormItem label="姓名：">
            <Input v-model="formRight.nickname" placeholder="请输入姓名" />
          </FormItem>
          <FormItem label="手机号：">
            <Input v-model="formRight.mobile" placeholder="请输入手机号" />
          </FormItem>
          <FormItem label="身份证号：">
            <Input v-model="formRight.idcard" placeholder="请输入身份证号" />
          </FormItem>
        </Form>
      </div>
      <div class="save-btn">
        <button @click="add_staff">保存</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addEmployees",
  data() {
    return {
      formRight: {
        nickname: "",
        mobile: "",
        idcard: ""
      }
    };
  },
  methods: {
    // 添加员工
    add_staff() {
      this.$post({
        url: "/app/user/enterpriseAdd",
        data: {
          nickname:this.formRight.nickname,
          mobile:this.formRight.mobile,
          idcard:this.formRight.idcard  
        },
        success: res => {
          window.console.log(res.data)
          if (res.data.code == 1) {
            window.console.log("添加员工", res);
            this.$Message.success('添加成功');
            this.formRight.nickname = '',
            this.formRight.mobile = '',
            this.formRight.idcard = ''
          }else{
            this.$Message.error(res.data.msg);
          }
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
      width: 520px;
      margin: 0 auto;
      /deep/.ivu-form-item-label:before{
        content:'';
      }
      /deep/.ivu-form .ivu-form-item-label {
        font-size: 16px;
        color: #000000;
      }
      /deep/.ivu-input {
        font-size: 16px;
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
        margin-top: 200px;
      }
    }
  }
}
</style>