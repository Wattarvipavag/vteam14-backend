function calculateDistance(stationCoords, bikeCoords) {
    const stationLat = stationCoords.latitude;
    const bikeLat = bikeCoords.latitude;

    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const latDiff = toRadians(bikeCoords.latitude - stationCoords.latitude);
    const longDiff = toRadians(bikeCoords.longitude - stationCoords.longitude);
    const R = 6371000;

    const a = Math.sin(latDiff / 2) ** 2 + Math.cos(stationLat) * Math.cos(bikeLat) * Math.sin(longDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in meters between bike and chargingstation/parkingarea
    let distance = R * c;
    console.log('Distance calculated: ', distance);
    return distance;
}

export async function getRentalPrice(startLocation, endLocation, stations, startTime, endTime, surcharge, discount, minuteRate, bike) {
    console.log(startTime, endTime);
    const milliseconds = (endTime - startTime) / 1000;
    const minutes = milliseconds / 60;
    console.log(minutes);
    const costForTimeUsed = Math.floor(minutes * minuteRate);
    console.log(costForTimeUsed);
    let applySurcharge = false;
    let applyDiscount = false;
    let bikeReturned = false;
    let surchargeMultiplier = 1 + surcharge / 100;
    let discountMultiplier = 1 - discount / 100;
    let endDistance;
    let endStation = {};
    let startDistanceArray = [];
    console.log('Startplats', startLocation);

    stations.forEach(async (station, index) => {
        let distance = calculateDistance(station.location, endLocation);
        if (index === 0) {
            endDistance = distance;
            endStation = station;
        }
        if (distance < endDistance) {
            endDistance = distance;
            endStation = station;
        }
        startDistanceArray.push(calculateDistance(station.location, startLocation));
    });
    let minStart = Math.min(...startDistanceArray);
    console.log('Minsta startdistans', minStart);
    console.log('Minsta slutdistans', endDistance);
    console.log('Endstationstyp', endStation.type);

    if (endDistance > 50 && minStart > 50 && !bikeReturned) {
        bikeReturned = true;
        applySurcharge = true;
        bike.location = endLocation;
        await bike.save();
        console.log('Straffavgift!');
    } else if (endDistance > 50 && !bikeReturned) {
        bikeReturned = true;
        applySurcharge = true;
        bike.location = endLocation;
        await bike.save();
        console.log('Straffavgift!');
    } else if (endDistance <= 50 && minStart > 50 && !bikeReturned) {
        bikeReturned = true;
        applyDiscount = true;
        bike.location = endStation.location;
        await bike.save();
        endStation.type === 'Chargingstation' ? (bike.chargingStationId = endStation._id) : (bike.parkingAreaId = endStation._id);
        console.log('Prisavdrag!');
    } else {
        endStation.type === 'Chargingstation' ? (bike.chargingStationId = endStation._id) : (bike.parkingAreaId = endStation._id);
        bikeReturned = true;
        bike.location = endStation.location;
        await bike.save();
    }

    const totalCost = costForTimeUsed * (applySurcharge ? surchargeMultiplier : 1) * (applyDiscount ? discountMultiplier : 1);
    console.log('Slutplats', endStation.location);
    console.log('Kostnad: ', totalCost);
    return totalCost;
}
