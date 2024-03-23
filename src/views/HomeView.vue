<template>
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

    <el-form-item label="增值税及附加税" class="likediv">
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
    <el-form-item label="个税" class="likediv">
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
  </el-form>
  <div>
    手续费：{{ total }}万 = 契税：{{ qiTax }}万 + 增值税及附加税：{{
      zengzhiTax
    }}万 + 个税{{ personTax }}万
  </div>

  <div>中介费{{ middle }}万</div>

  <div>首付：{{ first }}</div>

  <div>最终总价:{{ final }}</div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
interface formt {
  money: number;
  oldMoney: number;
  type: string;
  year: string;
  year2: string;
  middle: number;
}
const form: formt = reactive({
  money: 359,
  oldMoney: 15,
  type: "1.5",
  year: "2",
  year2: "1",
  middle: 2,
});

const first = computed(() => {
  return (form.money * 0.35).toFixed(2);
});

const qiTax = computed(() => {
  return ((form.money * form.type) / 100).toFixed(3);
});

const zengzhiTax = computed(() => {
  let result = 0;
  if (form.year >= 2) {
    //满2年
    if (form.type > 1) {
      //非普通住宅
      result = ((form.money - form.oldMoney) * 5.38) / 100;
    } else {
      result = 0;
    }
  } else {
    //不满两年
    if (form.type > 1) {
      result = ((form.money * 5.38) / 100).toFixed(3);
    } else {
      result = ((form.money * 5.38) / 100).toFixed(3);
    }
  }
  return result;
});

const personTax = computed(() => {
  let result = 0;
  if (form.year2 >= 5) {
    //满5年
    result = 0;
  } else {
    //不满5年
    if (form.type > 1) {
      //非普通
      result = (((form.money - zengzhiTax.value) * 2) / 100).toFixed(3);
    } else {
      result = (((form.money - zengzhiTax.value) * 1) / 100).toFixed(3);
    }
  }
  return result;
});

const middle = computed(() => {
  let _num = (form.money * form.middle) / 100;
  return _num;
});

const total = computed(() => {
  return (
    Math.ceil(
      qiTax.value * 10000 + zengzhiTax.value * 10000 + personTax.value * 10000
    ) / 10000
  );
});

const final = computed(() => {
  return Math.ceil(total.value * 10000 + first.value * 10000) / 10000;
});
</script>

<style scoped>
.el-form-item {
  background: #fff;
  border-radius: 5px;
  padding: 5px 0 5px 5px;
}

.likediv {
  flex-direction: column !important;
}
</style>
