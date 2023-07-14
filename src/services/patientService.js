import db from "../models/index";
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId,token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}


require('dotenv').config();



let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email 
                || !data.doctorId
                || !data.timeType
                || !data.date
                || !data.fullName
            ) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter(s)!'
                })
            } else {
                let token = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName:data.fullName,
                    time:data.timeString,
                    doctorName:data.doctorName,
                    language:data.language,
                    redirectLink:buildUrlEmail(data.doctorId,token)
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
                            timeType:data.timeType,
                            token:token
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

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId
                || !data.token
            ) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter(s)!'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId:data.doctorId,
                        token:data.token,
                        statusId:'S1'
                    },
                    raw:false
                })
                

                //create a booking record
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage:'Update the appointment successfully!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage:'The appointment has been activated or does not exist!'
                    })
                }
            }
                
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment:postBookAppointment,
    postVerifyBookAppointment:postVerifyBookAppointment
}