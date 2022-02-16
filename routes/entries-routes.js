const express = require('express');
const { check } = require('express-validator');
const fileUpload = require('../middleware/file-upload');

// eslint-disable-next-line new-cap
const router = express.Router();
const entryController = require('../controllers/entries-controllers');

router.get('/', entryController.getEntries);

router.get('/user/:email', entryController.getEntriesByemail);

router.post(
	'/',
	fileUpload.fields([
		{
			name: 'cardFrontImg',
			maxCount: 1,
		},
		{
			name: 'cardBackImg',
			maxCount: 1,
		},
		{
			name: 'selfieImg',
			maxCount: 1,
		},
	]),
	[
		check('name').not().isEmpty().withMessage('Name is required'),
		check('email').isEmail().withMessage('Email is required'),
		check('cardFrontImg').isEmpty(),
		check('cardBackImg').isEmpty(),
	],
	entryController.createEntry
);

router.post('/status', entryController.updateStatus);

router.delete('/:eid', entryController.deleteEntry);

module.exports = router;
