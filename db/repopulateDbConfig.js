export const cities = [
    { name: 'Stockholm', location: { latitude: '59.332560096895286', longitude: '18.06527946354849' } },
    { name: 'Uppsala', location: { latitude: '59.860038783024336', longitude: '17.638834258637786' } },
    { name: 'Kalmar', location: { latitude: '56.66159638691289', longitude: '16.359624775385132' } },
    { name: 'Halmstad', location: { latitude: '56.66955870230835', longitude: '12.86551105745475' } },
];

export const bikeDetails = [
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

/**
 * Returns data based on city, cityId and type
 * @param {String} cityName - name of the city we want data from.
 * @param {String} mongooseCityId - MongooseId for the city
 * @param {String} type - charging or parking
 */
export function getStaticData(cityName = '', mongooseCityId = '', type = '') {
    if (cityName === 'stockholm') {
        if (type === 'charging') {
            const stockholmChargings = [
                {
                    name: 'Gröna Lund Laddplats',
                    location: { latitude: '59.32431605790759', longitude: '18.095569002560794' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Odenplan Laddplats',
                    location: { latitude: '59.34280637297721', longitude: '18.049606213091774' },
                    cityId: mongooseCityId,
                },
            ];
            return stockholmChargings;
        } else if (type === 'parking') {
            const stockholmParkings = [
                {
                    name: 'Luma Parkering',
                    location: { latitude: '59.303954964144125', longitude: '18.09577990860332' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Fatbursparkeringen',
                    location: { latitude: '59.314748084274946', longitude: '18.068159584904965' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Sergels Torgs Parkering',
                    location: { latitude: '59.332906229323754', longitude: '18.064729933075053' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Strawberry Arena Parkering',
                    location: { latitude: '59.37133204153478', longitude: '18.001119759227002' },
                    cityId: mongooseCityId,
                },
            ];
            return stockholmParkings;
        }
    } else if (cityName === 'uppsala') {
        if (type === 'charging') {
            const uppsalaChargings = [
                {
                    name: 'Svandammens Laddplats',
                    location: { latitude: '59.85462902557457', longitude: '17.641158239152958' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Biotopia Laddplats',
                    location: { latitude: '59.85963676183302', longitude: '17.623033094520803' },
                    cityId: mongooseCityId,
                },
            ];
            return uppsalaChargings;
        } else if (type === 'parking') {
            const uppsalaParkings = [
                {
                    name: 'Uppsala Domkyrka Parkering',
                    location: { latitude: '59.85794118549142', longitude: '17.632288563547707' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Studenternas IP Parkering',
                    location: { latitude: '59.85017030836557', longitude: '17.64392202366271' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Uppsala Centralstation Parkering',
                    location: { latitude: '59.85821474191454', longitude: '17.645869014559768' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Domarringens Parkering',
                    location: { latitude: '59.87681803784774', longitude: '17.62471007070414' },
                    cityId: mongooseCityId,
                },
            ];
            return uppsalaParkings;
        }
    } else if (cityName === 'kalmar') {
        if (type === 'charging') {
            const kalmarChargings = [
                {
                    name: 'Kalmar Stortorg Laddplats',
                    location: { latitude: '56.66412626548758', longitude: '16.3657557402704' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Kalmar Centralstation Laddplats',
                    location: { latitude: '56.66197613045237', longitude: '16.35835512318651' },
                    cityId: mongooseCityId,
                },
            ];
            return kalmarChargings;
        } else if (type === 'parking') {
            const kalmarParkings = [
                {
                    name: 'Baronens Parkering',
                    location: { latitude: '56.66120011667783', longitude: '16.364748903239395' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Fredriksskans IP Parkering',
                    location: { latitude: '56.66942413562081', longitude: '16.35834272985206' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Kvarteret Giraffen Parkering',
                    location: { latitude: '56.66987812445342', longitude: '16.3367606153405' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Kalmar Äventyrsbad Parkering',
                    location: { latitude: '56.66830240322608', longitude: '16.34952370763934' },
                    cityId: mongooseCityId,
                },
            ];
            return kalmarParkings;
        }
    } else if ((cityName = 'halmstad')) {
        if (type === 'charging') {
            const halmstadChargings = [
                {
                    name: 'Halmstad Högskola Laddplats',
                    location: { latitude: '56.663784314780955', longitude: '12.878986903879268' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Gamletull Laddplats',
                    location: { latitude: '56.67520432417453', longitude: '12.866751800615877' },
                    cityId: mongooseCityId,
                },
            ];
            return halmstadChargings;
        } else if (type === 'parking') {
            const halmstadParkings = [
                {
                    name: 'Stationsparkens Parkering',
                    location: { latitude: '56.668743097069026', longitude: '12.862825893058288' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Halmstad Arena Parkering',
                    location: { latitude: '56.673817035689375', longitude: '12.888907296892688' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Halmstads Slott Parkering',
                    location: { latitude: '56.67152781989793', longitude: '12.858275051887452' },
                    cityId: mongooseCityId,
                },
                {
                    name: 'Strandtorps Golfklubb Parkering',
                    location: { latitude: '56.64221320057727', longitude: '12.899030280403894' },
                    cityId: mongooseCityId,
                },
            ];
            return halmstadParkings;
        }
    }
}

/**
 * Returns data based on city, cityId and type
 * @param {String} cityName - name of the city we want data from.
 * @param {String} mongooseCityId - MongooseId for the city
 * @param {String} type - charging or parking
 */
export function getStaticData(cityName = '', mongooseCityId = '', type = '') {
    onst cityData = {
        stockholm: {
            charging: [
                {
                    name: 'Gröna Lund Laddplats',
                    location: { latitude: '59.32431605790759', longitude: '18.095569002560794' },
                },
                {
                    name: 'Odenplan Laddplats',
                    location: { latitude: '59.34280637297721', longitude: '18.049606213091774' },
                },
            ],
            parking: [
                {
                    name: 'Luma Parkering',
                    location: { latitude: '59.303954964144125', longitude: '18.09577990860332' },
                },
                {
                    name: 'Fatbursparkeringen',
                    location: { latitude: '59.314748084274946', longitude: '18.068159584904965' },
                },
                {
                    name: 'Sergels Torgs Parkering',
                    location: { latitude: '59.332906229323754', longitude: '18.064729933075053' },
                },
                {
                    name: 'Strawberry Arena Parkering',
                    location: { latitude: '59.37133204153478', longitude: '18.001119759227002' },
                },
            ],
        },
        uppsala: {
            charging: [
                {
                    name: 'Svandammens Laddplats',
                    location: { latitude: '59.85462902557457', longitude: '17.641158239152958' },
                },
                {
                    name: 'Biotopia Laddplats',
                    location: { latitude: '59.85963676183302', longitude: '17.623033094520803' },
                },
            ],
            parking: [
                {
                    name: 'Uppsala Domkyrka Parkering',
                    location: { latitude: '59.85794118549142', longitude: '17.632288563547707' },
                },
                {
                    name: 'Studenternas IP Parkering',
                    location: { latitude: '59.85017030836557', longitude: '17.64392202366271' },
                },
                {
                    name: 'Uppsala Centralstation Parkering',
                    location: { latitude: '59.85821474191454', longitude: '17.645869014559768' },
                },
                {
                    name: 'Domarringens Parkering',
                    location: { latitude: '59.87681803784774', longitude: '17.62471007070414' },
                },
            ],
        },
        kalmar: {
            charging: [
                {
                    name: 'Kalmar Stortorg Laddplats',
                    location: { latitude: '56.66412626548758', longitude: '16.3657557402704' },
                },
                {
                    name: 'Kalmar Centralstation Laddplats',
                    location: { latitude: '56.66197613045237', longitude: '16.35835512318651' },
                },
            ],
            parking: [
                {
                    name: 'Baronens Parkering',
                    location: { latitude: '56.66120011667783', longitude: '16.364748903239395' },
                },
                {
                    name: 'Fredriksskans IP Parkering',
                    location: { latitude: '56.66942413562081', longitude: '16.35834272985206' },
                },
                {
                    name: 'Kvarteret Giraffen Parkering',
                    location: { latitude: '56.66987812445342', longitude: '16.3367606153405' },
                },
                {
                    name: 'Kalmar Äventyrsbad Parkering',
                    location: { latitude: '56.66830240322608', longitude: '16.34952370763934' },
                },
            ],
        },
        halmstad: {
            charging: [
                {
                    name: 'Halmstad Högskola Laddplats',
                    location: { latitude: '56.663784314780955', longitude: '12.878986903879268' },
                },
                {
                    name: 'Gamletull Laddplats',
                    location: { latitude: '56.67520432417453', longitude: '12.866751800615877' },
                },
            ],
            parking: [
                {
                    name: 'Stationsparkens Parkering',
                    location: { latitude: '56.668743097069026', longitude: '12.862825893058288' },
                },
                {
                    name: 'Halmstad Arena Parkering',
                    location: { latitude: '56.673817035689375', longitude: '12.888907296892688' },
                },
                {
                    name: 'Halmstads Slott Parkering',
                    location: { latitude: '56.67152781989793', longitude: '12.858275051887452' },
                },
                {
                    name: 'Strandtorps Golfklubb Parkering',
                    location: { latitude: '56.64221320057727', longitude: '12.899030280403894' },
                },
            ],
        },
    };

    // Check if city and type exist
    const cityInfo = cityData[cityName.toLowerCase()];
    if (cityInfo && cityInfo[type]) {
        return cityInfo[type];
    }

    return []; // Return empty array if no data found
}