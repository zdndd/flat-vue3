<template>
  <div class="wrap">
    <div class="top">
      <div class="title">{{ title }}</div>
      <div class="setting">
        <el-input-plus
          v-model="selectedValue"
          :options="optionList"
          selection-type="multiple"
          style="width: 200px; margin-right: 10px"
        />
        <el-button @click="openDialog" :icon="Edit" circle />
        <el-button :icon="Delete" circle />
      </div>
    </div>

    <div class="content">echart</div>
  </div>

  <el-dialog v-model="dialogFormVisible" title="设置" width="500">
    <el-form :model="form">
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>

      <el-form-item label="尺寸" :label-width="formLabelWidth">
        <el-select v-model="form.size" placeholder="请选择尺寸">
          <el-option label="2" :value="2" />
          <el-option label="3" :value="3" />
          <el-option label="4" :value="4" />
        </el-select>
      </el-form-item>

      <el-form-item label="echat图类型" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import ElInputPlus from "./ElInputPlus.vue"; // 确保路径正确

// 模拟选项列表
const optionList = ref([
  { label: "折线图", value: "line" },
  { label: "柱状图", value: "bar" },
  { label: "饼图", value: "pie" },
]);

const selectedValue = ref("line");

const handleAddNewOption = (newItem: { label: string; value: string }) => {
  // 1. 将新选项加入列表
  optionList.value.push({
    label: newItem.label,
    value: newItem.value,
  });

  console.log("新增成功:", newItem);
  // 注意：这里没有自动选中，如果需要自动选中，可以在子组件 emit update:modelValue
  // 或者在这里设置: selectedValue.value = newItem.value;
};

// 1. 定义 Props 接口
interface Props {
  title: string;
  size?: 2 | 3 | 4; // size 为可选，默认可能未定义
}

// 2. 接收 Props
const props = withDefaults(defineProps<Props>(), {
  size: 4, // 默认值为 4
});

// 2. 定义 Emits
const emit = defineEmits<{
  (e: "update-card", data: { title: string; size: number }): void;
}>();

const dialogFormVisible = ref(false);
const formLabelWidth = "140px";

// 表单数据
const form = reactive({
  name: "",
  size: 4,
  region: "",
});

// 打开对话框时，同步当前 props 到 form
const openDialog = () => {
  form.name = props.title;
  form.size = props.size;
  dialogFormVisible.value = true;
};

// 点击确认按钮
const submitForm = () => {
  // 触发事件，将修改后的数据传回父组件
  emit("update-card", {
    title: form.name,
    size: form.size,
  });
  dialogFormVisible.value = false;
};
</script>

<style scoped>
.wrap {
  margin-bottom: 20px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.content {
  min-height: 200px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
