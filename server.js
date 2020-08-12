const express = require('express')
const app = express()
const path = require('path')


const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});

