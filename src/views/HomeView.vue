<template>
  <el-form :model="form" label-position="left" label-width="120px">
    <el-form-item label="选择城市">
      <el-col :span="5">
        <el-select
          v-model="cityStore.selectedCityId"
          placeholder="请选择城市"
          style="width: 100%"
        >
          <el-option
            v-for="city in cityStore.cities"
            :key="city.id"
            :label="city.name"
            :value="city.id"
          />
        </el-select>
      </el-col>
    </el-form-item>

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
        <el-radio :value="1">普通住宅</el-radio>
        <el-radio :value="1.5">非普通住宅</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="契税"> 比例：{{ form.type }} </el-form-item>

    <el-form-item label="增值税及附加税" class="likediv">
      <el-radio-group v-model="form.year">
        <el-radio :value="1">不满两年</el-radio>
        <el-radio :value="2">满两年</el-radio>
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
        <el-radio :value="1">不满五或者不唯一</el-radio>
        <el-radio :value="5">满五唯一</el-radio>
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
    手续费：{{ formatWan(total) }}万 = 契税：{{ formatWan(qiTax) }}万 + 增值税及附加税：{{
      formatWan(zengzhiTax)
    }}万 + 个税{{ formatWan(personTax) }}万
  </div>

  <div>中介费{{ formatWan(middle) }}万</div>

  <div>首付：{{ formatWan(first) }}</div>

  <div>最终总价:{{ formatWan(final) }}</div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useCityStore } from "@/stores/useCityStore";

const cityStore = useCityStore();

// --- 工具函数 ---
/** 精度安全的向上取整（保留 N 位小数） */
const ceilFixed = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.ceil(value * factor) / factor;
};

/** 格式化为万位展示，保留2位小数 */
const formatWan = (value: number): string => value.toFixed(2);

// --- 表单数据 ---
interface TaxForm {
  money: number;
  oldMoney: number;
  type: number;   // 1 = 普通住宅, 1.5 = 非普通住宅
  year: number;   // 1 = 不满两年, 2 = 满两年
  year2: number;  // 1 = 不满五/不唯一, 5 = 满五唯一
  middle: number; // 中介费比例
}

const form: TaxForm = reactive({
  money: 359,
  oldMoney: 15,
  type: 1.5,
  year: 2,
  year2: 1,
  middle: 2,
});

// --- 计算链 ---

/** 首付 = 总价 × 35% */
const first = computed(() => form.money * 0.35);

/** 契税 = 总价 × 契税比例 / 100 */
const qiTax = computed(() => (form.money * form.type) / 100);

/** 增值税及附加税 */
const zengzhiTax = computed(() => {
  if (form.year >= 2) {
    // 满两年
    return form.type > 1
      ? ((form.money - form.oldMoney) * 5.38) / 100  // 非普通住宅
      : 0;                                            // 普通住宅免征
  }
  // 不满两年：统一按总价 × 5.38%
  return (form.money * 5.38) / 100;
});

/** 个税 */
const personTax = computed(() => {
  if (form.year2 >= 5) return 0; // 满五唯一免征
  const rate = form.type > 1 ? 2 : 1; // 非普通 ×2，普通 ×1
  return ((form.money - zengzhiTax.value) * rate) / 100;
});

/** 中介费 */
const middle = computed(() => (form.money * form.middle) / 100);

/** 手续费合计 = 契税 + 增值税 + 个税 */
const total = computed(() =>
  ceilFixed(qiTax.value + zengzhiTax.value + personTax.value, 4),
);

/** 最终总价 = 手续费 + 首付 */
const final = computed(() =>
  ceilFixed(total.value + first.value, 4),
);
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
