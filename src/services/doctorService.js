import db from "../models/index";

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
            if (!inputData || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
                resolve({
                    errCode: 1,
                    errmessage: 'missing parameter!'
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                        // createdAt:new Date()
                    })
                    resolve({
                        errCode: 0,
                        errmessage: 'create info doctor successfully!'
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
                    
                    resolve({
                        errCode: 0,
                        errmessage: 'Update info doctor successfully!'
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
            console.log('data schedule: ',data);
            if (true) {
                resolve({
                    errCode: 0,
                    data: data
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
}

