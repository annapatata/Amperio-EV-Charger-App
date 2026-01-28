const StationModel = require('../models/stationModel');

const db = require('../config/db'); 

const searchStations = async (req, res, next) => {
    try {
        const { q, power, connector, available, facilities, score } = req.query;

        let queryParams = [];
        let chargerFilters = [];

        // 1. Προετοιμασία φίλτρων (Power & Connector)
        if (power && power !== "" && power !== 'undefined') {
            const powerArray = power.split(',').map(p => Number(p.trim())).filter(p => !isNaN(p));
            if (powerArray.length > 0) {
                const placeholders = powerArray.map(() => '?').join(', ');
                chargerFilters.push(`ch.power IN (${placeholders})`);
                queryParams.push(...powerArray);
            }
        }

        if (connector && connector !== "" && connector !== 'undefined') {
            const connectorArray = connector.split(',').map(c => c.trim()).filter(c => c);
            if (connectorArray.length > 0) {
                const placeholders = connectorArray.map(() => '?').join(', ');
                chargerFilters.push(`ch.connector_type IN (${placeholders})`);
                queryParams.push(...connectorArray);
            }
        }

        // 2. Κατασκευή Query
        // Χρησιμοποιούμε INNER JOIN αν υπάρχουν φίλτρα φορτιστή για να "πετάξουμε" τους σταθμούς που δεν ταιριάζουν
        const joinType = chargerFilters.length > 0 ? 'INNER JOIN' : 'LEFT JOIN';

        let queryText = `
            SELECT s.station_id, 
                s.address, 
                s.latitude, 
                s.longitude,
                s.facilities,
                s.score,
                CASE 
                    WHEN SUM(CASE WHEN ch.charger_status = 'available' THEN 1 ELSE 0 END) > 0 THEN 'available'
                    WHEN SUM(CASE WHEN ch.charger_status = 'charging' THEN 1 ELSE 0 END) > 0 THEN 'charging'
                    WHEN SUM(CASE WHEN ch.charger_status = 'reserved' THEN 1 ELSE 0 END) > 0 THEN 'reserved'
                    ELSE 'offline'
                END AS station_status,
                SUM(CASE WHEN ch.charger_status = 'available' THEN 1 ELSE 0 END) AS available_chargers,
                COUNT(CASE WHEN ch.charger_id IS NOT NULL THEN 1 END) AS total_chargers
            FROM Station s
            ${joinType} Charger ch ON s.station_id = ch.station_id
            ${chargerFilters.length > 0 ? ` AND ${chargerFilters.join(' AND ')}` : ''}
            WHERE 1=1
        `;

        // 3. Φίλτρα Σταθμού
        if (q) {
            const searchPattern = `%${q}%`;
            queryText += ` AND (s.address LIKE ? OR s.facilities LIKE ?)`;
            queryParams.push(searchPattern, searchPattern);
        }

        if (facilities && facilities !== "" && facilities !== 'undefined') {
            const facilitiesArray = typeof facilities === 'string' ? facilities.split(',') : (Array.isArray(facilities) ? facilities : []);
            if (facilitiesArray.length > 0) {
                const orConditions = facilitiesArray.map(() => 's.facilities LIKE ?').join(' OR ');
                queryText += ` AND (${orConditions})`;
                facilitiesArray.forEach(f => queryParams.push(`%${f.trim()}%`));
            }
        }

        if (score && score !== "" && score !== 'undefined') {
            const minScore = Math.min(...score.split(',').map(Number));
            queryText += ` AND s.score >= ?`;
            queryParams.push(minScore);
        }

        queryText += ` GROUP BY s.station_id`;

        // 4. Availability Filter
        if (available === 'true') {
            queryText += ` HAVING SUM(CASE WHEN ch.charger_status = 'available' THEN 1 ELSE 0 END) > 0`;
        }

        const [rows] = await db.query(queryText, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error("Database Error:", error);
        next(error);
    }
};

const getAllStations = async (req, res,next) => {
    try {
        const stations = await StationModel.getAllStations();
        res.status(200).json(stations);
    } catch (error) {
        next(error);
    }
};

const getStation = async (req,res,next) => {
    try{
        const {id} = req.params;
        const station = await StationModel.getStationById(id);

        if(!station){
            res.status(404);
            return next(new Error("Station not found."));
        }

        res.status(200).json(station);
    }
        catch(error){
            next(error);
        }
};

module.exports = {getAllStations,getStation, searchStations};