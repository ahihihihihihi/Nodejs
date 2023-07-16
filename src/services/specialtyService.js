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



module.exports = {
    createSpecialty:createSpecialty

}