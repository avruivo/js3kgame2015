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
        white: "#FFFFFF",
        pink: "#FF99FF",
        aqua: "#33CCFF",
        green: "#33CC00"
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
    scoreLength: 3,
    lineBreakToken: '|',
    showBoundingBoxs: false,
    opacity: 0.8,

    eaterVx: 2,
    ghostVx: 1,
    lives: 3,
    normalCellScore: 1,
    xlCellScore: 2,
    chaseTimeSeconds: 8
}

var Context = {
    eaterPlan: [],
    currentBoardScore: 0,
    debug: true
}

var GameLogic = {
    isChaseTime: false,
    setChaseTimeOn: function(value, movingElements, validCells){
       if(value){
           document.body.style.backgroundColor = Enums.Colors.red;
           GameLogic.isChaseTime = true;
           
       } else{
           document.body.style.backgroundColor = Enums.Colors.darkBlue;
           GameLogic.isChaseTime = false;
       }
       
       for (var elemIndex = 0; elemIndex < movingElements.length; elemIndex++) {
           var ghost =  UiElement('','',''); ghost = movingElements[elemIndex];
           if(ghost.cType == Enums.UiElements.ghost){
               if(value){ //set chase time on
                   if(ghost.target1.cType != Enums.UiElements.eater){
                        if(Context.debug){
                            ghost.target1.fill = Enums.Colors.white;
                        }
                   }
                   ghost.target1 = _prey;
                   //old.fill = Enums.Colors.white;
               }else{
                   var generateRandomTarget = function(){
                       
                       var newTargetIndex = getRandomInt(0, validCells.length-1);
                       var newTargetCell = validCells[newTargetIndex];
                       if(Context.debug){
                        newTargetCell.fill = ghost.fill;
                       }
                       
                       var newTarget = UiElement(newTargetCell.x, newTargetCell.y, Enums.UiElements.dot);
                       ghost.target1 = newTarget;
                   };
                   
                   generateRandomTarget();
               }
           }
       }
    },
    checkColision: function(s1, s2) {
        var casted1 = UiElement('','',''); casted1 = s1; 
        var casted2 = UiElement('','',''); casted2 = s2;
       
    if (casted1.x < casted2.x + casted2.length &&
        casted1.x + casted1.length > casted2.x &&
        casted1.y < casted2.y + casted2.length &&
        casted1.length + casted1.y > casted2.y) {
        return true;
    }    
    // if (s1.x < s2.x + s2.w &&
    //     s1.x + s1.w > s2.x &&
    //     s1.y < s2.y + s2.h &&
    //     s1.h + s1.y > s2.y) {
    //     return true;
    // }
    return false;
    
    },
    checkCollisions: function(movingElements, validCells){
        for (var elem1index = 0; elem1index < movingElements.length; elem1index++) {
            var elem1 = UiElement('','',''); elem1 = movingElements[elem1index];
            
            if(!elem1.IsCollided){
                for (var elem2index = 0; elem2index < movingElements.length; elem2index++) {
                    if(elem1index != elem2index)
                    {
                        var elem2 = UiElement('','',''); elem2 = movingElements[elem2index];
                        
                        var msg = "'"+ elem1.DebugName +"' has collided with '"+ elem2.DebugName +"'.";
                        if(elem1.cType == Enums.UiElements.eater 
                            || elem2.cType == Enums.UiElements.eater){
                            
                            var isCollision = GameLogic.checkColision(elem1, elem2);
                            
                            if(isCollision){
                                elem1.hit(elem2);
                            }
                        }
                    }
                    
                    //if is eater, then check score collisions
                    if(elem1.cType == Enums.UiElements.eater){
                        for (var cells = 0; cells < validCells.length; cells++) {
                            var cell = Cell('','',''); cell = validCells[cells];
                            if(cell.score > 0){
                                if(elem1.x == 180 && elem1.y == 320 && cell.x == 9 && cell.y == 16){
                                    console.log(123);
                                }
                                
                                var dot = scoreElementFromCell(cell.x, cell.y) //scoreElementFromCell(cell.x, cell.y);
                                
                                var isCollision2 = GameLogic.checkColision(elem1, dot);
                                
                                if(isCollision2){
                                    if(cell.cType == Enums.UiElements.powerup){
                                        //alert(123);
                                    }
                                    totalScore += cell.score;
                                    cell.score = 0;
                                }
                            }
                            
                        }
                    }
                }
            }
        }
            
            //currentUiElement
    },
    
    gameOver: function(){
        clearMainInterval();
        alert("Game is over!");
    },
    // generateEaterPlan: function(){
    //     //1 - NW
    //     //2 - SW
    //     //3 - NE
    //     //4 - SE
    //     for (var index = 0; index < 4; index++) {
    //         
    //         getRandomInt()
    //     }
    // }
}

// function scoreElementFromUiElement(x, y){
//     return scoreElementFromUiElement(x* GameCfg.uiElementsLength, y* GameCfg.uiElementsLength); 
// }

function scoreElementFromCell(x, y, isXl){
    var tempx = (x + (1/2));
    var tempy = (y + (1/2));
    
    var length = GameCfg.scoreLength;
    var ctype = Enums.UiElements.dot;
    
    if(isXl){
        length = length*3;
        ctype = Enums.UiElements.powerup;
    }
    
    var elem = UiElement(tempx, tempy, ctype);
    //elem.cellX = elem.x * GameCfg.uiElementsLength;
    //elem.cellY = elem.y * GameCfg.uiElementsLength;
    elem.length = length;
    
    return elem;
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
    
    //LEFT
    document.getElementById("btnLeft").addEventListener('click', function () {
        _prey.nextDirection = Enums.Directions.LEFT;
    }, false);
    document.getElementById("btnLeft").parentElement.addEventListener('click', function () {
        _prey.nextDirection = Enums.Directions.LEFT;
    }, false);
    
    //RIGHT
    document.getElementById("btnRight").addEventListener('click', function () {
        _prey.nextDirection = Enums.Directions.RIGHT;
    }, false);
    document.getElementById("btnRight").parentElement.addEventListener('click', function () {
        _prey.nextDirection = Enums.Directions.RIGHT;
    }, false);
    
    //UP
    document.getElementById("btnUp").addEventListener('click', function () {
        _prey.nextDirection = Enums.Directions.UP;
    }, false);
    document.getElementById("btnUp").parentElement.addEventListener('click', function () {
        _prey.nextDirection = Enums.Directions.UP;
    }, false);
    
    //DOWN
    document.getElementById("btnDown").addEventListener('click', function () {
        _prey.nextDirection = Enums.Directions.DOWN;
    }, false);
    document.getElementById("btnDown").parentElement.addEventListener('click', function () {
        _prey.nextDirection = Enums.Directions.DOWN;
    }, false);
}

var mainloop = function () {
    var ctx = c.getContext("2d");

Draw.levelInit(levelMatrix, ctx);

    updateGame(); //update arrays + logic
    drawGame(ctx); //draw game with updated info

    //currentSeconds();


    //ctx.globalAlpha = GameCfg.opacity;

    //Draw.hpBar(ctx);
    
};

function initGame(livesLeft) {
    //frameCount = 0;
    if(!livesLeft){
        levelMatrix = Level.level01();
    }
    //console.log('inited Game');

    var eater = Eater(13, 16);
    if(!livesLeft){
        eater.lives = GameCfg.lives;
    }else{
        eater.lives = livesLeft;
    }
    
    movingElements = [];

    _prey = eater;
    
    var addGhost = function(x, y, timer, ghostsNumber){
        
        var handler = function(){
            
            var g1 = Ghost(x, y, name);
            g1.DebugName ="Ghost" + ghostsNumber;
            
            
            if(ghostsNumber == 1){
                g1.fill = Enums.Colors.red;
            }else if(ghostsNumber == 2){
                g1.fill = Enums.Colors.pink;
            }else if(ghostsNumber == 3){
                g1.fill = Enums.Colors.aqua;
            }else if(ghostsNumber == 4){
                g1.fill = Enums.Colors.yellow;
            }
            
            g1.target1 = _prey;
            g1.target2 = null; 
            
            movingElements.push(g1);
            
            console.log(g1.DebugName + " has just spawned!"); 
        };
        
        //window.setInterval(handler, timer);
        //handler();
        setTimeout(handler, timer);
    };
    
    
    
    movingElements.push(eater);
    var ctx = c.getContext("2d");
    
    var ghostsCounter = 1;
    //addGhost(23, 1, 2000, ghostsCounter++);
    //addGhost(5,  1, 4000, ghostsCounter++);
    
    //addGhost(11, 5, 3000, ghostsCounter++);
    addGhost(15, 26, 3000, ghostsCounter++);
}

function clearScreen(ctx) {
    //ctx.clearRect
}

function updateGame() {
    frameCount++;
}

function drawGame(ctx) {
    
    Context.currentBoardScore = Draw.cells(validCells, ctx);
    
    if(Context.currentBoardScore <= 0){
        GameLogic.gameOver();
    }
    //Draw.scoreElements(validCells, ctx); //TODO:
    Draw.uiElements(movingElements, ctx);
    
    //Draw.uiElement(_prey, ctx);
    
    
    GameLogic.checkCollisions(movingElements, validCells);
    
    Draw.hpBar(ctx);
    Draw.score(ctx);
    
    //60 frames  _ 1 sec
    //x frames   _ 7 sec
    var setChaseTime = function(){
        var aux = GameCfg.chaseTimeSeconds * 60;
        if((frameCount < 60 && !GameLogic.isChaseTime)  || (frameCount % aux == 0)){
            GameLogic.setChaseTimeOn(!GameLogic.isChaseTime, movingElements, validCells);
        }
    };
    
    setChaseTime();
    Debug.writeText(ctx, 20, 17, "Lives: ", _prey.lives);
    Debug.writeText(ctx, 435, 17, "#Score: ", Context.currentBoardScore); 
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
                    
                    if(cellType == Enums.UiElements.powerup){
                        cell.score = GameCfg.xlCellScore;
                    }
                    
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
    cells: function(matrix, ctx){
        var totalBoardScore = Draw.levelInit(matrix, ctx);
        return totalBoardScore;
    },
    cell: function(element, ctx, secondCall){
        var casted = Cell('','','');
        casted = element;
        
        var hasScore = false;
        var drawScore = function(hasScore){
            if(hasScore)
            {
                var isXl = casted.cType == Enums.UiElements.powerup;
                Draw.scoreElement(element.x, element.y, isXl, ctx);
                return GameCfg.normalCellScore;
            };
            return 0;
        };
        
        var minus = 0;

        if (element.cType == "W") {
            
            ctx.fillStyle = Enums.Colors.blue;
            
        } else if (element.cType == "w") {
            ctx.fillStyle = Enums.Colors.darkBlue;
        } else if (element.cType == "o" || element.cType == "O") {
            var fill = Enums.Colors.white;
            
            if(element.cType == "O"){
                //fill = Enums.Colors.green;
            }
            
            if(element.fill && element.fill != fill){
                fill = element.fill;
                ctx.globalAlpha = 0.3;
                minus = 10;
            }else{
                ctx.globalAlpha = GameCfg.opacity;
            }
            
            ctx.fillStyle = fill;
            hasScore = (casted.score > 0);
        }
        else {
            ctx.fillStyle = Enums.Colors.red;
            //continue;
            return;
        }

        var length = GameCfg.uiElementsLength;
            
            
            if(secondCall){
                minus = 5;
            }
            
        var tempx = length * element.x;
        var tempy = length * element.y;
        ctx.fillRect(tempx, tempy, length-minus, length);
        
        return drawScore(hasScore);
        
        
    },
    scoreElement: function(x, y, isXl, ctx){
        
        
        
        var fill = Enums.Colors.red;
        var length = GameCfg.scoreLength;
        
        if(isXl){
            fill = Enums.Colors.green;
            length = length*3;
        }
        
        var scoreElem = scoreElementFromCell(x, y, isXl);
        ctxHelper.fillRect2(scoreElem.x, scoreElem.y, length, length, fill, ctx);
    },
    levelInit: function (matrix, ctx) {
        var boardScore = 0;
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

                boardScore += Draw.cell(element, ctx);
            }
        }
        return boardScore;
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
            
             //logEveryFrameX('CurrDir: ' + currElem.direction, 60);
             //logEveryFrameX('NextDir: ' + movedElement.nextDirection, 60);
            
            var checkFuture = true && currElem.direction != movedElement.nextDirection;
            if(isNextPositionValid(currElem, movedElement, checkFuture)){
                //var mapElement = levelMatrix[currElem.cellX, currElem.cellY];
                var mapElement = getCellFromUiElement(levelMatrix, currElem);
                //Draw.cell(mapElement, ctx, true);
                
                currElem.vx = movedElement.vx;
                currElem.vy = movedElement.vy;
                
                //currElem.direction = currElem.direction;
                if(currElem.direction != movedElement.nextDirection){
                    currElem.direction = movedElement.nextDirection;
                    currElem.nextDirection = movedElement.nextDirection;
                }

                    
            }else{
                //logEveryFrameX('position not allowed!', 60);
            }
            
            Draw.uiElement(currElem, ctx);
            
            var next = Object.create( currElem );//UiElement('','','');
            
             next.x += next.vx;
             next.y += next.vy;
             var isStuck = next.vx == 0 && next.vy == 0;   
             if(!isStuck && isNextPositionValid(currElem, next))
             {
                 currElem.x += currElem.vx;
                 currElem.y += currElem.vy;
             }else{
                // var xDiff = next.x - currElem.x;
                // var yDiff = next.y - currElem.y;
                // var isStuck = next.direction == next.nextDirection;
                var repeatUntilValidPosition = (currElem.cType == Enums.UiElements.ghost) 
                    //&& (xDiff == 0) && (yDiff == 0);
                    //&& isStuck
                    ;
                    
                if(repeatUntilValidPosition){
                    counter = 0;
                    var search = true;
                    var movedElementLocal = next;
                    var desiredDirection = next.nextDirection;
                    
                    while(search && counter < 100){
                        counter++;
                        
                        currElem.nextDirection = desiredDirection;
                        currElem.direction = movedElementLocal.direction;
                        movedElementLocal = AI.MoveGhost(currElem);
                        
                        //invert
                        movedElementLocal.direction = movedElementLocal.nextDirection;
                        movedElementLocal.nextDirection = desiredDirection;
                        
                        search = !isNextPositionValid(currElem, movedElementLocal, checkFuture);
                        if(!search){
                            movedElement = movedElementLocal;  
                            
                        }
                    }
                }
             }
            
            
            
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
    ,hpBar: function (ctx) {
        // for (var i = 0; i < GameCfg.lives; i++) {
        //     if (true)
        //         ctx.fillStyle = Enums.Colors.blue;
        //     else
        //         ctx.fillStyle = Enums.Colors.red;
        //     ctx.fillRect(100 + i * 25, 16, 15, 15);
        // }
        
        var message = _prey.lives + " LIVES";
        var elemId = "lblLives";
        var elem = document.getElementById(elemId);
        elem.innerText = message;
    },
    score: function(ctx){
        var message = "TOTAL: " + totalScore*-1;
        var elemId = "lblScore";
        var elem = document.getElementById(elemId);
        elem.innerText = message;
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
    return { "x": x, "y": y, "cType": cType , "score" : GameCfg.normalCellScore };
}

function UiElement(cellX, cellY, eType) {
    var vx = 0; //GameCfg.ghostVx;
    var vy = 0; //GameCfg.ghostVx;

    return { 
        "cellX": cellX, 
        "cellY": cellY, 
        "x": cellX*GameCfg.uiElementsLength, 
        "y": cellY*GameCfg.uiElementsLength, 
        "cType": eType, 
        "length": GameCfg.uiElementsLength, 
        "vx": vx, 
        "vy": vy, 
        "direction": null, 
        "nextDirection": null, 
        //"nextDirectionToBe": null,
        "fill": Enums.Colors.blue,
        "hit" : function(hitter){ 
            
                },
        "IsCollided" : false,
        "DebugName" : ""
        };
}


function Eater(x, y) {
    var elem = UiElement(x, y, Enums.UiElements.eater);
    elem.DebugName = "Eater";
    elem.fill = Enums.Colors.black;
    //elem.vx = GameCfg.eaterVx;
    //elem.vy = GameCfg.eaterVx
    
    elem.hit = function(hitter){
        var casted = UiElement('','',''); casted = hitter;
        var temp = elem.lives-1;
        var msg = 'Loose 1 life ('+temp+' of '+GameCfg.lives+')';
        if(this.lives > 0){
            if(casted.cType == Enums.UiElements.ghost){
                this.lives-= 1;
                
                if(this.lives > 0){
                    alert("Well done, the big guy only has " + this.lives + " lives left!" )
                    initGame(this.lives);
                }else{
                    GameLogic.gameOver();
                }
                //alert(msg);
            }
        }else{
            GameLogic.gameOver();
        }
        console.log(msg);
    }

    return elem;
}

function Ghost(x, y, eType, name) {
    var elem = UiElement(x, y, eType);
    elem.fill = Enums.Colors.red;
    elem.cType = Enums.UiElements.ghost;

    elem.target1 = null;
    elem.target2 = null;
    
    elem.DebugName = name;
    
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
    },
    
    fillRect2: function(x, y, lengthX, lengthY, fillColor, ctx){
        var oldStyle = ctx.fillStyle;
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, lengthX, lengthY); 
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
        ctx.font="19px Georgia";
        ctx.fillStyle = Enums.Colors.white;
        ctx.fillText(name + ": " + value, x, y); 
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
            return AI.MoveEaterAuto(elem);
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
        
        var xLogic = function(){
            if(Math.abs(xDiff) > 0 && elem.vx == 0){
                if(xDiff < 0 || casted.direction == Enums.Directions.LEFT){
                    casted.nextDirection = Enums.Directions.RIGHT;
                    casted.vx = GameCfg.ghostVx;
                    casted.vy = 0;
                }else{
                    casted.nextDirection = Enums.Directions.LEFT;
                    casted.vx = GameCfg.ghostVx*-1;
                    casted.vy = 0;
                }
            }
        };
        
        var yLogic = function(){
            if(Math.abs(yDiff) > 0 && elem.vy == 0){
                if(yDiff < 0 && casted.direction != Enums.Directions.DOWN){
                    casted.nextDirection = Enums.Directions.DOWN;
                    casted.vy = GameCfg.ghostVx;
                    casted.vx = 0;
                }else{
                    casted.nextDirection = Enums.Directions.UP;
                    casted.vy = GameCfg.ghostVx*-1;
                    casted.vx = 0;
                }
            }
        }
        
        //if failed previous PosCalc, with right or left, then try to move Y 
        var condition1 = casted.nextDirection == Enums.Directions.RIGHT 
            || casted.nextDirection == Enums.Directions.LEFT;
        var condition2 = (elem.vx == 0 && elem.vy == 0) && (casted.direction == Enums.Directions.RIGHT || casted.direction == Enums.Directions.LEFT); 
        if(condition1 || condition2){
                yLogic();
            }else{
                xLogic();
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
    }, 
    MoveEaterAuto: function(elem){
        var cellsIndexWithScore = [];
        
        if(!elem.target1 || (elem.x == elem.target1.x && elem.y == elem.target1.y)){
            for (var index = 0; index < validCells.length; index++) {
                var cell = Cell('','',''); cell = validCells[index];
                if(cell.score > 0){
                    cellsIndexWithScore.push(index);
                }
            }
            
            var indexChosen = getRandomInt(0, cellsIndexWithScore.length-1);
        
            var newTargetIndex = cellsIndexWithScore[indexChosen];
            var cellChosen = validCells[newTargetIndex];
            if(Context.debug){
                cellChosen.fill = elem.fill;
            }
            elem.target1 = UiElement(cellChosen.x, cellChosen.y, Enums.UiElements.dot);
            //elem.target1.fill = Enums.Colors.black;;
        }
        
        
        
        return AI.MoveGhost(elem);
        
        // var generateRandomTarget = function(){               
        //     var newTargetIndex = getRandomInt(0, validCells.length-1);
        //     var newTarget = validCells[newTargetIndex];
        //     newTarget.fill = ghost.fill;
        //     ghost.target1 = newTarget;
        // };
    },
    MoveElementAuto: function(elem){
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
            if(xDiff > 0){
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
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};