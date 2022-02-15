const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		orderId: {
			type: String,
		},
		cardFrontImg: {
			type: String,
			required: true,
		},
		cardBackImg: {
			type: String,
			required: true,
		},
		selfieImg: {
			type: String,
		},
		status: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Entry', entrySchema);
