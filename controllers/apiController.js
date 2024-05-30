const { makePostRequest, deleteCityInfo, getDetailsForAllCities } = require('../services/apiService');


// Model Classes
class FinalResponse {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

class FinalResponseGetAllCities {
    constructor(cityName, places) {
        this.cityName = cityName;
        this.places = places;
    }
}

async function getCityInfo(req, res) {
    const { city } = req.params;
    try {
        const result = await makePostRequest(city);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteCity(req, res) {
    const { city } = req.params;
    try {
        await deleteCityInfo(city);
        res.json({ message: `${city} and its related information has been deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAllCities(req, res) {
    try {
        const cities = await getDetailsForAllCities();
        if (cities.length === 0) {
            res.status(400).json({ message: 'No information exists in DB' });
        } else {
            const cityInfoResponseList = [];
            cities.forEach(cityInfo => {
                const rawMap = JSON.parse(cityInfo.placeDetails);
                const places = Object.entries(rawMap).map(([key, value]) => new FinalResponse(key, value));
                cityInfoResponseList.push(new FinalResponseGetAllCities(cityInfo.cityName, places));
            });
            res.status(200).json(cityInfoResponseList);
        }
    } catch (error) {
        res.status(500).json({ error: 'An internal server error occurred' })
    }
}

module.exports = {
    getCityInfo,
    deleteCity,
    getAllCities
};
