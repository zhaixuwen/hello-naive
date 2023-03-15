<template>
  <h2>执行集【{{testsuiteName}}】测试报告</h2>
  <n-grid x-gap="12" :cols="3">
    <n-gi>
      <div class="report-list" />
    </n-gi>
    <n-gi>
      <div class="green" />
    </n-gi>
    <n-gi>
      <div class="green" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NGrid, NGi } from "naive-ui";
import { useRoute } from "vue-router";
import { getTestsuiteLogsAPI, getTestsuiteAPI } from "@/requests/testsuite";

// 获取执行集id
const uRoute = useRoute();
const testsuiteId = Number(uRoute.query.id);
console.log(testsuiteId);

// 获取执行集详情和报告内容
const testsuiteName = ref();
getTestsuiteAPI(testsuiteId).then((resp) => {
    testsuiteName.value = resp.data.data.name;
});

getTestsuiteLogsAPI(testsuiteId).then((resp) => {
  console.log(resp.data.data);
});
</script>

<style>
.report-list {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.24);
}
</style>
