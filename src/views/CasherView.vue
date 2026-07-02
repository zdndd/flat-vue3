<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
        <el-dialog v-model="dialogVisible" title="新增">
          <el-form :model="form" label-width="80px">
            <el-form-item label="输入">
              <el-input v-model="form.name" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="选择">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="opt in options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
          </template>
        </el-dialog>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
          <el-table-column fixed="right" label="Operations" min-width="120">
            <template #default>
              <el-button link type="primary" size="small" @click="handleClick">
                Detail
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";

const dialogVisible = ref<boolean>(false);

const form = reactive({
  name: "",
  type: "",
});

const options = [
  { label: "类型 A", value: "A" },
  { label: "类型 B", value: "B" },
  { label: "类型 C", value: "C" },
];

const handleClick = () => {
  console.log("click");
};

const handleConfirm = () => {
  console.log("提交表单：", { ...form });
  dialogVisible.value = false;
};

const handleCancel = () => {
  dialogVisible.value = false;
};

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
</script>
