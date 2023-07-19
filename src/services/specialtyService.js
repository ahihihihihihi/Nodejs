import db from "../models/index";

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name
                || !data.imageBase64
                || !data.descriptionHTML
                || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter(s)!'
                })
            } else {
                // console.log('check data: ',data);
                let result = await db.Specialty.create({
                    name:data.name,
                    image:data.imageBase64,
                    descriptionHTML:data.descriptionHTML,
                    descriptionMarkdown:data.descriptionMarkdown,
                })

                if (result) {
                    resolve({
                        errCode: 0,
                        errMessage:'ok'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage:'Add new speciaty error!'
                    })
                }
            }
                
        } catch (e) {
            reject(e);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({

            })
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage:'ok',
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailSpecialtyById = (inputId,location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter(s)!'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: {id:inputId},
                    attributes: ['descriptionHTML','descriptionMarkdown'],
                })
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: {
                                specialtyId:inputId,
                            },
                            attributes: ['provinceId','doctorId'],
                        })
                    } else {
                        // find doctor by location
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: {
                                specialtyId:inputId,
                                provinceId:location
                            },
                            attributes: ['provinceId','doctorId'],
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty;
                } else {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    errMessage:'ok',
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createSpecialty:createSpecialty,
    getAllSpecialty:getAllSpecialty,
    getDetailSpecialtyById:getDetailSpecialtyById,
}