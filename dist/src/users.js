"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var expressplus_1 = require("./expressplus"); // Sử dụng improved version
var connection_1 = require("../database/connection");
var app = new expressplus_1.default();
// GET /users - Lấy danh sách users
app.get("/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, connection_1.default.query("SELECT * FROM users")];
            case 1:
                result = _a.sent();
                res.json({ users: result.rows });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching users:", error_1);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /users/:id - Lấy user theo ID  
app.get("/users/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, result, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, connection_1.default.query("SELECT * FROM users WHERE id = $1", [userId])];
            case 2:
                result = _b.sent();
                if (result.rows.length > 0) {
                    res.json(result.rows[0]);
                }
                else {
                    res.status(404).json({ error: "User not found" });
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error("Error fetching user:", error_2);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// POST /users - Tạo user mới
app.post("/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, result, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body || {}, name_1 = _a.name, email = _a.email;
                if (!name_1 || !email) {
                    res.status(400).json({ error: "Name and email are required" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection_1.default.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [name_1, email])];
            case 1:
                result = _b.sent();
                res.status(201).json(result.rows[0]);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error("Error creating user:", error_3);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /users/:id - Cập nhật user (full update)
app.put("/users/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name_2, email, result, error_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                _a = req.body || {}, name_2 = _a.name, email = _a.email;
                if (!name_2 || !email) {
                    res.status(400).json({ error: "Name and email are required" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection_1.default.query("UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *", [name_2, email, userId])];
            case 2:
                result = _c.sent();
                if (result.rows.length > 0) {
                    res.json(result.rows[0]);
                }
                else {
                    res.status(404).json({ error: "User not found" });
                }
                return [3 /*break*/, 4];
            case 3:
                error_4 = _c.sent();
                console.error("Error updating user:", error_4);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// PATCH /users/:id - Cập nhật user (partial update)  
app.patch("/users/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name_3, email, updates, values, paramCount, query, result, error_5;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                _a = req.body || {}, name_3 = _a.name, email = _a.email;
                updates = [];
                values = [];
                paramCount = 1;
                if (name_3) {
                    updates.push("name = $".concat(paramCount++));
                    values.push(name_3);
                }
                if (email) {
                    updates.push("email = $".concat(paramCount++));
                    values.push(email);
                }
                if (updates.length === 0) {
                    res.status(400).json({ error: "No fields to update" });
                    return [2 /*return*/];
                }
                values.push(userId);
                query = "UPDATE users SET ".concat(updates.join(', '), " WHERE id = $").concat(paramCount, " RETURNING *");
                return [4 /*yield*/, connection_1.default.query(query, values)];
            case 2:
                result = _c.sent();
                if (result.rows.length > 0) {
                    res.json(result.rows[0]);
                }
                else {
                    res.status(404).json({ error: "User not found" });
                }
                return [3 /*break*/, 4];
            case 3:
                error_5 = _c.sent();
                console.error("Error updating user:", error_5);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// DELETE /users/:id - Xóa user
app.delete("/users/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, result, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, connection_1.default.query("DELETE FROM users WHERE id = $1 RETURNING *", [userId])];
            case 2:
                result = _b.sent();
                if (result.rows.length > 0) {
                    res.json({ message: "User deleted successfully", user: result.rows[0] });
                }
                else {
                    res.status(404).json({ error: "User not found" });
                }
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                console.error("Error deleting user:", error_6);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Start server
app.listen(3005, function () {
    console.log("Server is running on port 3005");
});
