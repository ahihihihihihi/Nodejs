import db from "../models/index";
import CRUDservice, { createNewUser } from "../services/CRUDservice";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }


}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

let getCRUD = (req, res) => {
    return res.render('test/crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body);
    console.log(message);
    return res.send("post crud from server");
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    console.log("-------------------------");
    console.log(data);
    console.log("-------------------------");
    return res.render("displayCRUD.ejs", {
        dataTable: data,
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDservice.getUserInfoById(userId);
        // console.log("---------------------");
        // console.log(userData);
        // console.log("---------------------");
        // console.log(Object.keys(userData).length);
        if (Object.keys(userData).length != 0) {
            return res.render("editCRUD.ejs", {
                user: userData,
                // x<-y
            });
        }
        else {
            return res.send("Khum co user 1.");
        }
    }
    return res.send("Khum co user 2.");
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDservice.updateUserData(data);
    return res.render("displayCRUD.ejs", {
        dataTable: allUsers,
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        let ok = await CRUDservice.deleteUserById(id);
        if (ok == 'ok') {
            return res.send('delete the user successfully!');
        }
        return res.send('User not found!');
    } else {
        return res.send('User not found!');
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}