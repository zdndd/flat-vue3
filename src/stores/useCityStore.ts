import { defineStore } from "pinia";
import { ref } from "vue";

export const useCityStore = defineStore("city", () => {
  // 定义城市数据源
  const cities = [
    { id: "bj", name: "北京" },
    { id: "sh", name: "上海" },
    { id: "gz", name: "广州" },
    { id: "sz", name: "深圳" },
  ];

  // 定义选中的城市 ID，默认可以为空或指定默认值
  const selectedCityId = ref<string>("");

  // 设置选中城市的方法
  const setCity = (id: string) => {
    selectedCityId.value = id;
  };

  return {
    cities,
    selectedCityId,
    setCity,
  };
});
