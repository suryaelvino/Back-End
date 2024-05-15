import { 
    getDetailAdmin,
    addadmin,
    changePwAdmin,
    deleteAdmin, 
    getAdminLatestPagination 
} from "../controllers/adminControllers";
const api   = 'api';
const admin = 'admin';

const adminRoutes = [
    { url: `/${api}/${admin}/getlistadmin`,          method: "get",      handler: (req: any, res: any) => { return getAdminLatestPagination(req, res) }},
    { url: `/${api}/${admin}/getdetailadmin/:id`,    method: "get",      handler: (req: any, res: any) => { return getDetailAdmin(req,res) }},
    { url: `/${api}/${admin}/addadmin`,              method: "post",     handler: (req: any, res: any) => { return addadmin(req,res) }},
    { url: `/${api}/${admin}/updateadmin/:id`,       method: "put",      handler: (req: any, res: any) => { return }},
    { url: `/${api}/${admin}/changepwadmin/:id`,     method: "put",      handler: (req: any, res: any) => { return changePwAdmin(req, res) }},
    { url: `/${api}/${admin}/deleteeadmin/:id`,      method: "delete",   handler: (req: any, res: any) => { return deleteAdmin(req,res) }},
];

export { adminRoutes };