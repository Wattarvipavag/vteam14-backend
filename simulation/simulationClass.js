import SimulatedBike from '../simulation/bikeClass.js';
import { endRental, createRental } from '../controllers/rentalController.js';
import mongoose from 'mongoose';

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
                const route = routes[Math.floor(Math.random() * routes.length)];
                this.bikes[bike._id] = new SimulatedBike(bike, route);
            } else if (bike.chargingStationId) {
                const routes = this.chargingStations[bike.chargingStationId].routes;
                const route = routes[Math.floor(Math.random() * routes.length)];
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

    /**
     * Method that starts the simulation and rents out available bikes in a staggered fashion in order to
     * decrease the load on the database
     * @param {Number} rentalsAtATime number of rentals to send to the database for each batch
     * @param {Number} delay the delay between batch requests to the database
     * @param {Number} bikeDelay the baseline delay each bike will have between moving to the next waypoint on its route
     */
    async startSim(rentalsAtATime = 20, delay = 1000, bikeDelay = 5000) {
        const bikeIdArray = Object.keys(this.bikes);
        const shuffled = this.shuffle(bikeIdArray);
        const customerIds = Object.keys(this.customers);
        const count = Math.min(customerIds.length, bikeIdArray.length);
        const rentalPromises = [];

        for (let i = 0; i < count; i++) {
            const customerId = customerIds[i];
            const bikeId = shuffled[i];

            // Start bike simulation
            this.startBikeSim(this.bikes[bikeId], bikeDelay);

            if (!this.rentals[bikeId]) {
                this.rentals[bikeId] = {};
            }
            this.rentals[bikeId].customer = customerId;

            // Prepare rental request
            const req = {
                body: {
                    userId: customerId,
                    bikeId: bikeId,
                },
            };

            rentalPromises.push(req);

            // Batch processing
            if ((i + 1) % rentalsAtATime === 0) {
                console.log('Processing batch...');
                for (const request of rentalPromises) {
                    try {
                        const rentalResponse = await createRental(request);
                        if (!rentalResponse || !rentalResponse.rental) {
                            console.error(`Failed to create rental for bike ${request.body.bikeId}`);
                            continue;
                        }
                        this.rentals[request.body.bikeId].rentalId = rentalResponse.rental._id;
                    } catch (error) {
                        console.error(`Error processing rental: ${error.message}`);
                    }
                }
                rentalPromises.length = 0;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        // Final batch processing (for remaining rentals)
        if (rentalPromises.length > 0) {
            for (const request of rentalPromises) {
                try {
                    const rentalResponse = await createRental(request);
                    if (!rentalResponse || !rentalResponse.rental) {
                        console.error(`Failed to create rental for bike ${request.body.bikeId}`);
                        continue;
                    }
                    this.rentals[request.body.bikeId].rentalId = rentalResponse.rental._id;
                } catch (error) {
                    console.error(`Error processing final rentals: ${error.message}`);
                }
            }
        }
    }

    /**
     * Stops the simulation by looping over all rented bikes and stopping those
     * that have not stopped on their own by finishing their route or running out of charge
     */
    async stopSim() {
        const bikeIds = Object.keys(this.rentals);
        for (const bikeId of bikeIds) {
            const bikeDone = this.bikes[bikeId].getRouteCompleted();

            if (!bikeDone) {
                this.bikes[bikeId].stopBike();
            }

            const location = this.bikes[bikeId].getLocation();
            const activeRental = this.bikes[bikeId].getActiveRental();
            const charge = this.bikes[bikeId].getCharge();

            if (this.rentals[bikeId] && this.rentals[bikeId].rentalId && activeRental) {
                this.bikes[bikeId].setActiveRental(false);
                try {
                    await this.endSimRental(bikeId, this.rentals[bikeId].rentalId, location.latitude, location.longitude, charge);
                } catch (e) {
                    console.error(`Error ending rental for bike ${bikeId}: ${e.message}`);
                }
            }
        }
    }

    /**
     * Method that ends the rental for the provided bike with details. utilizes the rentalController.js
     * to end the rental in the database
     * @param {mongoose.Types.ObjectId} bikeId mongoose id for the bike
     * @param {mongoose.Types.ObjectId} rentalId mongoose id for the rental
     * @param {Number} latitude the floating point value for the bikes latitude
     * @param {Number} longitude the floating point value for the bikes longitude
     * @param {Number} charge the current charge of the bike, number signifies percentage
     * @returns
     */
    async endSimRental(bikeId, rentalId, latitude, longitude, charge) {
        let simRentalId = rentalId;
        if (typeof rentalId === 'string') {
            simRentalId = rentalId.trim();
            simRentalId = mongoose.Types.ObjectId.createFromHexString(simRentalId);
        }

        if (!mongoose.isValidObjectId(simRentalId)) {
            console.error(`Invalid rentalId: ${simRentalId} for bike ${bikeId}`);
            return;
        }

        // Creates a dummy res object in order to use the endRental function in the rentalController
        const dummyRes = {
            status: () => {
                return dummyRes;
            },
            json: () => {},
        };

        const data = {
            params: {
                id: simRentalId,
            },
            body: {
                latitude: latitude,
                longitude: longitude,
                charge: charge,
            },
        };
        try {
            await endRental(data, dummyRes);
        } catch (e) {
            console.error(`Error ending rental for bike ${bikeId}: ${e.message}`);
        }
    }

    /**
     * Method that starts up a bikeClass internal simulation
     * @param {SimulatedBike} bike one instance of a SimulatedBike class
     * @param {Number} bikeDelay the delay in milliseconds the bike will use between waypoints
     */
    startBikeSim(bike, bikeDelay) {
        bike.startSimulation(bikeDelay);
    }

    stopBike(id) {
        console.log(id, ' Stopped');
    }

    /**
     * Method that updates and returns the object holding all the rentals
     * @returns an updated object signifying the state of all current rentals
     * containing the data needed for the frontend to update the map
     */
    async getUpdatedData() {
        const bikeIdArray = Object.keys(this.rentals);
        const updatePromises = bikeIdArray.map(async (bikeId) => {
            const location = this.bikes[bikeId].getLocation();
            const charge = this.bikes[bikeId].getCharge();
            const available = this.bikes[bikeId].getAvailability();

            this.rentals[bikeId].location = location;
            this.rentals[bikeId].charge = charge;
            this.rentals[bikeId].available = available;

            const routeComplete = this.bikes[bikeId].getRouteCompleted();
            const activeRental = this.bikes[bikeId].getActiveRental();
            if (routeComplete && activeRental && this.rentals[bikeId].rentalId) {
                this.bikes[bikeId].setActiveRental(false);
                try {
                    await this.endSimRental(bikeId, this.rentals[bikeId].rentalId, location.latitude, location.longitude, charge);
                } catch (e) {
                    console.error(`Error ending rental for bike ${bikeId}: ${e.message}`);
                }
            }
        });
        await Promise.all(updatePromises);
        return this.rentals;
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
