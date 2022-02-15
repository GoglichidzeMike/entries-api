require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const HttpError = require('./models/http-errors');
const mongoose = require('mongoose');
const cors = require('cors');
// importing routes
const entryRoutes = require('./routes/entries-routes');

const app = express();

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to Mongoose');
		app.listen(process.env.PORT, () => {
			console.log('listening on port ' + process.env.PORT);
		});
	})
	.catch((err) => {
		console.log(err);
	});

// SUMByAD5vKScwNW
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

	next();
});
app.use(cors());
app.use(bodyParser.json());

app.use('/api/entries', entryRoutes);

app.use((req, res, next) => {
	const error = new HttpError('Route not found', 404);
	throw error;
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.status(500).json({
		message: error.message || 'An unknown error occured!',
	});
});
