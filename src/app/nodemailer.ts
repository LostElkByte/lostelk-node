import nodemailer from 'nodemailer'

// 获取邮箱服务IP
export const { EMAIL_IP } = process.env

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com', //QQ邮箱的服务器
  port: 587, //端口号
  secure: false, //465为true,其他为false
  auth: {
    user: 'email.lostelk@qq.com', // 自己的邮箱
    pass: 'xarucblqhqjlbhhb', // 授权码,邮箱的授权码
  },
});

/**
 * 注册用户时发送邮箱
 */
export const sendRegisterEmail = ({ name, email, registration_verify_key }) => {
  const url = `${EMAIL_IP}?email=${email}&name=${name}&registration_verify_key=${registration_verify_key}`;
  const loginUrl = `${EMAIL_IP}/login`;
  const registerUrl = `${EMAIL_IP}/register`;
  const params = {
    from: 'lostElk<email.lostelk@qq.com>', // 收件人显示的发件人信息,xxxxxxx换成自己的qq
    to: email, // 目标邮箱号
    subject: '确认您的 LostElk 账户',
    html: `<p>嗨: ${name}</p>
          <p>感谢您注册 LostElk，如确认是您本人注册的本站账号,</p>
          <p>请在30分钟内点击下面的链接即可激活您的账号：
            <a style="color: #87CEFA" href="${url}">点击激活邮箱</a>
          </p>
          <p>此激活链接只能使用一次，请在30分钟内使用。如超过激活时间导致链接失效，您可以点击此链接
            <a style="color: #87CEFA" href="${registerUrl}">点击注册</a> 重新注册。
          </p>
          <p>注：如果您未注册此账号，您可以忽略该邮件，该账号将在30分钟后被删除。</p>
          <p>激活成功后之后您就可以在 <a style="color: #87CEFA" href="${loginUrl}">点击登录</a>
          使用您的账号和密码登录啦~</p>
        
          <p>— LostElk</p>
          `,
  };
  return sendMsg(params);
};

/**
 * 激活用户成功时发送邮件
 */
export const sendActivateSuccess = ({ name, email }) => {
  const loginUrl = `${EMAIL_IP}/login`;
  const params = {
    from: 'lostElk<email.lostelk@qq.com>', // 收件人显示的发件人信息,xxxxxxx换成自己的qq
    to: email, // 目标邮箱号
    subject: 'LostElk 账号激活成功',
    html: `尊敬的: ${name}
          </br> 
          您的账号：${email} 已经激活成功
          </br>
          您现在即可点击链接
           <a style="color: #87CEFA" href="${loginUrl}">点击登录</a>
          使用您的账号和密码登录了
          </br>
          </br>
          — LostElk 团队
          `,
  };
  return sendMsg(params);
}


/**
 * 找回密码时发送邮件
 * @param {*} params
 */
export const sendRetrievePasswordEmail = ({ email, name, retrieve_password_verify_key }) => {
  const url = `${EMAIL_IP}/RetrievePassword?email=${email}&retrievePasswordVerifyKey=${retrieve_password_verify_key}`;
  const params = {
    from: 'lostElk<email.lostelk@qq.com>', // 收件人显示的发件人信息,xxxxxxx换成自己的qq
    to: email, // 目标邮箱号
    subject: '找回密码',
    html: `<p>嗨: ${name}</p>
          <p>您现在可以重置您的密码。请在30分钟内使用下面的链接设置新密码</p>
            <a style="color: #87CEFA" href="${url}">设置您的新密码</a>
          </p>
          <p>如果您没有请求，请忽略该邮件</p>
          <p>您的密码不会改变,直到您访问上面的链接并设置新密码</p>

          <p>— LostElk 团队</p>
          `,
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