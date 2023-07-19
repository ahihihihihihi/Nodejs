import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
    try {
        let response = await clinicService.createClinic(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

// let getAllSpecialty = async (req, res) => {
//     try {
//         let response = await specialtyService.getAllSpecialty();
//         return res.status(200).json(response);
//     } catch (e) {
//         console.log(e);
//         return res.status(200).json({
//             errCode: -1,
//             message: 'Error from server...'
//         })
//     }
// }

// let getDetailSpecialtyById = async (req, res) => {
//     try {
//         let response = await specialtyService.getDetailSpecialtyById(req.query.id,req.query.location);
//         return res.status(200).json(response);
//     } catch (e) {
//         console.log(e);
//         return res.status(200).json({
//             errCode: -1,
//             message: 'Error from server...'
//         })
//     }
// }

module.exports = {
    createClinic:createClinic,
    // getAllSpecialty:getAllSpecialty,
    // getDetailSpecialtyById:getDetailSpecialtyById,

}