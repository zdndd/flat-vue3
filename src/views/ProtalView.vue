<script setup lang="ts">
import { ref } from "vue";
import { ElRow, ElCol } from "element-plus";
import Card from "../components/Card.vue";
import { useCityStore } from "@/stores/useCityStore";
const cityStore = useCityStore();

const localSelectedCity = ref<string>(cityStore.selectedCityId);

// 定义类型以确保 size 只能是 2, 3, 4
type CardSize = 2 | 3 | 4;

interface CardData {
  id: number;
  title: string;
  buttons: { name: string; type: string }[];
  size: CardSize;
}

const cards = ref<CardData[]>([
  {
    id: 1,
    title: "My journey with Vue",
    buttons: [{ name: "11", type: "select" }],
    size: 4, // 新增 size 字段
  },
  {
    id: 2,
    title: "Blogging with Vue",
    buttons: [{ name: "11", type: "select" }],
    size: 6, // 注意：如果严格限制2,3,4，这里应改为合法值，例如 4。此处暂按原逻辑保留或修正为4
    // 修正为合法值示例：
    size: 4,
  },
  {
    id: 3,
    title: "Why Vue is so fun",
    buttons: [{ name: "11", type: "select" }],
    size: 4,
  },
  {
    id: 4,
    title: "Card 4",
    buttons: [{ name: "11", type: "select" }],
    size: 3,
  },
  {
    id: 5,
    title: "Card 5",
    buttons: [{ name: "11", type: "select" }],
    size: 2,
  },
  {
    id: 6,
    title: "Card 6",
    buttons: [{ name: "11", type: "select" }],
    size: 4,
  },
]);

// 1. 定义映射函数：将逻辑 size (2,3,4) 转换为布局 span (12,8,6)
const getSizeSpan = (size: CardSize): number => {
  switch (size) {
    case 2:
      return 12; // 2列布局
    case 3:
      return 8; // 3列布局
    case 4:
      return 6; // 4列布局
    default:
      return 6;
  }
};

// 处理子组件传来的更新事件
const handleUpdateCard = (
  id: number,
  data: { title: string; size: number },
) => {
  const card = cards.value.find((item) => item.id === id);
  if (card) {
    card.title = data.title;
    // 确保 size 是合法的值 (2, 3, 4)
    if ([2, 3, 4].includes(data.size)) {
      card.size = data.size as CardSize;
    }
  }
};
</script>

<template>
  <div class="portal-container">
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="24">
        <el-form label-position="left" label-width="100px">
          <el-form-item label="选择城市">
            <el-select
              v-model="localSelectedCity"
              placeholder="请选择城市"
              style="width: 200px"
            >
              <el-option
                v-for="city in cityStore.cities"
                :key="city.id"
                :label="city.name"
                :value="city.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col
        v-for="item in cards"
        :key="item.id"
        :span="getSizeSpan(item.size)"
        style="margin-bottom: 20px"
      >
        <!-- 将 size 传递给 Card 组件 -->
        <Card
          :title="item.title"
          :size="item.size"
          @update-card="(data) => handleUpdateCard(item.id, data)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.portal-container {
  padding: 20px;
  width: 100%;
}
:deep(.el-row) {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
</style>
