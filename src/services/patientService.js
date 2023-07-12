import db from "../models/index";
import emailService from './emailService';


require('dotenv').config();



let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email 
                || !data.doctorId
                || !data.timeType
                || !data.date
            ) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter(s)!'
                })
            } else {
                
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName:'Bệnh nhân iu dấu',
                    time:'8:00 - 9:00 Chủ nhật 01/08/2023',
                    doctorName:'Mlem Mlem',
                    redirectLink:'https://youtu.be/0GL--Adfqhc?t=2392'
                })
                
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: {email:data.email},
                    defaults: {
                        email:data.email,
                        roleId:'R3'
                    }
                })

                // console.log('check user: ', user[0]);

                //create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {patientId:user[0].id},
                        defaults: {
                            statusId:'S1',
                            doctorId:data.doctorId,
                            patientId:user[0].id,
                            date:data.date,
                            timeType:data.timeType
                    }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage:'Save info patient successfully!'
                })
            }
                
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    postBookAppointment:postBookAppointment,
}