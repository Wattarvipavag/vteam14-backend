import Bike from '../models/bikeModel.js';
import City from '../models/cityModel.js';
import ChargingStation from '../models/chargingStationModel.js';
import ParkingArea from '../models/parkingAreaModel.js';
import User from '../models/userModel.js';
import Rental from '../models/rentalModel.js';
import { cities, getParkingAreas, getChargingStations, getBikeDetails } from '../db/repopulateDbConfig.js';

export async function deleteAll(req, res) {
    try {
        await Promise.all([
            Bike.deleteMany(),
            ParkingArea.deleteMany(),
            ChargingStation.deleteMany(),
            City.deleteMany(),
            User.deleteMany({ role: 'customer' }),
            Rental.deleteMany(),
        ]);
        return res.status(200).json({ message: 'Everything deleted' });
    } catch (e) {
        return res.status(500).json({ message: `deleteAll ${e.message}` });
    }
}

export async function recreateAll(req, res) {
    try {
        const cityIds = await createCities(cities);
        const parkings = await insertParkings(cityIds);
        const chargings = await insertChargingstations(cityIds);
        const bikeDetails = await getBikeDetails(cityIds);
        const bikes = await addBikes(bikeDetails, 'cities');
        const allCities = await City.find().exec();

        return res.status(200).json({
            message: `${cityIds.length} cities added successfully. ${parkings.count} parkings added successfully, with ${
                parkings.totalBikesAdded
            } bikes. ${chargings.count} chargingstations added successfully, with ${
                chargings.totalBikesAdded
            } bikes. ${bikes} bikes added outside chargingstations or parking areas. ${
                parkings.totalBikesAdded + chargings.totalBikesAdded + bikes
            } total bikes added.`,
            cities: allCities,
            parkings: parkings,
            chargings: chargings,
            bikes: bikes,
        });
    } catch (e) {
        return res.status(500).json({ message: 'Error adding cities', e: e.message });
    }
}

/**
 * Function that takes city data and adds it to the database, returning an array of each cities id.
 *
 * @param {Array} cities, an array of city objects
 * @returns {Array} an array mongoose ids of the created cities
 */
async function createCities(cities) {
    const insertedCities = await City.insertMany(cities);
    const insertedIds = insertedCities.map((city) => city._id);
    return insertedIds;
}

async function insertParkings(cityIds) {
    const parkingAreas = getParkingAreas(cityIds);
    try {
        const mongooseParkings = await ParkingArea.insertMany(parkingAreas);
        const num = parkingAreas.length;

        // Create all updates to be made
        const cityUpdates = mongooseParkings.reduce((updates, parking) => {
            if (!updates[parking.cityId]) {
                updates[parking.cityId] = [];
            }
            updates[parking.cityId].push(parking._id);
            return updates;
        }, {});

        // Update cities with parking areas in batches
        const cityUpdatePromises = Object.entries(cityUpdates).map(([cityId, parkingIds]) =>
            City.updateOne({ _id: cityId }, { $push: { parkingAreas: { $each: parkingIds } } })
        );
        await Promise.all(cityUpdatePromises);

        // Add bikes to parking areas
        const bikePromises = mongooseParkings.map((parking) => addBikes([parking._id], 'parking', 5, parking.cityId));
        // An array of number of bikes per parking
        const numBikes = await Promise.all(bikePromises);
        const totalBikesAdded = numBikes.reduce((sum, count) => sum + count, 0);

        return { count: num, mongooseParkings, totalBikesAdded };
    } catch (error) {
        throw new Error('Error adding parking areas: ' + error.message);
    }
}

async function insertChargingstations(cityIds) {
    const chargingStations = getChargingStations(cityIds);
    try {
        const mongooseChargings = await ChargingStation.insertMany(chargingStations);
        const num = chargingStations.length;

        // Create all updates to be made
        const cityUpdates = mongooseChargings.reduce((updates, chargingStation) => {
            if (!updates[chargingStation.cityId]) {
                updates[chargingStation.cityId] = [];
            }
            updates[chargingStation.cityId].push(chargingStation._id);
            return updates;
        }, {});

        // Update cities with charging stations in batches
        const cityUpdatePromises = Object.entries(cityUpdates).map(([cityId, chargingStationIds]) =>
            City.updateOne({ _id: cityId }, { $push: { chargingStations: { $each: chargingStationIds } } })
        );
        await Promise.all(cityUpdatePromises);

        // Add bikes to charging stations
        const bikePromises = mongooseChargings.map((chargingStation) =>
            addBikes([chargingStation._id], 'charging', 3, chargingStation.cityId)
        );
        // An array of number of bikes per parking
        const numBikes = await Promise.all(bikePromises);
        const totalBikesAdded = numBikes.reduce((sum, count) => sum + count, 0);

        return { count: num, mongooseChargings, totalBikesAdded };
    } catch (error) {
        throw new Error('Error adding parking areas: ' + error.message);
    }
}

/**
 * Function that creates bikes at chargingstations, parkingareas or in cities
 *
 * @param {Array} data - array of ids or objects for creating bikes
 * @param {string} toWhat - parking, charging or cities depending on where we want to add the bikes
 * @param {number} numberOfBikes - The amount of bikes we want to add.
 * @param {string} id - The cityId for where we want to chargingstations or parkingareas, if adding bikes to cities it's included in the bike data
 */
async function addBikes(data = [], toWhat = '', numberOfBikes = 0, id = '') {
    let numAddedBikes = 0;
    if (toWhat === 'parking' && id) {
        await Promise.all(
            data.map(async (parkingId) => {
                try {
                    const parkingLocation = await ParkingArea.findById(parkingId).select('location');
                    const bikes = Array.from({ length: numberOfBikes }).map(() => ({
                        location: parkingLocation.location,
                        cityId: id,
                        charge: Math.floor(Math.random() * (100 - 15) + 15),
                        parkingAreaId: parkingId,
                    }));
                    const mongooseBikes = await Bike.insertMany(bikes);

                    const cityUpdatePromises = mongooseBikes.map((bike) =>
                        City.updateOne({ _id: bike.cityId }, { $push: { bikes: { $each: [bike._id] } } })
                    );
                    const parkingUpdatePromises = mongooseBikes.map((bike) =>
                        ParkingArea.updateOne({ _id: bike.parkingAreaId }, { $push: { bikes: { $each: [bike._id] } } })
                    );
                    await Promise.all([...cityUpdatePromises, ...parkingUpdatePromises]);
                    numAddedBikes += mongooseBikes.length;
                } catch (e) {
                    throw new Error(`Error adding bikes to parking areas, stopped at parkingAreaId ${parkingId}` + e.message);
                }
            })
        );
        return numAddedBikes;
    } else if (toWhat === 'charging' && id) {
        await Promise.all(
            data.map(async (chargingId) => {
                try {
                    const chargingLocation = await ChargingStation.findById(chargingId).select('location');
                    const bikes = Array.from({ length: numberOfBikes }).map(() => ({
                        location: chargingLocation.location,
                        cityId: id,
                        charge: Math.floor(Math.random() * (100 - 15) + 15),
                        chargingStationId: chargingId,
                    }));
                    const mongooseBikes = await Bike.insertMany(bikes);

                    const cityUpdatePromises = mongooseBikes.map((bike) =>
                        City.updateOne({ _id: bike.cityId }, { $push: { bikes: { $each: [bike._id] } } })
                    );
                    const chargingUpdatePromises = mongooseBikes.map((bike) =>
                        ChargingStation.updateOne({ _id: bike.chargingStationId }, { $push: { bikes: { $each: [bike._id] } } })
                    );
                    await Promise.all([...cityUpdatePromises, ...chargingUpdatePromises]);
                    numAddedBikes += mongooseBikes.length;
                } catch (e) {
                    throw new Error(`Error adding bikes to charging stations, stopped at chargingStationId ${chargingId}` + e.message);
                }
            })
        );
        return numAddedBikes;
    } else if (toWhat === 'cities') {
        try {
            const bikes = data.map((bike) => ({
                location: bike.location,
                cityId: bike.cityId,
                charge: Math.floor(Math.random() * (100 - 15) + 15),
            }));

            const mongooseBikes = await Bike.insertMany(bikes);
            const cityUpdatePromises = mongooseBikes.map((bike) =>
                City.updateOne({ _id: bike.cityId }, { $push: { bikes: { $each: [bike._id] } } })
            );
            await Promise.all(cityUpdatePromises);
            numAddedBikes += mongooseBikes.length;
        } catch (e) {
            throw new Error('Error adding bikes to cities: ' + e.message);
        }
        return numAddedBikes;
    }
}
