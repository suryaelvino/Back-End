import { Connection } from "../../connection/database";
import { r } from 'rethinkdb-ts';
import { typeofAdminRegister } from "../helpers/adminConfig";
import { AdminData } from "../helpers/adminConfig";
import md5 from "md5";
const db = new Connection();
db.connect();

export async function getAllAdmin(req: any, res: any) {
    try {
        const result:any = await db.getAllData("admin");
        return res.status(200).json({ result, message: "Sucess get list admin" });
    } catch (error) {
        console.error("Error while fetching admin list:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getAdminLatestPagination(req: any, res: any) {
    try {
        console.time("adminList");
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 100;
        const result: any = await db.getAllDataPagination("admin", r.desc("created_at"), skip, limit);
        if (result.length === 0) {
            return res.status(404).json({ message: "List admin with query not found" });
        }
        console.timeEnd("adminList");
        return res.status(200).json({ result, message: "Success get list admin" });
    } catch (error) {
        console.error("Error while fetching admin list:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getDetailAdmin(req: any, res: any) {
    try {
        const result: any = await db.getDataFiltered("admin", { id: req.params.id },1);
        return res.status(200).json({ result, message: "Success get detail admin" });
    } catch (error) {
        console.error("Error while fetching admin list:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function addadmin(req: any, res: any) {
    const { email, phonenumber, name, password, role } = req.body;
    try {
        console.time("adminRegister");
        if (!email || !phonenumber || !name || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!typeofAdminRegister(email, phonenumber, name, password, role)) {
            return res.status(400).json({ message: "Invalid data type for one or more fields" });
        }
        let [emailUsers, phoneUsers]: any = await Promise.all([
            db.getDataFiltered("admin", { email: email }, 1),
            db.getDataFiltered("admin", { phonenumber: phonenumber }, 1)
        ]);
        if (emailUsers.length > 0) {
            console.timeEnd("adminRegister");
            return res.status(409).json({ message: "Email already exists" });
        }
        if (phoneUsers.length > 0) {
            console.timeEnd("adminRegister");
            return res.status(409).json({ message: "Phonenumber already exists" });
        }
        let data: AdminData = {
            name            : name,
            email           : email,
            phonenumber     : phonenumber,
            password        : md5(password),
            role            : role,
            created_at      : new Date().valueOf(),
            update_at       : new Date().valueOf(),
            status          : 'ACTIVATE',
        };
        await db.insertData("admin", data);
        console.timeEnd("adminRegister");
        return res.status(201).json({ message: "Success added new user" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export async function changePwAdmin(req: any, res: any) {
    try {
        const { password } = req.body;
        let data = {
            password: md5(password),
        }
        await db.updateData("admin", { id: req.params.id }, data);
        return res.status(200).json({ message: "Success update password admin" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export async function deleteAdmin(req:any, res: any) {
    try {
        await db.deleteData("admin", { id: req.params.id });
        return res.status(200).json({ message: "Success delete admin" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}