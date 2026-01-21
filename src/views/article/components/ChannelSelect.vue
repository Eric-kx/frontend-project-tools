<script setup>
import { artGetChannelsService } from '@/api/article';
import { ref } from 'vue'
const channelList = ref([])
//通过父子通信显示所选的选项
// defineProps({
//   modelValue: { type: [String, Number] }
// })
// const emit = defineEmits(['update:modelValue'])
//新方法直接父子通信
const model = defineModel({
  type: [String, Number]
})
//父亲传入来修改width
defineProps({
  width: {
    type: String,
    default: '200px'
  }
})
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()
</script>
<template>
  <!-- <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)" style="width: 200px"> -->
  <el-select v-model="model" :style="{ width }">
    <el-option v-for="channel in channelList" :key="channel.id" :label="channel.cate_name" :value="channel.id">

    </el-option>
  </el-select>
</template>