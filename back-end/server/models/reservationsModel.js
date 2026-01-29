const db = require('../config/db'); // Import the database connection

class ReservationsModel {

	static async upcoming(id) {
		const sql = `
		Select s.station_name, s.address, r.reservation_end_time 
		from Reservation r 
		join Charger c on r.charger_id = c.charger_id 
		join Station s on c.station_id = s.station_id 
		where r.user_id = ? and r.reservation_start_time > NOW()
		order by r.reservation_start_time asc
		`;
		const [rows] = await db.query(sql, id);
		return rows;
	}

    static async create(user_id, charger_id, reservation_start_time, reservation_end_time) {
        const sql = 'INSERT INTO Reservation (user_id, charger_id, reservation_start_time, reservation_end_time) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [user_id, charger_id, reservation_start_time, reservation_end_time]);
        return result;
    }

    static async delete(reservation_id) {
        const sql = 'DELETE FROM Reservation WHERE reservation_id = ?';
        const [result] = await db.query(sql, [reservation_id]);
        return result;
    }

    static async deleteByUserId(user_id) {
        const sql = 'DELETE FROM Reservation WHERE user_id = ?';
        const [result] = await db.query(sql, [user_id]);
        return result;
    }
}

module.exports = ReservationsModel;
