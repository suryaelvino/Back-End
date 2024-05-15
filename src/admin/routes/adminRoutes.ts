const api = '/api';

const adminRoutes = [
    { url: `${api}/getlistadmin`,           method: "get",      handler: (req: any, res: any) => { return } },
    { url: `${api}/getdetailadmin/:id`,     method: "get",      handler: (req: any, res: any) => { return } },
    { url: `${api}/addadmin`,               method: "post",     handler: (req: any, res: any) => { return } },
    { url: `${api}/updateadmin/:id`,        method: "put",      handler: (req: any, res: any) => { return } },
    { url: `${api}/changepwadmin/:id`,      method: "put",      handler: (req: any, res: any) => { return } },
    { url: `${api}/deleteeadmin/:id`,       method: "delete",   handler: (req: any, res: any) => { return } },
];