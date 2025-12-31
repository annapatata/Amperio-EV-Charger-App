//check type of parameter
const validateType = (x, type) =>
{
	switch(type)
	{
		case "null": 
			return x == null;
		case "integer":
			if (x === "") return false;
			return Number.isInteger(Number(x));
		default:
			return false;
	}
}

// Validate a timestamp
const validateTimestamp = (ts) =>
{
  	const isoString = ts.replace(" ", "T");
  	const date = new Date(isoString);
  	if (isNaN(date.getTime())) return false;

  	const [year, month, day, hour, minute] = ts.match(/\d+/g).map(Number);
  	return 
	(
    		date.getFullYear() === year &&
    		date.getMonth() + 1 === month &&
    		date.getDate() === day &&
    		date.getHours() === hour &&
    		date.getMinutes() === minute
  	);
}

module.exports = { validateType, validateTimestamp };
