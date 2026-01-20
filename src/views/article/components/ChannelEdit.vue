<script setup>
import { ref } from 'vue'
import { artAddChannelsService,artEditChannelService } from '@/api/article'
const dialogVisible = ref(false)
const formRef = ref()
const formModel = ref({
  cate_name: '',
  cate_alias:''
})
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if(isEdit){
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
    dialogVisible.value = false
    emit('success')
  }else{
    await artAddChannelsService(formModel.value)
    ElMessage.success('新增成功')
    dialogVisible.value = false
    emit('success')
  }
}

const open = (row) => {
  dialogVisible.value = true
  formModel.value =  { ...row }  //编辑则回显，新增则置空
  //不能用formModel.value =  row ，相当于formModel直接指向row，改formModel也会直接改到row
}
const rules = {
  cate_name:[
    {required: true, message: '请输入分类名称', trigger:'blur'},
    {pattern: /^\S{2,10}$/, message:'分类名必须是1-10位非空字符', trigger:'blur'}
  ],
  cate_alias:[
    {required: true, message: '请输入分类别名', trigger:'blur'},
    {pattern: /^[a-zA-Z0-9]{2,15}$/, message:'别名必须是1-10位非空字符', trigger:'blur'}
  ],
 }

 //暴露出方法
 defineExpose({
  open
 })
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px;">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" placeholder="请输入分类别名"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>