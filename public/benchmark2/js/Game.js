var sadako = sadako || {};


sadako.Game = function () {};

var completed;
var lv;
var mute;
var cursors;
var jumpCounter = 0;
var jumpFlag;
var lighting = false;
var pauseButton;
var pauseWhite;
var game;
var pauseText;
var pauseResume;
var pauseRestart;
var pauseMenu;
var pauseHelp;
var pauseNext;
var t;
var terror = 0;
var winState = false;


sadako.Game.prototype = {
    init: function (complete, level, sound) {
        completed = complete;
        lv = level;
        mute = sound;
    },
    create: function () {
        game = this.game;
        t = this;
        winState = false;
        terror = 0;
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
        this.player.position.x = 20500;
        this.game.camera.follow(this.player);
        

        cursors = this.game.input.keyboard.createCursorKeys();
        pauseButton = this.game.add.sprite(2000, 100, 'pauseButton');
        pauseButton.anchor.setTo(0.5);
        pauseButton.scale.setTo(0.5);
        pauseButton.inputEnabled = true;
        pauseButton.fixedToCamera = true;
        pauseButton.events.onInputDown.add(this.pauseGame, this);

        this.escKey.onDown.add(this.pauseGame);


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
        this.bear = this.game.add.group();
        this.bear.enableBody = true;
        result = this.findObjectsByType('bear', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.bear.create(element.x, element.y, 'bear');
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
            element.animations.add('floatingleft',[0,1,2,3]);
            element.animations.add('floatingright',[4,5,6,7]);
            element.animations.add('chasingleft',[8,9,10,11]);
            element.animations.add('chasingright',[12,13,14,15]);
            element.animations.add('scaredleft',[16,17,18,19]);
            element.animations.add('scaredright',[20,21,22,23]);
            element.animations.add('winning',[24,25]);
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
        this.game.physics.arcade.overlap(this.player,this.bear,this.winningBear,null,this);

        // TODO: add hover to pause menu
        // if(!typeof(pauseResume) == "undefined"){
        //     if(pauseResume.input.pointerOver()){
        //         pauseResume.frame = 1;
        //     }else{
        //         pauseResume.frame = 0;
        //     }
        // }


        if(pauseButton.input.pointerOver()){
            pauseButton.frame = 1;
        }else{
            pauseButton.frame = 0;
        }

        if(button.frame == 0){
            this.game.physics.arcade.collide(this.player, this.door);
            door.frame = 0;
        }
        else{
            door.frame = 1;
        }

        this.player.body.velocity.x = 0;
        if(cursors.left.isDown || this.aKey.isDown){
            this.player.body.velocity.x = -600;
        }else if(cursors.right.isDown || this.dKey.isDown){
            this.player.body.velocity.x = 600;
        }

        if(this.player.body.onFloor()){
            jumpCounter = 0;
        }

        if(this.spaceKey.isDown && this.player.body.onFloor()){
            this.player.body.velocity.y = -400;
            jumpCounter = 1;
            jumpFlag = true;
        }else if(this.spaceKey.isDown && jumpCounter <=1 && !jumpFlag){
            this.player.body.velocity.y = -400;
            jumpCounter = 2;
        }

        if(this.spaceKey.isUp){
            jumpFlag = false;
        }

        if(this.rKey.isDown && this.player.body.onFloor()){
            lighting = true;
        }

        if(this.rKey.isUp){
            lighting = false;
        }

        this.ghostMovement();
        //reset velocity
        this.reset();
    },
    //check point event
    passCheckPoint: function (player, checkPoint){
        this.restartx = checkPoint.position.x+128;
        this.restarty = checkPoint.position.y-128;
    },
    //step on spike event
    stepOnSpike: function (){
        this.player.position.x = this.restartx;
        this.player.position.y = this.restarty;
    },
    //pushing box event
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
    //reset
    reset: function(){
        this.lighting = false;
        this.box.children.forEach(function(element){
            element.body.velocity.x = 0;
        },this);
        this.door.children.forEach(function(element){
            element.body.velocity.x = 0;
        },this);
    },
    //button activation event
    boxOnButton: function(box,button){
        button.frame = 1;
    },
    //ghost movement
    ghostMovement: function(){
        this.ghost.children.forEach(function(element){
            if(this.player.position.x < element.body.position.x && this.player.position.x +1280>element.body.position.x){
                this.game.physics.arcade.moveToObject(element,this.player,200);
                if(lighting){
                    element.body.velocity.x *= -1;
                    element.body.velocity.y = -200;
                    element.animations.play('scaredright',10,true);
                }
                else{
                    element.animations.play('chasingleft',10,true);
                }
            }
            else if(this.player.position.x > element.body.position.x && this.player.position.x -1280<element.body.position.x){
                this.game.physics.arcade.moveToObject(element,this.player,200);
                if(lighting){
                    element.body.velocity.x *= -1;
                    element.body.velocity.y = -200;
                    element.animations.play('scaredleft',10,true);
                }
                else{
                    console.log(666);
                    element.animations.play('chasingright',10,true);
                }
            }
            else{
                element.body.velocity.y = 400;
                element.animations.play('floatingleft',10,true);
                if(element.y>1664){
                    element.body.velocity.y = -400;
                    element.animations.play('floatingright',10,true);
                }
                else if(element.y<256){
                    element.body.velocity.y = 400;
                    element.animations.play('floatingleft',10,true);
                }
            }
        },this)
    },
    //winning event
    winningBear: function () {
        winState = true;
        t.bear.destroy();
        pauseButton.destroy();
        pauseWhite = game.add.sprite(game.camera.x + 1024, 1024, 'white');
        pauseWhite.anchor.setTo(0.5, 0.5);
        pauseWhite.alpha = 0.5;

        var textStyle = {
            font: "100px Arial",
            fill: "#000000",
            align: "center"
        };

        text = game.add.text(game.camera.x + 1024, 500, "Win", textStyle);
        text.anchor.setTo(0.5, 0.5);

        pauseNext = game.add.sprite(game.camera.x + 1024, 900, 'nextLevelButton');
        pauseNext.anchor.setTo(0.5);
        pauseNext.inputEnabled = true;
        pauseNext.events.onInputDown.add(function () {
            if(lv < 2){
                lv = 2;
            }
            game.state.start('MainMenu', true, false, completed, lv, mute);
        },t);

        pauseMenu = game.add.sprite(game.camera.x + 1024, 1250, 'mainMenuButton');
        pauseMenu.anchor.setTo(0.5);
        pauseMenu.inputEnabled = true;
        pauseMenu.events.onInputDown.add(function () {
            if(lv < 2){
                lv = 2;
            }
            game.state.start('MainMenu', true, false, completed, lv, mute);
        },t);
    },
    pauseGame: function () {
        if(!winState){
            game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
            if(game.physics.arcade.isPaused){
                pauseWhite = game.add.sprite(game.camera.x + 1024, 1024, 'white');
                pauseWhite.anchor.setTo(0.5, 0.5);
                pauseWhite.alpha = 0.5;

                var textStyle = {
                    font: "100px Arial",
                    fill: "#000000",
                    align: "center"
                };

                text = game.add.text(game.camera.x + 1024, 500, "Paused", textStyle);
                text.anchor.setTo(0.5, 0.5);

                pauseResume = game.add.sprite(game.camera.x + 1024, 750, 'resumeButton');
                pauseResume.anchor.setTo(0.5);
                pauseResume.inputEnabled = true;
                pauseResume.events.onInputDown.add(t.pauseGame, t);

                pauseRestart = game.add.sprite(game.camera.x + 1024, 1050, 'restartButton');
                pauseRestart.anchor.setTo(0.5);
                pauseRestart.inputEnabled = true;
                pauseRestart.events.onInputDown.add(function () {
                    t.pauseGame();
                    game.state.start('Game', true, false, completed, lv, mute);
                },t);
                
                pauseMenu = game.add.sprite(game.camera.x + 1024, 1350, 'mainMenuButton');
                pauseMenu.anchor.setTo(0.5);
                pauseMenu.inputEnabled = true;
                pauseMenu.events.onInputDown.add(function () { 
                    t.pauseGame();
                    game.state.start('MainMenu', true, false, completed, lv, mute);

                },t);



            }else{
                pauseWhite.destroy();
                text.destroy();
                pauseResume.destroy();
                pauseRestart.destroy();
                pauseMenu.destroy();
            }
        }


    },
    shutdown: function () {
        game.world.setBounds(0, 0, 2048, 2048);
    }

};