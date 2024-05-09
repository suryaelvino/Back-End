import { userLogin, userRegister, forgotPassword, updateNewPassword } from "../controllers/auth";
import { photosProfil, deletePhotoProfil } from "../controllers/setting";
const api = '/api';

const routesAuth = [
    { url: `${api}/login`,                  method: "post",   handler: (req: any, res: any) => { return userLogin(req,res) }},
    { url: `${api}/register`,               method: "post",   handler: (req: any, res: any) => { return userRegister(req,res) }},
    { url: `${api}/forgotpassword`,         method: "post",   handler: (req: any, res: any) => { return forgotPassword(req,res) }},
    { url: `${api}/updatenewpassword`,      method: "post",   handler: (req: any, res: any) => { return updateNewPassword(req,res) }},
];

const routesUser = [
    { url: `${api}/userdetail/:id`,         method: "get",    handler: (req: any, res: any) => { return } },
    { url: `${api}/userupdate/:id`,         method: "put",    handler: (req: any, res: any) => { return } },
    { url: `${api}/userdelete/:id`,         method: "delete", handler: (req: any, res: any) => { return } },
];

const routesAdmin = [
    { url: `${api}/adminlist`,              method: "get",    handler: (req: any, res: any) => { return } },
    { url: `${api}/admindetail/:id`,        method: "get",    handler: (req: any, res: any) => { return } },
    { url: `${api}/addadmin`,               method: "post",   handler: (req: any, res: any) => { return } },
    { url: `${api}/updateadmin/:id`,        method: "put",    handler: (req: any, res: any) => { return } },
    { url: `${api}/admindelete/:id`,        method: "delete", handler: (req: any, res: any) => { return } },
];

const routesFile = [
    { url: `${api}/photosprofil/:id`,       method: "post", handler: (req: any, res: any) => { return photosProfil(req, res) } },
    { url: `${api}/deletephotosprofil/:id`, method: "delete", handler: (req: any, res: any) => { return deletePhotoProfil(req, res) } },
];

export { routesAuth, routesUser, routesAdmin, routesFile };