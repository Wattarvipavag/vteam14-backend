export const cities = [
    { name: 'Stockholm', location: { latitude: '59.332560096895286', longitude: '18.06527946354849' } },
    { name: 'Uppsala', location: { latitude: '59.860038783024336', longitude: '17.638834258637786' } },
    { name: 'Kalmar', location: { latitude: '56.66159638691289', longitude: '16.359624775385132' } },
    { name: 'Halmstad', location: { latitude: '56.66955870230835', longitude: '12.86551105745475' } },
];

/**
 * Function that returns bike objects to be added to the database.
 * @param {Array} cityIds- array of the id's which we use to set each cityId with
 * @param {Array} bikes- array of bike objects which we use to set the dynamic values of each bike
 * @return {Array} returns an array of bike objects ready to be sent to the database or simulation.
 *
 */
export function getBikeDetails(cityIds, bikes = []) {
    const cityBikes = [
        {
            city: 'Stockholm',
            bikes: [
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '59.312379874896415', longitude: '18.08778003565807' },
                    route: [
                        { latitude: '59.31005235194841', longitude: '18.086233057068927' },
                        { latitude: '59.30815633935659', longitude: '18.079599642314527' },
                        { latitude: '59.30783552778152', longitude: '18.076444016438632' },
                        { latitude: '59.30760659390393', longitude: '18.06950538042475' },
                        { latitude: '59.30855017748914', longitude: '18.064715003781505' },
                        { latitude: '59.309674238568554', longitude: '18.06106595782342' },
                        { latitude: '59.311347954109316', longitude: '18.056420256562603' },
                        { latitude: '59.31349740908394', longitude: '18.052674760330422' },
                        { latitude: '59.31512171622341', longitude: '18.05167810466968' },
                        { latitude: '59.3176758218014', longitude: '18.050350493788144' },
                    ],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '59.33274954329449', longitude: '18.06940575824523' },
                    route: [
                        { latitude: '59.33303120927716', longitude: '18.075695565338684' },
                        { latitude: '59.334518172487', longitude: '18.07410534259732' },
                        { latitude: '59.33628079472146', longitude: '18.07221766341805' },
                        { latitude: '59.338404080151676', longitude: '18.07462892682908' },
                        { latitude: '59.34038787947243', longitude: '18.076268586012777' },
                        { latitude: '59.34219348220117', longitude: '18.07779144758444' },
                        { latitude: '59.34383281113267', longitude: '18.079286430899277' },
                        { latitude: '59.34456982827155', longitude: '18.076320336347184' },
                        { latitude: '59.345714825873735', longitude: '18.071750167678744' },
                        { latitude: '59.34711048974898', longitude: '18.071600420899742' },
                    ],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '59.345020367735124', longitude: '18.039699253190946' },
                    route: [
                        { latitude: '59.33785', longitude: '18.10249' },
                        { latitude: '59.33960', longitude: '18.09451' },
                        { latitude: '59.34063', longitude: '18.09043' },
                        { latitude: '59.34205', longitude: '18.08490' },
                        { latitude: '59.34354', longitude: '18.07889' },
                        { latitude: '59.34494', longitude: '18.07327' },
                        { latitude: '59.34688', longitude: '18.06666' },
                        { latitude: '59.34583', longitude: '18.06271' },
                        { latitude: '59.34509', longitude: '18.05945' },
                        { latitude: '59.34402', longitude: '18.05554' },
                        { latitude: '59.34634', longitude: '18.05335' },
                        { latitude: '59.34758', longitude: '18.04984' },
                        { latitude: '59.34632', longitude: '18.04488' },
                        { latitude: '59.34504', longitude: '18.03973' },
                    ],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
            ],
        },
        {
            city: 'Uppsala',
            bikes: [
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '59.86095430245953', longitude: '17.63769300562198' },
                    route: [{ latitude: '', longitude: '' }],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '59.852973954834496', longitude: '17.644766355743457' },
                    route: [{ latitude: '', longitude: '' }],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '59.86287295220117', longitude: '17.61381655077588' },
                    route: [{ latitude: '', longitude: '' }],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
            ],
        },
        {
            city: 'Kalmar',
            bikes: [
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '56.67005631226999', longitude: '16.376951417852773' },
                    route: [{ latitude: '', longitude: '' }],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '56.674599377831505', longitude: '16.335886217442393' },
                    route: [{ latitude: '', longitude: '' }],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '56.66550520819479', longitude: '16.34887754075502' },
                    route: [{ latitude: '', longitude: '' }],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
            ],
        },
        {
            city: 'Halmstad',
            bikes: [
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '56.677249194094976', longitude: '12.859233486346115' },
                    route: [{ latitude: '', longitude: '' }],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '56.68190968896822', longitude: '12.86112721883696' },
                    route: [{ latitude: '', longitude: '' }],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
                {
                    _id: 'dynamic mongooseBikeId',
                    cityId: 'dynamic mongooseCityId',
                    location: { latitude: '56.68127662001243', longitude: '12.846102269519257' },
                    route: [{ latitude: '', longitude: '' }],
                    charge: 'dynamic',
                    speed: 0,
                    available: true,
                    qrCode: 'dynamic',
                },
            ],
        },
    ];

    let bikeIdsIndex = 0;
    // Loops through each object containing the bikes and sets the cityId of each bike to what the index correlates to in the provided cityIds array.
    // This is done in order to dynamicly set the correct mongoose ids to the cityId of each bike since mongoose ids change when recreating the cities in the database.
    // Same goes for bikeIds if provided
    cityBikes.forEach((cityObject, index) => {
        if (cityIds[index]) {
            cityObject.bikes.forEach((bike) => {
                bike.cityId = cityIds[index];

                // If an array of bikes is provided we set what we can dynamicly
                if (bikes[bikeIdsIndex]) {
                    bike._id = bikes[bikeIdsIndex]._id;
                    bike.charge = bikes[bikeIdsIndex].charge;
                    bike.qrCode = bikes[bikeIdsIndex].qrCode;
                    bikeIdsIndex += 1;
                }
            });
        }
    });

    return cityBikes.flatMap((cityObject) => cityObject.bikes);
}

/**
 * Function that returns objects needed to create parking areas in the database or simulation
 * @param {Array} cityIds- the id's which we use to set each parking areas cityId to based on index. So order is important!
 * @param {Array} parkingAreaIds- mongoose id's to insert into each parkingArea object
 * @return {Array} returns an array of parking area objects
 *
 */
export function getParkingAreas(cityIds, parkingAreaIds = []) {
    const cityParkings = [
        {
            city: 'Stockholm',
            parkingAreas: [
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Luma Parkering',
                    location: { latitude: '59.303954964144125', longitude: '18.09577990860332' },
                    cityId: 'dynamic mongooseId',
                    routes: [
                        [
                            { latitude: '59.303401068243986', longitude: '18.090499356938125' },
                            { latitude: '59.302501643691336', longitude: '18.086805145096353' },
                            { latitude: '59.30247843240863', longitude: '18.08080347130994' },
                            { latitude: '59.30500836773979', longitude: '18.078825646759597' },
                            { latitude: '59.30775880781413', longitude: '18.07660830784623' },
                            { latitude: '59.3116628131025', longitude: '18.074544064258774' },
                            { latitude: '59.314197866171405', longitude: '18.073396016718238' },
                            { latitude: '59.314946959521635', longitude: '18.070728825265984' },
                            { latitude: '59.314748084274946', longitude: '18.068159584904965' },
                        ],
                        [
                            { latitude: '59.30572775711249', longitude: '18.099341889835472' },
                            { latitude: '59.30825352428685', longitude: '18.097668150048584' },
                            { latitude: '59.312654090249325', longitude: '18.09923211213345' },
                            { latitude: '59.314026523838805', longitude: '18.08820414729506' },
                            { latitude: '59.317749901721484', longitude: '18.082492120265037' },
                            { latitude: '59.32020710771819', longitude: '18.072172947790794' },
                            { latitude: '59.32502957451091', longitude: '18.0757813628873' },
                            { latitude: '59.33061155406759', longitude: '18.072893415036578' },
                            { latitude: '59.332624111519245', longitude: '18.06811247932973' },
                            { latitude: '59.33230376800273', longitude: '18.065475225880878' },
                        ],
                    ],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Fatbursparkeringen',
                    location: { latitude: '59.314748084274946', longitude: '18.068159584904965' },
                    cityId: 'dynamic mongooseId',
                    routes: [
                        [
                            { latitude: '59.316020012497994', longitude: '18.07237326320823' },
                            { latitude: '59.319462622238355', longitude: '18.070691744568574' },
                            { latitude: '59.320965970144165', longitude: '18.073391152718084' },
                            { latitude: '59.32267445516046', longitude: '18.069145733040205' },
                            { latitude: '59.325480091947', longitude: '18.06596094172629' },
                            { latitude: '59.32813349919704', longitude: '18.07015076947563' },
                            { latitude: '59.330483621361054', longitude: '18.066761779508212' },
                            { latitude: '59.33200657010783', longitude: '18.066533096728342' },
                            { latitude: '59.332906229323754', longitude: '18.064729933075053' },
                        ],
                        [
                            { latitude: '59.31449900170962', longitude: '18.06463869540231' },
                            { latitude: '59.316862962176295', longitude: '18.0635146516605' },
                            { latitude: '59.318808655525444', longitude: '18.0622463018473' },
                            { latitude: '59.31810908468655', longitude: '18.056268432639474' },
                            { latitude: '59.31704014739774', longitude: '18.048127630619586' },
                            { latitude: '59.31615368609857', longitude: '18.040855407875245' },
                            { latitude: '59.31611023150928', longitude: '18.033872711661328' },
                            { latitude: '59.32186004691657', longitude: '18.030414764691937' },
                            { latitude: '59.32521742483185', longitude: '18.026291534112833' },
                            { latitude: '59.33161453867871', longitude: '18.023863724449125' },
                            { latitude: '59.33597106160215', longitude: '18.033664223950236' },
                            { latitude: '59.340589483597775', longitude: '18.04151284928601' },
                            { latitude: '59.34275565300625', longitude: '18.049656173229' },
                        ],
                    ],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Sergels Torgs Parkering',
                    location: { latitude: '59.332906229323754', longitude: '18.064729933075053' },
                    cityId: 'dynamic mongooseId',
                    routes: [
                        [
                            { latitude: '59.33444106818901', longitude: '18.06464194732604' },
                            { latitude: '59.33595073373167', longitude: '18.06309813149984' },
                            { latitude: '59.338058947471644', longitude: '18.06115879263525' },
                            { latitude: '59.34073318231453', longitude: '18.05871581955746' },
                            { latitude: '59.34395355824653', longitude: '18.055551634998622' },
                            { latitude: '59.34281153992831', longitude: '18.04945835517944' },
                        ],
                        [
                            { latitude: '59.33272225000055', longitude: '18.06932951113717' },
                            { latitude: '59.33294901590683', longitude: '18.07581124351183' },
                            { latitude: '59.33142130053531', longitude: '18.08226957736784' },
                            { latitude: '59.33168388150034', longitude: '18.09324406286861' },
                            { latitude: '59.32872376032499', longitude: '18.09591163556834' },
                            { latitude: '59.3247184486159', longitude: '18.09748099795526' },
                            { latitude: '59.32428845736685', longitude: '18.095534626372743' },
                        ],
                    ],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Strawberry Arena Parkering',
                    location: { latitude: '59.37133204153478', longitude: '18.001119759227002' },
                    cityId: 'dynamic mongooseId',
                    routes: [
                        [
                            { latitude: '59.36754419106139', longitude: '17.995075127181693' },
                            { latitude: '59.36637222206005', longitude: '17.996979788590632' },
                            { latitude: '59.36352613336941', longitude: '18.000875176147456' },
                            { latitude: '59.360446250577866', longitude: '18.001820380425563' },
                            { latitude: '59.356577755195715', longitude: '18.010040794419623' },
                            { latitude: '59.35389812147151', longitude: '18.016819914186904' },
                            { latitude: '59.35385800177713', longitude: '18.02280165285598' },
                            { latitude: '59.353717582496955', longitude: '18.029413047579975' },
                            { latitude: '59.35242687696829', longitude: '18.03235275537765' },
                        ],
                        [
                            { latitude: '59.36754419106139', longitude: '17.995075127181693' },
                            { latitude: '59.36637222206005', longitude: '17.996979788590632' },
                            { latitude: '59.36352613336941', longitude: '18.000875176147456' },
                            { latitude: '59.360446250577866', longitude: '18.001820380425563' },
                            { latitude: '59.356577755195715', longitude: '18.010040794419623' },
                            { latitude: '59.35389812147151', longitude: '18.016819914186904' },
                            { latitude: '59.34794110952759', longitude: '18.02976534847914' },
                            { latitude: '59.343876165637546', longitude: '18.03543464059039' },
                            { latitude: '59.342482822511585', longitude: '18.036662046187818' },
                            { latitude: '59.34265692888587', longitude: '18.042401022793676' },
                            { latitude: '59.342783479936294', longitude: '18.049291965997615' },
                        ],
                    ],
                },
            ],
        },
        {
            city: 'Uppsala',
            parkingAreas: [
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Uppsala Domkyrka Parkering',
                    location: { latitude: '59.85794118549142', longitude: '17.632288563547707' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Studenternas IP Parkering',
                    location: { latitude: '59.85017030836557', longitude: '17.64392202366271' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Uppsala Centralstation Parkering',
                    location: { latitude: '59.85821474191454', longitude: '17.645869014559768' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Domarringens Parkering',
                    location: { latitude: '59.87681803784774', longitude: '17.62471007070414' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
            ],
        },
        {
            city: 'Kalmar',
            parkingAreas: [
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Baronens Parkering',
                    location: { latitude: '56.66120011667783', longitude: '16.364748903239395' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Fredriksskans IP Parkering',
                    location: { latitude: '56.66942413562081', longitude: '16.35834272985206' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Kvarteret Giraffen Parkering',
                    location: { latitude: '56.66987812445342', longitude: '16.3367606153405' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Kalmar Äventyrsbad Parkering',
                    location: { latitude: '56.66830240322608', longitude: '16.34952370763934' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
            ],
        },
        {
            city: 'Halmstad',
            parkingAreas: [
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Stationsparkens Parkering',
                    location: { latitude: '56.668743097069026', longitude: '12.862825893058288' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Halmstad Arena Parkering',
                    location: { latitude: '56.673817035689375', longitude: '12.888907296892688' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Halmstads Slott Parkering',
                    location: { latitude: '56.67152781989793', longitude: '12.858275051887452' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    parkingAreaId: 'dynamic mongooseId',
                    name: 'Strandtorps Golfklubb Parkering',
                    location: { latitude: '56.64221320057727', longitude: '12.899030280403894' },
                    cityId: 'dynamic mongooseId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
            ],
        },
    ];

    let parkingAreaIdsIndex = 0;
    // Loops through each object containing the cities name and parking areas and sets the cityId of each parking to what the index correlates to in the provided cityIds array.
    // This is done in order to dynamicly set the correct mongoose ids to the cityId of each parking since mongoose ids change when recreating the cities in the database.

    cityParkings.forEach((cityObject, index) => {
        if (cityIds[index]) {
            cityObject.parkingAreas.forEach((parking) => {
                parking.cityId = cityIds[index];

                // If an array of parkingAreaIds is provided we also set that dynamicly
                if (parkingAreaIds[parkingAreaIdsIndex]) {
                    parking.parkingAreaId = parkingAreaIds[parkingAreaIdsIndex];
                    parkingAreaIdsIndex += 1;
                }
            });
        }
    });
    return cityParkings.flatMap((cityObject) => cityObject.parkingAreas);
}

/**
 * Function that returns objects needed to create charging stations in the database or simulation
 * @param {Array} cityIds- the id's which we use to set each charging stations cityId to based on index. So order is important!
 * @param {Array} chargingStationIds- mongoose id's to insert into each chargingstation object under each city
 * @return {Array} returns an array of charging station objects
 *
 */
export function getChargingStations(cityIds, chargingStationIds = []) {
    const cityChargings = [
        {
            city: 'Stockholm',
            chargingStations: [
                {
                    chargingStationId: 'dynamic mongooseId',
                    name: 'Gröna Lund Laddplats',
                    location: { latitude: '59.32431605790759', longitude: '18.095569002560794' },
                    cityId: 'dynamic mongooseCityId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    chargingStationId: 'dynamic mongooseId',
                    name: 'Odenplan Laddplats',
                    location: { latitude: '59.34280637297721', longitude: '18.049606213091774' },
                    cityId: 'dynamic mongooseCityId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
            ],
        },
        {
            city: 'Uppsala',
            chargingStations: [
                {
                    chargingStationId: 'dynamic mongooseId',
                    name: 'Svandammens Laddplats',
                    location: { latitude: '59.85462902557457', longitude: '17.641158239152958' },
                    cityId: 'dynamic mongooseCityId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    chargingStationId: 'dynamic mongooseId',
                    name: 'Biotopia Laddplats',
                    location: { latitude: '59.85963676183302', longitude: '17.623033094520803' },
                    cityId: 'dynamic mongooseCityId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
            ],
        },
        {
            city: 'Kalmar',
            chargingStations: [
                {
                    chargingStationId: 'dynamic mongooseId',
                    name: 'Kalmar Stortorg Laddplats',
                    location: { latitude: '56.66412626548758', longitude: '16.3657557402704' },
                    cityId: 'dynamic mongooseCityId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    chargingStationId: 'dynamic mongooseId',
                    name: 'Kalmar Centralstation Laddplats',
                    location: { latitude: '56.66197613045237', longitude: '16.35835512318651' },
                    cityId: 'dynamic mongooseCityId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
            ],
        },
        {
            city: 'Halmstad',
            chargingStations: [
                {
                    chargingStationId: 'dynamic mongooseId',
                    name: 'Halmstad Högskola Laddplats',
                    location: { latitude: '56.663784314780955', longitude: '12.878986903879268' },
                    cityId: 'dynamic mongooseCityId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
                {
                    chargingStationId: 'dynamic mongooseId',
                    name: 'Gamletull Laddplats',
                    location: { latitude: '56.67520432417453', longitude: '12.866751800615877' },
                    cityId: 'dynamic mongooseCityId',
                    routes: [{ latitude: '59.303954964144125', longitude: '18.09577990860332' }],
                },
            ],
        },
    ];

    let chargingStationIdsIndex = 0;
    // Loops through each object containing the cities name and charging stations and sets the cityId of each charging station to what the index correlates to in the provided cityIds array.
    // This is done in order to dynamicly set the correct mongoose ids to the cityId of each parking since mongoose ids change when recreating the cities in the database.
    cityChargings.forEach((cityObject, index) => {
        if (cityIds[index]) {
            cityObject.chargingStations.forEach((chargingStation) => {
                chargingStation.cityId = cityIds[index];

                if (chargingStationIds[chargingStationIdsIndex]) {
                    chargingStation.chargingStationId = chargingStationIds[chargingStationIdsIndex];
                    chargingStationIdsIndex += 1;
                }
            });
        }
    });
    return cityChargings.flatMap((cityObject) => cityObject.chargingStations);
}
