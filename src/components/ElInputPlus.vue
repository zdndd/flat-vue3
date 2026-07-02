<template>
  <div class="el-input-plus">
    <!-- 展示区域 -->
    <el-input
      v-model="displayValue"
      placeholder="请选择或添加"
      readonly
      :suffix-icon="Plus"
      @click="openDialog"
      style="cursor: pointer; width: 100%"
    />

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="选择数据"
      width="50%"
      :before-close="handleClose"
    >
      <el-alert
        v-if="displayValue || currentSelection.length > 0"
        type="info"
        :closable="false"
        style="margin-bottom: 15px"
      >
        <template #title>
          <span>
            <strong>当前选中:</strong>
            <!-- 优先显示动态选中的详细列表，如果没有动态选中（如刚打开的单选），则显示 displayValue -->
            {{
              currentSelection.length > 0
                ? JSON.stringify(
                    currentSelection.map((item) => item.label || item.value),
                  )
                : displayValue
            }}
          </span>
        </template>
      </el-alert>

      <!-- 数据表格 -->
      <el-table
        ref="tableRef"
        :data="tableData"
        style="width: 100%"
        max-height="400"
        @selection-change="handleSelectionChange"
        :highlight-current-row="selectionType === 'single'"
      >
        <!-- 根据 selection-type 决定是否显示多选框列 -->
        <el-table-column
          v-if="selectionType === 'multiple'"
          type="selection"
          width="55"
        />

        <!-- 如果是单选，通常使用 radio 逻辑或者点击行选中，这里为了统一体验，单选也可以隐藏 selection 列，改为点击行高亮，或者保留 selection 但限制只能选一个 -->
        <!-- 这里采用通用做法：如果是单选，我们隐藏 selection 列，改用 highlight-current-row 和 row-click -->

        <el-table-column
          v-if="selectionType === 'single'"
          type="index"
          width="50"
          label="#"
        />

        <el-table-column prop="label" label="名称" min-width="120" />
        <el-table-column prop="value" label="值" min-width="120" />

        <!-- 操作列：用于在单选模式下确认，或者多选模式下只是展示 -->
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button
              v-if="selectionType === 'single'"
              link
              type="primary"
              size="small"
              @click="handleSingleSelect(row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="selectionType === 'multiple'"
            type="primary"
            @click="confirmMultipleSelection"
          >
            确认选择 ({{ currentSelection.length }})
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { TableInstance } from "element-plus";

// 定义 Props
interface Props {
  modelValue?: string | number | (string | number)[]; // 支持单选值或多选数组
  options?: Array<{ label: string; value: string | number }>; // 选项列表
  selectionType?: "single" | "multiple"; // 选择类型：单选或多选
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  options: () => [],
  selectionType: "single",
});

// 定义 Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | (string | number)[]): void;
}>();

// 状态管理
const dialogVisible = ref(false);
const tableRef = ref<TableInstance>();
const currentSelection = ref<any[]>([]); // 当前表格中选中的行数据

// 表格数据源（直接使用 props.options，也可以在这里做转换）
const tableData = computed(() => props.options);

// 计算属性：根据 modelValue 和 options 找到对应的 label 进行展示
const displayValue = computed(() => {
  if (!props.modelValue) return "";

  // 处理多选情况 (Array)
  if (Array.isArray(props.modelValue)) {
    if (props.modelValue.length === 0) return "";
    const labels = props.modelValue.map((val) => {
      const option = props.options.find((opt) => opt.value === val);
      return option ? option.label : String(val);
    });
    return labels.join(", ");
  }

  // 处理单选情况
  const option = props.options.find((opt) => opt.value === props.modelValue);
  return option ? option.label : String(props.modelValue);
});

// ... 原有 imports 和 props ...

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;

  // 1. 根据 modelValue 找到对应的行数据对象
  // 注意：需要处理 modelValue 可能是单值或数组的情况
  let valuesToFind: (string | number)[] = [];
  if (Array.isArray(props.modelValue)) {
    valuesToFind = props.modelValue;
  } else if (props.modelValue) {
    valuesToFind = [props.modelValue];
  }

  // 过滤出对应的完整行数据
  const rowsToSelect = tableData.value.filter((item) =>
    valuesToFind.includes(item.value),
  );

  // 2. 初始化 currentSelection，用于 el-alert 显示
  // 无论是单选还是多选，我们都把当前已选的值放入 currentSelection，这样 Alert 就能显示出来
  currentSelection.value = [...rowsToSelect];

  // 3. 等待 DOM 更新后，处理表格的视觉选中状态
  setTimeout(() => {
    if (!tableRef.value) return;

    if (props.selectionType === "multiple") {
      // 多选模式：调用 toggleRowSelection 使 Checkbox 勾选
      rowsToSelect.forEach((row) => {
        tableRef.value?.toggleRowSelection(row, true);
      });
    } else {
      // 单选模式：虽然不显示 Checkbox，但可以设置当前高亮行（可选）
      // 如果希望单选时也高亮当前选中的行，可以使用 setCurrentRow
      if (rowsToSelect.length > 0) {
        tableRef.value?.setCurrentRow(rowsToSelect[0]);
      }
    }
  }, 0);
};

// 关闭弹窗
const handleClose = (done: () => void) => {
  done();
};

// 监听表格多选变化
const handleSelectionChange = (val: any[]) => {
  currentSelection.value = val;
};

// 单选模式：点击行或按钮直接选中并关闭
const handleSingleSelect = (row: any) => {
  emit("update:modelValue", row.value);
  dialogVisible.value = false;
};

// 多选模式：点击确认按钮
const confirmMultipleSelection = () => {
  const values = currentSelection.value.map((item) => item.value);
  emit("update:modelValue", values);
  dialogVisible.value = false;
};
</script>

<style scoped>
.el-input-plus {
  width: 100%;
}
</style>
