import mongoose from '../config/DBHelpler'
import moment from 'dayjs'

const Schema = mongoose.Schema

const CommentsSchema = new Schema({
  tid: { type: String, ref: 'post' },
  uid: { type: String, ref: 'users' },
  cuid: { type: String, ref: 'users' },
  content: { type: String },
  created: { type: Date },
  hands: { type: Number, default: 0 },
  status: { type: String, default: '1' },
  isRead: { type: String, default: '0' },
  isBest: { type: String, default: '0' }
}, { toJSON: { virtuals: true } })

CommentsSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

CommentsSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next(error)
  }
})

CommentsSchema.statics = {
  findByTid: function (id) {
    return this.find({ tid: id })
  },
  findByCid: function (id) {
    return this.findOne({ _id: id })
  },
  getCommentsList: function (id, page, limit) {
    return this.find({ tid: id }).populate({
      path: 'cuid',
      select: '_id name pic isVip status'
    }).populate({
      path: 'tid',
      select: '_id title status'
    }).skip(page * limit).limit(limit)
  },
  queryCount: function (id) {
    return this.find({ tid: id }).countDocuments()
  },
  getCommetsPublic: function (id, page, limit) {
    return this.find({ cuid: id })
      .populate({
        path: 'tid',
        select: '_id title'
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: -1 })
  },
  getMsgList: function (id, page, limit) {
    return this.find({
      uid: id,
      cuid: { $ne: id },
      isRead: { $eq: '0' }, // 未读状态
      status: { $eq: '1' } // 是否显示
    })
      .populate({
        path: 'tid',
        select: '_id title content'
      })
      .populate({
        path: 'uid',
        select: '_id name'
      })
      .populate({
        path: 'cuid',
        select: '_id name'
      })
      .skip(limit * page)
      .limit(limit)
      .sort({ created: -1 })
  },
  getTotal: function (id) {
    return this.find({
      uid: id,
      isRead: '0',
      cuid: { $ne: id },
      status: '1'
    }).countDocuments()
  },
  getCommentsOptions: function (options, page, limit) {
    let query = {}
    if (typeof options.search !== 'undefined') {
      if (typeof options.search === 'string' && options.search.trim() !== '') {
        // radio
        query[options.item] = options.search
      }

      if (['uid', 'tid', 'cuid'].includes(options.item)) {
        let arr = [
          {
            $lookup: {
              from: 'posts',
              let: { pid: { $toObjectId: '$tid' } },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$pid'] } } },
                { $project: { _id: 1, uid: 1, title: 1 } }
              ],
              as: 'tid'
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ $arrayElemAt: ['$tid', 0] }, '$$ROOT']
              }
            }
          },
          { $unwind: '$tid' }
        ]
        if (options.item === 'tid') {
          arr.push({
            $match: { title: { $regex: options.search, $options: 'i' } }
          })
        }
        arr = arr.concat([
          { $addFields: { userId: { $toObjectId: '$uid' } } },
          { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'uid' } }])
        if (options.item === 'uid' && options.search.trim() !== '') {
          arr.push({
            $match: { 'uid.name': { $regex: options.search, $options: 'i' } }
          })
        }
        arr.push({ $unwind: '$uid' })
        arr = arr.concat([
          { $addFields: { fuserId: { $toObjectId: '$cuid' } } },
          { $lookup: { from: 'users', localField: 'fuserId', foreignField: '_id', as: 'cuid' } }
        ])
        if (options.item === 'cuid' && options.search.trim() !== '') {
          arr.push({
            $match: { 'cuid.name': { $regex: options.search, $options: 'i' } }
          })
        }
        arr = arr.concat([
          { $unwind: '$cuid' },
          { $project: { tid: 1, cuid: { name: 1, _id: 1 }, uid: { name: 1, _id: 1 }, isBest: 1, status: 1, content: 1, created: 1 } },
          { $skip: limit * page },
          { $limit: limit },
          { $sort: { created: -1 } }
        ])
        return this.aggregate(arr)
      }
      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      }
      return this.find(query)
        .populate({
          path: 'tid',
          select: '_id title'
        })
        .populate({
          path: 'cuid',
          select: '_id name'
        })
        .populate({
          path: 'uid',
          select: '_id name'
        })
        .skip(page * limit)
        .limit(limit)
        .sort({ created: -1 })
    }
  },
  getCommentsOptionsCount: function (options) {
    let query = {}
    if (typeof options.search !== 'undefined') {
      if (typeof options.search === 'string' && options.search.trim() !== '') {
        // radio
        query[options.item] = options.search
      }
      if (['uid', 'tid', 'cuid'].includes(options.item)) {
        let arr = [
          {
            $lookup: {
              from: 'posts',
              let: { pid: { $toObjectId: '$tid' } },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$pid'] } } },
                { $project: { _id: 1, uid: 1, title: 1 } }
              ],
              as: 'tid'
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ $arrayElemAt: ['$tid', 0] }, '$$ROOT']
              }
            }
          },
          { $unwind: '$tid' }
        ]
        if (options.item === 'tid') {
          arr.push({
            $match: { title: { $regex: options.search, $options: 'i' } }
          })
        }
        arr = arr.concat([
          { $addFields: { userId: { $toObjectId: '$uid' } } },
          { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'uid' } }])
        if (options.item === 'uid' && options.search.trim() !== '') {
          arr.push({
            $match: { 'uid.name': { $regex: options.search, $options: 'i' } }
          })
        }
        arr.push({ $unwind: '$uid' })
        arr = arr.concat([
          { $addFields: { fuserId: { $toObjectId: '$cuid' } } },
          { $lookup: { from: 'users', localField: 'fuserId', foreignField: '_id', as: 'cuid' } }
        ])
        if (options.item === 'cuid' && options.search.trim() !== '') {
          arr.push({
            $match: { 'cuid.name': { $regex: options.search, $options: 'i' } }
          })
        }
        arr.push({ $unwind: '$cuid' })
        arr.push({ $project: { tid: 1, cuid: { name: 1, _id: 1 }, uid: { name: 1, _id: 1 }, isBest: 1, status: 1, content: 1, created: 1 } })
        arr.push({ $group: { _id: null, count: { $sum: 1 } } })
        return this.aggregate(arr)
      }
      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      }
      return this.find(query).countDocuments()
    }
    return this.find(query).countDocuments()
  },
  getHotComments: function (page, limit, index) {
    if (index === '0') {
      // 总评论记数 -> aggregate聚合查询
      return this.aggregate([
        // 匹配30天内的评论数据
        { $match: { created: { $gte: new Date(moment().subtract(30, 'day')) } } },
        { $group: { _id: '$cuid', count: { $sum: 1 } } },
        { $addFields: { userId: { $toObjectId: '$_id' } } },
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'cuid' } },
        { $unwind: '$cuid' },
        { $project: { cuid: { name: 1, _id: 1, pic: 1 }, count: 1 } },
        { $skip: page * limit },
        { $limit: limit },
        { $sort: { count: -1 } }
      ])
    } else if (index === '1') {
      // 最新评论
      return this.find({})
        // populate
        .populate({
          path: 'cuid',
          select: 'name pic _id'
        })
        .skip(page * limit)
        .limit(limit)
        .sort({ created: -1 })
    }
  },
  getHotCommentsCount: async function (index) {
    if (index === '0') {
      // 总评论记数 -> aggregate聚合查询
      const result = await this.aggregate([
        // 匹配30天内的评论数据
        { $match: { created: { $gte: new Date(moment().subtract(30, 'day')) } } },
        { $group: { _id: '$cuid', count: { $sum: 1 } } },
        { $group: { _id: 'null', total: { $sum: 1 } } }
      ])
      return result[0].total
    } else if (index === '1') {
      // 最新评论
      return this.find({}).countDocuments()
    }
  }
}

const Comments = mongoose.model('comments', CommentsSchema)

export default Comments
