import db from "../models/index";

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name
                || !data.address
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
                let result = await db.Clinic.create({
                    name:data.name,
                    address:data.address,
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
                        errMessage:'Add new clinic error!'
                    })
                }
            }
                
        } catch (e) {
            reject(e);
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({

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

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter(s)!'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {id:inputId},
                    attributes: ['name','address','descriptionHTML','descriptionMarkdown'],
                })
                if (data) {
                    let doctorClinic = await db.Doctor_info.findAll({
                        where: {
                            clinicId:inputId,
                        },
                        attributes: ['provinceId','doctorId'],
                    })
                    data.doctorClinic = doctorClinic;
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
    createClinic:createClinic,
    getAllClinic:getAllClinic,
    getDetailClinicById:getDetailClinicById,
}