import { Connection } from "../../connection/database";
import { createTokenUser, createTokenAdmin } from "../helpers/authToken";
import { comparePasswords, hashPassword } from "../helpers/authBcrypt";
import { UserData,typeofUserRegister } from "../helpers/authConfig";
import { sendEmail, validateTimeOtp } from "../helpers/authEmail";
import logs from "../../logging/logs"

const db = new Connection();
db.connect();

const myService = 'Auth Service';
const logger = logs(myService);

async function login(req: any, res: any) {
    const { email, password } = req.body;
    try {
        console.time("userLogin");
        const tables = {
            admin: "admin",
            user: "user",
            member: "member"
        };
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        for (const userType in tables) {
            const users: any = await db.getDataFiltered(tables[userType], { email }, 1);
            if (users.length > 0) {
                const user = users[0];
                const hashedPasswordFromDatabase = user.password;
                const match = await comparePasswords(password, hashedPasswordFromDatabase);
                if (match) {
                    const result = { id: user.id, name: user.name };
                    let token: string;
                    if (userType === "admin") {
                        token = createTokenAdmin(result);
                    } else {
                        token = createTokenUser(result);
                    }
                    console.log(`Success ${userType.charAt(0).toUpperCase() + userType.slice(1)} Login`, result);
                    logger.info(`Success Login with ${email}`);
                    console.timeEnd("userLogin");
                    return res.status(200).json({ result, token, message: "success login" });
                } else{
                    console.timeEnd("userLogin");
                    logger.error(`Failed Login ${email}`,);
                    return res.status(404).json({ message: "Please check email and password is correct" });
                }
            }
        }
    } catch (error) {
        console.error("Internal server error:", error);
        logger.error(`Internal server error`);
        return res.status(500).json({ message: "Internal server error", error });
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
        let [emailUsers, phoneUsers]: any = await Promise.all([
            db.getDataFiltered("user", { email: email }, 1),
            db.getDataFiltered("user", { phonenumber: phonenumber }, 1)
        ]);
        if (emailUsers.length > 0) {
            console.timeEnd("userRegister");
            return res.status(409).json({ message: "Email already exists" });
        }
        if (phoneUsers.length > 0) {
            console.timeEnd("userRegister");
            return res.status(409).json({ message: "Phonenumber already exists" });
        }
        let data: UserData = {
            name        : name,
            email       : email,
            phonenumber : phonenumber,
            password    : hashPassword(password),
            created_at  : new Date().valueOf(),
            update_at   : new Date().valueOf(),
            status      : 'ACTIVATE',
        };
        await db.insertData("user", data);
        console.timeEnd("userRegister");
        return res.status(201).json({ message: "Success added new user" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

async function forgotPassword(req: any, res: any) {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }
        let [userResults, forgotResults]: any = await Promise.all([
            db.getDataFiltered("user",   { email : email }, 1),
            db.getDataFiltered("forgot", { email : email }, 1)
        ]);
        if (userResults.length !== 0) {
            const otp = await sendEmail(email, 'Lupa Kata Sandi');
            console.log("otp", otp);
            let data:object = {
                email       : email,
                otp         : otp,
                created_at  : new Date().valueOf()
            }
            if (forgotResults.length !== 0) {
                await db.updateData("forgot", { email : email }, data);
                console.log("Success update otp", otp);
                res.status(200).json({message: 'Success send email verify and update to db' });
            } else {
                await db.insertData("forgot", data);
                console.log("Success added otp", otp);
                res.status(201).json({message: 'Success send email verify and insert to db' });
            }
        } else {
            console.log("Email verification not found")
            res.status(404).send("Email verify not found")
        }
    } catch (error) {
        console.log(`Internal server error : ${error}`);
        res.status(500).send('Internal server error:');
    }
}

async function updateNewPassword(req: any, res: any) { 
    const { email, otp, password } = req.body;
    try {
        if (!email || !otp || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        let condition:object = { email: email, otp: otp };
        const result:any = await db.getDataFiltered('forgot', condition, 1);
        if (result.length === 0) {
            return res.status(404).json({ message: 'No matching OTP found for the email and OTP' });
        }
        let { created_at: createdAt } = result[0];
        const isTimeValid = validateTimeOtp(createdAt);
        if (!isTimeValid) {
            return res.status(400).json({ message: 'Expired OTP' });
        }
        const newpassword = hashPassword(password);
        let data:object = { password: newpassword };
        await Promise.all([
            db.updateData('users',  { email : email }, data),
            db.deleteData('forgot', { email : email })
        ]);
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(`Internal server error: ${error}`);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

export { login, userRegister, forgotPassword, updateNewPassword };