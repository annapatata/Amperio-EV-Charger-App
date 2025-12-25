const db = require('../config/db');

const getFilterOptions = async (req, res,next) => {
    try {
        //Fetch unique connectors and ower levels
        const [connectorsRows] = await db.query("SELECT * FROM Connector");
        const [powersRows] = await db.query("SELECT * FROM Power ORDER BY power ASC");

        res.status(200).json({
            connectors: connectorsRows,
            powers: powersRows
        });
    }
    catch (error){
        res.status(500);
        next(error);
    }
};

module.exports = { getFilterOptions};