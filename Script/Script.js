var view = {
    displayMessage: function(msg){
        let messageArea = document.getElementById("status");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        let hitCell = document.getElementById(location);
        hitCell.style.backgroundColor = "rgb(128, 29, 4)"; 
    },
    displayMiss: function(location){
        let missCell = document.getElementById(location);
        missCell.style.backgroundColor = "rgb(93, 92, 84)"; 
    }
};

class Ship {
    constructor(shipLength, shipsNumber, location, hits){
        this.shipLength = shipLength;
        this.shipsNumber = shipsNumber;
        this.location = location;
        this.hits = hits;
    }
}

var model = {
    boardSize: 10,
    shipsTotal: 10,
    sunkTotal: 0,
    ships: [],
    spaces: [],

    generateLocation: function(length){
        let location = [];

        let loc1 = Math.round(Math.random() * 20) % (this.boardSize - length + 1);
        let loc2 = Math.round(Math.random() * 20) % (this.boardSize - length + 1);

        let direction = Math.round(Math.random() * 10) % 2;

        location.push(loc1 + "" + loc2);
        
        for(let i = 1; i < length; i++){
            if(direction == 0){ 
                loc2 ++;
                location.push(loc1 + "" + loc2);
            } else {
                loc1 ++;
                location.push(loc1 + "" + loc2);
            }
        }
        return location;
    },

    spaceBetween: function(location){
        let space = [];

        for(let i = 0; i < location.length; i++){
            let row = parseInt(location[i].split("")[0], 10);
            let col = parseInt(location[i].split("")[1], 10);

            let rowLoc1 = row + 1;
            let rowLoc2 = row - 1;
            let colLoc1 = col + 1;
            let colLoc2 = col - 1;

            if(rowLoc1 <= 9){
                let tempLoc = rowLoc1 + "" + col;
                if(location.indexOf(tempLoc) == -1){
                    space.push(tempLoc);
                }
                if(colLoc1 <= 9){
                    let tempLoc2 = rowLoc1 + "" + colLoc1;
                    if(location.indexOf(tempLoc2) == -1){
                        space.push(tempLoc2);
                    }
                }
            }
            if(rowLoc2 >= 0){
                let tempLoc = rowLoc2 + "" + col;
                if(location.indexOf(tempLoc) == -1){
                    space.push(tempLoc);
                }
                if(colLoc2 >= 0){
                    let tempLoc2 = rowLoc2 + "" + colLoc2;
                    if(location.indexOf(tempLoc2) == -1){
                        space.push(tempLoc2);
                    }
                }
            }
            if(colLoc1 <= 9){
                let tempLoc = row + "" + colLoc1;
                if(location.indexOf(tempLoc) == -1){
                    space.push(tempLoc);
                }
                if(rowLoc2 >= 0){
                    let tempLoc2 = rowLoc2 + "" + colLoc1;
                    if(location.indexOf(tempLoc2) == -1){
                        space.push(tempLoc2);
                    }
                }
            }
            if(colLoc2 >= 0){
                let tempLoc = row + "" + colLoc2;
                if(location.indexOf(tempLoc) == -1){
                    space.push(tempLoc);
                }
                if(rowLoc1 <= 9){
                    let tempLoc2 = rowLoc1 + "" + colLoc2;
                    if(location.indexOf(tempLoc2) == -1){
                        space.push(tempLoc2);
                    }
                }
            }
        }
        return space;
    },

    generateShips: function(){

        if(this.ships.length == 0){
            this.ships.push(new Ship(4, 1, this.generateLocation(4), [" ", " ", " ", " "]));

            // console.log(this.spaceBetween(this.ships[0].location));
        } 

        while(this.ships.length < 3){
            let tempLocation = this.generateLocation(3);

            if(!this.isCollision(tempLocation)){
                this.ships.push(new Ship(3, 2, tempLocation, [" ", " ", " "]));
            }
        }
        
        while(this.ships.length < 6){
            let tempLocation = this.generateLocation(2);

            if(!this.isCollision(tempLocation)){
                this.ships.push(new Ship(2, 3, tempLocation, [" ", " "]));
            }
        }

        while(this.ships.length < 10){
            let tempLocation = this.generateLocation(1);

            if(!this.isCollision(tempLocation)){
                this.ships.push(new Ship(1, 4, tempLocation, [" "]));
            }
        }
        
        console.log(this.ships);
    },

    isCollision: function(tempLocation){
        for(let i = 0; i < this.ships.length; i++){
            let ship = this.ships[i];

            this.spaces += this.spaceBetween(this.ships[i].location); 

            for(let i = 0; i < tempLocation.length; i++){
                if(ship.location.indexOf(tempLocation[i]) >= 0 || this.spaces.indexOf(tempLocation[i]) >= 0){
                    return true;
                }
            }
        }
        return false;
    },

    fire: function(guess){
        for(let i = 0; i < this.shipsTotal; i++){
            let ship = this.ships[i];
            let index = ship.location.indexOf(guess);

            if(index >= 0){
                ship.hits[index] = "hit";

                view.displayMessage("Влучання!");
                view.displayHit(guess);

                if(this.isSunk(ship)){
                    this.sunkTotal ++;
                    view.displayMessage("Ти потопив корабль!");
                }
                return true;
            }
        }
        view.displayMessage("Промах");
        view.displayMiss(guess);

        return false;
    },

    isSunk: function(ship){
        for(let i = 0; i < ship.shipLength; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    }
};

var controller = {
    isGameOver: false,
    tries: new Array(),

    checkClicked: function(guess){  
        let index = this.tries.indexOf(guess);
        if(index >= 0){
            return false;
        }
        this.tries.push(guess);
        return true;
    },

    processGuess: function(guess){
        
        if(this.checkClicked(guess) && !this.isGameOver){
            let hit = model.fire(guess);

            if(hit && model.sunkTotal === model.shipsTotal){
                view.displayMessage("Ти переміг! Ура");
                this.isGameOver = true;

                let stat = Math.round(20 / this.tries.length * 100);
                document.getElementById("skill").innerHTML = "твоя точність: " + stat + "%";
            }
        }
    }
};

model.generateShips();

function handler (event) {
    controller.processGuess(event.target.id);
}

var cells = document.querySelectorAll(".cell");
for (let c of cells) {
    c.onclick = handler;
}