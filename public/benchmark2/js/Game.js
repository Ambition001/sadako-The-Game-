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
        this.player = this.game.add.sprite(result[0].x,result[0].y-128,'ghost');
        this.restartx = result[0].x;
        this.restarty = result[0].y-128;
        console.log(this.restarty);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = 250;
        this.game.camera.follow(this.player);

        cursors = this.game.input.keyboard.createCursorKeys();

    },
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
          if(element.properties.type === type) {
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
        this.items = this.game.add.group();
        this.items.enableBody = true;
        result = this.findObjectsByType('box', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.items.create(element.x, element.y, element.properties.sprite);
        }, this);
    },
    createButton: function() {
        this.items = this.game.add.group();
        this.items.enableBody = true;
        result = this.findObjectsByType('button', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.items.create(element.x, element.y, element.properties.sprite);
        }, this);
    },
    createDoor: function() {
        this.items = this.game.add.group();
        this.items.enableBody = true;
        result = this.findObjectsByType('door', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.items.create(element.x, element.y, element.properties.sprite);
        }, this);
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
        this.items = this.game.add.group();
        this.items.enableBody = true;
        result = this.findObjectsByType('ghost', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.items.create(element.x, element.y, element.properties.sprite);
        }, this);
    },
    createFromTiledObject: function(element, group,name) {
        var sprite = group.create(element.x, element.y, name);
    
          Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
          });
    },
    update: function () {
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.overlap(this.player,this.checkPoints,this.passCheckPoint,null,this);
        this.game.physics.arcade.overlap(this.player,this.spikes,this.stepOnSpike,null,this);
        this.player.body.velocity.x = 0;
        if(cursors.left.isDown){
            this.player.body.velocity.x = -500;
        }else if(cursors.right.isDown){
            this.player.body.velocity.x = 500;
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
    },
    passCheckPoint: function (player, checkPoint){
        this.restartx = checkPoint.position.x+128;
        this.restarty = checkPoint.position.y-128;
        console.log(this.restarty);
    },
    stepOnSpike: function (){
        this.player.position.x = this.restartx;
        this.player.position.y = this.restarty;
    }


};