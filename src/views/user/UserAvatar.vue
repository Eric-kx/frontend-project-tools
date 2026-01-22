<script setup>
import PageContainer from '@/components/PageContainer.vue';
import { useUserStore } from '@/stores';
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { userUpdateAvatarService } from '@/api/user';
//基于store数据，回显现在头像
const { user: { user_pic }, getUser } = useUserStore()
const imgUrl = ref(user_pic)
const uploadRef = ref()
const onSelectFile = (uploadFile) => {
  // imgUrl.value = URL.createObjectURL(uploadFile.raw)
  //因为需要上传base64，使用基于FileReader来读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}
const onUpdateAvatar = async () => {
  //发请求更新头像
  await userUpdateAvatarService(imgUrl.value)
  //更新userStore
  await getUser()
  ElMessage.success('头像更换成功')
}
</script>
<template>
  <page-container title="更换头像">
    <el-upload ref="uploadRef" class="avatar-uploader" :show-file-list="false" :auto-upload="false"
      :on-change="onSelectFile">
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    <br />
    <el-button type="primary" :icon="Plus" size="large"
      @click="uploadRef.$el.querySelector('input').click()">选择图片</el-button>
    <el-button type="success" :icon="Upload" size="large" @click="onUpdateAvatar">上传头像</el-button>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>