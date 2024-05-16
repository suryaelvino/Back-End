import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './src/auth/routes/authRoutes';
import { adminRoutes } from './src/admin/routes/adminRoutes';
import {authenticateAdmin, authenticateUser } from './src/auth/helpers/authToken';
import { testDatabaseConnection } from './src/connection/seqeulize';
import { userRoutes } from './src/users/routes/usersRoutes';
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 3000;
const limiter = (maxRequests:number) => rateLimit({
    windowMs: 1 * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
});

const authWithoutToken = [
    "login", "register", "forgotpassword", "updatenewpassword"
]

const adminToken = [
    "getlistadmin", "getdetailadmin/:id", "addadmin", "updateadmin/:id", "changepwadmin/:id", "deleteeadmin/:id"
]

app.use(cors());
app.use(bodyParser.text());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use('/uploads', express.static('uploads'));

const corsOptions = {
    origin: ['http://localhost:8100', 'http://127.0.0.1:8100'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.all('/*', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next()
});


const services = [
    userRoutes,
    authRoutes, 
    adminRoutes
];
services.forEach(registerService);

function registerService(routes: any) {
    routes.map((route: any) => {
        const method = route.method.toLowerCase();
        const url = route.url;
        const withoutToken = authWithoutToken.some((routePart) => url.includes(routePart));
        const adminpath = adminToken.some((routePart) => url.includes(routePart));
        switch (method) {
            case 'get':
                if (adminpath) {
                    // app.get(url, cors(corsOptions), authenticateAdmin, limiter(60), route.handler);
                    app.get(url, cors(corsOptions), limiter(60), route.handler);
                }
                else {
                    // app.get(url, cors(corsOptions), authenticateUser , limiter(60), route.handler);
                    app.get(url, cors(corsOptions), limiter(60), route.handler);
                }
                break;
            case 'post':
                if (withoutToken) {
                    app.post(url, cors(corsOptions), limiter(5) ,route.handler);
                }
                else if (adminpath){
                    app.post(url, cors(corsOptions), authenticateAdmin, limiter(60), route.handler);
                }
                else {
                    app.post(url, cors(corsOptions), authenticateUser, limiter(60), route.handler);
                }
                break;
            case 'put':
                if (adminpath){
                    app.put(url, cors(corsOptions), authenticateAdmin, limiter(60), route.handler);    
                }
                else {
                    app.put(url, cors(corsOptions), authenticateUser, limiter(60), route.handler);
                }
                break;
            case 'delete':
                if (adminpath) {
                    app.delete(url, cors(corsOptions), authenticateAdmin, limiter(60), route.handler);
                }
                else {
                    app.delete(url, cors(corsOptions), authenticateUser, limiter(60), route.handler);
                }
                break;
            case 'patch':
                if (adminpath) {
                    app.patch(url, cors(corsOptions), authenticateAdmin, limiter(60), route.handler);
                }
                else {
                    app.patch(url, cors(corsOptions), authenticateUser, limiter(60), route.handler);
                }
                break;
            default:
                console.warn(`Unknown method '${method}' for route '${url}'`);
                break;
        }
    });
}

testDatabaseConnection();
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

export { app };