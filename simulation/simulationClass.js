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
            this.bikes[bike._id] = bike;
        });
        bikes.forEach((bike) => {
            if (bike.parkingAreaId) {
                const routes = this.parkingAreas[bike.parkingAreaId].routes;
                const route = routes[Math.floor(Math.random() * [routes.length - 1])];
                this.bikes[bike._id] = new SimulatedBike(bike, route);
            } else if (bike.chargingStationId) {
                const routes = this.chargingStations[bike.chargingStationId].routes;
                const route = routes[Math.floor(Math.random() * [routes.length - 1])];
                this.bikes[bike._id] = new SimulatedBike(bike, route);
            }
        });
        freeFloatingBikes.forEach((bike) => {
            const route = bike.route;
            this.bikes[bike._id] = new SimulatedBike(bike, route);
        });
        this.customers = {};
        customers.forEach((customer) => {
            this.customers[customer._id] = customer;
        });
    }

    async startSim(rentalsAtATime = 10, delay = 3000) {
        const bikeIdArray = Object.keys(this.bikes);
        const shuffled = this.shuffle(bikeIdArray);
        const customerIds = Object.keys(this.customers);
        const count = customerIds.length;
        const rentalsToInsert = [];

        for (let i = 0; i < count; i++) {
            const id = customerIds[i];
            const bikeId = shuffled[i];
            const startLocation = this.bikes[bikeId].location;
            console.log(startLocation);

            this.rentals[i] = { customerId: id, bikeId: bikeId };

            const rental = {
                userId: id,
                bikeId: bikeId,
                startLocation: this.bikes[bikeId].location,
            };

            if ((i + 1) % rentalsAtATime === 0) {
                console.log('New batch');
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    rentBike(bike) {
        console.log('Bike rented', bike);
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
