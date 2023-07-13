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
    html: getBodyHTMLEmail(datasend)
    });
    // console.log("Message sent: ", info);  
}

let getBodyHTMLEmail = (datasend) => {
  let result = '';

  if (datasend.language === 'vi') {
    result = 
    ` 
    <h3>Xin chào ${datasend.patientName}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website Đặt lịch khám bệnh</p>
    <p>Thông tin đặt lệnh khám bệnh</p>
    <div><b>Thời gian: ${datasend.time}</b></div>
    <div><b>Bác sĩ: ${datasend.doctorName}</b></div>
    <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận & hoàn tất thủ tục đặt lịch khám bệnh</p>
    <div>
        <a href=${datasend.redirectLink} target="_blank">Click here</a>
    </div>
    <div>Xin chân thành cảm ơn</div>
    `
  }

  if (datasend.language === 'en') {
    result = 
    ` 
    <h3>Dear ${datasend.patientName}!</h3>
    <p>You received this email because you booked an online medical appointment on the Book an appointment website</p>
    <p>Information to order medical examination</p>
    <div><b>Time: ${datasend.time}</b></div>
    <div><b>Doctor: ${datasend.doctorName}</b></div>
    <p>If the above information is true, please click on the link below to confirm & complete the medical appointment booking procedure.</p>
    <div>
        <a href=${datasend.redirectLink} target="_blank">Click here</a>
    </div>
    <div>Sincerely thank</div>
    `
  }

  return result;
}

module.exports = {
  sendSimpleEmail:sendSimpleEmail
}