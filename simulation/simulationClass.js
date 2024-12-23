import SimulatedBike from '../simulation/bikeClass';

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
        parkingAreas.forEach((area) => {
            this.parkingAreas[area._id] = area;
        });
        chargingStations.forEach((station) => {
            this.chargingStations[station._id] = station;
        });
        bikes.forEach((bike) => {
            if (bike.parkingAreaId) {
                const routes = this.parkingAreas[bike.parkingAreaId].routes;
                bike.route = routes[Math.floor(Math.random() * routes.length)];
                this.bikes[bike._id] = new SimulatedBike(bike);
            } else if (bike.chargingStationId) {
                const routes = this.chargingStations[bike.chargingStationId].routes;
                bike.route = routes[Math.floor(Math.random() * routes.length)];
                this.bikes[bike._id] = new SimulatedBike(bike);
            }
        });
        freeFloatingBikes.forEach((bike) => {
            this.bikes[bike._id] = new SimulatedBike(bike);
        });
        this.customers = {};
        customers.forEach((customer) => {
            this.customers[customer._id] = customer;
        });
    }
}

export { Simulation };
