const HttpError = require('../models/http-errors');
const { validationResult } = require('express-validator');

// immport models;
const Entry = require('../models/entry');

// get all entries
const getEntries = async (req, res, next) => {
	const { q = '' } = req.query;
	const options = { $regex: q, $options: 'i' };
	let entries;

	try {
		entries = await Entry.find({
			$or: [
				{ ['name']: options },
				{ ['email']: options },
				{ ['orderId']: options },
			],
		}).sort('-createdAt');
	} catch (err) {
		const error = new HttpError('something up cant get entry by id', 500);
		return error;
	}

	res.json({
		entries,
	});
};

// get entries by email;
const getEntriesByemail = async (req, res, next) => {
	const email = req.params.email;
	let entries = {};

	try {
		entries = await Entry.find({ email: email });
	} catch (err) {
		const error = new HttpError('something up cant get entry by id', 500);
		return error;
	}

	if (!entries) {
		return next(
			new HttpError("Couldn't find entry for provided entry id", 404)
		);
	}

	res.json({
		entries: entries.map((entry) => entry.toObject({ getters: true })),
	});
};

// delet entry duh
const deleteEntry = async (req, res, next) => {
	const entryId = req.params.eid;
	console.log(entryId);
	let entry;

	try {
		entry = await Entry.findById(entryId);
	} catch (err) {
		const error = new HttpError('Cant find entry by that id.', 500);
		return error;
	}

	console.log(entry);

	try {
		await entry.remove();
	} catch (err) {
		const error = new HttpError('something up cant delete entry by id', 500);
		return error;
	}

	res.json({ message: 'entry deleted' });
};

// update entry status
const updateStatus = async (req, res, next) => {
	const { entryId, status } = req.body;
	console.log(entryId, status);
	let entry = {};

	try {
		entry = await Entry.findById(entryId);
	} catch (err) {
		const error = new HttpError('something up cant get entry by id', 500);
		return error;
	}

	entry.status = status;

	try {
		entry.save();
	} catch (error) {
		const err = new HttpError('something up cant update entry', 500);
		return err;
	}

	res.status(201).json({ entry: entry.toObject({ getters: true }) });
};

// create new entry

const createEntry = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors);
		return next(new HttpError('invalid inputs passed, check your data', 422));
	}

	const { name, email, orderId } = req.body;

	if (
		req.files['cardFrontImg'].length < 1 ||
		req.files['cardBackImg'].length < 1
	) {
		return next(new HttpError('Invalid Entry', 422));
	}
	const cardFrontImg = req.files['cardFrontImg'][0].filename;
	const cardBackImg = req.files['cardBackImg'][0].filename;
	let selfieImg = '';
	if (req.files['selfieImg']) {
		selfieImg = req.files['selfieImg'][0].filename;
	}

	const newEntry = new Entry({
		name,
		email,
		orderId,
		cardFrontImg,
		cardBackImg,
		selfieImg,
		status: 'New',
	});

	try {
		newEntry.save();
	} catch (err) {
		const error = new HttpError('creating entry failed, please try again', 500);
		return next(error);
	}

	res.status(201).json({ Entry: newEntry.toObject({ getters: true }) });
};

exports.getEntries = getEntries;
exports.getEntriesByemail = getEntriesByemail;
exports.deleteEntry = deleteEntry;
exports.updateStatus = updateStatus;
exports.createEntry = createEntry;
