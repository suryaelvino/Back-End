import { login, userRegister, forgotPassword, updateNewPassword } from "../controllers/authControllers";
const api = '/api';

const authRoutes = [
    { url: `${api}/login`,                 method: "post",  handler: (req: any, res: any) => { return login(req, res) } },
    { url: `${api}/register`,              method: "post",  handler: (req: any, res: any) => { return userRegister(req, res) } },
    { url: `${api}/forgotpassword`,        method: "post",  handler: (req: any, res: any) => { return forgotPassword(req, res) } },
    { url: `${api}/updatenewpassword`,     method: "post",  handler: (req: any, res: any) => { return updateNewPassword(req, res) } },
];

export { authRoutes };