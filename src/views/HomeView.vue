<template>
  <el-row style="text-align: left">
    <el-col :span="20">
      <el-form :model="form" label-position="left" label-width="120px">
        <el-form-item label="总价">
          <el-col :span="5">
            <el-input-number :min="1" v-model="form.money" />
          </el-col>
          万
        </el-form-item>
        <el-form-item label="当年购买价格">
          <el-col :span="5">
            <el-input-number :min="1" v-model="form.oldMoney" />
          </el-col>
          万
        </el-form-item>

        <el-form-item label="房屋类型">
          <el-radio-group v-model="form.type">
            <el-radio label="1">普通住宅</el-radio>
            <el-radio label="1.5">非普通住宅</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="契税"> 比例：{{ form.type }} </el-form-item>

        <el-form-item label="增值税及附加税">
          <el-radio-group v-model="form.year">
            <el-radio label="1">不满两年</el-radio>
            <el-radio label="2">满两年</el-radio>
          </el-radio-group>
          <div v-if="form.year >= 2">
            <p v-if="form.type <= 1">满两年-普通住宅-0</p>
            <p v-else>满两年-非普通-（税务核定价-原来价格） × 5.38</p>
          </div>
          <div v-else>
            <p v-if="form.type <= 1">不满两年-普通住宅-税务核定价 × 5.38</p>
            <p v-else>不满两年-非普通-税务核定价 × 5.38</p>
          </div>
        </el-form-item>
        <el-form-item label="个税">
          <el-radio-group v-model="form.year2">
            <el-radio label="1">不满五或者不唯一</el-radio>
            <el-radio label="5">满五唯一</el-radio>
          </el-radio-group>
          <div v-if="form.year2 < 5">
            <p v-if="form.type <= 1">普通住宅-（税务核定价-增值税） × 1</p>
            <p v-else>非普通-（税务核定价-增值税） × 2</p>
          </div>
        </el-form-item>
        <el-form-item label="中介费">
          <el-col :span="5">
            <el-input-number :min="0" v-model="form.middle" />
          </el-col>
          %
        </el-form-item>

        <el-form-item label="计算结果">
          <div>
            手续费：{{ total }}万 = 契税：{{ qiTax }}万 + 增值税及附加税：{{
              zengzhiTax
            }}万 + 个税{{ personTax }}万
          </div>
          <div>中介费{{ middle }}万</div>
          <div>首付：{{ first }}</div>
          <div>最终总价:{{ final }}</div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      form: {
        money: "359",
        oldMoney: "15",
        type: "1.5",
        year: "2",
        year2: "1",
        middle: "2",
      },
    };
  },
  computed: {
    first: function () {
      return (this.form.money * 0.35).toFixed(2);
    },
    qiTax: function () {
      return ((this.form.money * this.form.type) / 100).toFixed(3);
    },
    zengzhiTax: function () {
      let result = 0;
      if (this.form.year >= 2) {
        //满2年
        if (this.form.type > 1) {
          //非普通住宅
          result = ((this.form.money - this.form.oldMoney) * 5.38) / 100;
        } else {
          result = 0;
        }
      } else {
        //不满两年
        if (this.form.type > 1) {
          result = ((this.form.money * 5.38) / 100).toFixed(3);
        } else {
          result = ((this.form.money * 5.38) / 100).toFixed(3);
        }
      }
      return result;
    },
    personTax: function () {
      let result = 0;
      if (this.form.year2 >= 5) {
        //满5年
        result = 0;
      } else {
        //不满5年
        if (this.form.type > 1) {
          //非普通
          result = (((this.form.money - this.zengzhiTax) * 2) / 100).toFixed(3);
        } else {
          result = (((this.form.money - this.zengzhiTax) * 1) / 100).toFixed(3);
        }
      }
      return result;
    },
    middle: function () {
      let _num = (this.form.money * this.form.middle) / 100;
      return _num;
    },
    total: function () {
      return (
        Math.ceil(
          this.qiTax * 10000 + this.zengzhiTax * 10000 + this.personTax * 10000
        ) / 10000
      );
    },
    final: function () {
      return Math.ceil(this.total * 10000 + this.first * 10000) / 10000;
    },
  },
};
</script>

<style scoped>
.el-form-item {
  background: #fff;
  border-radius: 5px;
  padding: 5px 0 5px 5px;
}
</style>
