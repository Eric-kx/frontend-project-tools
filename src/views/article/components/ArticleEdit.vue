<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { artAddService, artGetDetailService, artEditService } from '@/api/article';
import { baseURL } from '@/utils/request';
import axios from 'axios';
const visibleDrawer = ref(false)
//默认数据，不加ref
const defaultFormModel = {
  title: '',
  cate_id: '',
  cover_img: '',  //file格式
  content: '',
  state: ''
}
//准备数据
const formModel = ref({ ...defaultFormModel })
//图片相关
const imgURL = ref('')
const onSelectFile = (uploadFile) => {
  imgURL.value = URL.createObjectURL(uploadFile.raw) //预览图片
  formModel.value.cover_img = uploadFile.raw
}
const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    //单独回显图片
    imgURL.value = baseURL + formModel.value.cover_img
    //转换格式为file类型
    formModel.value.cover_img = await imageUrlToFile(imgURL.value, formModel.value.cover_img)
  } else {
    formModel.value = { ...defaultFormModel }
    //新增打开置空
    imgURL.value = ''
    editorRef.value.setHTML('')
  }
}
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  formModel.value.state = state
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.id) {
    //编辑
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    await artAddService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    //通知到父组件
    emit('success', 'add')
  }
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = response.data;

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] });

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error);
    throw error;
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑文章' : '添加文章'" direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <!-- 通过style传入来增加长度 -->
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 前端本地预览，无需提交上传 URL.createObjectURL(...),预览-->
        <el-upload class="avatar-uploader" :show-file-list="false" auto-upload="false" :on-change="onSelectFile">
          <img v-if="imgURL" :src="imgURL" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor ref="editorRef" v-model:content="formModel.content" content-type="html"
            theme="snow"></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>