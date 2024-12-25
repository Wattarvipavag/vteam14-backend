class SimulatedBike {
    constructor(bike) {
        this.id = bike._id;
        this.step = 0;
    }

    moveToNextWayPoint() {
        console.log('Moved');
        //Step through an array

        // if (this.step === (this.rout.length - 1) && !this.routeCompleted) {
        // this.routeCompleted = true;
        // return;
        //}
        // this.location=this.route[this.step];
    }
}

export default SimulatedBike;
