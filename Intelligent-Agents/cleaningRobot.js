// In this simple problem the world includes both the environment and the robot
// but in most problems the environment and world would be separate
class World {
    constructor(numFloors) {
        this.location = 0;
        this.floors = [];
        for (let i = 0; i < numFloors; i++) {
            this.floors.push({dirty: false
            ,Vdirty: false});
        }
    }

    markFloorDirty(floorNumber) {
        this.floors[floorNumber].dirty = true;
    }

    markFloorVeryDirty(floorNumber) {
        this.floors[floorNumber].Vdirty = true;
    }

    simulate(action) {
        switch(action) {
        case 'SUCK':
            this.floors[this.location].dirty = false;
            break;
        case 'WASH':
            this.floors[this.location].Vdirty = false;
            break;
        case 'A':
            this.location = 0;
            break;
        case 'B':
            this.location = 1;
            break;
        case 'C':
            this.location = 2;
            break;
        case 'D':
            this.location = 3;
            break;
        }

        return action;
    }
}


// Rules are defined in code
function reflexVacuumAgent(world) {
    if (world.floors[world.location].Vdirty) { return 'WASH'; }
    else if (world.floors[world.location].dirty) { return 'SUCK'; }
    else if (world.location == 0)           { return 'B'; }
    else if (world.location == 1)           { return 'C'; }
    else if (world.location == 2)           { return 'D'; }
    else if (world.location == 3)           { return 'A'; }
}

// Rules are defined in data, in a table indexed by [location][dirty]
function tableVacuumAgent(world, table) {
    let location = world.location;
    let dirty = world.floors[location].dirty ? 1 : 0;
    return table[location][dirty];
}
