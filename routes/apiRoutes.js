const express = require('express');
const { getCityInfo, deleteCity, getAllCities } = require('../controllers/apiController');

const router = express.Router();

router.get('/city/:city', getCityInfo);
router.delete('/deleteCity/:city', deleteCity);
router.get('/cities', getAllCities);

module.exports = router;
