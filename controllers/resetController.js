import Bike from '../models/bikeModel.js';
import City from '../models/cityModel.js';
import Chargingstation from '../models/chargingStationModel.js';
import ParkingArea from '../models/parkingAreaModel.js';
import User from '../models/userModel.js';

export async function deleteAll(req, res) {
    try {
        await Promise.all([
            Bike.deleteMany(),
            ParkingArea.deleteMany(),
            Chargingstation.deleteMany(),
            City.deleteMany(),
            User.deleteMany({ role: 'customer' }),
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

        const parkings = await insertParkings(stockholmId, uppsalaId, kalmarId, halmstadId);
        const chargings = await insertChargingstations(stockholmId, uppsalaId, kalmarId, halmstadId);
        const allCities = await City.find().exec();

        return res.status(200).json({
            message: `${createdCities.length} cities added successfully. ${parkings.count} parkings added successfully. ${chargings.count} chargingstations added successfully`,
            cities: allCities,
            parkings: parkings.parkingAreas,
            chargings: chargings.chargingstations,
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
        const stockholm = await ParkingArea.insertMany(stockholmParkings);
        const uppsala = await ParkingArea.insertMany(uppsalaParkings);
        const kalmar = await ParkingArea.insertMany(kalmarParkings);
        const halmstad = await ParkingArea.insertMany(halmstadParkings);
        const num = stockholm.length + uppsala.length + kalmar.length + halmstad.length;

        // Spreading arrays of parking areas reference id's and pushing them to their respective city
        const stockholmCity = await City.findById(stockholmId);
        stockholmCity.parkingAreas.push(...stockholm.map((parking) => parking._id));
        const uppsalaCity = await City.findById(uppsalaId);
        uppsalaCity.parkingAreas.push(...uppsala.map((parking) => parking._id));
        const kalmarCity = await City.findById(kalmarId);
        kalmarCity.parkingAreas.push(...kalmar.map((parking) => parking._id));
        const halmstadCity = await City.findById(halmstadId);
        halmstadCity.parkingAreas.push(...halmstad.map((parking) => parking._id));

        await Promise.all([stockholmCity.save(), uppsalaCity.save(), kalmarCity.save(), halmstadCity.save()]);

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
        const stockholm = await Chargingstation.insertMany(stockholmChargings);
        const uppsala = await Chargingstation.insertMany(uppsalaChargings);
        const kalmar = await Chargingstation.insertMany(kalmarChargings);
        const halmstad = await Chargingstation.insertMany(halmstadChargings);
        const num = stockholm.length + uppsala.length + kalmar.length + halmstad.length;

        // Spreading arrays of chargingstation reference id's and pushing them to their respective city
        const stockholmCity = await City.findById(stockholmId);
        stockholmCity.chargingStations.push(...stockholm.map((chargingstation) => chargingstation._id));
        stockholmCity.save();
        const uppsalaCity = await City.findById(uppsalaId);
        uppsalaCity.chargingStations.push(...uppsala.map((chargingstation) => chargingstation._id));
        uppsalaCity.save();
        const kalmarCity = await City.findById(kalmarId);
        kalmarCity.chargingStations.push(...kalmar.map((chargingstation) => chargingstation._id));
        kalmarCity.save();
        const halmstadCity = await City.findById(halmstadId);
        halmstadCity.chargingStations.push(...halmstad.map((chargingstation) => chargingstation._id));
        halmstadCity.save();

        // Returning a count of number of stations and the station objects
        return { count: num, chargingstations: [stockholm, uppsala, kalmar, halmstad] };
    } catch (error) {
        throw new Error('Error adding charging stations: ' + error.message);
    }
}
