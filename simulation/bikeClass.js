/**
 * Class for simulating a bike
 *
 * @param {Object} bike The bike object to simulate, containing properties such as ID, location, qrCode and charge.
 * @param {Array<{latitude: number, longitude: number}>} route An array of waypoint objects, each containing latitude and longitude coordinates.
 */
class SimulatedBike {
    constructor(bike, route) {
        this._id = bike._id;
        this.step = 0;
        this.route = route;
        this.location = bike.location;
        this.available = bike.available;
        this.cityId = bike.cityId;
        this.charge = bike.charge;
        this.speed = bike.speed;
        this.chargingStationId = bike.chargingStationId ?? null;
        this.parkingAreaId = bike.parkingAreaId ?? null;
        this.qrCode = bike.qrCode;
        this.bikeMaxSpeed = 15;
        this.routeCompleted = false;
        this.activeRental = false;
    }

    /**
     * Starts the bike simulation by moving it through its defined route with delays between waypoints.
     *
     * @param {number} bikeDelay The maximum additional delay in milliseconds added between each waypoint.
     * A random delay between 3000 and (3000 + bikeDelay) milliseconds is used.
     */
    async startSimulation(bikeDelay) {
        console.log('Simulation started for bike: ', this._id);
        this.available = false;
        this.activeRental = true;

        //Sets a random delay between 3 seconds and 33 seconds
        const delay = Math.floor(Math.random() * bikeDelay + 3000);

        //Moves the bike to its next waypoint after the delay for each waypoint it has
        for (let i = 0; i < this.route.length; i++) {
            if (!this.routeCompleted) {
                await new Promise((resolve) =>
                    setTimeout(() => {
                        this.moveToNextWayPoint();
                        resolve();
                    }, delay)
                );
            }
        }
        //Sets routeCompleted to true so the simulationclass knows to stop the rental
        this.routeCompleted = true;
        console.log('Last step taken: ', this._id, 'current step: ', this.step);
    }

    /**
     * Moves the bike to its next waypoint, increases its steps taken, reduces its charge, randomizes speed
     * checks if the bike has enough charge to continue and if its at the end of its route.
     * If the charge is too low or if its at the end of the route then the speed is set to 0 and the routeCompleted is set to true
     */
    moveToNextWayPoint() {
        if (this.charge > 10) {
            this.location = this.route[this.step];
            this.step += 1;
            this.route.length > 7 ? (this.charge -= 3) : (this.charge -= 5);
            this.speed = Math.floor(Math.random() * this.bikeMaxSpeed);
            console.log('Moved bike: ', this._id, 'On step: ', this.step, 'Current speed: ', this.speed, 'Current charge: ', this.charge);

            if (this.step === this.route.length) {
                this.speed = 0;
                this.routeCompleted = true;
            }
        } else {
            this.speed = 0;
            this.routeCompleted = true;
        }
    }

    /**
     * Stops the bike by setting its route to being completed and setting its speed to 0.
     * Also checks if it has a charge above 10, if it does the bike is available for further rentals
     */
    stopBike() {
        this.routeCompleted = true;
        this.speed = 0;
        if (this.charge > 10) {
            this.available = true;
        } else {
            this.available = false;
        }
    }

    getRouteCompleted() {
        return this.routeCompleted;
    }

    getLocation() {
        return this.location;
    }

    getCharge() {
        return this.charge;
    }

    getAvailability() {
        return this.available;
    }

    getActiveRental() {
        return this.activeRental;
    }

    /**
     * Setter for activeRental
     * @param {Boolean} bool
     */
    setActiveRental(bool) {
        this.activeRental = bool;
    }
}

export default SimulatedBike;
