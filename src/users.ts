import ExpressPlus from "./expressplus"; // Sử dụng improved version
import pool from "../database/connection";

const app = new ExpressPlus();

// GET /users - Lấy danh sách users
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json({ users: result.rows });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /users/:id - Lấy user theo ID  
app.get("/users/:id", async (req, res) => {
    const userId = req.params?.id;
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /users - Tạo user mới
app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body || {};

        if (!name || !email) {
            res.status(400).json({ error: "Name and email are required" });
            return;
        }

        const result = await pool.query(
            "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /users/:id - Cập nhật user (full update)
app.put("/users/:id", async (req, res) => {
    const userId = req.params?.id;
    try {
        const { name, email } = req.body || {};

        if (!name || !email) {
            res.status(400).json({ error: "Name and email are required" });
            return;
        }

        const result = await pool.query(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
            [name, email, userId]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PATCH /users/:id - Cập nhật user (partial update)  
app.patch("/users/:id", async (req, res) => {
    const userId = req.params?.id;
    try {
        const { name, email } = req.body || {};

        // Build dynamic query cho PATCH
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (name) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (email) {
            updates.push(`email = $${paramCount++}`);
            values.push(email);
        }

        if (updates.length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        values.push(userId);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /users/:id - Xóa user
app.delete("/users/:id", async (req, res) => {
    const userId = req.params?.id;
    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [userId]);
        if (result.rows.length > 0) {
            res.json({ message: "User deleted successfully", user: result.rows[0] });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start server
app.listen(3005, () => {
    console.log("Server is running on port 3005");
});
