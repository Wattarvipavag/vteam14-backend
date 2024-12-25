import SimulatedBike from '../simulation/bikeClass.js';

/**
 * Class for holding and managing the simulation of bikes and customers
 * @param {Array} cities an Array of city objects
 * @param {Array} parkingAreas an Array of parking objects
 * @param {Array} chargingStations an Array of charging objects
 * @param {Array} bikes an Array of bike objects
 * @param {Array} freeFloatingBikes an Array of bikes objects that are not parked at a parkingarea or chargingstation
 * @param {Array} customers an Array of user objects
 */
class Simulation {
    constructor(cities, parkingAreas, chargingStations, bikes, freeFloatingBikes, customers) {
        this.cities = cities;
        this.parkingAreas = {};
        this.chargingStations = {};
        this.bikes = {};
        this.rentals = {};
        parkingAreas.forEach((area) => {
            this.parkingAreas[area.parkingAreaId] = area;
        });
        chargingStations.forEach((station) => {
            this.chargingStations[station.chargingStationId] = station;
        });
        bikes.forEach((bike) => {
            this.bikes[bike._id] = new SimulatedBike(bike);
        });
        bikes.forEach((bike) => {
            if (bike.parkingAreaId) {
                const routes = this.parkingAreas[bike.parkingAreaId].routes;
                bike.route = routes[Math.floor(Math.random() * [routes.length - 1])];
                this.bikes[bike._id] = new SimulatedBike(bike);
            } else if (bike.chargingStationId) {
                const routes = this.chargingStations[bike.chargingStationId].routes;
                bike.route = routes[Math.floor(Math.random() * [routes.length - 1])];
                this.bikes[bike._id] = new SimulatedBike(bike);
            }
        });
        freeFloatingBikes.forEach((bike) => {
            bike._id = bike.bikeId;
            this.bikes[bike.bikeId] = new SimulatedBike(bike);
        });
        this.customers = {};
        customers.forEach((customer) => {
            this.customers[customer._id] = customer;
        });
    }

    startSim(rentalsAtATime = 10, delay = 1000) {
        this.bikes = this.shuffle(this.bikes);
    }

    stopBike(id) {
        console.log(id, ' Stopped');
    }

    /**
     * Shuffles array in place.
     * @param {Array} a items An array containing the items.
     */
    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}

export default Simulation;
