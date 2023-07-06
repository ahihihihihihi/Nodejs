import db from "../models/index";
require('dotenv').config();
import _ from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            if (users) {
                resolve({
                    errCode: 0,
                    data: users
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}


let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            if (doctors) {
                resolve({
                    errCode: 0,
                    data: doctors
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        // console.log('inputData doctor: ',inputData);
        try {
            if (!inputData 
                || !inputData.contentHTML 
                || !inputData.contentMarkdown 
                || !inputData.action
                || !inputData.selectedPrice
                || !inputData.selectedPayment
                || !inputData.selectedProvince
                || !inputData.nameClinic
                || !inputData.addressClinic
                || !inputData.note
                ) {
                resolve({
                    errCode: 1,
                    errmessage: 'missing parameter!'
                })
            } else {
                // upsert to Markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                        // createdAt:new Date()
                    })
                    
                }
                if (inputData.action === 'UPDATE') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: {doctorId:inputData.doctorId},
                        raw: false
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        // doctorMarkdown.updatedAt = new Date();
                        await doctorMarkdown.save();
                    }

                    // console.log('date: ', new Date())
                    
                    
                }

                // upsert to Markdown table
                let doctorInfo = await db.Doctor_info.findOne({
                    where: {
                        doctorId:inputData.doctorId,
                    },
                    raw:false,
                })

                if (doctorInfo) {
                    //update
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.nameClinic = inputData.nameClinic;
                    doctorInfo.addressClinic = inputData.addressClinic;
                    doctorInfo.note = inputData.note;
                    await doctorInfo.save();

                    resolve({
                        errCode: 0,
                        errmessage: 'Update info doctor successfully!'
                    })
                } else
                {
                    //create
                    await db.Doctor_info.create({
                        doctorId : inputData.doctorId,
                        priceId : inputData.selectedPrice,
                        provinceId : inputData.selectedProvince,
                        paymentId : inputData.selectedPayment,
                        nameClinic : inputData.nameClinic,
                        addressClinic : inputData.addressClinic,
                        note : inputData.note,
                    })

                    resolve({
                        errCode: 0,
                        errmessage: 'create info doctor successfully!'
                    })
                }
                
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = '';
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_info,
                            attributes:{
                                exclude: ['id','doctorId'],
                            },
                            include:[
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: true,
                    nest: true
                })
            }
            if (data) {
                if (data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
            else {
                resolve({
                    errCode: 0,
                    errMessage: 'The info of doctor not found!',
                    data: {}
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('data schedule: ',data);
            // console.log('data schedule: ',typeof data);
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter(s)!'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                //get all existing data
                let existing = await db.Schedule.findAll(
                    {
                        where:{doctorId:data.doctorId, date:data.formatedDate},
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        
                    }
                )

                //convert date
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }

                // console.log('check existing: ',existing);
                // console.log('check schedule: ',schedule);

                //compare diffrent
                let toCreate = _.differenceWith(schedule, existing, (a , b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                })

                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode:0,
                    errMessage:'OK'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}


let getScheduleByDate = (doctorId,date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter(s)!'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId:doctorId,
                        date:date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    nest:true,
                    raw:true
                })
                if (!dataSchedule) {
                    dataSchedule = [];
                }
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
                
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule:bulkCreateSchedule,
    getScheduleByDate:getScheduleByDate
}

