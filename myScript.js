var GameCfg = {
    uiElementsLength: 25,
    lineBreakToken: '|',
    showBoundingBoxs: false,

    eaterVx: 2,
    ghostVx: 1
}

window.onload = function () {
    init();
    console.log(123);
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
        var moveLogic = function () {
            if (!e) e = window.e;
            var c = e.keyCode;
            if (e.charCode && c == 0)
                c = e.charCode;


            var casted = UiElement('', '', ''); //dummy 
            if (c == 37) { //left
                // if (this.currentUiElement.direction != "L") {
                //     this.currentUiElement.direction = "L";
                //     this.currentUiElement.vx = 0;
                // }
                // else{
                //     this.currentUiElement.vx = -d * 2;
                // }

                console.log('left!!');
                //this.currentUiElement.vx = -d * 2;

                casted.nextDirection = Enums.Directions.LEFT;
                console.log(casted);

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
        };

        moveLogic()
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


    ctx.globalAlpha = opacity;

    //Draw.hpBar(ctx);
    Draw.level(levelMatrix, ctx);
};

function initGame() {
    levelMatrix = Level.level01();
    console.log('inited Game');

    var eater = Eater(13, 16);
    shapeList.push(eater);

    currentUiElement = eater;
}

function clearScreen(ctx) {
    //ctx.clearRect
}

function updateGame() {

}

function drawGame(ctx) {
    Draw.uiElements(ctx, shapeList);
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
                lclLevelMatrix.push(Cell(rowIndex, columnIndex, cellType));
            }
        }
        return lclLevelMatrix;
    }
}

var UiElements = {
    eater: "eater",
    ghost: "ghost",
    dot: "dot",
    powerup: "powerup"
}

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
        red: "#a90000"
    }
}

var Draw = {
    hpBar: function (ctx) {
        for (var i = 0; i < 5; i++) {
            if (true)
                ctx.fillStyle = Enums.Colors.blue;
            else
                ctx.fillStyle = Enums.Colors.red;
            ctx.fillRect(100 + i * 25, 16, 15, 15);
        }

    }

    , level: function (matrix, ctx) {
        if (matrix && matrix.length > 0) {
            for (var index = 0; index < matrix.length; index++) {
                var element = matrix[index];

                if (element.cType == "W") {
                    ctx.fillStyle = Enums.Colors.blue;
                } else if (element.cType == "w") {
                    ctx.fillStyle = Enums.Colors.darkBlue;
                }
                else {
                    ctx.fillStyle = Enums.Colors.red;
                    continue;
                }

                var length = GameCfg.uiElementsLength;

                var tempx = length * element.x;
                var tempy = length * element.y;
                ctx.fillRect(tempx, tempy, length, length);
            }
        }
    }

    // , eater: function(ctx, x, y) {
    //     ctx.fillStyle = Enums.Colors.yellow;
    //     ctx.fillRect(x, y, length, length);
    // }
    , uiElements: function (ctx, uiElementsList) {
        for (var i in uiElementsList) {
            var currElem = uiElementsList[i];
            var oldFillStyle = ctx.fillStyle;
            ctx.fillStyle = currElem.fill;
            ctx.fillRect(currElem.x, currElem.y, currElem.length, currElem.length);

            ctx.fillStyle = oldFillStyle;


            var movedElement = calcNextPosition(currElem, true);
            currElem = movedElement;

            //uiElementsList[i] = movedElement;

            return;
            // if(currElem.eType == UiElements.eater){
            //     
            // }



            //shapeList[i].shape.isCollision = false; //reset collision;
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
    casted = element;

    console.log("casted.x: " + casted.x);
    // console.log("casted.y: " + casted.y);
    // console.log("casted.Dir: " + casted.direction);
    // console.log("casted.NextDir: " + casted.nextDirection);

    console.log("xStuff: " + casted.x / GameCfg.uiElementsLength);
    //console.log("yStuff: " + casted.y / GameCfg.uiElementsLength);

     casted.x += GameCfg.ghostVx;
    // casted.y += GameCfg.ghostVx;
    return casted;

    //     if (casted.direction == casted.nextDirection) {
    //         switch (casted.direction) {
    //             case Enums.Directions.DOWN:
    //                 casted.vx = 0;
    //                 casted.vy = GameCfg.ghostVx * -1;
    //                 break;
    //             case Enums.Directions.LEFT:
    //                 casted.vy = 0;
    //                 casted.vx = GameCfg.ghostVx * -1;
    //                 break;
    //             case Enums.Directions.RIGHT:
    //                 casted.vy = 0;
    //                 casted.vx = GameCfg.ghostVx;
    //                 break;
    //             case Enums.Directions.UP:
    //                 casted.vx = 0;
    //                 casted.vy = GameCfg.ghostVx;
    //                 break;
    // 
    //             default:
    //                 break;
    //         }
    //     }
}


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
    var vx = GameCfg.ghostVx;
    var vy = GameCfg.ghostVx;

    return { "x": x, "y": y, "cType": eType, "length": GameCfg.uiElementsLength, "vx": vx, "vy": vy, "direction": null, "nextDirection": null, "fill": Enums.Colors.blue };
}

function Eater(x, y) {
    var elem = UiElement(x * GameCfg.uiElementsLength, y * GameCfg.uiElementsLength, UiElements.eater);
    elem.fill = Enums.Colors.yellow;
    elem.vx = GameCfg.eaterVx;
    elem.vy = GameCfg.eaterVx

    return elem;
}

function Ghost(x, y, eType) {
    var elem = UiElement(x, y, eType);
    elem.fill = Enums.Colors.red;

    return elem;
}