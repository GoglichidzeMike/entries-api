/* eslint-disable require-jsdoc */
// eslint-disable-next-line require-jsdoc
class HttpError extends Error {
	constructor(message, errorCode) {
		super(message); // add message propperty;
		this.code = errorCode;
	}
}

module.exports = HttpError;
