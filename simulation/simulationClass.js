import SimulatedBike from '../simulation/bikeClass.js';
import Rental from '../models/rentalModel.js';
import { endRental } from '../controllers/rentalController.js';
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

    async startSim(rentalsAtATime = 50, delay = 3000, bikeDelay = 5000) {
        const bikeIdArray = Object.keys(this.bikes);
        const shuffled = this.shuffle(bikeIdArray);
        const customerIds = Object.keys(this.customers);
        const count = customerIds.length > bikeIdArray.length ? bikeIdArray.length : customerIds.length;
        const rentalsToInsert = [];

        for (let i = 0; i < count; i++) {
            const customerId = customerIds[i];
            const bikeId = shuffled[i];

            //Start the individual bike simulation
            this.startBikeSim(this.bikes[bikeId], bikeDelay);

            if (!this.rentals[bikeId]) {
                this.rentals[bikeId] = {};
            }
            //Add the rental to the rental dict by bike id
            this.rentals[bikeId].customer = customerId;
            this.rentals[bikeId].rentalId = 'id';

            //Create a rental to be sent to the database
            const rental = {
                userId: customerId,
                bikeId: bikeId,
                startLocation: this.bikes[bikeId].location,
            };

            // Push the rental data to an array later used to insertMany
            rentalsToInsert.push(rental);

            if ((i + 1) % rentalsAtATime === 0) {
                console.log('New batch');

                try {
                    //Inserts the current batch of created rentals to the database
                    //More efficient than inserting them one by one
                    const rentals = await Rental.insertMany(rentalsToInsert);

                    //Add each rental id to the rentals dict that is sorted by bike ids
                    rentals.forEach((rental) => {
                        this.rentals[rental.bikeId].rentalId = rental._id;
                    });
                    rentalsToInsert.length = 0;
                } catch (e) {
                    console.error('Error adding rentals to db', e);
                }

                //Creates a promise we wait for in order to delay the batches of rentals
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        // After the for loop has been run, we check for remaining rentals and add them
        if (rentalsToInsert.length > 0) {
            try {
                const rentals = await Rental.insertMany(rentalsToInsert);

                //Add each rental id to the rentals dict that is sorted by bike ids
                rentals.forEach((rental) => {
                    this.rentals[rental.bikeId].rentalId = rental._id;
                });
                console.log('Last rentals added: ', rentalsToInsert.length);
            } catch (e) {
                console.error('Error adding remaining rentals to db', e);
            }
        }
    }

    // Stops all bikes from further simulation
    async stopSim() {
        const bikeIds = Object.keys(this.rentals);
        for (const bikeId of bikeIds) {
            const bikeDone = this.bikes[bikeId].getRouteCompleted();

            if (!bikeDone) {
                this.bikes[bikeId].stopBike();
            }

            const location = this.bikes[bikeId].getLocation();
            const activeRental = this.bikes[bikeId].getActiveRental();

            if (this.rentals[bikeId] && this.rentals[bikeId].rentalId && activeRental) {
                this.bikes[bikeId].setActiveRental(false);
                try {
                    await this.endSimRental(bikeId, this.rentals[bikeId].rentalId, location.latitude, location.longitude);
                } catch (e) {
                    console.error(`Error ending rental for bike ${bikeId}: ${e.message}`);
                }
            }
        }
    }

    //Ends the rental
    async endSimRental(bikeId, rentalId, latitude, longitude) {
        let simRentalId = rentalId;
        if (typeof rentalId === 'string') {
            simRentalId = rentalId.trim();
            simRentalId = mongoose.Types.ObjectId.createFromHexString(simRentalId);
        }
        if (!mongoose.isValidObjectId(simRentalId)) {
            console.error(`Invalid rentalId: ${simRentalId} for bike ${bikeId}`);
            console.log('Type of rentalId:', typeof simRentalId);
            return;
        }
        console.log('Type of rentalId:', typeof simRentalId);

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
            },
        };
        try {
            await endRental(data, dummyRes);
        } catch (e) {
            console.error(`Error ending rental for bike ${bikeId}: ${e.message}`);
        }
    }

    startBikeSim(bike, bikeDelay) {
        bike.startSimulation(bikeDelay);
    }

    stopBike(id) {
        console.log(id, ' Stopped');
    }

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
            if (routeComplete && activeRental) {
                this.bikes[bikeId].setActiveRental(false);
                try {
                    await this.endSimRental(bikeId, this.rentals[bikeId].rentalId, location.latitude, location.longitude);
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
