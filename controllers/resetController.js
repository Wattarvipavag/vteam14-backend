import Bike from '../models/bikeModel.js';
import City from '../models/cityModel.js';
import ChargingStation from '../models/chargingStationModel.js';
import ParkingArea from '../models/parkingAreaModel.js';
import User from '../models/userModel.js';
import Rental from '../models/rentalModel.js';

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
    const cities = [
        { name: 'Stockholm', location: { latitude: '59.332560096895286', longitude: '18.06527946354849' } },
        { name: 'Uppsala', location: { latitude: '59.860038783024336', longitude: '17.638834258637786' } },
        { name: 'Kalmar', location: { latitude: '56.66159638691289', longitude: '16.359624775385132' } },
        { name: 'Halmstad', location: { latitude: '56.66955870230835', longitude: '12.86551105745475' } },
    ];
    try {
        const createdCities = await City.insertMany(cities);
        const stockholmId = createdCities[0]._id;
        const uppsalaId = createdCities[1]._id;
        const kalmarId = createdCities[2]._id;
        const halmstadId = createdCities[3]._id;

        const bikeDetails = [
            { cityId: stockholmId, location: { latitude: '59.312379874896415', longitude: '18.08778003565807' }, city: 'stockholm' },
            { cityId: stockholmId, location: { latitude: '59.33274954329449', longitude: '18.06940575824523' }, city: 'stockholm' },
            { cityId: stockholmId, location: { latitude: '59.345020367735124', longitude: '18.039699253190946' }, city: 'stockholm' },
            { cityId: uppsalaId, location: { latitude: '59.86095430245953', longitude: '17.63769300562198' }, city: 'uppsala' },
            { cityId: uppsalaId, location: { latitude: '59.852973954834496', longitude: '17.644766355743457' }, city: 'uppsala' },
            { cityId: uppsalaId, location: { latitude: '59.86287295220117', longitude: '17.61381655077588' }, city: 'uppsala' },
            { cityId: kalmarId, location: { latitude: '56.67005631226999', longitude: '16.376951417852773' }, city: 'kalmar' },
            { cityId: kalmarId, location: { latitude: '56.674599377831505', longitude: '16.335886217442393' }, city: 'kalmar' },
            { cityId: kalmarId, location: { latitude: '56.66550520819479', longitude: '16.34887754075502' }, city: 'kalmar' },
            { cityId: halmstadId, location: { latitude: '56.677249194094976', longitude: '12.859233486346115' }, city: 'halmstad' },
            { cityId: halmstadId, location: { latitude: '56.68190968896822', longitude: '12.86112721883696' }, city: 'halmstad' },
            { cityId: halmstadId, location: { latitude: '56.68127662001243', longitude: '12.846102269519257' }, city: 'halmstad' },
        ];

        const parkings = await insertParkings(stockholmId, uppsalaId, kalmarId, halmstadId);
        const chargings = await insertChargingstations(stockholmId, uppsalaId, kalmarId, halmstadId);
        const bikes = await addBikes(bikeDetails, 'cities');
        const allCities = await City.find().exec();

        return res.status(200).json({
            message: `${createdCities.length} cities added successfully. ${parkings.count} parkings added successfully. ${chargings.count} chargingstations added successfully`,
            cities: allCities,
            parkings: parkings.parkingAreas,
            chargings: chargings.chargingstations,
            bikes: bikes,
        });
    } catch (e) {
        return res.status(500).json({ message: 'Error adding cities', e: e.message });
    }
}

async function insertParkings(stockholmId, uppsalaId, kalmarId, halmstadId) {
    const stockholmParkings = [
        { name: 'Luma Parkering', location: { latitude: '59.303954964144125', longitude: '18.09577990860332' }, cityId: stockholmId },
        { name: 'Fatbursparkeringen', location: { latitude: '59.314748084274946', longitude: '18.068159584904965' }, cityId: stockholmId },
        {
            name: 'Sergels Torgs Parkering',
            location: { latitude: '59.332906229323754', longitude: '18.064729933075053' },
            cityId: stockholmId,
        },
        {
            name: 'Strawberry Arena Parkering',
            location: { latitude: '59.37133204153478', longitude: '18.001119759227002' },
            cityId: stockholmId,
        },
    ];
    const uppsalaParkings = [
        {
            name: 'Uppsala Domkyrka Parkering',
            location: { latitude: '59.85794118549142', longitude: '17.632288563547707' },
            cityId: uppsalaId,
        },
        {
            name: 'Studenternas IP Parkering',
            location: { latitude: '59.85017030836557', longitude: '17.64392202366271' },
            cityId: uppsalaId,
        },
        {
            name: 'Uppsala Centralstation Parkering',
            location: { latitude: '59.85821474191454', longitude: '17.645869014559768' },
            cityId: uppsalaId,
        },
        { name: 'Domarringens Parkering', location: { latitude: '59.87681803784774', longitude: '17.62471007070414' }, cityId: uppsalaId },
    ];
    const kalmarParkings = [
        { name: 'Baronens Parkering', location: { latitude: '56.66120011667783', longitude: '16.364748903239395' }, cityId: kalmarId },
        {
            name: 'Fredriksskans IP Parkering',
            location: { latitude: '56.66942413562081', longitude: '16.35834272985206' },
            cityId: kalmarId,
        },
        {
            name: 'Kvarteret Giraffen Parkering',
            location: { latitude: '56.66987812445342', longitude: '16.3367606153405' },
            cityId: kalmarId,
        },
        {
            name: 'Kalmar Äventyrsbad Parkering',
            location: { latitude: '56.66830240322608', longitude: '16.34952370763934' },
            cityId: kalmarId,
        },
    ];
    const halmstadParkings = [
        {
            name: 'Stationsparkens Parkering',
            location: { latitude: '56.668743097069026', longitude: '12.862825893058288' },
            cityId: halmstadId,
        },
        {
            name: 'Halmstad Arena Parkering',
            location: { latitude: '56.673817035689375', longitude: '12.888907296892688' },
            cityId: halmstadId,
        },
        {
            name: 'Halmstads Slott Parkering',
            location: { latitude: '56.67152781989793', longitude: '12.858275051887452' },
            cityId: halmstadId,
        },
        {
            name: 'Strandtorps Golfklubb Parkering',
            location: { latitude: '56.64221320057727', longitude: '12.899030280403894' },
            cityId: halmstadId,
        },
    ];
    try {
        // Create all the parking areas
        const stockholm = await ParkingArea.insertMany(stockholmParkings);
        const uppsala = await ParkingArea.insertMany(uppsalaParkings);
        const kalmar = await ParkingArea.insertMany(kalmarParkings);
        const halmstad = await ParkingArea.insertMany(halmstadParkings);
        const num = stockholm.length + uppsala.length + kalmar.length + halmstad.length;

        // Get arrays of mongoose id's
        const stockholmParkingIds = stockholm.map((parking) => parking._id);
        const uppsalaParkingIds = uppsala.map((parking) => parking._id);
        const kalmarParkingIds = kalmar.map((parking) => parking._id);
        const halmstadParkingIds = halmstad.map((parking) => parking._id);

        // Update each city by pushing the parking id references to it
        await Promise.all([
            City.updateOne({ _id: stockholmId }, { $push: { parkingAreas: { $each: stockholmParkingIds } } }),
            City.updateOne({ _id: uppsalaId }, { $push: { parkingAreas: { $each: uppsalaParkingIds } } }),
            City.updateOne({ _id: kalmarId }, { $push: { parkingAreas: { $each: kalmarParkingIds } } }),
            City.updateOne({ _id: halmstadId }, { $push: { parkingAreas: { $each: halmstadParkingIds } } }),
        ]);

        // Add bikes to all parking areas sending in parkingIds, type, cityId and number of bikes to create
        await Promise.all([
            addBikes(stockholmParkingIds, 'parking', 5, stockholmId),
            addBikes(uppsalaParkingIds, 'parking', 5, uppsalaId),
            addBikes(kalmarParkingIds, 'parking', 5, kalmarId),
            addBikes(halmstadParkingIds, 'parking', 5, halmstadId),
        ]);

        // Returning a count of number of stations and the station objects
        return { count: num, parkingAreas: [stockholm, uppsala, kalmar, halmstad] };
    } catch (error) {
        throw new Error('Error adding parking areas: ' + error.message);
    }
}

async function insertChargingstations(stockholmId, uppsalaId, kalmarId, halmstadId) {
    const stockholmChargings = [
        { name: 'Gröna Lund Laddplats', location: { latitude: '59.32431605790759', longitude: '18.095569002560794' }, cityId: stockholmId },
        { name: 'Odenplan Laddplats', location: { latitude: '59.34280637297721', longitude: '18.049606213091774' }, cityId: stockholmId },
    ];
    const uppsalaChargings = [
        { name: 'Svandammens Laddplats', location: { latitude: '59.85462902557457', longitude: '17.641158239152958' }, cityId: uppsalaId },
        { name: 'Biotopia Laddplats', location: { latitude: '59.85963676183302', longitude: '17.623033094520803' }, cityId: uppsalaId },
    ];
    const kalmarChargings = [
        { name: 'Kalmar Stortorg Laddplats', location: { latitude: '56.66412626548758', longitude: '16.3657557402704' }, cityId: kalmarId },
        {
            name: 'Kalmar Centralstation Laddplats',
            location: { latitude: '56.66197613045237', longitude: '16.35835512318651' },
            cityId: kalmarId,
        },
    ];
    const halmstadChargings = [
        {
            name: 'Halmstad Högskola Laddplats',
            location: { latitude: '56.663784314780955', longitude: '12.878986903879268' },
            cityId: halmstadId,
        },
        { name: 'Gamletull Laddplats', location: { latitude: '56.67520432417453', longitude: '12.866751800615877' }, cityId: halmstadId },
    ];
    try {
        // Inserting all the chargingstations to the Chargingstation Schema
        const stockholm = await ChargingStation.insertMany(stockholmChargings);
        const uppsala = await ChargingStation.insertMany(uppsalaChargings);
        const kalmar = await ChargingStation.insertMany(kalmarChargings);
        const halmstad = await ChargingStation.insertMany(halmstadChargings);
        const num = stockholm.length + uppsala.length + kalmar.length + halmstad.length;

        // Get arrays of mongoose id's
        const stockholmChargingIds = stockholm.map((chargingstation) => chargingstation._id);
        const uppsalaChargingIds = uppsala.map((chargingstation) => chargingstation._id);
        const kalmarChargingIds = kalmar.map((chargingstation) => chargingstation._id);
        const halmstadChargingIds = halmstad.map((chargingstation) => chargingstation._id);

        // Update each city by pushing the parking id references to it
        await Promise.all([
            City.updateOne({ _id: stockholmId }, { $push: { chargingStations: { $each: stockholmChargingIds } } }),
            City.updateOne({ _id: uppsalaId }, { $push: { chargingStations: { $each: uppsalaChargingIds } } }),
            City.updateOne({ _id: kalmarId }, { $push: { chargingStations: { $each: kalmarChargingIds } } }),
            City.updateOne({ _id: halmstadId }, { $push: { chargingStations: { $each: halmstadChargingIds } } }),
        ]);

        // Add bikes to all charging areas sending in chargingIds, type, cityId and number of bikes to create
        await Promise.all([
            addBikes(stockholmChargingIds, 'charging', 2, stockholmId),
            addBikes(uppsalaChargingIds, 'charging', 4, uppsalaId),
            addBikes(kalmarChargingIds, 'charging', 3, kalmarId),
            addBikes(halmstadChargingIds, 'charging', 5, halmstadId),
        ]);

        // Returning a count of number of stations and the station objects
        return { count: num, chargingstations: [stockholm, uppsala, kalmar, halmstad] };
    } catch (e) {
        throw new Error('Error adding charging stations: ' + e.message);
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
    if (toWhat === 'parking' && id) {
        await Promise.all(
            data.map(async (parkingId) => {
                try {
                    const parkingLocation = await ParkingArea.findById(parkingId).select('location');
                    for (let i = 0; i < numberOfBikes; i++) {
                        const charge = Math.floor(Math.random() * (100 - 15) + 15);
                        const newBike = await Bike.create({
                            location: parkingLocation.location,
                            cityId: id,
                            charge: charge,
                            parkingAreaId: parkingId,
                        });
                        const city = await City.findById(id);
                        city.bikes.push(newBike._id);
                        await city.save();
                        await ParkingArea.updateOne({ _id: parkingId }, { $push: { bikes: newBike._id } });
                    }
                } catch (e) {
                    throw new Error(`Error adding bikes to parking areas, stopped at parkingAreaId ${parkingId}` + e.message);
                }
            })
        );
    } else if (toWhat === 'charging' && id) {
        await Promise.all(
            data.map(async (chargingId) => {
                try {
                    const chargingLocation = await ChargingStation.findById(chargingId).select('location');

                    for (let i = 0; i < numberOfBikes; i++) {
                        const charge = Math.floor(Math.random() * (100 - 15) + 15);
                        const newBike = await Bike.create({
                            location: chargingLocation.location,
                            cityId: id,
                            charge: charge,
                            chargingStationId: chargingId,
                        });
                        const city = await City.findById(id);
                        city.bikes.push(newBike._id);
                        await city.save();
                        await ChargingStation.updateOne({ _id: chargingId }, { $push: { bikes: newBike._id } });
                    }
                } catch (e) {
                    throw new Error(`Error adding bikes to charging stations, stopped at chargingStationId ${chargingId}` + e.message);
                }
            })
        );
    } else if (toWhat === 'cities') {
        await Promise.all(
            data.map(async (bike) => {
                const charge = Math.floor(Math.random() * (100 - 15) + 15);
                try {
                    const randBike = await Bike.create({
                        location: bike.location,
                        cityId: bike.cityId,
                        charge: charge,
                    });
                    await City.updateOne({ _id: bike.cityId }, { $push: { bikes: randBike._id } });
                } catch (e) {
                    throw new Error('Error adding bikes to cities: ' + e.message);
                }
            })
        );
    }
}
