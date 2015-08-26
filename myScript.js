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
    uiElementsLength: 25,
    lineBreakToken: '|',
    showBoundingBoxs: false,
    opacity: 0.8,

    eaterVx: 2,
    ghostVx: 1
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

        moveLogic(player);
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
    

    player = eater;
    
    
    movingElements.push(eater);
    var ctx = c.getContext("2d");
}

function clearScreen(ctx) {
    //ctx.clearRect
}

function updateGame() {
    frameCount++;
}

function drawGame(ctx) {
    Draw.cells(validCells, ctx);
    Draw.uiElements(movingElements, ctx);
    Draw.uiElement(player, ctx);
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

        var tempx = length * element.x;
        var tempy = length * element.y;
        ctx.fillRect(tempx, tempy, length, length);
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
            var oldFillStyle = ctx.fillStyle;
            ctx.fillStyle = currElem.fill;
            //ctx.fillRect(currElem.x, currElem.y, currElem.length, currElem.length);

            ctx.fillStyle = oldFillStyle;

            var old = currElem;
            var movedElement = calcNextPosition(currElem, true);
            
            logEveryFrameX('FromX: ' + currElem.x + " FromY: " + currElem.y, 60);
            logEveryFrameX('To__X: ' + movedElement.x + " To__Y: " + movedElement.y, 60);
            
            if(isNextPositionValid(currElem, movedElement)){
                //var mapElement = levelMatrix[currElem.cellX, currElem.cellY];
                var mapElement = getCellFromUiElement(levelMatrix, currElem);
                Draw.cell(mapElement, ctx);
                
                currElem.x = movedElement.x;
                currElem.y = movedElement.y;
                currElem.vx = movedElement.vx;
                currElem.vy = movedElement.vy;
            }else{
                //console.log('position not allowed!');
                logEveryFrameX('position not allowed!', 60);
            }
            

            //uiElementsList[i] = movedElement;

            return;
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
                
                casted.direction = casted.nextDirection;
        }
    }
    
    casted.x += casted.vx;
    casted.y += casted.vy;
    
    return casted;
}

function isNextPositionValid(currentPosition, nextPosition){
    var castedCurrentPos = UiElement('','','');
    var castedNextPos = UiElement('','','');
    
    castedCurrentPos = currentPosition;
    castedNextPos = nextPosition;
    
    var xDiff = castedNextPos.x - castedCurrentPos.x;
    var yDiff = castedNextPos.y - castedCurrentPos.y;
    
    //var validCells = [];
    //validCells = getValidCellsToMoveTo(castedCurrentPos, castedNextPos);
    
    var cellToFind = Cell('','','');
    if(Math.abs(xDiff) >= 1 || Math.abs(yDiff) >= 1){
        cellToFind.x = Math.floor(castedNextPos.x/GameCfg.uiElementsLength) + xDiff;
        cellToFind.y = Math.floor(castedNextPos.y/GameCfg.uiElementsLength) + yDiff;
    }
    
    for (var index = 0; index < validCells.length; index++) {
        var cell = Cell('','',''); 
        cell = validCells[index];
        
        // if(isValidCellToMoveTo(castedCurrentPos, castedNextPos, cell)){
        //     return true;  
        // }
        if(cell.x == cellToFind.x && cell.y == cellToFind.y){
            return true;
        }
    }
    
    return false;
}

function isValidCellToMoveTo(currentPosition, nextPosition, cell){
    var castedCurrentPos = UiElement('','','');
    var castedNextPos = UiElement('','','');
    
    var validX = (castedCurrentPos.x >= cell.x)  
        && (castedNextPos.x + GameCfg.uiElementsLength >= cell.x + GameCfg.uiElementsLength) 
        && (cell.y == castedCurrentPos.y)
        && (cell.cType != Enums.UiElements.wall);

        return validX;
    
}

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

    return { "cellX": x, "cellY": y, "x": x*GameCfg.uiElementsLength, "y": y*GameCfg.uiElementsLength, "cType": eType, "length": GameCfg.uiElementsLength, "vx": vx, "vy": vy, "direction": null, "nextDirection": null, "fill": Enums.Colors.blue };
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