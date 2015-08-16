window.onload = function () {
    init();
	console.log(123);
}

function startMainLoop() {
    var ONE_FRAME_TIME = 1000.0 / 60.0;
    window.setInterval(mainloop, ONE_FRAME_TIME);
}

function init() {
	startMainLoop();
    initGame();
}

var mainloop = function () {
    //updateGame();
    //drawGame();
	
	currentSeconds();
	
	var ctx = c.getContext("2d");
    ctx.globalAlpha = opacity;
	
	//Draw.hpBar(ctx);
    Draw.level(levelMatrix, ctx);
};

function initGame(){
    levelMatrix = Level.level01();
    console.log('inited Game');
}


var Level = {
    level01: function() {        
        var map = "WWWWWWWWWWWWWWWWWWWWWWWWWWWW|WOOOOOOOOOOOOWWOOOOOOOOOOOOW|WOWWWWOWWWWWOWWOWWWWWOWWWWOW|WOWWWWOWWWWWOOOOWWWWWOWWWWOW|WOWWWWOWWWWWOWWOWWWWWOWWWWOW|WOOOOOOOOOOOOWWOOOOOOOOOOOOW|WOWWWWOWWOWWWWWWWWOWWOWWWWOW|WOOOOOOWWOOOOWWOOOOWWOOOOOOW|WWOWWWOWWWWWOWWOWWWWWOWWWOWW|WWOWWWOWWWWWOWWOWWWWWOWWWOWW|WOOWWWOOOOOOOOOOOOOOOOWWWOOW|WOWWWWOWWOWWDDDDWWOWWOWWWWOW|WOWWWWOWWOWWDDDDWWOWWOWWWWOW|WOOOOOOWWOWWWWWWWWOWWOOOOOOW|WOWWWWOWWOWWWWWWWWOWWOWWWWOW|WOWWWWOWWOWWWWWWWWOWWOWWWWOW|WOOWWWOWWOOOOOOOOOOWWOWWWOOW|WWOWWWOWWOWWWWWWWWOWWOWWWOWW|WWOWWWOWWOWWWWWWWWOWWOWWWOWW|WOOOOOOOOOOOOOOOOOOOOOOOOOOW|WOWWWWOWWWWWOWWOWWWWWOWWWWOW|WOWWWWOWWWWWOWWOWWWWWOWWWWOW|WOOWWWOOOOOOOWWOOOOOOOWWWOOW|WWOWWWOWWOWWWWWWWWOWWOWWWOWW|WWOWWWOWWOWWWWWWWWOWWOWWWOWW|WOOOOOOWWOOOOWWOOOOWWOOOOOOW|WOWWWWOWWWWWOWWOWWWWWOWWWWOW|WOWWWWOWWWWWOWWOWWWWWOWWWWOW|WOOOOOOOOOOOOOOOOOOOOOOOOOOW|WWWWWWWWWWWWWWWWWWWWWWWWWWWW|";
        
        return Level.parseLevel(map);;
    }
    , parseLevel : function (map){
        var LINE_BREAK_TOKEN = "|";
        var lclLevelMatrix = [];
        
        var splitted = map.split(LINE_BREAK_TOKEN);
        
        // for (var rowIndex = 0; rowIndex < splitted.length; rowIndex++) {
        //     var row = splitted[rowIndex]; //returns char[]
        //     for (var columnIndex = 0; columnIndex < row.length; columnIndex++) {
        //         var cellType = row[columnIndex];
        //         lclLevelMatrix.push(Cell(rowIndex, columnIndex, cellType));
        //     }
        // }
        
        for (var columnIndex = 0; columnIndex < splitted.length; columnIndex++) {
            var column = splitted[columnIndex]; //returns char[]
            for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
                var cellType = column[rowIndex];
                lclLevelMatrix.push(Cell(rowIndex,columnIndex, cellType));
            }
        }
        return lclLevelMatrix;
    }
    
    // ,parseCellType : function(char){
    //     switch (char) {
    //         case value:
    //             
    //             break;
    //     
    //         default:
    //             break;
    //     }
    // }
    
    
}

function currentSeconds(now) {
    if (now == undefined)
        now = new Date(Date.now());

    return new Date((now - startTime)).getSeconds();
}


var Draw = {
	hpBar: function (ctx) {
        for (var i = 0; i < 5; i++) {
			if(true)
				ctx.fillStyle = "#1c5cff"; //blue
			else
				ctx.fillStyle = "#a90000"; //red
            ctx.fillRect(100 + i * 25, 16, 15, 15);
        }

    }
    
    , level: function(matrix, ctx){
        if(matrix && matrix.length > 0){
            for (var index = 0; index < matrix.length; index++) {
                var element = matrix[index];
                
                if(element.cType == "W"){
                    ctx.fillStyle = "#1c5cff"; //blue
                }
                else{
                    ctx.fillStyle = "#a90000"; //red
                    continue;
                }
                
                var length  = 25;
                //multiplier = index;
                
                var tempx = length * element.x;
                var tempy = length * element.y;
                ctx.fillRect(tempx, tempy, length, length);
            }
        }
    }
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

function Cell(x, y, cType){
    return {"x":x, "y":y, "cType":cType};
}