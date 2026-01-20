import request from '@/utils/request'
//获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')
//新增文章分类
export const artAddChannelsService = (data) => request.post('/my/cate/add', data)
//更新文章分类
export const artEditChannelService = (data) => request.put('/my/cate/info', data)
//删除文章分类
export const artDelChannelService = (id) => request.delete('/my/cate/del', {
  params: {id}
})