const db = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  static async create({ firstName, lastName, username, password, isMember = false, isAdmin = false }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `INSERT INTO users (first_name, last_name, username, password, is_member, is_admin) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, first_name, last_name, username, is_member, is_admin, created_at`,
      [firstName, lastName, username, hashedPassword, isMember, isAdmin]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    return rows[0];
  }

  static async findById(id) {
    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0];
  }

  static async updateMembership(id, isMember) {
    const { rows } = await db.query(
      "UPDATE users SET is_member = $1 WHERE id = $2 RETURNING *",
      [isMember, id]
    );
    return rows[0];
  }

  static async getAllMembers() {
    const { rows } = await db.query(
      "SELECT id, first_name, last_name, username, is_member, is_admin FROM users WHERE is_member = true"
    );
    return rows;
  }
}

module.exports = User;