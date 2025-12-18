const db = require('../config/db');

class ChargerModel {

	// Return all points from the View
	static async getAllChargers() {
		const sql = 'SELECT * FROM Points';
		const [rows] = await db.query(sql);
		return rows;
	}

	// Return points filtered by status
	static async getByStatus(status) {
		const sql = 'SELECT * FROM Points WHERE status = ?';
		const [rows] = await db.query(sql, [status]); 
		return rows;
	}
	// get specific point on ip
	static async getById(id) {
		const sql = 'SELECT * FROM PointDetail WHERE pointid = ?';
		const [rows] = await db.query(sql, [id]);

		// Return the first result (or undefined if not found)
		return rows[0];
	}
}

module.exports = ChargerModel;
