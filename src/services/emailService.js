import nodemailer from 'nodemailer';
require('dotenv').config();


let sendSimpleEmail = async (datasend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD
        }
      });

    let info = await transporter.sendMail({
    from: '"Phòng khám đa khoa 👻" <bdsthocu20@gmail.com>', // sender address
    to: datasend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lệnh khám bệnh", // Subject line
    // html body
    html:` 
    <h3>Xin chào ${datasend.patientName}!</h3>
    <p> Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website Đặt lịch khám bệnh</p>
    <p>Thông tin đặt lệnh khám bệnh</p>
    <div><b>Thời gian: ${datasend.time}</b></div>
    <div><b>Bác sĩ: ${datasend.doctorName}</b></div>
    <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận & hoàn tất thủ tục đặt lịch khám bệnh</p>
    <div>
        <a href=${datasend.redirectLink} target="_blank">Click here</a>
    </div>
    <div>Xin chân thành cảm ơn</div>
    `
    });
    // console.log("Message sent: ", info);  
}

module.exports = {
  sendSimpleEmail:sendSimpleEmail
}