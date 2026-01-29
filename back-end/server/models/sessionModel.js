const db = require('../config/db'); // Import the database connection

class sessionModel 
{
	// create new session
	// given values of a session, it creates a new session
	// user_id, progress and preblocked money are optional
	static async createSession(id, startTime, endTime, startSoc, endSoc, totalKwh, kwhPrice, user_id = 1, progress = 100, preblocked_money = 0) 
	{
		const sql = 'INSERT INTO Session (charger_id, start_time, end_time, start_soc, end_soc, ' + 
			    'energy_delivered, price_per_kwh, money_preblocked, user_id, session_progress) ' +
                            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'; 
		const [result] = await db.query(sql, [id, startTime, endTime, startSoc, endSoc, totalKwh, kwhPrice, preblocked_money, user_id, progress]);
		return result;
	}

	static async allSessions()
	{
		const sql = 'SELECT * FROM Session';
		const [result] = await db.query(sql);
		return result;
	}

	static async searchSession(id, startTime)
	{
		const sql = 'SELECT * FROM Session WHERE charger_id = ? AND start_time = ?';
		const [result] = await db.query(sql, [id, startTime]);
		return result[0] || null;
	}

	static async rangeSessionSearch(id, startTime, endTime)
	{
		const sql = 'SELECT starttime, endtime, startsoc, endsoc, totalkwh, kwhprice, Amount ' +
			    'FROM Sessions WHERE charger_id = ? AND starttime >= ? AND endtime <= ?';
		const [rows] = await db.query(sql, [id, startTime, endTime]);
		return rows;
	}

    static async deleteByUserId(user_id) {
        const sql = 'DELETE FROM Session WHERE user_id = ?';
        const [result] = await db.query(sql, [user_id]);
        return result;
    }
}

module.exports = sessionModel;
