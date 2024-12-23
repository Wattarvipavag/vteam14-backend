export const cities = [
    { name: 'Stockholm', location: { latitude: '59.332560096895286', longitude: '18.06527946354849' } },
    { name: 'Uppsala', location: { latitude: '59.860038783024336', longitude: '17.638834258637786' } },
    { name: 'Kalmar', location: { latitude: '56.66159638691289', longitude: '16.359624775385132' } },
    { name: 'Halmstad', location: { latitude: '56.66955870230835', longitude: '12.86551105745475' } },
];

/**
 * Function that returns bike objects to be added to the database.
 * @param {Array} cityIds- the id's which we use to set each parkings cityId to based on index. So order is important!
 * @return {Array} returns an array of bike objects ready to be sent to the database.
 *
 */
export async function getBikeDetails(cityIds) {
    const cityBikes = [
        {
            city: 'Stockholm',
            bikes: [
                { cityId: 'dynamic mongooseCityId', location: { latitude: '59.312379874896415', longitude: '18.08778003565807' } },
                { cityId: 'dynamic mongooseCityId', location: { latitude: '59.33274954329449', longitude: '18.06940575824523' } },
                { cityId: 'dynamic mongooseCityId', location: { latitude: '59.345020367735124', longitude: '18.039699253190946' } },
            ],
        },
        {
            city: 'Uppsala',
            bikes: [
                { cityId: 'dynamic mongooseCityId', location: { latitude: '59.86095430245953', longitude: '17.63769300562198' } },
                { cityId: 'dynamic mongooseCityId', location: { latitude: '59.852973954834496', longitude: '17.644766355743457' } },
                { cityId: 'dynamic mongooseCityId', location: { latitude: '59.86287295220117', longitude: '17.61381655077588' } },
            ],
        },
        {
            city: 'Kalmar',
            bikes: [
                { cityId: 'dynamic mongooseCityId', location: { latitude: '56.67005631226999', longitude: '16.376951417852773' } }, //route: [{ latitude: '56.67005631226999', longitude: '16.376951417852773' }, { latitude: '56.67005631226999', longitude: '16.376951417852773' }]
                { cityId: 'dynamic mongooseCityId', location: { latitude: '56.674599377831505', longitude: '16.335886217442393' } },
                { cityId: 'dynamic mongooseCityId', location: { latitude: '56.66550520819479', longitude: '16.34887754075502' } },
            ],
        },
        {
            city: 'Halmstad',
            bikes: [
                { cityId: 'dynamic mongooseCityId', location: { latitude: '56.677249194094976', longitude: '12.859233486346115' } },
                { cityId: 'dynamic mongooseCityId', location: { latitude: '56.68190968896822', longitude: '12.86112721883696' } },
                { cityId: 'dynamic mongooseCityId', location: { latitude: '56.68127662001243', longitude: '12.846102269519257' } },
            ],
        },
    ];

    // Loops through each object containing the bikes and sets the cityId of each bike to what the index correlates to in the provided cityIds array.
    // This is done in order to dynamicly set the correct mongoose ids to the cityId of each bike since mongoose ids change when recreating the cities in the database.

    cityBikes.forEach((cityObject, index) => {
        if (cityIds[index]) {
            cityObject.bikes.forEach((bike) => {
                bike.cityId = cityIds[index];
            });
        }
    });
    return cityBikes.flatMap((cityObject) => cityObject.bikes);
}

/**
 * Function that returns objects needed to create parking areas in the database
 * @param {Array} cityIds- the id's which we use to set each parkings cityId to based on index. So order is important!
 * @return {Array} returns an array of parking area objects
 *
 */
export function getParkingAreas(cityIds) {
    const cityParkings = [
        {
            city: 'Stockholm',
            parkings: [
                {
                    name: 'Luma Parkering',
                    location: { latitude: '59.303954964144125', longitude: '18.09577990860332' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Fatbursparkeringen',
                    location: { latitude: '59.314748084274946', longitude: '18.068159584904965' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Sergels Torgs Parkering',
                    location: { latitude: '59.332906229323754', longitude: '18.064729933075053' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Strawberry Arena Parkering',
                    location: { latitude: '59.37133204153478', longitude: '18.001119759227002' },
                    cityId: 'dynamic mongooseCityId',
                },
            ],
        },
        {
            city: 'Uppsala',
            parkings: [
                {
                    name: 'Uppsala Domkyrka Parkering',
                    location: { latitude: '59.85794118549142', longitude: '17.632288563547707' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Studenternas IP Parkering',
                    location: { latitude: '59.85017030836557', longitude: '17.64392202366271' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Uppsala Centralstation Parkering',
                    location: { latitude: '59.85821474191454', longitude: '17.645869014559768' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Domarringens Parkering',
                    location: { latitude: '59.87681803784774', longitude: '17.62471007070414' },
                    cityId: 'dynamic mongooseCityId',
                },
            ],
        },
        {
            city: 'Kalmar',
            parkings: [
                {
                    name: 'Baronens Parkering',
                    location: { latitude: '56.66120011667783', longitude: '16.364748903239395' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Fredriksskans IP Parkering',
                    location: { latitude: '56.66942413562081', longitude: '16.35834272985206' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Kvarteret Giraffen Parkering',
                    location: { latitude: '56.66987812445342', longitude: '16.3367606153405' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Kalmar Äventyrsbad Parkering',
                    location: { latitude: '56.66830240322608', longitude: '16.34952370763934' },
                    cityId: 'dynamic mongooseCityId',
                },
            ],
        },
        {
            city: 'Halmstad',
            parkings: [
                {
                    name: 'Stationsparkens Parkering',
                    location: { latitude: '56.668743097069026', longitude: '12.862825893058288' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Halmstad Arena Parkering',
                    location: { latitude: '56.673817035689375', longitude: '12.888907296892688' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Halmstads Slott Parkering',
                    location: { latitude: '56.67152781989793', longitude: '12.858275051887452' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Strandtorps Golfklubb Parkering',
                    location: { latitude: '56.64221320057727', longitude: '12.899030280403894' },
                    cityId: 'dynamic mongooseCityId',
                },
            ],
        },
    ];

    // Loops through each object containing the cities name and parking areas and sets the cityId of each parking to what the index correlates to in the provided cityIds array.
    // This is done in order to dynamicly set the correct mongoose ids to the cityId of each parking since mongoose ids change when recreating the cities in the database.

    cityParkings.forEach((cityObject, index) => {
        if (cityIds[index]) {
            cityObject.parkings.forEach((parking) => {
                parking.cityId = cityIds[index];
            });
        }
    });
    return cityParkings.flatMap((cityObject) => cityObject.parkings);
}

/**
 * Function that returns objects needed to create charging stations in the database
 * @param {Array} cityIds- the id's which we use to set each charging stations cityId to based on index. So order is important!
 * @return {Array} returns an array of charging station objects
 *
 */
export function getChargingStations(cityIds) {
    const cityChargings = [
        {
            city: 'Stockholm',
            chargingStations: [
                {
                    name: 'Gröna Lund Laddplats',
                    location: { latitude: '59.32431605790759', longitude: '18.095569002560794' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Odenplan Laddplats',
                    location: { latitude: '59.34280637297721', longitude: '18.049606213091774' },
                    cityId: 'dynamic mongooseCityId',
                },
            ],
        },
        {
            city: 'Uppsala',
            chargingStations: [
                {
                    name: 'Svandammens Laddplats',
                    location: { latitude: '59.85462902557457', longitude: '17.641158239152958' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Biotopia Laddplats',
                    location: { latitude: '59.85963676183302', longitude: '17.623033094520803' },
                    cityId: 'dynamic mongooseCityId',
                },
            ],
        },
        {
            city: 'Kalmar',
            chargingStations: [
                {
                    name: 'Kalmar Stortorg Laddplats',
                    location: { latitude: '56.66412626548758', longitude: '16.3657557402704' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Kalmar Centralstation Laddplats',
                    location: { latitude: '56.66197613045237', longitude: '16.35835512318651' },
                    cityId: 'dynamic mongooseCityId',
                },
            ],
        },
        {
            city: 'Halmstad',
            chargingStations: [
                {
                    name: 'Halmstad Högskola Laddplats',
                    location: { latitude: '56.663784314780955', longitude: '12.878986903879268' },
                    cityId: 'dynamic mongooseCityId',
                },
                {
                    name: 'Gamletull Laddplats',
                    location: { latitude: '56.67520432417453', longitude: '12.866751800615877' },
                    cityId: 'dynamic mongooseCityId',
                },
            ],
        },
    ];

    // Loops through each object containing the cities name and charging stations and sets the cityId of each charging station to what the index correlates to in the provided cityIds array.
    // This is done in order to dynamicly set the correct mongoose ids to the cityId of each parking since mongoose ids change when recreating the cities in the database.
    cityChargings.forEach((cityObject, index) => {
        if (cityIds[index]) {
            cityObject.chargingStations.forEach((chargingStation) => {
                chargingStation.cityId = cityIds[index];
            });
        }
    });
    return cityChargings.flatMap((cityObject) => cityObject.chargingStations);
}
