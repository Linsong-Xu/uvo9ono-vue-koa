import Router from 'koa-router'
import contentController from '@/api/ContentController'

const router = new Router()

router.prefix('/content')

router.post('/upload', contentController.uploadImg)

router.post('/add', contentController.addPost)

// 更新帖子
router.post('/update', contentController.updatePost)

router.post('/updateId', contentController.updatePostByTid)

router.post('/updatePostSettings', contentController.updatePostBatch)

router.post('/delete', contentController.deletePost)

export default router
