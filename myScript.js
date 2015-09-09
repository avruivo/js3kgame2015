var Enums = {
    Directions: {
        LEFT: "L",
        RIGHT: "R",
        UP: "U",
        DOWN: "D"
    },

    Colors: {
        yellow: "#FFFF00",
        blue: "#1c5cff",
        darkBlue: '#1c5c88',
        red: "#a90000",
        black: "#000000",
        white: "#FFFFFF"
    },
    
    UiElements: {
        eater: "E",
        ghost: "G",
        dot: "o",
        powerup: "O",
        wall: "W"
    }
}
var GameCfg = {
    uiElementsLength: 20,
    lineBreakToken: '|',
    showBoundingBoxs: false,
    opacity: 0.8,

    eaterVx: 2,
    ghostVx: 1
}

var GameVars = {
    isChaseTime: true
}

window.onload = function () {
    init();
}

function startMainLoop() {
    var ONE_FRAME_TIME = 1000.0 / 60.0;
    var mainIntervalId = window.setInterval(mainloop, ONE_FRAME_TIME);
    intervals.push(mainIntervalId);
}


function clearMainInterval() {
    window.clearInterval(intervals[0]);
}

function init() {
    startMainLoop();
    initGameControlls();
    initGame();
}

function initGameControlls() {
    //Set up key listener
    function onkey(d, e) {
        var moveLogic = function (uiElement) {
            if (!e) e = window.e;
            var c = e.keyCode;
            if (e.charCode && c == 0)
                c = e.charCode;


            var casted = UiElement('', '', ''); //dummy 
            casted = uiElement;
            if (c == 37) { //left
                // if (this.currentUiElement.direction != "L") {
                //     this.currentUiElement.direction = "L";
                //     this.currentUiElement.vx = 0;
                // }
                // else{
                //     this.currentUiElement.vx = -d * 2;
                // }

                //console.log('left!!');
                //this.currentUiElement.vx = -d * 2;

                casted.nextDirection = Enums.Directions.LEFT;
            }
            else if (c == 39) { //right
                // if (this.currentUiElement.direction != "R") {
                //     this.currentUiElement.direction = "R";
                // }
                // else{
                //     this.currentUiElement.vx = d * 2;
                // }

                //this.currentUiElement.vx = d * 2;
                casted.nextDirection = Enums.Directions.RIGHT;
            }
            else if (c == 38) { //up
                // if (this.currentUiElement.direction != "U") {
                //     this.currentUiElement.direction = "U";
                // }
                // else{
                //     this.currentUiElement.vy = d * 2;
                // }

                //this.currentUiElement.vy = d * 2;
                casted.nextDirection = Enums.Directions.UP;
            }
            else if (c == 40) { //down
                // if (this.currentUiElement.direction != "D") {
                //     this.currentUiElement.direction = "D";
                // }
                // else{
                //     this.currentUiElement.vy = -d * 2;
                // }

                //this.currentUiElement.vy = -d * 2;
                casted.nextDirection = Enums.Directions.DOWN;

            }
            
            if(!casted.direction){
                //casted.direction = casted.nextDirection;
            }
        };

        moveLogic(_prey);
    };

    document.onkeyup = function (e) {
        onkey(0, e);
    };
    document.onkeydown = function (e) {
        onkey(1, e);
    };
}

var mainloop = function () {
    var ctx = c.getContext("2d");

    updateGame(); //update arrays + logic
    drawGame(ctx); //draw game with updated info

    //currentSeconds();


    ctx.globalAlpha = GameCfg.opacity;

    //Draw.hpBar(ctx);
    Draw.levelInit(levelMatrix, ctx);
};

function initGame() {
    levelMatrix = Level.level01();
    //console.log('inited Game');

    var eater = Eater(13, 16);
    

    _prey = eater;
    
    var addGhost = function(x, y, timer){
        
        var handler = function(){
            var g1 = Ghost(x,y);
            
            g1.target1 = _prey;
            g1.target2 = null; 
            
            movingElements.push(g1);    
        };
        
        //window.setInterval(handler, timer);
        handler();
    };
    
    
    
    movingElements.push(eater);
    var ctx = c.getContext("2d");
    
    // addGhost(23,1, 2000);
    // addGhost(5,1, 4000);
}

function clearScreen(ctx) {
    //ctx.clearRect
}

function updateGame() {
    frameCount++;
}

function drawGame(ctx) {
    Draw.cells(validCells, ctx);
    //Draw.scoreElements(); //TODO:
    Draw.uiElements(movingElements, ctx);
    
    //Draw.uiElement(_prey, ctx);
}


var Level = {
    level01: function () {
        var map = "WWWWWWWWWWWWWWWWWWWWWWWWWWWW|WooooooooooooWWooooooooooooW|WoWWWWoWWWWWoWWoWWWWWoWWWWoW|WoWWWWoWWWWWooooWWWWWoWWWWoW|WoWWWWoWWWWWoWWoWWWWWoWWWWoW|WooooooooooooWWooooooooooooW|WoWWWWoWWoWWWWWWWWoWWoWWWWoW|WooooooWWooooWWooooWWooooooW|WWoWWWoWWWWWoWWoWWWWWoWWWoWW|WWoWWWoWWWWWoWWoWWWWWoWWWoWW|WooWWWooooooooooooooooWWWooW|WoWWWWoWWoWWwwwwWWoWWoWWWWoW|WoWWWWoWWoWWwwwwWWoWWoWWWWoW|WooooooWWoWWWWWWWWoWWooooooW|WoWWWWoWWoWWWWWWWWoWWoWWWWoW|WoWWWWoWWoWWWWWWWWoWWoWWWWoW|WooWWWoWWooooooooooWWoWWWooW|WWoWWWoWWoWWWWWWWWoWWoWWWoWW|WWoWWWoWWoWWWWWWWWoWWoWWWoWW|WooooooooooooooooooooooooooW|WoWWWWoWWWWWoWWoWWWWWoWWWWoW|WoWWWWoWWWWWoWWoWWWWWoWWWWoW|WooWWWoooooooWWoooooooWWWooW|WWoWWWoWWoWWWWWWWWoWWoWWWoWW|WWoWWWoWWoWWWWWWWWoWWoWWWoWW|WooooooWWooooWWooooWWooooooW|WoWWWWoWWWWWoWWoWWWWWoWWWWoW|WoWWWWoWWWWWoWWoWWWWWoWWWWoW|WooooooooooooooooooooooooooW|WWWWWWWWWWWWWWWWWWWWWWWWWWWW";

        return Level.parseLevel(map);;
    }
    , parseLevel: function (map) {
        var lclLevelMatrix = [];

        var splitted = map.split(GameCfg.lineBreakToken);

        for (var columnIndex = 0; columnIndex < splitted.length; columnIndex++) {
            var column = splitted[columnIndex]; //returns char[]
            for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
                var cellType = column[rowIndex];
                var cell = Cell(rowIndex, columnIndex, cellType);
                lclLevelMatrix.push(cell);
                
                var isValidCell = (cellType == Enums.UiElements.dot
                    || cellType == Enums.UiElements.eater
                    || cellType == Enums.UiElements.powerup); 
                if(isValidCell){
                    validCells.push(cell);
                }
                    
                if(cellType == Enums.UiElements.eater 
                    || cellType == Enums.UiElements.ghost) {
                    movingElements.push(cell);
                }
            }
        }
        return lclLevelMatrix;
    }
}

var Draw = {
//     hpBar: function (ctx) {
//         for (var i = 0; i < 5; i++) {
//             if (true)
//                 ctx.fillStyle = Enums.Colors.blue;
//             else
//                 ctx.fillStyle = Enums.Colors.red;
//             ctx.fillRect(100 + i * 25, 16, 15, 15);
//         }
// 
//     },
    cells: function(matrix, ctx){
        Draw.levelInit(matrix, ctx);
    },
    cell: function(element, ctx, secondCall){
        var casted = Cell('','','');
        casted = element; 

        if (element.cType == "W") {
            
            ctx.fillStyle = Enums.Colors.blue;
            
        } else if (element.cType == "w") {
            ctx.fillStyle = Enums.Colors.darkBlue;
        } else if (element.cType == "o") {
            ctx.fillStyle = Enums.Colors.white;
        }
        else {
            ctx.fillStyle = Enums.Colors.red;
            //continue;
            return;
        }

        var length = GameCfg.uiElementsLength;
            
            var minus = 0;
            if(secondCall){
                minus = 5;
            }
            
        var tempx = length * element.x;
        var tempy = length * element.y;
        ctx.fillRect(tempx, tempy, length-minus, length);
    },
    levelInit: function (matrix, ctx) {
        if (matrix && matrix.length > 0) {
            for (var index = 0; index < matrix.length; index++) {
                var element = matrix[index];
// 
//                 if (element.cType == "W") {
//                     ctx.fillStyle = Enums.Colors.blue;
//                 } else if (element.cType == "w") {
//                     ctx.fillStyle = Enums.Colors.darkBlue;
//                 }
//                 else {
//                     ctx.fillStyle = Enums.Colors.red;
//                     continue;
//                 }
// 
//                 var length = GameCfg.uiElementsLength;
// 
//                 var tempx = length * element.x;
//                 var tempy = length * element.y;
//                 ctx.fillRect(tempx, tempy, length, length);

                Draw.cell(element, ctx);
            }
        }
    },
    
    uiElement: function(uiElem, ctx) {
        ctxHelper.fillRect(uiElem, ctx);  
    }

    // , eater: function(ctx, x, y) {
    //     ctx.fillStyle = Enums.Colors.yellow;
    //     ctx.fillRect(x, y, length, length);
    // }
    , uiElements: function (uiElementsList, ctx) {
        for (var i in uiElementsList) {
            var currElem = UiElement('','','');
            currElem = uiElementsList[i];
            

            var old = currElem;
            var movedElement = AI.Move(currElem);
            
            
            if(currElem.cType != Enums.UiElements.eater){
                var breakAvr = true;
                var tst = "current: x= " + currElem.x + "; y="+ currElem.y + "; moved: x=" + movedElement.x + " y=" + movedElement.y;
            }
            
            // logEveryFrameX('FromX: ' + currElem.x + " FromY: " + currElem.y, 60);
            // logEveryFrameX('To__X: ' + movedElement.x + " To__Y: " + movedElement.y, 60);
             logEveryFrameX('CurrDir: ' + currElem.direction, 60);
             logEveryFrameX('NextDir: ' + movedElement.nextDirection, 60);
            
            var checkFuture = true && currElem.direction != movedElement.nextDirection;
            if(isNextPositionValid(currElem, movedElement, checkFuture)){
                //var mapElement = levelMatrix[currElem.cellX, currElem.cellY];
                var mapElement = getCellFromUiElement(levelMatrix, currElem);
                //Draw.cell(mapElement, ctx, true);
                
                
                currElem.x = movedElement.x;
                currElem.y = movedElement.y;
                currElem.vx = movedElement.vx;
                currElem.vy = movedElement.vy;
                
                //currElem.direction = currElem.direction;
                if(currElem.direction != movedElement.nextDirection){
                    currElem.direction = movedElement.nextDirection;
                    currElem.nextDirection = movedElement.nextDirection;
                }

                    
            }else{
                //console.log('position not allowed!');
                logEveryFrameX('position not allowed!', 60);
            }
            
            Draw.uiElement(currElem, ctx);
            
            var next = Object.create( currElem );//UiElement('','','');
            
            // next.x += next.vx;
            // next.y += next.vy;            
            // if(isNextPositionValid(currElem, next, false)){
            //     currElem.x += currElem.vx;
            //     currElem.y += currElem.vy;
            // }
            
            

            //uiElementsList[i] = movedElement;

            continue;
            // if(currElem.eType == UiElements.eater){
            //     
            // }



            //elementsList[i].shape.isCollision = false; //reset collision;
            //var elem = moveElement(uiElementsList[i], c);
            if (elem != null) {
                //currShape = iShape.shape;

                if (showBoundingBoxs) {
                    //ctx.fillStyle = getFill(currShape);
                    //ctx.fillRect(currShape.x, currShape.y, currShape.w, currShape.h);
                }

                //write(iShape);
            }
        }
        
        
        //Debug.writeText(ctx, 10, 10, "teste", "avr");
    }
}

function calcNextPosition(element, allowDirectionChanging) {
    var casted = UiElement('', '', ''); //dummy
    //casted = element;
    casted = Object.create( element );

    //console.log("casted.x: " + casted.x);
    // console.log("casted.y: " + casted.y);
    // console.log("casted.Dir: " + casted.direction);
    // console.log("casted.NextDir: " + casted.nextDirection);

    //console.log("xStuff: " + casted.x / GameCfg.uiElementsLength);
    //console.log("yStuff: " + casted.y / GameCfg.uiElementsLength);

    //console.log('direction: ' + casted.direction, '; next: ' + casted.nextDirection);
    // casted.y += GameCfg.ghostVx;


    if (casted.direction != casted.nextDirection) {
        switch (casted.nextDirection) {
            case Enums.Directions.DOWN:
                casted.vx = 0;
                casted.vy = GameCfg.ghostVx;
                break;
            case Enums.Directions.LEFT:
                casted.vy = 0;
                casted.vx = GameCfg.ghostVx * -1;
                break;
            case Enums.Directions.RIGHT:
                casted.vy = 0;
                casted.vx = GameCfg.ghostVx;
                break;
            case Enums.Directions.UP:
                casted.vx = 0;
                casted.vy = GameCfg.ghostVx*-1;
                break;
            default:
                break;
                
                //casted.direction = casted.nextDirection;
        }
    }
    
    casted.x += casted.vx;
    casted.y += casted.vy;
    
    return casted;
}

function isNextPositionValid(currentPosition, nextPosition, checkFuture) {
    var castedNextPos = UiElement('','',''); castedNextPos = nextPosition;
    var castedCurrentPos = UiElement('','',''); castedCurrentPos = currentPosition;
    
    var xDiff = castedNextPos.x - castedCurrentPos.x;
    var yDiff = castedNextPos.y - castedCurrentPos.y;
    
    // var p1 = castedNextPos.x;
    // var p2 = castedNextPos.x + (xDiff * GameCfg.uiElementsLength);
    // var p3 = castedNextPos.y;
    // var p4 = castedNextPos.y + (yDiff * GameCfg.uiElementsLength);
    
    var nextCellMinusOne = -1;
    
    var p1 = castedNextPos.x;
    var p2 = castedNextPos.x + GameCfg.uiElementsLength -1;
    var p3 = castedNextPos.y;
    var p4 = castedNextPos.y + GameCfg.uiElementsLength -1;
    
    var p1valid, p2valid, p3valid, p4valid = false;
    //var p1p2valid, p2p3valid, p3p4valid, p4p1valid = false;
    
    var minCellX, minCellY;
    var maxCellX, maxCellY;
    
    
    
    
    minCellX = Math.floor(castedNextPos.x / GameCfg.uiElementsLength);
    minCellY = Math.floor(castedNextPos.y / GameCfg.uiElementsLength);
    
    
    //var auxMultiple = castedNextPos.x + GameCfg.uiElementsLength;
    maxCellX = Math.floor( (castedNextPos.x + GameCfg.uiElementsLength + nextCellMinusOne) / GameCfg.uiElementsLength);
    maxCellY = Math.floor( (castedNextPos.y + GameCfg.uiElementsLength + nextCellMinusOne) / GameCfg.uiElementsLength);
    
    var foundMin, foundMax = false;
    // if(xDiff != 0)
    // {
    //     var xx = castedNextPos.x;
    //     if(xDiff > 0){
    //         xx = castedNextPos.x + GameCfg.uiElementsLength + nextCellMinusOne;
    //     }
    //     
    //     minCellY = Math.floor(castedNextPos.y / GameCfg.uiElementsLength);
    //     minCellX = Math.floor(xx / GameCfg.uiElementsLength);
    //     foundMax = true;        
    // }
    // else if (yDiff != 0)
    // {
    //     var yy = castedNextPos.y;
    //     
    //     if(yDiff > 0){
    //         yy = castedNextPos.y + GameCfg.uiElementsLength + nextCellMinusOne;
    //     }
    //     
    //     minCellX = Math.floor(castedNextPos.x / GameCfg.uiElementsLength);
    //     minCellY = Math.floor(yy / GameCfg.uiElementsLength);
    //     foundMax = true;      
    //     
    //     // minCellX = Math.floor(castedNextPos.x / GameCfg.uiElementsLength);
    //     // minCellY = Math.floor(castedNextPos.y / GameCfg.uiElementsLength);
    //     // 
    //     // maxCellX = Math.floor( (castedNextPos.x + GameCfg.uiElementsLength) / GameCfg.uiElementsLength);
    //     // maxCellY = Math.floor( (castedNextPos.y + GameCfg.uiElementsLength) / GameCfg.uiElementsLength);
    // }
    
    // var try2 = function(){
    //     if(!foundMin){
    //             if(cell.x == minCellX && cell.y == minCellY){
    //                 foundMin = true;
    //             }
    //         }
    //     
    //         if(!foundMax){
    //             if(cell.x == maxCellX && cell.y == maxCellY){
    //                 foundMax = true;
    //             }
    //         }
    //         
    //         if(foundMin && foundMax){
    //             //break;
    //         }
    // }    
    // }
    
    var isValid = function(x, y, cell){
        return cell.x == x && cell.y == y;
    };
    
    for (var index = 0; index < validCells.length; index++) {
        var cell = Cell('','',''); 
        cell = validCells[index];
        

            //CALC p1 (x):
            var p1CellX = Math.floor(p1 / GameCfg.uiElementsLength);
            var p1CellY = Math.floor(castedNextPos.y / GameCfg.uiElementsLength);
            
            //CALC p2 (x + len):
            var p2CellX = Math.floor(p2 / GameCfg.uiElementsLength);
            var p2CellY = Math.floor(castedNextPos.y / GameCfg.uiElementsLength);
            
            //CALC p3 (y):
            var p3CellX = Math.floor(castedNextPos.x / GameCfg.uiElementsLength);
            var p3CellY = Math.floor(p4 / GameCfg.uiElementsLength);
            
            //CALC p2 (x p len):
            var p4CellX = Math.floor(p2 / GameCfg.uiElementsLength);
            var p4CellY = Math.floor(p4 / GameCfg.uiElementsLength);
        
            //try2();
            
            if(!p1valid){
                if(isValid(p1CellX, p1CellY, cell)){
                    p1valid = true;
                }
            }
            
            if(!p2valid){
                if(isValid(p2CellX, p2CellY, cell)){
                    p2valid = true;
                }
            }
            
            if(!p3valid){
                if(isValid(p3CellX, p3CellY, cell)){
                    p3valid = true;
                }
            }
            
            if(!p4valid){
                if(isValid(p4CellX, p4CellY, cell)){
                    p4valid = true;
                }
            }
            
//         var xi = cell.x * GameCfg.uiElementsLength;
//         var xf = cell.x * GameCfg.uiElementsLength + GameCfg.uiElementsLength;
//         
//         var yi = cell.y * GameCfg.uiElementsLength;
//         var yf = cell.y * GameCfg.uiElementsLength + GameCfg.uiElementsLength;
//         
//         if(cell.x == 12 && cell.y == 16){
//             console.log('avr;');
//         }
// 
// 
//         
//         // var pointAx = Math.floor(p1 / GameCfg.uiElementsLength);
//         // var pointAy = Math.floor(p1 / GameCfg.uiElementsLength);
//                 
        if(p1valid && p2valid && p3valid && p4valid){
            break;
        }
    }
    
    //return foundMin && foundMax;
    return p1valid && p2valid && p3valid && p4valid;
    
}

function isNextPositionValid2(currentPosition, nextPosition, checkFuture) {
    var castedCurrentPos = UiElement('','','');
    var castedNextPos = UiElement('','','');
    
    castedCurrentPos = currentPosition;
    castedNextPos = nextPosition;
    
    var xDiff = castedNextPos.x - castedCurrentPos.x;
    var yDiff = castedNextPos.y - castedCurrentPos.y;
    
    //var validCells = [];
    //validCells = getValidCellsToMoveTo(castedCurrentPos, castedNextPos);
    
    var floorOrCeilLogic = (function(diff) {
            if(diff >= 0){
                return function(arg){
                    return Math.floor(arg);
                };
            }else{
                return function(arg){
                    return Math.ceil(arg);
                };
            }
        });
    
    var msg01 = "xDiff: " + xDiff + "; yDiff: " + yDiff;
    Debug.debugMessage(1, msg01);
    var msg02 = "(castedNextPos.DIR: "+ castedNextPos.direction + ";  castedNextPos.NDIR: " + castedNextPos.nextDirection + "); --||-- (castedCurrentPos.DIR: " + castedCurrentPos.direction + "; castedCurrentPos.NDIR: " + castedCurrentPos.nextDirection + ")";
    Debug.debugMessage(2, msg02);
    
    var msg03 = "castedCurrentPos.x: " + castedCurrentPos.x + "; castedNextPos.x: " + castedNextPos.x
    + "castedCurrentPos.y: " + castedCurrentPos.y + "; castedNextPos.y: " + castedNextPos.y;
    Debug.debugMessage(3, msg03);
    
    var xDiffManual = 0;
    var yDiffManual = 0;
    
    if(castedNextPos.nextDirection == Enums.Directions.RIGHT || castedCurrentPos.direction == Enums.Directions.RIGHT){
        xDiffManual = 1;
    }else if (castedNextPos.nextDirection == Enums.Directions.LEFT || castedCurrentPos.direction == Enums.Directions.LEFT){
        xDiffManual = -1;
    }
    
    if(castedNextPos.nextDirection == Enums.Directions.UP || castedCurrentPos.direction == Enums.Directions.UP){
        yDiffManual = -1;
    }else if (castedNextPos.nextDirection == Enums.Directions.DOWN || castedCurrentPos.direction == Enums.Directions.DOWN){
        yDiffManual = 1;
    }
    
    var msg04 = "xDiffManual: " + xDiffManual + "; yDiffManual: " + yDiffManual;
    //msg04 = "COUNTER:" + counter;;
    Debug.debugMessage(4, msg04);
    
    
    var moveLogicX = floorOrCeilLogic(xDiffManual);
    var moveLogicY = floorOrCeilLogic(1*yDiffManual);
    
    
    var cellToFind = Cell('','','');
    if(Math.abs(xDiff) >= 1) {
        //cellToFind.y = Math.floor(castedNextPos.y/GameCfg.uiElementsLength);
        cellToFind.y = moveLogicY((castedNextPos.y - yDiff)/GameCfg.uiElementsLength) + yDiff;
        cellToFind.x = moveLogicX((castedNextPos.x - xDiff)/GameCfg.uiElementsLength) + xDiff;
    }
    
    if(Math.abs(yDiff) >= 1){
        //cellToFind.x = Math.ceil(castedNextPos.x/GameCfg.uiElementsLength);
        cellToFind.x = moveLogicX((castedNextPos.x - xDiff)/GameCfg.uiElementsLength) + xDiff;
        cellToFind.y = moveLogicY((castedNextPos.y - yDiff)/GameCfg.uiElementsLength) + yDiff;
    }
    
    
    for (var index = 0; index < validCells.length; index++) {
        var cell = Cell('','',''); 
        cell = validCells[index];
        
        // if(isValidCellToMoveTo(castedCurrentPos, castedNextPos, cell)){
        //     return true;  
        // }
        if(cell.x == cellToFind.x && cell.y == cellToFind.y){
            
            if(checkFuture){
                counter++;
                var mmsg = "DiffX: " + xDiff + "; cell.x: " + cell.x + "; cell.y: " + cell.y;
                logEveryFrameX(mmsg, 60);
                if(counter == 100){
                    //alert(mmsg + "; Counter: " + counter);
                }
            }
            return true;
        }
    }
    
    return false;
}

// function isValidCellToMoveTo(currentPosition, nextPosition, cell){
//     var castedCurrentPos = UiElement('','','');
//     var castedNextPos = UiElement('','','');
//     
//     var validX = (castedCurrentPos.x >= cell.x)  
//         && (castedNextPos.x + GameCfg.uiElementsLength >= cell.x + GameCfg.uiElementsLength) 
//         && (cell.y == castedCurrentPos.y)
//         && (cell.cType != Enums.UiElements.wall);
// 
//         return validX;
//     
// }

// function getValidCellsToMoveTo(currentPosition, nextPosition){
//     var castedCurrentPos = UiElement('','','');
//     var castedNextPos = UiElement('','','');
//     
//     castedCurrentPos = currentPosition;
//     castedNextPos = nextPosition;
//     
//     var validCells = [];
//     for (var index = 0; index < levelMatrix.length; index++) {
//         var cell = Cell('','','');
//         cell = levelMatrix[index];
//         
//         
//         if(isValidCellToMoveTo(castedCurrentPos, castedNextPos, cell)){
//             validCells.push(cell);
//         }
//         
//         //else if()
//         
//     }
//     
//     return validCells;
// }


function Shape(x, y, w, h, fill, vx, vy, name) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
    this.vx = vx;
    this.vy = vy;
    this.name = name;
    this.isCollision = false;
    this.ignoreRightBottomCanvas = true;
}

function Cell(x, y, cType) {
    return { "x": x, "y": y, "cType": cType };
}

function UiElement(x, y, eType) {
    var vx = 0; //GameCfg.ghostVx;
    var vy = 0; //GameCfg.ghostVx;

    return { 
        "cellX": x, 
        "cellY": y, 
        "x": x*GameCfg.uiElementsLength, 
        "y": y*GameCfg.uiElementsLength, 
        "cType": eType, 
        "length": GameCfg.uiElementsLength, 
        "vx": vx, 
        "vy": vy, 
        "direction": null, 
        "nextDirection": null, 
        //"nextDirectionToBe": null,
        "fill": Enums.Colors.blue
         
        };
}


function Eater(x, y) {
    var elem = UiElement(x, y, Enums.UiElements.eater);
    elem.fill = Enums.Colors.black;
    //elem.vx = GameCfg.eaterVx;
    //elem.vy = GameCfg.eaterVx

    return elem;
}

function Ghost(x, y, eType) {
    var elem = UiElement(x, y, eType);
    elem.fill = Enums.Colors.red;
    elem.cType = Enums.UiElements.ghost;

    elem.target1 = null;
    elem.target2 = null;
    
    return elem;
}

function logEveryFrameX(val, frameX) {
    if (frameCount % frameX == 0 || frameCount == 1 || frameX == undefined) {
        console.log(val);
    }
}

var ctxHelper = {
    fillRect: function(uiElem, ctx){
        var oldStyle = ctx.fillStyle;
        ctx.fillStyle = uiElem.fill;
        ctx.fillRect(uiElem.x, uiElem.y, uiElem.length, uiElem.length); 
        ctx.fillStyle = oldStyle;
    }   
}

function getCellFromUiElement(matrix, elem){
    var castedElem = UiElement('','','');
    castedElem = elem;
    for (var index = 0; index < matrix.length; index++) { 
        var cell = matrix[index];
        if(cell.x == castedElem.cellX && cell.y == castedElem.cellY){
            return cell;
        }   
    }
    return null;   
}

var Debug = {
    addLi: function(name, value){
        var li = document.createElement("li"); 
        var liInnerHtml = document.createTextNode(name + ": " + value);
        li.appendChild(liInnerHtml);
        document.getElementById('debugUl').appendChild(li);
    },
    writeText: function(ctx, x, y, name, value){
        var oldStyle = ctx.fillStyle;
        ctx.fillText(name + ": " + value, 20, 20); 
        ctx.fillStyle = oldStyle;
    },
    debugMessage: function(count, message){        
        var divId = "divDebug0" + count;
        var debugDiv = document.getElementById(divId);
        debugDiv.innerText = message;
    }
}

var AI = {
    Move: function(elem){
        var casted = UiElement('','','');
        casted = elem;
        
        if(casted.cType == Enums.UiElements.ghost){
            return AI.MoveGhost(elem);
        }else{
            return AI.MoveEater(elem);
        }
    },
    
    MoveGhost: function(elem){
        var casted = UiElement('','',''); casted = casted = Object.create( elem );
        var target = UiElement('','',''); target = casted.target1;
        
        
        var calcMiddle = function(value) {
            return value + (GameCfg.uiElementsLength / 2);
        };
            
        
        var targetMiddleX = calcMiddle(target.x); 
        var targetMiddleY = calcMiddle(target.y);
        
        var elemMiddleX = calcMiddle(casted.x);
        var elemMiddleY = calcMiddle(casted.y);

        var xDiff = elemMiddleX - targetMiddleX;
        var yDiff = elemMiddleY - targetMiddleY;
        
        if(Math.abs(xDiff) > 0 && elem.vx == 0){
            if(xDiff < 0){
                casted.nextDirection = Enums.Directions.RIGHT;
                casted.vx = GameCfg.ghostVx;
                casted.vy = 0;
            }else{
                casted.nextDirection = Enums.Directions.LEFT;
                casted.vx = GameCfg.ghostVx*-1;
                casted.vy = 0;
            }
        }else if(Math.abs(yDiff) > 0 && elem.vy == 0){
            if(yDiff < 0){
                casted.nextDirection = Enums.Directions.DOWN;
                casted.vy = GameCfg.ghostVx;
                casted.vx = 0;
            }else{
                casted.nextDirection = Enums.Directions.UP;
                casted.vy = GameCfg.ghostVx*-1;
                casted.vx = 0;
            }
        }
        
        //if it's the first time
        if(!casted.direction){
            casted.direction = casted.nextDirection;
        }
        
        casted.x += casted.vx;
        casted.y += casted.vy;
        
        return casted;
    },
    
    MoveEater: function(elem){
        var currElem = UiElement('','',''); currElem = elem;
        return calcNextPosition(currElem, true);
    }
}