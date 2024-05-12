import { Connection } from "../models/database";
import md5 from "md5";
import { createToken } from "../helpers/token";
import { UserData } from "../helpers/config";
import { typeofUserRegister } from "../helpers/auth.validate";
const db = new Connection();
db.connect();

async function userLogin(req: any, res: any) {
    try {
        console.time("userLogin");
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
                console.timeEnd("userLogin");
                return res.status(200).json({ result, token, message:"success login" });
            } else {
                return res.status(404).json({ message: "Please check email and password is correct" });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Invalid request", error });
    }
};

async function userRegister(req: any, res: any) {
    const { email, phonenumber, name, password } = req.body;
    try {
        console.time("userRegister");
        if (!email || !phonenumber || !name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!typeofUserRegister(email, phonenumber, name, password)) {
            return res.status(400).json({ message: "Invalid data type for one or more fields" });
        }
        const [emailUsers, phoneUsers]:any = await Promise.all([
            db.getDataFiltered("users", { email: email }, 1),
            db.getDataFiltered("users", { phonenumber: phonenumber }, 1)
        ]);
        if (emailUsers.length > 0) {
            console.timeEnd("userRegister");
            return res.status(409).json({ message: "Email already exists" });
        }
        if (phoneUsers.length > 0) {
            console.timeEnd("userRegister");
            return res.status(409).json({ message: "Phonenumber already exists" });
        }
        const data: UserData = {
            name            : name,
            email           : email,
            phonenumber     : phonenumber,
            password        : md5(password),
            created_at      : new Date().valueOf(),
            update_at       : new Date().valueOf(),
            status          : 'ACTIVATE',
        };
        await db.insertData("users", data);
        console.timeEnd("userRegister");
        return res.status(201).json({ message: "Success added new user" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

function forgotPassword(req:any, res:any){}
function updateNewPassword(req: any, res: any) {}

export { userLogin, userRegister, forgotPassword, updateNewPassword };