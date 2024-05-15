import { login, userRegister, forgotPassword, updateNewPassword } from "../controllers/authControllers";

const api   = 'api';
const auth  = 'auth';

const authRoutes = [
    { url: `/${api}/${auth}/login`,                 method: "post",  handler: (req: any, res: any) => { return login(req, res) } },
    { url: `/${api}/${auth}/register`,              method: "post",  handler: (req: any, res: any) => { return userRegister(req, res) } },
    { url: `/${api}/${auth}/forgotpassword`,        method: "post",  handler: (req: any, res: any) => { return forgotPassword(req, res) } },
    { url: `/${api}/${auth}/updatenewpassword`,     method: "post",  handler: (req: any, res: any) => { return updateNewPassword(req, res) } },
];

export { authRoutes };