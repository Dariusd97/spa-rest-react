const bodyParser = require('body-parser');
const express = require('express');
const port = process.env.PORT || 3000;


const userRoutes = require('./routes/userRoutes');
const artistRoutes = require('./routes/artistRoutes');
const paintingRoutes = require("./routes/paintingRoutes");
const accessTokenRoutes = require("./routes/accessTokenRoutes");

const app = express();

app.use(bodyParser.json());
app.use(express.static('../simple-app/build'))

app.use('/tokens',accessTokenRoutes);
app.use('/users',userRoutes);
app.use('/artists',artistRoutes);
app.use('/paintings',paintingRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}...`));

module.exports = app;