const path = require('path');
const fs = require('fs').promises;
const csv = require('csv-parser');
const { Readable } = require('stream');
const Station = require('../models/stationModel');
const Charger = require('../models/chargerModel');
const db = require('../config/db');
const { JsonToDb } = require('../utils/dataFormatter');

//hardwired path to the reset data json file
const RESET_DATA_PATH = path.join(__dirname, '../../database/sample_data/reset_data.json');

//controller to reset points to initial state from reset data json file
const resetpoints = async (req, res, next) => {
    //only implement changes if everything goes well
    let connection;
    try {
        const rawData = await fs.readFile(RESET_DATA_PATH, 'utf-8');
        const points = JSON.parse(rawData);

        //connect for transaction
        connection = await db.getConnection();
        await connection.beginTransaction();

        //delete existing data  
        await Charger.deleteAll(connection);
        await Station.deleteAll(connection);

        // import data from reset file
        for (const entry of points) {
            // format data
            const { stationData, chargers } = JsonToDb(entry);

            //insert station
            await Station.create(stationData, connection);

            //insert chargers
            for (const chargerData of chargers) {
                await Charger.create(chargerData, connection);
            }
        }

        //commit transcation
        await connection.commit();

        return res.status(200).json({
            status: "OK",
            message: 'Data reset to initial state successfully.'
         });

    } catch (error) {
        //rollback transaction on error
        if (connection) await connection.rollback();
        
        next(error);
    } finally {
        //release connection
        if (connection) connection.release();
    }
};

const addpoints = async (req, res, next) => {
    //check if file exists 
    if (!req.file) {  
        res.status(400);
        return next(new Error('No file uploaded'));
    }

    if (req.file.mimetype !== 'text/csv') {
        res.status(400);
        return next(new Error("Invalid file type. Only 'text/csv' is supported."));
    }

    let connection;
    try {
        const stationsMap = new Map();
        const stream = Readable.from(req.file.buffer.toString());

        await new Promise((resolve, reject) => {
            stream
                .pipe(csv())
                .on('data', (row) => {
                    const sId = row.id;
                    if (!stationsMap.has(sId)) {
                        stationsMap.set(sId, {
                            id: sId,
                            name:row.name,
                            address: row.address,
                            latitude: row.latitude,
                            longitude: row.longitude,
                            stations: [{ outlets: [] }] // Nesting to satisfy your JsonToDb logic
                        });
                    }
                    stationsMap.get(sId).stations[0].outlets.push({
                        id: row.outlet_id 
                    });
                })
                .on('end', resolve)
                .on('error', reject);
        });

        connection = await db.getConnection();
        await connection.beginTransaction();

        for (const entry of stationsMap.values()) {
            const { stationData, chargers } = JsonToDb(entry);

            await Station.create(stationData, connection);

            for (const chargerData of chargers) {
                await Charger.create(chargerData, connection);
            }
        }

        await connection.commit();
        return res.status(200).json({
            status: "OK",
            message: `Successfully imported ${stationsMap.size} stations.`
        });
        } catch (error) {
        if (connection) await connection.rollback();
        next(error); 
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { resetpoints , addpoints};

    