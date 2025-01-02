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
    }

    async startSimulation(bikeDelay) {
        console.log('Simulation started for bike: ', this._id);

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

    moveToNextWayPoint() {
        if (this.charge > 10) {
            this.location = this.route[this.step];
            this.step += 1;
            this.charge -= 5;
            this.speed = Math.floor(Math.random() * this.bikeMaxSpeed);
            console.log('Moved bike: ', this._id, 'On step: ', this.step, 'Current speed: ', this.speed, 'Current charge: ', this.charge);
        } else {
            this.speed = 0;
            this.available = false;
            this.routeCompleted = true;
        }
    }

    stopBike() {
        this.routeCompleted = true;
        this.speed = 0;
        if (this.charge > 10) {
            this.available = true;
        }
    }

    getRouteCompleted() {
        return this.routeCompleted;
    }

    getLocation() {
        return this.location;
    }
}

export default SimulatedBike;
