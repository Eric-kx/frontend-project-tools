<script setup>
import { artGetChannelsService,artDelChannelService } from '@/api/article';
import PageContainer from '@/components/PageContainer.vue';
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref,onMounted } from 'vue'
import ChannelEdit from './components/ChannelEdit.vue';
import { ElMessageBox } from 'element-plus';
const channelList = ref([])
const loading = ref(false)
//获得弹窗对象
const dialog = ref()
//获得数据列表
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
//按钮点击事件
const onEditChannel = (row) => {
  //使用弹窗对象的方法打开弹窗
  dialog.value.open(row)
}
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确定要删除该分类么', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const onAddChannel = () => {
  dialog.value.open({})
}
onMounted(() => {
  getChannelList()
})
const onSuccess = () => {
  getChannelList()
}
</script>

<template> 
  <PageContainer title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel" type="primary">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="150"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row, $index}">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row, $index)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row, $index)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </PageContainer>
  
</template>

<style lang="scss" scoped>
    
</style>