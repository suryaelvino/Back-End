import { Connection } from "../models/database";
import md5 from "md5";
import { createToken } from "../helpers/token";
const db = new Connection();
db.connect();

async function userLogin(req: any, res: any) {
    console.log(req.body);
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const condition = { email: req.body.email, password: md5(req.body.password) };
        db.getDataFiltered("users", condition,1).then((users: any) => {
            if (users.length > 0) {
                const user = users[0];
                const result = { id: user.id, name: user.name }
                const token = createToken(result);
                console.log("Success Login", result)
                return res.status(200).json({ result, token, message:"success login" });
            } else {
                return res.status(404).json({ message: "Please check email and password is correct" });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Invalid request", error });
    }
};

function userRegister(req:any, res: any){}
function forgotPassword(req:any, res:any){}
function updateNewPassword(req: any, res: any) {}

export { userLogin, userRegister, forgotPassword, updateNewPassword };