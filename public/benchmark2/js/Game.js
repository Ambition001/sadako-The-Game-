var sadako = sadako || {};


sadako.Game = function () {};

var completed;
var lv;
var mute;
var cursors;
var jumpCounter = 0;
var jumpFlag;

sadako.Game.prototype = {
    init: function (complete, level, sound) {
        completed = complete;
        lv = level;
        mute = sound;
    },
    create: function () {
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.eKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.jKey = this.game.input.keyboard.addKey(Phaser.Keyboard.J);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        this.map = this.game.add.tilemap('level1');

        this.map.addTilesetImage('SadakoFullTileSet','sadakoFullTileSet');
        this.map.addTilesetImage('BasicColor','basicColor');
        this.backgroundlayer = this.map.createLayer('Background');
        this.blockedLayer = this.map.createLayer('BlockLayer');

        this.map.setCollisionBetween(1, 10000, true, 'BlockLayer');

        this.backgroundlayer.resizeWorld();

        this.createCheckPoints();
        this.createBox();
        this.createButton();
        this.createDoor();
        this.createSpikes();
        this.createBear();
        this.createGhost();
        
        //create a player
        var result = this.findObjectsByType('playerStart', this.map, 'ObjectLayer');
        this.player = this.game.add.sprite(result[0].x,result[0].y-128,'sadako');
        this.restartx = result[0].x;
        this.restarty = result[0].y-128;
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = 250;
        this.game.camera.follow(this.player);

        cursors = this.game.input.keyboard.createCursorKeys();
        this.player.position.x = 16500;
    },
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
          if(element.properties[0].value === type) {
            element.y -= map.tileHeight;
            result.push(element);
          }      
        });
        return result;
    },
    createCheckPoints: function() {
        this.checkPoints = this.game.add.group();
        this.checkPoints.enableBody = true;
        result = this.findObjectsByType('checkPoint', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.createFromTiledObject(element, this.checkPoints,'checkPoint');
        }, this);
    },
    createSpikes: function() {
        this.spikes = this.game.add.group();
        this.spikes.enableBody = true;
        result = this.findObjectsByType('spike', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.spikes.create(element.x, element.y, 'spike');
        }, this);
    },
    createBox: function() {
        this.box = this.game.add.group();
        this.box.enableBody = true;
        result = this.findObjectsByType('box', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.box.create(element.x, element.y, 'sadakoWoodenCrate');
        }, this);
        this.box.children.forEach(function(element){
            this.game.physics.enable(element, Phaser.Physics.ARCADE);
            element.body.gravity.y = 1000;
        },this);
    },
    createButton: function() {
        this.button = this.game.add.group();
        this.button.enableBody = true;
        result = this.findObjectsByType('button', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.button.create(element.x, element.y, 'sadakoButton');
        }, this);
    },
    createDoor: function() {
        this.door = this.game.add.group();
        this.door.enableBody = true;
        result = this.findObjectsByType('door', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.door.create(element.x, element.y, 'sadakoDoor');
        }, this);
        this.door.children.forEach(function(element){
            element.body.immovable = true;
            element.body.moves = false;
        },this);
    },
    createBear: function() {
        this.items = this.game.add.group();
        this.items.enableBody = true;
        result = this.findObjectsByType('bear', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.items.create(element.x, element.y, element.properties.sprite);
        }, this);
    },
    createGhost: function() {
        this.ghost = this.game.add.group();
        this.ghost.enableBody = true;
        result = this.findObjectsByType('ghost', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.ghost.create(element.x, element.y, 'ghost');
        }, this);
        this.ghost.children.forEach(function(element){
            element.body.velocity.y = 200;
        },this);
    },
    createFromTiledObject: function(element, group,name) {
        var sprite = group.create(element.x, element.y, name);
    
          Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
          });
    },
    update: function () {
        var button = this.button.children[0];
        var door = this.door.children[0];
        //reset button in every frame
        button.frame = 0;

        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.box,this.blockedLayer);
        this.game.physics.arcade.overlap(this.player,this.checkPoints,this.passCheckPoint,null,this);
        this.game.physics.arcade.overlap(this.player,this.spikes,this.stepOnSpike,null,this);
        this.game.physics.arcade.collide(this.player,this.box,this.moveBox,null,this);
        this.game.physics.arcade.collide(this.box,this.blockedLayer);
        this.game.physics.arcade.collide(this.player,this.box);
        this.game.physics.arcade.overlap(this.box,this.button,this.boxOnButton,null,this);
        this.game.physics.arcade.collide(this.blockedLayer, this.door);
            door.frame = 0;
        if(button.frame == 0){
            this.game.physics.arcade.collide(this.player, this.door);
            door.frame = 0;
        }
        else{
            door.frame = 1;
        }
        this.player.body.velocity.x = 0;
        if(cursors.left.isDown){
            this.player.body.velocity.x = -600;
        }else if(cursors.right.isDown){
            this.player.body.velocity.x = 600;
        }

        if(this.player.body.onFloor()){
            jumpCounter = 0;
        }

        if(this.spaceKey.isDown && this.player.body.onFloor()){
            this.player.body.velocity.y = -400;
            jumpCounter = 1;
            jumpFlag = true;
        }else if(this.spaceKey.isDown && jumpCounter == 1 && !jumpFlag){
            this.player.body.velocity.y = -400;
            jumpCounter = 2;
        }

        if(this.spaceKey.isUp){
            jumpFlag = false;
        }
        this.ghostMovement();

        //reset velocity
        this.reset();
    },
    passCheckPoint: function (player, checkPoint){
        this.restartx = checkPoint.position.x+128;
        this.restarty = checkPoint.position.y-128;
    },
    stepOnSpike: function (){
        this.player.position.x = this.restartx;
        this.player.position.y = this.restarty;
    },
    moveBox: function (player,box){
        if(player.x<=box.position.x-256 || player.x>=box.position.x+256){
            if(box.position.x>this.player.x){
                box.body.velocity.x += 32;
            }
            else{
                box.body.velocity.x -= 32;
            }
        }
    },
    reset: function(){
        this.box.children.forEach(function(element){
            element.body.velocity.x = 0;
        },this);
        this.door.children.forEach(function(element){
            element.body.velocity.x = 0;
        },this);
    },
    boxOnButton: function(box,button){
        button.frame = 1;
    },
    ghostMovement: function(){
        this.ghost.children.forEach(function(element){
            if(element.y>1664){
                element.body.velocity.y = -400;
            }
            else if(element.y<256){
                element.body.velocity.y = 400;
            }
        },this)
    }


};