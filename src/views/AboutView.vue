<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="家庭情况">
      <el-radio-group v-model="form.marital">
        <el-radio label="10">已婚（10）</el-radio>
        <el-radio label="0">单身（0）</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="户籍情况">
      <el-radio-group v-model="form.local">
        <el-radio label="10">上海户口（10）</el-radio>
        <el-radio label="0">非上海户口（0）</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="房产情况">
      <el-radio-group v-model="form.estates">
        <el-radio label="20">上海无房（20）</el-radio>
        <el-radio label="5">上海有房（5）</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="五年内购房情况">
      <el-select v-model="form.buy" placeholder="五年内购房情况">
        <el-option label="无房，5年内无购房记录（20）" value="20" />
        <el-option label="有房，5年内无购房记录（5）" value="5" />
        <el-option label="5年内有购房记录（0）" value="0" />
      </el-select>
    </el-form-item>
    <el-form-item label="社保月数">
      <el-input-number v-model="months" :min="1" />
    </el-form-item>
    <el-form-item label="社保缴纳系数">
      <el-input-number
        v-model="coefficient"
        :precision="2"
        :step="0.01"
        :min="0.1"
        :max="0.24"
      />
    </el-form-item>
    <el-form-item label="购房积分"
      ><h2>{{ score }}</h2></el-form-item
    >
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
interface formType {
  marital: string;
  local: string;
  estates: string;
  buy: string;
}
const form: formType = reactive({
  marital: "10",
  local: "10",
  estates: "5",
  buy: "0",
});
const months = ref<number>(148);
const coefficient = ref(0);
const score: number = computed(() => {
  const arr = Object.values(form);
  const formTotal = arr.reduce((a, c) => Number(a) + Number(c));
  return (formTotal + months.value * coefficient.value).toFixed(1);
});
</script>
