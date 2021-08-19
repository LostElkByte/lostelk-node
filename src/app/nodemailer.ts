import nodemailer from 'nodemailer'

// 获取邮箱服务IP
export const { EMAIL_IP } = process.env

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com', //QQ邮箱的服务器
  port: 587, //端口号
  secure: false, //465为true,其他为false
  auth: {
    user: 'email.lostelk@qq.com', // 自己的邮箱
    pass: 'rhfyeexriqctcbcd', // 授权码,邮箱的授权码
  },
});

/**
 * 注册用户时发送邮箱
 */
export const sendRegisterEmail = ({ name, email, verify_key }) => {
  const url = `${EMAIL_IP}/regiter_success?name=${name}&verify_key=${verify_key}`;
  const loginUrl = `${EMAIL_IP}/login`;
  const params = {
    from: 'lostElk<email.lostelk@qq.com>', // 收件人显示的发件人信息,xxxxxxx换成自己的qq
    to: email, // 目标邮箱号
    subject: 'LostElk',
    html: `${name}
          </br>
          </br> 
          感谢您注册 LostElk, 点击下面的链接即可激活您的账号:
          <a style="color: #87CEFA" href="${url}">${url}</a>
          </br>
          </br>
          这个链接只能使用一次, 点击激活之后就可以在  <a style="color: #87CEFA" href="${loginUrl}">${loginUrl}</a>
          使用下列账号和密码登录了
          </br>
          </br>
          — LostElk 团队
          `,
  };
  return sendMsg(params);
};

/**
 * 找回密码时发送校验码
 * @param {*} params
 */
export const sendCode = ({ email, verify_key }) => {
  const params = {
    from: 'lostElk<email.lostelk@qq.com>', // 收件人显示的发件人信息,xxxxxxx换成自己的qq
    to: email, // 目标邮箱号
    subject: '找回密码',
    html: `邮箱验证码:${verify_key}`,
  };
  return sendMsg(params);
};

/**
 * 发送消息
 */
const sendMsg = (params) => {
  return new Promise((resolve) => {
    transporter.sendMail(params, (err, data) => {
      resolve(null);
      transporter.close(); //发送完毕后关闭
    });
  });
};