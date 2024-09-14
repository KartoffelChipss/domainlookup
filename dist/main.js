"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = exports.authManager = void 0;
exports.getCountryByCode = getCountryByCode;
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = require("./util/auth");
const api_1 = __importDefault(require("./routes/api"));
const auth_2 = __importDefault(require("./routes/auth"));
mongoose_1.default.connect(process.env.MONGO_URI || '', {}).then(() => console.log("Connected to database"));
const app = (0, express_1.default)();
exports.authManager = new auth_1.AuthManager();
const dataDir = path_1.default.resolve(`${process.cwd()}${path_1.default.sep}src`);
const templateDir = path_1.default.resolve(`${dataDir}${path_1.default.sep}templates`);
const utilDir = path_1.default.resolve(path_1.default.join(dataDir, "util"));
app.engine("ejs", ejs_1.default.renderFile);
app.set("view engine", "ejs");
const renderTemplate = (res, req, template, data = {}) => {
    const baseData = { path: req.path };
    res.render(path_1.default.resolve(`${templateDir}${path_1.default.sep}${template}`), Object.assign(Object.assign({}, baseData), data));
};
exports.renderTemplate = renderTemplate;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((0, cookie_parser_1.default)());
function getCountryByCode(code) {
    return require(path_1.default.join(utilDir, "countrycodes.json")).find((country) => country.code === code);
}
app.use(exports.authManager.use);
app.use("/api", api_1.default);
app.use("/", auth_2.default);
app.use("/assets", express_1.default.static(path_1.default.resolve(`${dataDir}${path_1.default.sep}assets`)));
app.get("/", auth_1.requireAuth, (req, res) => {
    (0, exports.renderTemplate)(res, req, "main.ejs", {
        user: req.user,
    });
});
app.get("/domain/:query", auth_1.requireAuth, (req, res) => {
    (0, exports.renderTemplate)(res, req, "info.ejs", {
        user: req.user,
        query: req.params.query,
        queryType: "domain",
    });
});
app.get("/tld/:query", auth_1.requireAuth, (req, res) => {
    (0, exports.renderTemplate)(res, req, "info.ejs", {
        user: req.user,
        query: req.params.query,
        queryType: "tld",
    });
});
app.listen(process.env.PORT || 3000, () => console.log(`Server is running on port ${process.env.PORT || 3000}`));
