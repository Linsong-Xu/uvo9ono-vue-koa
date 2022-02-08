import axios from '@/utils/request'
import qs from 'qs'

// 用户签到
const userSign = () => axios.get('/user/fav')

// 更新用户基本资料
const updateUserInfo = (data) => axios.post('/user/basic', data)

const activateUser = (data) => axios.get('/public/activ?' + data)
// 确认修改用户名
const updateUsername = (data) => axios.get('/public/reset-email?' + qs.stringify(data))

// 修改用户密码
const changePasswd = (data) => axios.post('/user/change-password', {
  ...data
})

// 重置用户密码
const resetPasswd = (data) => axios.post('/user/reset-password', {
  ...data
})

// 设置收藏 & 取消收藏
const addCollect = (data) => axios.get('/user/set-collect?' + qs.stringify(data))

// 获取收藏列表
const getCollect = (data) => axios.get('/user/collect?' + qs.stringify(data))

// 获取发表的文章列表
const getPostListByUid = (data) => axios.get('/user/post?' + qs.stringify(data))

// 获取用户最近的发表文章列表
const getPostPublic = (data) => axios.get('/public/latest-post?' + qs.stringify(data))

// 删除指定文章列表
const deletePostByUid = (data) => axios.get('/user/delete-post?' + qs.stringify(data))

// 获取用户的基本信息
const getInfo = (data) => axios.get('/public/info?' + qs.stringify(data))

// 获取用户最近评论列表
const getCommentList = (data) => axios.get('/public/latest-comment?' + qs.stringify(data))

// 获取用户未读消息
const getMsg = (data) => axios.get('/user/getmsg?' + qs.stringify(data))

// 设置用户未读消息
const setMsg = (data) => axios.get('/user/setmsg?' + qs.stringify(data))

// 拉取最新签到
const getNewestSign = (data) => axios.get('/public/getNewestSign')

// 拉取今日最快
const getEarlyestSign = (data) => axios.get('/public/getEarlyestSign')

// 拉取签到榜
const getTopSign = (data) => axios.get('/public/getTopSign')

export {
  userSign,
  updateUserInfo,
  updateUsername,
  changePasswd,
  addCollect,
  getCollect,
  getPostListByUid,
  deletePostByUid,
  getInfo,
  getCommentList,
  getPostPublic,
  getMsg,
  setMsg,
  getNewestSign,
  getEarlyestSign,
  getTopSign,
  activateUser,
  resetPasswd
}
