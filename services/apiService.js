const axios = require('axios');
const CityInfo = require('../models/CityInfo');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
require('dotenv').config();

const geminiUrl = process.env.GEMINI_URL;
const geminiApiKey = process.env.GEMINI_API_KEY;

async function getCityInfoFromDB(city) {
    return await CityInfo.findOne({ where: { cityName: city } });
}

async function saveCityInfo(city, details) {
    await CityInfo.create({ cityName: city, placeDetails: details });
}

async function deleteCityInfo(city) {
    await CityInfo.destroy({ where: { cityName: city } });
}

async function getDetailsForAllCities() {
    return await CityInfo.findAll();
}

async function makePostRequest(city) {
    const finalResponseList = [];
    const cityInfo = await getCityInfoFromDB(city);
    if (cityInfo) {
        logger.info('Serving request from DB');
        for (const [key, value] of Object.entries(JSON.parse(cityInfo.placeDetails))) {
            finalResponseList.push({ key: key, value: value });
        }
        return finalResponseList;
    } else {
        const url = `${geminiUrl}key=${geminiApiKey}`;
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `List top 10 places to visit in ${city} with place as key and description as value. Do not add numbering to response text`
                        }
                    ]
                }
            ],
            generationConfig: { responseMimeType: 'application/json' }
        };

        const response = await axios.post(url, requestBody, { headers: { 'Content-Type': 'application/json' } });
        const responseData = response.data;
        const text = responseData.candidates[0].content.parts[0].text;

        await saveCityInfo(city, text);

        for (const [key, value] of Object.entries(JSON.parse(text))) {
            finalResponseList.push({ key: key, value: value });
        }
        return (finalResponseList);
    }
}

module.exports = {
    makePostRequest,
    deleteCityInfo,
    getDetailsForAllCities
};
