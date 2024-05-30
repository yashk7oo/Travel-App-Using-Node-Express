const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CityInfo = sequelize.define('CityInfo', {
    cityName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    placeDetails: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = CityInfo;
