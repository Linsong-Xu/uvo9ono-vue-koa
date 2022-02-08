import send from '@/config/MailConfig'
import bcrypt from 'bcrypt'
import moment from 'dayjs'
import jsonwebtoken from 'jsonwebtoken'
import config from '@/config'
import { checkCode } from '@/common/Utils'
import User from '@/model/User'
import SignRecord from '../model/SignRecord'
import uuid from 'uuid/v4'
import qs from 'qs'
class LoginController {
  // 忘记密码，发送邮件
  async forget (ctx) {
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code)
    if (result) {
      const user = await User.findOne({ username: body.username })
      // 如果没有此用户，提示该用户没有注册
      if (user === null) {
        ctx.body = {
          code: 404,
          msg: '用户名错误'
        }
        return
      }
      // 如果找到此用户，如果该用户没有激活，则该用户未激活,也提示用户名错误
      if (user.activation === 0) {
        ctx.body = {
          code: 404,
          msg: '用户名错误'
        }
        return
      }
      // 如果存在此用户，并且已经激活，并且上次重置密码链接已经过期，重新发送邮件进行更改密码，并更新上次发送忘记密码时间和验证码
      // 如果上次还未过期
      if (typeof user.lastResetEmail !== 'undefined' && moment().isBefore(user.lastResetEmail)) {
        ctx.body = {
          code: 200,
          msg: '已发送重置密码链接'
        }
        return
      }
      user.lastResetEmail = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      user.fogetCode = uuid().replace(/-/g, '')
      const result1 = await User.updateOne({ _id: user._id }, user)
      if (result1) {
        // 如果更新成功重新发送重置密码邮件
        try {
          // body.username -> database -> email
          const result = await send({
            type: 'foget',
            expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            email: user.username,
            user: user.name,
            data: {
              expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
              email: user.username,
              code: user.fogetCode
            }
          })
          ctx.body = {
            code: 200,
            data: result,
            msg: '已发送邮件，请点击邮件链接进行重置密码'
          }
          return
        } catch (e) {
          console.log(e)
        }
      } else {
        ctx.body = {
          code: 404,
          msg: '用户名错误'
        }
      }
    } else {
      // 图片验证码校验失败
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确,请检查！'
      }
    }
  }

  // 用户登录
  async login (ctx) {
    // 接收用户的数据
    // 返回token
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code)
    if (result) {
      // 验证用户账号密码是否正确
      let checkUserPasswd = false
      const user = await User.findOne({ username: body.username })
      if (user === null) {
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
        return
      }
      if (user.activation === 0) {
        // 说明此账号还未激活，查看激活链接是否过期，如果过期则重新发送激活邮件，如果没有过期则不发送
        const lastExpireEmail = user.lastExpireEmail
        // eslint-disable-next-line no-undef
        if (typeof lastExpireEmail === 'undefined' || moment().isAfter(lastExpireEmail)) {
          // 重新发送邮件，并且更新上次发送邮件的时间和邮件激活码
          user.lastExpireEmail = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss')
          user.emailVerificationCode = uuid().replace(/-/g, '')
          const result1 = await User.updateOne({ _id: user._id }, user)
          if (result1) {
            // 如果更新成功重新发送激活邮件
            try {
              // body.username -> database -> email
              const result = await send({
                type: 'activate',
                expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                email: user.username,
                user: user.name,
                data: {
                  expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                  email: user.username,
                  code: user.emailVerificationCode
                }
              })
              ctx.body = {
                code: 404,
                data: result,
                msg: '已重新发送激活邮件，请先激活账号再进行登录'
              }
              return
            } catch (e) {
              console.log(e)
            }
          }
        } else {
          ctx.body = {
            code: 404,
            msg: '此账号还未激活，请先激活再进行登录'
          }
          return
        }
      }
      if (await bcrypt.compare(body.password, user.password)) {
        checkUserPasswd = true
      }
      // mongoDB查库
      if (checkUserPasswd) {
        // 验证通过，返回Token数据
        const userObj = user.toJSON()
        const arr = ['password', 'username']
        arr.map((item) => {
          delete userObj[item]
        })
        const token = jsonwebtoken.sign({ _id: userObj._id }, config.JWT_SECRET, {
          expiresIn: '1d'
        })
        // 加入isSign属性
        const signRecord = await SignRecord.findByUid(userObj._id)
        if (signRecord !== null) {
          if (moment(signRecord.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            userObj.isSign = true
          } else {
            userObj.isSign = false
          }
          userObj.lastSign = signRecord.created
        } else {
          // 用户无签到记录
          userObj.isSign = false
        }
        ctx.body = {
          code: 200,
          data: userObj,
          token: token
        }
      } else {
        // 用户名 密码验证失败，返回提示
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
      }
    } else {
      // 图片验证码校验失败
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确,请检查！'
      }
    }
  }

  // 注册接口
  async reg (ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    // 校验验证码的内容（时效性、有效性）
    const sid = body.sid
    const code = body.code
    let msg = {}
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code)
    let check = true
    if (result) {
      // 查库，看username是否被注册
      const user1 = await User.findOne({ username: body.username })
      if (user1 !== null && typeof user1.username !== 'undefined') {
        msg.username = ['此邮箱已经注册，可以通过邮箱找回密码']
        check = false
      }
      const user2 = await User.findOne({ name: body.name })
      // 查库，看name是否被注册
      if (user2 !== null && typeof user2.name !== 'undefined') {
        msg.name = ['此昵称已经被注册，请修改']
        check = false
      }
      // 写入数据到数据库
      if (check) {
        // 随机生成邮箱验证码
        body.emailVerificationCode = uuid().replace(/-/g, '')
        body.password = await bcrypt.hash(body.password, 5)
        const user = new User({
          username: body.username,
          name: body.name,
          password: body.password,
          created: moment().format('YYYY-MM-DD HH:mm:ss'),
          lastExpireEmail: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          emailVerificationCode: body.emailVerificationCode
        })
        const result = await user.save()
        // 如果用户创建成功，发送邮件进行激活
        if (result) {
          try {
            // body.username -> database -> email
            const result = await send({
              type: 'activate',
              expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
              email: body.username,
              user: body.name,
              data: {
                expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                email: body.username,
                code: body.emailVerificationCode
              }
            })
            ctx.body = {
              code: 200,
              data: result,
              msg: '注册成功，请进入邮件进行激活！'
            }
            return
          } catch (e) {
            console.log(e)
          }
        }
      }
    } else {
      // veevalidate 显示的错误
      msg.code = ['验证码已经失效，请重新获取！']
    }
    ctx.body = {
      code: 500,
      msg: msg
    }
  }

  // 密码重置
  async reset (ctx) {
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    let msg = {}
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code)
    if (!body.key) {
      ctx.body = {
        code: 500,
        msg: '请求参数异常，请重新获取链接'
      }
      return
    }
    if (!result) {
      msg.code = ['验证码已经失效，请重新获取！']
      ctx.body = {
        code: 500,
        msg: msg
      }
      return
    }
    const params = qs.parse(body.key)
    const expiretime = params.expire
    const email = params.email
    const vecode = params.code
    if (typeof expiretime === 'undefined' || typeof email === 'undefined' || typeof vecode === 'undefined') {
      ctx.body = {
        code: 500,
        msg: '链接错误'
      }
      return
    }
    // 如果链接中的过期时间小于现在，则链接已过期
    if (moment().isAfter(expiretime)) {
      ctx.body = {
        code: 500,
        msg: '链接已经失效'
      }
      return
    }
    const user1 = await User.findOne({ username: email })
    if (user1 === null && typeof user1.username === 'undefined') {
      ctx.body = {
        code: 500,
        msg: '链接错误'
      }
      return
    }
    // 如果链接没有过期，如果code不相同，则链接无效，如果没有code则说明此链接已经被使用过，也返回链接无效
    if (moment().isAfter(user1.lastResetEmail) || typeof user1.fogetCode === 'undefined' || vecode !== user1.fogetCode) {
      ctx.body = {
        code: 500,
        msg: '链接已经失效'
      }
      return
    }
    // 如果链接有效，则重置账户密码，并把vecode置空
    if (vecode === user1.fogetCode) {
      body.password = await bcrypt.hash(body.password, 5)
      user1.password = body.password
      user1.fogetCode = ''
      const result1 = await User.updateOne({ _id: user1._id }, user1)
      if (result1) {
        ctx.body = {
          code: 200,
          msg: '密码重置成功'
        }
        return
      }
    }
    ctx.body = {
      code: 500,
      msg: '链接已经失效'
    }
  }

  async activ (ctx) {
    const params = qs.parse(ctx.query)
    const expiretime = params.expire
    const email = params.email
    const code = params.code
    if (typeof expiretime === 'undefined' || typeof email === 'undefined' || typeof code === 'undefined') {
      ctx.body = {
        code: 500,
        msg: '链接错误'
      }
      return
    }
    // 如果链接中的过期时间小于现在，则链接已过期
    if (moment().isAfter(expiretime)) {
      ctx.body = {
        code: 500,
        msg: '链接已经失效'
      }
      return
    }
    const user1 = await User.findOne({ username: email })
    // 如果没有user1则连接错误
    if (user1 === null && typeof user1.username === 'undefined') {
      ctx.body = {
        code: 500,
        msg: '链接错误'
      }
      return
    }
    // 如果链接没有过期，如果code不相同，则链接无效，如果没有code则说明此链接已经被使用过，也返回链接无效
    if (moment().isAfter(user1.lastExpireEmail) || typeof user1.emailVerificationCode === 'undefined' || code !== user1.emailVerificationCode || user1.activation === 1) {
      ctx.body = {
        code: 500,
        msg: '链接已经失效'
      }
      return
    }
    // 如果链接有效，则激活账户，并把code置空
    if (code === user1.emailVerificationCode) {
      user1.activation = 1
      user1.emailVerificationCode = ''
      const result1 = await User.updateOne({ _id: user1._id }, user1)
      if (result1) {
        ctx.body = {
          code: 200,
          msg: '激活成功'
        }
        return
      }
    }
    ctx.body = {
      code: 500,
      msg: '链接已经失效'
    }
  }
}

export default new LoginController()
