import Bike from '../models/bikeModel.js';
import City from '../models/cityModel.js';
import ChargingStation from '../models/chargingStationModel.js';
import ParkingArea from '../models/parkingAreaModel.js';
import User from '../models/userModel.js';
import Rental from '../models/rentalModel.js';
import { cities, getParkingAreas, getChargingStations, getBikeDetails } from '../db/repopulateDbConfig.js';
import QRCode from 'qrcode';

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
        console.time('Recreation');
        const bikesToAddToCharging = req.body.bikesToAddToCharging ?? 3;
        const bikesToAddToParking = req.body.bikesToAddToParking ?? 5;
        const customersToCreate = req.body.customersToCreate ?? 20;
        const cityIds = await createCities(cities);
        const [parkings, chargings, bikeDetails, customers] = await Promise.all([
            insertParkings(cityIds, bikesToAddToParking),
            insertChargingstations(cityIds, bikesToAddToCharging),
            getBikeDetails(cityIds),
            createCustomers(customersToCreate),
        ]);
        const [bikes, allCities] = await Promise.all([addBikes(bikeDetails, 'cities'), City.find().exec()]);
        console.timeEnd('Recreation');

        return res.status(200).json({
            message: `${cityIds.length} cities added successfully. ${parkings.count} parkings added successfully, with ${
                parkings.totalBikesAdded
            } bikes. ${chargings.count} chargingstations added successfully, with ${
                chargings.totalBikesAdded
            } bikes. ${bikes} bikes added outside chargingstations or parking areas. ${
                parkings.totalBikesAdded + chargings.totalBikesAdded + bikes
            } total bikes added. ${customers.length} customers added.`,
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

async function insertParkings(cityIds, numBikesToAddToEach) {
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

        // Create everything that will be written to the db in a bulk mapping over the updated values in cityUpdates
        const cityUpdateBulk = Object.entries(cityUpdates).map(([cityId, parkingIds]) => ({
            updateOne: {
                filter: { _id: cityId },
                update: { $push: { parkingAreas: { $each: parkingIds } } },
            },
        }));

        await City.bulkWrite(cityUpdateBulk);

        // Add bikes to parking areas
        const bikePromises = mongooseParkings.map((parking) => addBikes([parking._id], 'parking', numBikesToAddToEach, parking.cityId));
        // An array of number of bikes per parking
        await Promise.all(bikePromises);
        const totalBikesAdded = num * numBikesToAddToEach;

        return { count: num, mongooseParkings, totalBikesAdded };
    } catch (error) {
        throw new Error('Error adding parking areas: ' + error.message);
    }
}

async function insertChargingstations(cityIds, numBikesToAddToEach) {
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

        // Create everything that will be written to the db in a bulk mapping over the updated values in cityUpdates
        const cityUpdateBulk = Object.entries(cityUpdates).map(([cityId, chargingIds]) => ({
            updateOne: {
                filter: { _id: cityId },
                update: { $push: { parkingAreas: { $each: chargingIds } } },
            },
        }));

        await City.bulkWrite(cityUpdateBulk);

        // Add bikes to charging stations
        const bikePromises = mongooseChargings.map((chargingStation) =>
            addBikes([chargingStation._id], 'charging', numBikesToAddToEach, chargingStation.cityId)
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

                    const qrCodes = await Promise.all(
                        mongooseBikes.map((bike) =>
                            QRCode.toDataURL(bike._id.toString()).then((qrCode) => ({
                                _id: bike._id,
                                qrCode,
                            }))
                        )
                    );

                    // Create everything that will be written to the db in a bulk mapping over the  values in qrCodes
                    const qrUpdateBulk = qrCodes.map(({ _id, qrCode }) => ({
                        updateOne: {
                            filter: { _id },
                            update: { $set: { qrCode } },
                        },
                    }));
                    await Bike.bulkWrite(qrUpdateBulk);

                    // Create everything that will be written to the db in a bulk mapping over the  values in mongooseBikes
                    const cityUpdateBulk = mongooseBikes.map((bike) => ({
                        updateOne: {
                            filter: { _id: bike.cityId },
                            update: { $push: { bikes: bike._id } },
                        },
                    }));

                    // Create everything that will be written to the db in a bulk mapping over the  values in mongooseBikes
                    const parkingAreaUpdateBulk = mongooseBikes.map((bike) => ({
                        updateOne: {
                            filter: { _id: bike.parkingAreaId },
                            update: { $push: { bikes: bike._id } },
                        },
                    }));

                    await Promise.all([City.bulkWrite(cityUpdateBulk), ParkingArea.bulkWrite(parkingAreaUpdateBulk)]);
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

                    const qrCodes = await Promise.all(
                        mongooseBikes.map((bike) =>
                            QRCode.toDataURL(bike._id.toString()).then((qrCode) => ({
                                _id: bike._id,
                                qrCode,
                            }))
                        )
                    );

                    // Create everything that will be written to the db in a bulk mapping over the  values in qrCodes
                    const qrUpdateBulk = qrCodes.map(({ _id, qrCode }) => ({
                        updateOne: {
                            filter: { _id },
                            update: { $set: { qrCode } },
                        },
                    }));
                    await Bike.bulkWrite(qrUpdateBulk);

                    // Create everything that will be written to the db in a bulk mapping over the  values in mongooseBikes
                    const cityUpdateBulk = mongooseBikes.map((bike) => ({
                        updateOne: {
                            filter: { _id: bike.cityId },
                            update: { $push: { bikes: bike._id } },
                        },
                    }));

                    // Create everything that will be written to the db in a bulk mapping over the  values in mongooseBikes
                    const chargingStationUpdateBulk = mongooseBikes.map((bike) => ({
                        updateOne: {
                            filter: { _id: bike.chargingStationId },
                            update: { $push: { bikes: bike._id } },
                        },
                    }));

                    // Wait for both bulkWrites to be complete
                    await Promise.all([City.bulkWrite(cityUpdateBulk), ChargingStation.bulkWrite(chargingStationUpdateBulk)]);
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

            const qrCodes = await Promise.all(
                mongooseBikes.map((bike) =>
                    QRCode.toDataURL(bike._id.toString()).then((qrCode) => ({
                        _id: bike._id,
                        qrCode,
                    }))
                )
            );

            // Create everything that will be written to the db in a bulk mapping over the  values in qrCodes
            const qrUpdateBulk = qrCodes.map(({ _id, qrCode }) => ({
                updateOne: {
                    filter: { _id },
                    update: { $set: { qrCode } },
                },
            }));
            await Bike.bulkWrite(qrUpdateBulk);

            // Create everything that will be written to the db in a bulk mapping over the  values in mongooseBikes
            const cityUpdateBulk = mongooseBikes.map((bike) => ({
                updateOne: {
                    filter: { _id: bike.cityId },
                    update: { $push: { bikes: bike._id } },
                },
            }));

            await City.bulkWrite(cityUpdateBulk);
            numAddedBikes += mongooseBikes.length;
        } catch (e) {
            throw new Error('Error adding bikes to cities: ' + e.message);
        }
        return numAddedBikes;
    }
}

async function createCustomers(numberOfCustomersToCreate) {
    if (typeof numberOfCustomersToCreate !== 'number' || numberOfCustomersToCreate < 1 || numberOfCustomersToCreate > 1000) {
        throw new Error(
            `Invalid number of customers to create: ${numberOfCustomersToCreate}. The value must be a number between 1 and 1000.`
        );
    }
    try {
        const customers = Array.from({ length: numberOfCustomersToCreate }, (_, index) => ({
            name: `Botumer${index} Botsson`,
            email: `Botumer${index}.Botsson@wattbot.se`,
            profileImage: 'https://imgur.com/KQ7fQ2E.png',
            oauthId: `botAuth${index}`,
            balance: 500,
            role: 'customer',
        }));
        const mongooseCustomers = await User.insertMany(customers);
        return mongooseCustomers;
    } catch (e) {
        throw new Error('Error adding customers: ' + e.message);
    }
}
