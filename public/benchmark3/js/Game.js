var sadako = sadako || {};


sadako.Game = function () {};

var completed;
var lv;
var mute;
var cursors;
var jumpCounter = 0;
var jumpHeight = -400;
var gravity = 600;
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
var terror;
var winState = false;
var terrorBar;
var terrorWidth;
var terrorBrackets;
var mapNum;
var backgroundMusic;
var ghostSoundFlag;
var takeDamageSoundFlag;
var ghostTouchFlag;
var ghostSound;
var boxOnFloor;
var boxLandList;

sadako.Game.prototype = {
    init: function (complete, level, sound, bgMusic, map) {
        completed = complete;
        lv = level;
        mute = sound;
        mapname = map;
        this.bgMusic = bgMusic;
        backgroundMusic = this.bgMusic;
        mapNum = parseInt(mapname.slice(mapname.length-1));
        ghostSoundFlag = false;
        boxLandList = [];
    },
    create: function () {
        game = this.game;
        t = this;
        winState = false;
        terror = 0;
        terrorWidth = 300;
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.eKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.jKey = this.game.input.keyboard.addKey(Phaser.Keyboard.J);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        this.map = this.game.add.tilemap(mapname);

        this.map.addTilesetImage('SadakoFullTileSet','sadakoFullTileSet');
        this.map.addTilesetImage('BasicColor','basicColor');
        this.backgroundlayer = this.map.createLayer('Background');
        this.background = this.game.add.tileSprite(0,0,4096,2048,'background'+mapNum);
        this.background.fixedToCamera = true;
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
        this.player.animations.add('idleleft',[0,1,2,3,4]);
        this.player.animations.add('walkleft',[5,6,7,8,9,10,11,12]);
        this.player.animations.add('jumpupleft',[13,14,15]);
        this.player.animations.add('jumpdownleft',[17,18]);
        this.player.animations.add('idlelighterleft',[19,20,21,22,23,24,25]);
        this.player.animations.add('walklighterleft',[24,25,26,27,28,29,30]);
        this.player.animations.add('walkgrableft',[32,33,34,35,36,37,38,39]);
        this.player.animations.add('idleright',[40,41,42,43,44]);
        this.player.animations.add('walkright',[45,46,47,48,49,50,51]);
        this.player.animations.add('jumpupright',[52,53,54,55]);
        this.player.animations.add('jumpdownright',[57,58]);
        this.player.animations.add('idlelighterright',[59,60,61,62,63]);
        this.player.animations.add('walklighterright',[64,65,66,67,68,69,70]);
        this.player.animations.add('walkgrabright',[72,73,74,75,76,77,78,79,80]);
        this.player.animations.add('gainterrorright',[81,82,83,84,85]);
        this.player.animations.add('gainterrorleft',[86,87,88,89,90]);
        this.player.animations.add('toterrifiedleft',[91,92]);
        this.player.animations.add('interrifiedleft',[93,94,95,96]);
        this.player.animations.add('toterrifiedright',[97,98]);
        this.player.animations.add('interrifiedright',[99,100,101,102]);
        this.restartx = result[0].x;
        this.restarty = result[0].y-128;
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = gravity;
        this.player.body.collideWorldBounds = true;
        this.game.camera.follow(this.player);
        
        cursors = this.game.input.keyboard.createCursorKeys();
        pauseButton = this.game.add.sprite(2000, 100, 'pauseButton');
        pauseButton.anchor.setTo(0.5);
        pauseButton.scale.setTo(0.5);
        pauseButton.inputEnabled = true;
        pauseButton.fixedToCamera = true;
        pauseButton.events.onInputDown.add(this.pauseGame, this);

        this.escKey.onDown.add(this.pauseGame);

        terrorBar = this.player.addChild(game.make.sprite(64, -50, 'bar'));
        terrorBar.width = 0;
        terrorBrackets = this.player.addChild(game.make.sprite(-91, -55,'brackets'));
        //this.player.position.x = 18000;
        //this.player.position.y = 0;
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
    createMoth: function() {
        this.moths = this.game.add.group();
        this.moths.enableBody = true;
        result = this.findObjectsByType('moth', this.map, 'ObjectLayer');
        result.forEach(function(element){
            this.ghost.create(element.x, element.y, 'moth');
        }, this);
        this.ghost.children.forEach(function(element){
            element.animations.add('flyingLeft',[0,1]);
            element.animations.add('flyringRight',[2,3]);
        },this);
    },
    createFromTiledObject: function(element, group,name) {
        var sprite = group.create(element.x, element.y, name);
    
          Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
          });
    },
    update: function () {
        ghostTouchFlag = false;
        if(this.button.length > 0){
            var button = this.button.children[0];
            button.frame = 0;
        }
        //var button = this.button.children[0];
        //reset button in every frame
        //button.frame = 0;
        if(this.door.length > 0){
            var door = this.door.children[0];
        }
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
        this.game.physics.arcade.overlap(this.player, this.ghost, this.ghostTouch, null, this);
        
        
        terrorBar.width = (terror / 100) * terrorWidth;
        if(terrorBar.width>300){
            terrorBar.width = 300;
        }
        terrorBar.x = 64 - terrorBar.width / 2;


        if(terror == 100){
            this.terrified();
        }
        //console.log(terrorBar.width);
        if(pauseButton.input.pointerOver()){
            pauseButton.frame = 1;
        }else{
            pauseButton.frame = 0;
        }
    

        if(this.button.length > 0 && this.door.length>0){
            if(button.frame == 0){
                this.game.physics.arcade.collide(this.player, this.door);
                door.frame = 0;
            }
            else{
                door.frame = 1;
            }
        }
        
        savedVelocity = this.player.body.velocity.x;
        this.player.body.velocity.x = 0;

        if(cursors.left.isDown || this.aKey.isDown){
            this.player.body.velocity.x = -600;
            if(!lighting)
                if(this.player.animations.currentAnim.name.includes("idle") || this.player.animations.currentAnim.name.includes("right") 
                || (!this.player.animations.currentAnim.isPlaying))
                    this.player.animations.play("walkleft", 10);
            else
                if(this.player.animations.currentAnim.name.includes("idle")  || this.player.animations.currentAnim.name.includes("right")
                || (!this.player.animations.currentAnim.isPlaying))
                    this.player.animations.play("walklighterleft", 10);
        }else if(cursors.right.isDown || this.dKey.isDown){
            this.player.body.velocity.x = 600;
            if(!lighting)
                if(this.player.animations.currentAnim.name.includes("idle")  || this.player.animations.currentAnim.name.includes("left")
                || (!this.player.animations.currentAnim.isPlaying))
                    this.player.animations.play("walkright", 10);
            else
                if(this.player.animations.currentAnim.name.includes("idle") || this.player.animations.currentAnim.name.includes("left")
                || (!this.player.animations.currentAnim.isPlaying))
                    this.player.animations.play("walklighterright", 10);
        }else {

            if((this.player.animations.currentAnim.name.includes("walk") && this.player.animations.currentAnim.name.includes("right")) || (!this.player.animations.currentAnim.isPlaying && savedVelocity >= 0 
                && this.player.animations.currentAnim.name.includes("right"))){
                if(!lighting)
                    this.player.animations.play("idleright", 10);
                else
                    this.player.animations.play("idlelighterright", 10);
            }
    
            else if ((this.player.animations.currentAnim.name.includes("walk") && this.player.animations.currentAnim.name.includes("left")) || (!this.player.animations.currentAnim.isPlaying && savedVelocity <= 0 
                && this.player.animations.currentAnim.name.includes("left"))){
                if(!lighting)
                    this.player.animations.play("idleleft", 10 , true);
                else
                    this.player.animations.play("idlelighterleft", 10, true);
            }
        }

        if(this.player.body.onFloor()){
            if(jumpCounter > 0){
                if(this.player.animations.currentAnim.name.includes("left"))
                    this.player.animations.play("jumpdownleft", 10);
                else
                    this.player.animations.play("jumpdownright", 10);
            }
            jumpCounter = 0;
        }

        if(this.spaceKey.isDown && jumpCounter <=1 && !jumpFlag){
            //console.log(jumpCounter,jumpFlag);
            if(this.player.animations.currentAnim.name.includes("left"))
                    this.player.animations.play("jumpupleft", 10);
            else if(this.player.animations.currentAnim.name.includes("right"))
                this.player.animations.play("jumpupright", 10);

            this.player.body.velocity.y = -500;
            jumpFlag = true;
            jumpCounter += 1;
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

        if(this.player.body.velocity.x > 0 && !this.player.body.blocked.right){
            this.background.tilePosition.x -= 0.5;
        }
        else if(this.player.body.velocity.x < 0 && !this.player.body.blocked.left){
            this.background.tilePosition.x += 0.5;
        }

        this.box.children.forEach(function(element){
            if(!element.body.blocked.down){
                if(boxLandList.indexOf(element)==-1){
                    boxLandList.push(element);
                }
            }
            if(boxLandList.indexOf(element)!=-1 && element.body.blocked.down){
                boxLandList.splice(boxLandList.indexOf(element));
                boxLandingSound = game.add.audio('blockLanding');
                boxLandingSound.play();
            }
            //console.log(boxOnFloor);
        },this);

        this.ghostMovement();
        //reset velocity
        this.reset();
    },// TODO: add hover to pause menu
    // pauseUpdate: function () {
    //     console.log("111");
    //     if(!typeof(pauseResume) == "undefined"){
    //         if(pauseResume.input.pointerOver()){
    //             pauseResume.frame = 1;
    //         }else{
    //             pauseResume.frame = 0;
    //         }
    //     }
    // },
    //check point event
    passCheckPoint: function (player, checkPoint){
        this.restartx = checkPoint.position.x+128;
        this.restarty = checkPoint.position.y-128;
        this.tilepx = this.background.tilePosition.x;
        terror = 0;
    },
    //step on spike event
    stepOnSpike: function (){
        this.player.position.x = this.restartx;
        this.player.position.y = this.restarty;
        this.background.tilePosition.x = this.tilepx;
    },
    //pushing box event
    moveBox: function (player,box){
        if(player.x<=box.position.x-256 || player.x>=box.position.x+256){
            if(box.position.x>this.player.x){
                box.body.velocity.x += 32;
                this.player.animations.play("walkgrabright", 10, true);
            }
            else{
                box.body.velocity.x -= 32;
                this.player.animations.play("walkgrableft", 10, true);
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
                
                if(!ghostSoundFlag && !mute){
                    ghostSound = game.add.audio('ghostSound');
                    ghostSoundFlag = true;
                    ghostSound.play();
                    ghostSound.onStop.add(function () {
                        ghostSoundFlag = false;
                    })
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
                    element.animations.play('chasingright',10,true);
                }

                if(!ghostSoundFlag && !mute){
                    ghostSound = game.add.audio('ghostSound');
                    ghostSoundFlag = true;
                    ghostSound.play();
                    ghostSound.onStop.add(function () {
                        ghostSoundFlag = false;
                    })
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
    ghostTouch: function () {
        terror += 1;
        ghostTouchFlag = true;
        if(!takeDamageSoundFlag && !mute && !winState){
            var takeDamageSound = game.add.audio('takeDamage');
            takeDamageSoundFlag = true;
            takeDamageSound.play();
            takeDamageSound.onStop.add(function () {
                takeDamageSoundFlag = false;
            })
        }
    }, 
    mothMovement: function(){
        this.ghost.children.forEach(function(element){
            
        });
    },
    //winning event
    winningBear: function () {
        winState = true;
        if(!mute){
            var winMusic = game.add.audio('winMusic');
            backgroundMusic.pause();
            winMusic.play();
            winMusic.onStop.add(function(){
                if(!mute){
                    backgroundMusic.resume();
                }
            });
        }
        t.bear.destroy();
        this.ghost.children.forEach(function(element){
        
            element.kill();
        });
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
            if(mapNum == 6){
                lv = 6;
                game.state.start('MainMenu', true, false, completed, lv, mute, this.bgMusic);
                ghostSound.stop();
            }
            else if(lv < mapNum + 1){
                lv = mapNum + 1;
                game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, 'level'+lv.toString());
                ghostSound.stop();
            }
            // TODO: Go to next level
        },t);

        pauseMenu = game.add.sprite(game.camera.x + 1024, 1250, 'mainMenuButton');
        pauseMenu.anchor.setTo(0.5);
        pauseMenu.inputEnabled = true;
        pauseMenu.events.onInputDown.add(function () {
            if(mapNum == 6){
                lv = 6;
            }
            else if(lv < mapNum + 1){
                lv = mapNum + 1;
            }
            game.state.start('MainMenu', true, false, completed, lv, mute, this.bgMusic);
            ghostSound.stop();
        },t);
    },
    terrified: function (){
        winState = true;
        this.ghost.children.forEach(function(element){
            element.animations.play('winning',10,true);
        });
        pauseButton.destroy();
        pauseWhite = game.add.sprite(game.camera.x + 1024, 1024, 'white');
        pauseWhite.anchor.setTo(0.5, 0.5);
        pauseWhite.alpha = 0.5;
        if(!mute){
            var terrifiedMusic = game.add.audio('terrified');
            backgroundMusic.pause();
            terrifiedMusic.play();
            terrifiedMusic.onStop.add(function(){
                if(!mute){
                    backgroundMusic.resume();
                }
            });
        }

        var textStyle = {
            font: "100px Arial",
            fill: "#ff0000",
            align: "center"
        };

        text = game.add.text(game.camera.x + 1024, 500, "Terrified", textStyle);
        text.anchor.setTo(0.5, 0.5);

        pauseRestart = game.add.sprite(game.camera.x + 1024, 900, 'restartButton');
        pauseRestart.anchor.setTo(0.5);
        pauseRestart.inputEnabled = true;
        pauseRestart.events.onInputDown.add(function () {
            game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, mapname);
            ghostSound.stop();
        },t);

        pauseMenu = game.add.sprite(game.camera.x + 1024, 1250, 'mainMenuButton');
        pauseMenu.anchor.setTo(0.5);
        pauseMenu.inputEnabled = true;
        pauseMenu.events.onInputDown.add(function () {
            game.state.start('MainMenu', true, false, completed, lv, mute, this.bgMusic);
            ghostSound.stop();
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
                    game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, mapname);
                    ghostSound.stop();
                },t);
                
                pauseMenu = game.add.sprite(game.camera.x + 1024, 1350, 'mainMenuButton');
                pauseMenu.anchor.setTo(0.5);
                pauseMenu.inputEnabled = true;
                pauseMenu.events.onInputDown.add(function () { 
                    t.pauseGame();
                    game.state.start('MainMenu', true, false, completed, lv, mute, this.bgMusic);
                    ghostSound.stop();

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