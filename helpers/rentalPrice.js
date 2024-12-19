export async function getRentalPrice(startLocation, endLocation, stations, startTime, endTime, surcharge, discount, minuteRate) {
    startTime = new Date(startTime);
    endTime = new Date(endTime);

    const milliseconds = endTime - startTime;
    const minutes = milliseconds / 60000; // Convert milliseconds to minutes
    const costForTimeUsed = Math.floor(minutes * minuteRate);

    let applySurcharge = false;
    let applyDiscount = false;

    const FIXED_RADIUS = 50; // Fixed radius in meters

    const isStartInside = stations.some(
        (station) => calculateDistance(startLocation, { latitude: station.latitude, longitude: station.longitude }) <= FIXED_RADIUS
    );

    const isEndInside = stations.some(
        (station) => calculateDistance(endLocation, { latitude: station.latitude, longitude: station.longitude }) <= FIXED_RADIUS
    );

    if (isStartInside && isEndInside) {
        return costForTimeUsed;
    }

    if (isStartInside && !isEndInside) {
        applySurcharge = true;
    }

    if (!isStartInside && isEndInside) {
        applyDiscount = true;
    }

    if (!isStartInside && !isEndInside) {
        applySurcharge = true;
    }

    let totalCost = costForTimeUsed;

    if (applySurcharge) {
        totalCost *= 1 + surcharge / 100;
    }

    if (applyDiscount) {
        totalCost *= 1 - discount / 100;
    }

    totalCost = parseFloat(totalCost.toFixed(2));

    console.log(applyDiscount, applySurcharge, totalCost);

    return totalCost;
}

export function calculateDistance(coord1, coord2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const latDiff = toRadians(coord2.latitude - coord1.latitude);
    const longDiff = toRadians(coord2.longitude - coord1.longitude);
    const R = 6371000; // Radius of the Earth in meters

    const a =
        Math.sin(latDiff / 2) ** 2 +
        Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) * Math.sin(longDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

export function isWithinArea(location, area) {
    const FIXED_RADIUS = 50; // Fixed radius in meters

    const distance = calculateDistance(location, { latitude: area.latitude, longitude: area.longitude });
    return distance <= FIXED_RADIUS;
}
