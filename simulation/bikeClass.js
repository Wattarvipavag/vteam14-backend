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
    }

    moveToNextWayPoint() {
        console.log('Moved');
        //Step through an array

        // if (this.step === (this.route.length - 1) && !this.routeCompleted) {
        // this.routeCompleted = true;
        // return;
        //}
        // this.location=this.route[this.step];
    }
}

export default SimulatedBike;
