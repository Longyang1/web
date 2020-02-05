let moment = require('moment-timezone');

export function formatDate(value, formatString, defaultString){
	if(value == null){
		return defaultString ? defaultString : "";
	}
	var val = value;
    if (!isNaN(value)) {
        val = Number(val);
    }
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
    return moment(val).tz('Asia/Shanghai').format(formatString);
}