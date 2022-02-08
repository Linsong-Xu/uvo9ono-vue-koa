import mongoose from '@/config/DBHelpler'
import moment from 'dayjs'

const Schema = mongoose.Schema

const PostTagsSchema = new Schema({
  tagName: { type: String, default: '' },
  tagClass: { type: String, default: '' }
})

PostTagsSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

PostTagsSchema.statics = {
  getList: function (options, page, limit) {
    return this.find(options)
      .skip(page * limit)
      .limit(limit)
      .sort({ created: -1 })
  },
  countList: function (options) {
    return this.find(options).countDocuments()
  }
}

const Links = mongoose.model('post_tags', PostTagsSchema)

export default Links
