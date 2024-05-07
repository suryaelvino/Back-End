const api = '/api';
const routesAuth = [
    { url: `${api}/login`, method: "post", handler: (req: any, res: any) => { return } },
    { url: "/register", method: "post", handler: (req: any, res: any) => { return } },
    { url: "/forgotpassword", method: "post", handler: (req: any, res: any) => { return } },
    { url: "/updatenewpassword", method: "post", handler: (req: any, res: any) => { return } },
];

const routesUser = [
    { url: `${api}/userdetail/:id`, method: "get", handler: (req: any, res: any) => { return getDetailUser(req, res) } },
    { url: "/userupdate/:id", method: "put", handler: (req: any, res: any) => { return } },
    { url: "/userdelete/:id", method: "delete", handler: (req: any, res: any) => { return } },
];

const routesAdmin = [
    { url: "/adminlist", method: "get", handler: (req: any, res: any) => { return } },
    { url: "/admindetail/:id", method: "get", handler: (req: any, res: any) => { return } },
    { url: "/addadmin", method: "post", handler: (req: any, res: any) => { return } },
    { url: "/updateadmin/:id", method: "put", handler: (req: any, res: any) => { return } },
    { url: "/admindelete/:id", method: "delete", handler: (req: any, res: any) => { return } },
];

const routesFile = [
    { url: "/uploadphotosprofil", method: "post", handler: (req: any, res: any) => { return } },
];
function getDetailUser(req: any, res: any) {
    return res.json({ message: "sucees get" });
}
export { routesAuth, routesUser, routesAdmin, routesFile };