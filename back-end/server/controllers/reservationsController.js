const Reservations = require('../models/reservationsModel');



const getUpcoming = async (req, res) => {
	try {
		const user_id = req.user_id;
		const rsv = await Reservations.upcoming(user_id);
		if(!userInfo) {
			return res.status(404).jason({ message: "User not found" });
		}

		res.status(200).json(rsv);
	} catch (error) {
		res.status(500).json({ message: "Error fetching reservations" });
	}
};

module.exports = { getUpcoming };
