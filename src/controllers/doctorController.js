import doctorService from "../services/doctorService"

let getTopDoctorHome = async (req, res) => {
    let limit = parseInt(req.query.limit);
    // console.log('req.query.limit = ', limit);
    limit ? limit : (limit = 10);
    // console.log('req.query.limit = ahihi...', limit);
    try {
        // console.log('limit console: ', limit);
        let response = await doctorService.getTopDoctorHome(limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,

}