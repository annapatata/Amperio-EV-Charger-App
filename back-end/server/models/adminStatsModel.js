const db = require('../config/db'); 

class AdminStatsModel {
    
   static async MonthlyFinancial(monthsLimit = 12) {
    const sql = `
        SELECT 
            DATE_FORMAT(start_time, '%b %Y') AS month_label,
           ROUND(SUM(energy_delivered * price_per_kwh), 2) AS revenue,
            ROUND(SUM(wholesale_cost), 2) AS cost
        FROM Session
        WHERE start_time >= DATE_SUB(NOW(), INTERVAL ? MONTH)
        GROUP BY YEAR(start_time), MONTH(start_time), month_label
        ORDER BY YEAR(start_time), MONTH(start_time)
    `;
    const [rows] = await db.execute(sql, [monthsLimit]);
    return rows;
}

    static async RevenueByStation() {
        const query = `
            SELECT 
                st.station_name, 
                ROUND(SUM(s.energy_delivered * s.price_per_kwh),2) AS total_revenue
            FROM Session s
            JOIN Charger c ON s.charger_id = c.charger_id
            JOIN Station st ON c.station_id = st.station_id
            GROUP BY st.station_id
            ORDER BY total_revenue DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }
    
    static async EnergyDemandHeatmap() {
        const sql = `
            SELECT 
                DAYNAME(start_time) AS day,
                HOUR(start_time) AS hour,
                ROUND(AVG(energy_delivered), 2) AS average_energy
            FROM Session
            GROUP BY day, hour
            ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), hour
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async PowerEfficiency() {
        const sql = `
            SELECT 
                c.power AS charger_power,
                ROUND(AVG(s.energy_delivered), 1) AS avg_energy
            FROM Session s
            JOIN Charger c ON s.charger_id = c.charger_id
            GROUP BY c.power
            ORDER BY c.power ASC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

};

    module.exports = AdminStatsModel;