<script lang="ts" setup>
import { ref } from 'vue'

const tableData = ref<any[]>([{}, {}])

const handleJSCodeError = () => {
  let a = undefined
  if (a.length) {
    console.log('1')
  }
}
</script>

<template>
  <div>
    <el-row>
      <el-button type="primary" @click="handleJSCodeError">js错误</el-button>
    </el-row>
    <p class="error">报错统计</p>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="message" label="报错信息" />
      <el-table-column prop="pageUrl" label="报错页面"> </el-table-column>
      <el-table-column
        prop="time"
        label="报错时间"
        width="150"
      ></el-table-column>
      <el-table-column prop="apikey" label="项目编号"> </el-table-column>
      <el-table-column prop="userId" label="用户id"> </el-table-column>
      <el-table-column prop="sdkVersion" label="SDK版本"> </el-table-column>
      <el-table-column prop="deviceInfo" label="浏览器信息" />
    </el-table>
  </div>
</template>

<style scoped></style>
