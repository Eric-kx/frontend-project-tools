<script setup>
import PageContainer from '@/components/PageContainer.vue';
import { ref, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue';
import { artGetListService } from '@/api/article';
import { formatTime } from '@/utils/format';
import ArticleEdit from './components/ArticleEdit.vue';
const articleList = ref([]) //列表
const total = ref(0)  //总条数
const loading = ref(false)
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
//获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

const articleEditRef = ref()
//编辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
//删除
const onDeleteArticle = (row) => {

}
//添加
const onAddArticle = () => {
  articleEditRef.value.open({})
}

//处理分页逻辑
const onSizeChange = (size) => {
  //更新分页大小
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
//编辑逻辑
const onCurrentChange = (num) => {
  //更新当前页
  params.value.pagenum = num
  getArticleList()
}
//搜索 从第一页开始重新检索
const onSearch = () => {//下拉菜单选项已经自动获取了
  params.value.pagenum = 1//重置
  getArticleList()
}
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}
//添加或编辑成功后的回调
const onSuccess = (finishType) => {
  if (finishType === 'add') {
    //渲染最后一页
    params.value.pagenum = Math.ceil((total.value + 1) / params.value.pagesize)
  }
  getArticleList()
}
onMounted(() => {
  getArticleList()
})

</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 表单 inline为一行显示-->
    <el-form inline>
      <el-form-item label="文章分类:">
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <!-- 已发布/草稿 -->
      <el-form-item label="发布状态:">
        <el-select v-model="params.state" style="width: 200px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" style="width: 100%" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽row可以获取当前行的数据 -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button circle plain type="primary" :icon="Edit" @click="onEditArticle(row)"></el-button>
          <el-button circle plain type="dange" :icon="Delete" @click="onDeleteArticle(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize" :page-sizes="[2, 3, 5, 10]"
      :size="size" :background="true" layout="jumper, total, sizes, prev, pager, next" :total="total"
      @size-change="onSizeChange" @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" />
    <!-- 抽屉区域 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </PageContainer>

</template>

<style lang="scss" scoped></style>