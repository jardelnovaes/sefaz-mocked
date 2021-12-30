Date.prototype.toISO8601String  = function() {
	var pad2 = function pad2(number) {
		return ("00"+number).slice(-2)
	}
	
	var tzoffset = (this).getTimezoneOffset() * 60000;
	var tzTemp = (this).getTimezoneOffset() / 60;
	var tzSinal = "-";
	if (tzTemp < 0) {
		tzSinal = "+";
		tzTemp = Math.abs(tzTemp);
	}
	var tzHours = ~~tzTemp;
	var tzMinutes = (tzTemp-tzHours) * 60;
	
	return (new Date(Date.now() - tzoffset)).toISOString().slice(0, -5) + tzSinal + pad2(tzHours) + ":" + pad2(tzMinutes);

}

module.exports = Date;