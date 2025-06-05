const db = require("../config/db");

class Message {
  static async create({ title, content, userId }) {
    const { rows } = await db.query(
      `INSERT INTO messages (title, content, user_id) 
       VALUES ($1, $2, $3) 
       RETURNING id, title, content, user_id, created_at`,
      [title, content, userId]
    );
    return rows[0];
  }

  static async findAll() {
    const { rows } = await db.query(`
      SELECT m.id, m.title, m.content, m.created_at, 
             u.id as user_id, u.first_name, u.last_name, u.is_member, u.is_admin
      FROM messages m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
    `);
    return rows;
  }

  static async findById(id) {
    const { rows } = await db.query(
      `SELECT m.*, u.first_name, u.last_name, u.is_member, u.is_admin
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = $1`,
      [id]
    );
    return rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM messages WHERE id = $1", [id]);
  }

  static async findByUserId(userId) {
    const { rows } = await db.query(
      "SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  }
}

module.exports = Message;