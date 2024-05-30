const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const apiRoutes = require('./routes/apiRoutes');
const logger = require('./utils/logger');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

sequelize.sync()
    .then(() => {
        app.listen(port, () => {
            logger.info(`Server running at http://localhost:${port}`);
        });
    })
    .catch(err => {
        logger.error('Unable to connect to the database:', err);
    });
