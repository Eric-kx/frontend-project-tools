<script setup>
import { useUserStore } from './stores';

const userStore = useUserStore()
</script>

<template>
  <h1>You did it!</h1>
  {{ userStore.token }}
  <el-button type="primary" @click="userStore.setToken('dsfsdf')">获取token</el-button>
  <el-button type="primary" @click="userStore.removeToken()">删除token</el-button>
</template>

<style scoped></style>
 