import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { routesAuth, routesUser, routesAdmin } from './src/routes/routes';
import { validateToken } from './src/helpers/token';
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
});

const authWithoutToken = [
    "login", "register", "forgotpassword", "updatenewpassword"
]
app.use(cors());
app.use(limiter);
app.use(bodyParser.text());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

const corsOptions = {
    origin: ['http://localhost:8100', 'http://127.0.0.1:8100'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    // res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

registerRoutes(routesAuth);
registerRoutes(routesUser);
registerRoutes(routesAdmin);

function registerRoutes(routes: any) {
    routes.map((route: any) => {
        const method = route.method.toLowerCase();
        const url = route.url;
        const withoutToken = authWithoutToken.some((routePart) => url.includes(routePart));
        switch (method) {
            case 'get':
                app.get(url, cors(corsOptions),validateToken ,route.handler);
                break;
            case 'post':
                if (url.includes('upload')) {
                    // app.post(url, cors(corsOptions), upload.array('files'), route.handler);
                } 
                else if (withoutToken) {
                    app.post(url, cors(corsOptions), route.handler);
                }
                else {
                    app.post(url, cors(corsOptions),validateToken, route.handler);
                }
                break;
            case 'put':
                app.put(url, cors(corsOptions),validateToken, route.handler);
                break;
            case 'delete':
                app.delete(url, cors(corsOptions),validateToken, route.handler);
                break;
            case 'patch':
                app.patch(url, cors(corsOptions),validateToken, route.handler);
                break;
            default:
                console.warn(`Unknown method '${method}' for route '${url}'`);
                break;
        }
    });
}

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

export { app };