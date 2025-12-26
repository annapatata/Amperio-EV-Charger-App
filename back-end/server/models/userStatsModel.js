const db = require('../config/db'); // Import the database connection

class UserStatsModel {

	// return kpis
	static async getKpis(id) {
		const sql = 'Select Count(session_id) as totalSessions, Sum(energy_delivered) as totalEnergy From Session Where user_id = ?'
		const [rows] = await db.query(sql, id);
		return rows[0];
	}
}

module.exports = UserStatsModel;
