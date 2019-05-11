var sadako = sadako || {};


sadako.Game = function () { };

var completed;
var lv;
var mute;
var cursors;

var desirFPS = 75;

var jumpCounter = 0;
var jumpHeight = 128 * -6;
var moveSpeed = 500;
var monMoveMult = 1;
var gravity = 128 * 7;

var jumpFlag = false;
var lighting = false;
var leftFlag = false;
var rightFlag = true;
var downflag = false;
var grabFlag = false;
var cryFlag = false;
var spikedFlag = false;

var dollFlag = false;
var starFlag = false;
var cheatStar = false;
var timerFlag = false;
var itemTimer = 0;
var catapultLoad = false;

var pauseButton;
var pauseFlag = false;
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
var terrorState = false;
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
var boxMoveSoundFlag;
var gashaponSoundFlag;
var doorOpenSoundFlag;
var lighterOpenSoundFlag;

var boxOnFloor;
var boxLandList;
var topCutSceneBar;
var bottomCutSceneBar;
var chatBox;
var chatBoxBar;
sadako.Game.prototype = {
    init: function (complete, level, sound, bgMusic, map) {
        completed = complete;
        lv = level;
        mute = sound;
        mapname = map;
        this.bgMusic = bgMusic;
        backgroundMusic = this.bgMusic;
        mapNum = parseInt(mapname.slice(mapname.length - 1));
        ghostSoundFlag = false;
        boxLandList = [];
        boxMoveSoundFlag = false;
        doorOpenSoundFlag = false;
        lighterOpenSoundFlag = false;

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
        this.pKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.oneKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.twoKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        cursors = this.game.input.keyboard.createCursorKeys();

        this.game.time.desiredFps = desirFPS;

        this.map = this.game.add.tilemap(mapname);

        //TODO IF level4 -> background = null


        this.map.addTilesetImage('SadakoTiles', 'sadakoTiles');
        this.map.addTilesetImage('BasicColor', 'basicColor');
        this.background = this.game.add.tileSprite(0, 0, 4096, 2048, 'background' + mapNum);
        this.background.fixedToCamera = true;
        this.blockedLayer = this.map.createLayer('BlockLayer');
        this.backgroundlayer = this.map.createLayer('Background');

        this.map.setCollisionBetween(1, 10000, true, 'BlockLayer');

        this.backgroundlayer.resizeWorld();

        this.monsters = this.game.add.group();

        this.createCheckPoints();
        this.createBox();
        this.createButton();
        this.createDoor();
        this.createSpikes();
        this.createBear();
        // this.createGashapon();
        // this.createSkull();
        this.createGhost();
        this.createMoth();
        this.createCatapult();

        cheatStar = false;

        //create a player
        var result = this.findObjectsByType('playerStart', this.map, 'ObjectLayer');
        this.player = this.game.add.sprite(result[0].x, result[0].y - 128, 'sadako');

        this.player.animations.add('idleleft', [0, 1, 2, 3, 4]);
        this.player.animations.add('walkleft', [5, 6, 7, 8, 9, 10, 11, 12]);
        this.player.animations.add('jumpupleft', [13, 14, 15]);
        this.player.animations.add('jumpdownleft', [17, 18]);
        this.player.animations.add('idlelighterleft', [19, 20, 21, 22, 23]);
        this.player.animations.add('walklighterleft', [24, 25, 26, 27, 28, 29, 30]);
        this.player.animations.add('walkgrableft', [32, 33, 34, 35, 36, 37, 38, 39]);
        this.player.animations.add('idleright', [40, 41, 42, 43, 44]);
        this.player.animations.add('walkright', [45, 46, 47, 48, 49, 50, 51]);
        this.player.animations.add('jumpupright', [52, 53, 54, 55]);
        this.player.animations.add('jumpdownright', [57, 58]);
        this.player.animations.add('idlelighterright', [59, 60, 61, 62, 63]);
        this.player.animations.add('walklighterright', [64, 65, 66, 67, 68, 69, 70]);
        this.player.animations.add('walkgrabright', [72, 73, 74, 75, 76, 77, 78, 79, 80]);
        this.player.animations.add('gainterrorright', [81, 82, 83, 84, 85]);
        this.player.animations.add('gainterrorleft', [86, 87, 88, 89, 90]);
        this.player.animations.add('toterrifiedleft', [91, 92]);
        this.player.animations.add('interrifiedleft', [93, 94, 95, 96]);
        this.player.animations.add('toterrifiedright', [97, 98]);
        this.player.animations.add('interrifiedright', [99, 100, 101, 102]);
        this.player.animations.add('spikedleft', [103, 104, 105]);
        this.player.animations.add('spikedright', [106, 107, 108]);

        this.player.frame = 40;//start her off facing right

        this.restartx = result[0].x;
        this.restarty = result[0].y - 128;

        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = gravity;
        this.player.body.collideWorldBounds = true;
        this.game.camera.follow(this.player);

        pauseButton = this.game.add.sprite(2000, 100, 'pauseButton');
        pauseButton.anchor.setTo(0.5);
        pauseButton.scale.setTo(0.5);
        pauseButton.inputEnabled = true;
        pauseButton.fixedToCamera = true;
        pauseButton.events.onInputDown.add(this.pauseGame, this);
        this.escKey.onDown.add(this.pauseGame);

        terrorBar = this.player.addChild(game.make.sprite(64, -50, 'bar'));
        terrorBar.width = 0;
        terrorBrackets = this.player.addChild(game.make.sprite(-91, -55, 'brackets'));
        this.tilepx = this.background.tilePosition.x;
        topCutSceneBar = game.add.sprite(game.camera.x, 0, 'cutSceneBar');
        topCutSceneBar.fixedToCamera = true;
        topCutSceneBar.alpha = 0;
        bottomCutSceneBar = game.add.sprite(game.camera.x, 1898, 'cutSceneBar');
        bottomCutSceneBar.fixedToCamera = true;
        bottomCutSceneBar.alpha = 0;
    },
    findObjectsByType: function (type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function (element) {
            if (element.properties[0].value === type) {
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },
    createCheckPoints: function () {
        this.checkPoints = this.game.add.group();
        this.checkPoints.enableBody = true;
        result = this.findObjectsByType('checkPoint', this.map, 'ObjectLayer');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.checkPoints, 'checkPoint');
        }, this);
    },
    createSpikes: function () {
        this.spikes = this.game.add.group();
        this.spikes.enableBody = true;
        result = this.findObjectsByType('spike', this.map, 'ObjectLayer');
        result.forEach(function (element) {
            this.spikes.create(element.x, element.y, 'spike');
        }, this);
    },
    createBox: function () {
        var thisBox;
        this.box = this.game.add.group(this.monsters);
        this.box.enableBody = true;
        result = this.findObjectsByType('box', this.map, 'ObjectLayer');
        result.forEach(function (element) {
            thisBox = this.box.create(element.x, element.y, 'sadakoWoodenCrate');
            thisBox.spawnPx = element.x;
            thisBox.spawnPy = element.y;
        }, this);
        this.box.children.forEach(function (element) {
            this.game.physics.enable(element, Phaser.Physics.ARCADE);
            element.body.gravity.y = 1000;
        }, this);
    },
    createButton: function () {
        this.button = this.game.add.group();
        this.button.enableBody = true;
        result = this.findObjectsByType('button', this.map, 'ObjectLayer');
        result.forEach(function (element) {
            this.button.create(element.x, element.y, 'sadakoButton');
        }, this);
    },
    createCatapult: function () {
        this.catapult = this.game.add.group();
        this.catapult.enableBody = true;
        result = this.findObjectsByType('catapult', this.map, 'ObjectLayer');
        result.forEach(function (element) {
            this.catapult.create(element.x, element.y, 'catapult');
        }, this);
        this.catapult.children.forEach(function (element) {
            element.animations.add('useCatapult', [0, 1, 2]);
        }, this);
    },
    createDoor: function () {
        this.door = this.game.add.group();
        this.door.enableBody = true;
        result = this.findObjectsByType('door', this.map, 'ObjectLayer');
        result.forEach(function (element) {
            this.door.create(element.x, element.y, 'sadakoDoor');
        }, this);
        this.door.children.forEach(function (element) {
            element.body.immovable = true;
            element.body.moves = false;
        }, this);
    },
    createTV: function () {
        this.tv = this.game.add.group();
        result = this.findObjectsByType('tv', this.map, 'ObjectLayer');
        result.forEach(function (element) {
            this.tv.create(element.x, element.y, 'tv');
        }, this);
    },

    createBear: function () {
        this.bear = this.game.add.group();
        this.bear.enableBody = true;
        result = this.findObjectsByType('bear', this.map, 'ObjectLayer');
        result.forEach(function (element) {
            this.bear.create(element.x, element.y, 'bear');
        }, this);
    },
    createGhost: function () {
        this.ghost = this.game.add.group(this.monsters);
        this.ghost.enableBody = true;
        result = this.findObjectsByType('ghost', this.map, 'ObjectLayer');
        result.forEach(function (element) {
            this.ghost.create(element.x, element.y, 'ghost');
        }, this);
        this.ghost.children.forEach(function (element) {
            element.animations.add('floatingleft', [0, 1, 2, 3]);
            element.animations.add('floatingright', [4, 5, 6, 7]);
            element.animations.add('chasingleft', [8, 9, 10, 11]);
            element.animations.add('chasingright', [12, 13, 14, 15]);
            element.animations.add('scaredleft', [16, 17, 18, 19]);
            element.animations.add('scaredright', [20, 21, 22, 23]);
            element.animations.add('winning', [24, 25]);

            element.spawnPx = element.x;
            element.spawnPy = element.y;

            element.touched = false;

            //element.wanderer = ;
        }, this);
    },
    createMoth: function () {
        this.moths = this.game.add.group(this.monsters);
        this.moths.enableBody = true;
        result = this.findObjectsByType('moth', this.map, 'ObjectLayer');
        console.log(result);
        result.forEach(function (element) {
            this.moths.create(element.x, element.y, 'moth');
        }, this);
        this.moths.children.forEach(function (element) {
            element.animations.add('flyingLeft', [0, 1]);
            element.animations.add('flyingRight', [2, 3]);
            element.counter = 0;

            element.spawnPx = element.x;
            element.spawnPy = element.y;

            element.chasing = false;
            element.running = false;
        }, this);
    },
    createSkull: function () {
        this.skulls = this.game.add.group(this.monsters);
        this.skulls.enableBody = true;
        result = this.findObjectsByType('skull', this.map, 'ObjectLayer');
        console.log(result);
        result.forEach(function (element) {
            this.skulls.create(element.x, element.y, 'skull');
        }, this);
        this.skulls.children.forEach(function (element) {

            element.animations.add('flyingLeft', [0, 1]);
            element.animations.add('flyingRight', [2, 3]);

            element.spawnPx = element.x;
            element.spawnPy = element.y;


        }, this);
    },
    createFromTiledObject: function (element, group, name) {
        var sprite = group.create(element.x, element.y, name);

        Object.keys(element.properties).forEach(function (key) {
            sprite[key] = element.properties[key];
        });
    },
    createGashapon: function () {

        this.game.physics.enable(this.cheatgashapon, Phaser.Physics.ARCADE);
        this.gashapon.enableBody = true;
        this.gashapon.body.gravity.y = 1000;
        this.gashapon.animations.add('useGashapon', [0, 1, 2, 3, 4]);
    },
    createStar: function (x, y) {

        this.star = this.game.add.sprite(x, y, 'goldStar');
        this.game.physics.enable(this.star, Phaser.Physics.ARCADE);
        this.star.enableBody = true;
        this.star.body.bounce.set(0.7);
        this.star.body.gravity.y = 400;
    },
    createDoll: function () {

        this.doll = this.game.add.sprite(x, y, 'hauntedDoll');
        this.game.physics.enable(this.doll, Phaser.Physics.ARCADE);
        this.doll.enableBody = true;
        this.doll.body.bounce.set(0.2);
        this.doll.body.gravity.y = 300;
    },
    createStopwatch: function () {

        this.stopwatch = this.game.add.sprite(x, y, 'stopwatch');
        this.game.physics.enable(this.stopwatch, Phaser.Physics.ARCADE);
        this.stopwatch.enableBody = true;
        this.stopwatch.body.bounce.set(0.4);
        this.stopwatch.body.gravity.y = 400;
    },

    // TODO Order:
    // COLLISION/LOGIC -> INPUT/GUI -> P MOVEMENT -> AI MOVEMENT
    update: function () {

        ghostTouchFlag = false;
        if (this.button.length > 0) {
            var button = this.button.children[0];
            button.frame = 0;
        }

        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.box, this.blockedLayer);
        this.game.physics.arcade.overlap(this.player, this.checkPoints, this.passCheckPoint, null, this);
        this.game.physics.arcade.overlap(this.player, this.spikes, this.stepOnSpike, null, this);
        this.game.physics.arcade.collide(this.player, this.box, this.moveBox, null, this);
        this.game.physics.arcade.collide(this.box, this.blockedLayer);
        this.game.physics.arcade.collide(this.player, this.box);
        this.game.physics.arcade.overlap(this.box, this.button, this.boxOnButton, null, this);
        this.game.physics.arcade.collide(this.blockedLayer, this.door);
        this.game.physics.arcade.overlap(this.player, this.bear, this.winningBear, null, this);
        this.game.physics.arcade.overlap(this.player, this.ghost, this.ghostTouch, null, this);
        this.game.physics.arcade.collide(this.moths, this.blockedLayer);
        this.game.physics.arcade.collide(this.moths, this.box);
        this.game.physics.arcade.overlap(this.moths, this.player, this.mothTouch, null, this);
        this.game.physics.arcade.overlap(this.star, this.player, this.useStar, null, this);
        this.game.physics.arcade.overlap(this.player, this.catapult, this.useCatapult, null, this);
        this.game.physics.arcade.collide(this.star, this.blockedLayer);
        this.game.physics.arcade.collide(this.cheatgashapon, this.blockedLayer);


        if (this.door.length > 0) {
            var door = this.door.children[0];
        }

        if (this.button.length > 0 && this.door.length > 0) {
            if (button.frame == 0) {
                this.game.physics.arcade.collide(this.player, this.door);
                door.frame = 0;
            }
            else {
                door.frame = 1;
            }
        }

        this.box.children.forEach(function (element) {
            if (!element.body.blocked.down && !mute) {
                if (boxLandList.indexOf(element) == -1) {
                    boxLandList.push(element);
                }
            }
            if (boxLandList.indexOf(element) != -1 && element.body.blocked.down && !mute) {
                boxLandList.splice(boxLandList.indexOf(element));
                boxLandingSound = game.add.audio('blockLanding');
                boxLandingSound.play();
            }
            //console.log(boxOnFloor);
        }, this);


        terrorBar.width = (terror / 100) * terrorWidth;
        if (terrorBar.width > 300) {
            terrorBar.width = 300;
        }

        terrorBar.x = 64 - terrorBar.width / 2;

        if (terror == 100) {
            this.terrified();
        }

        /* if(terror == 95 && dollFlag)
        {
            this.useDoll();
        } */

        if (pauseButton.input.pointerOver()) {
            pauseButton.frame = 1;
        } else {
            pauseButton.frame = 0;
        }

        if (!pauseFlag && !winState) {
            //Cheat code Handler
            if (this.shiftKey.isDown) {
                if (this.pKey.isDown && !this.cheatDone) {
                    this.cheatDone = true;
                    this.cheatgashapon = this.game.add.sprite(this.player.x + 256, this.player.y - 36, 'gashapon');
                    this.game.physics.enable(this.cheatgashapon, Phaser.Physics.ARCADE);
                    this.cheatgashapon.enableBody = true;
                    this.cheatgashapon.body.gravity.y = 1000;
                    this.cheatgashapon.animations.add('useGashapon', [0, 1, 2, 3, 4]);
                    this.cheatgashapon.stock = 1;
                    this.cheatgashapon.anchor.setTo(0.5);
                    this.useCheatGashapon();
                }
            }


            //Jump
            if (this.spaceKey.isUp) {
                jumpFlag = false;
            }

            //lighter
            if (this.rKey.isUp || (!this.player.body.onFloor() && !this.player.body.touching.down)) {
                lighting = false;
                lighterOpenSoundFlag = false;
            }
            else if (this.player.body.onFloor() || this.player.body.touching.down) {
                lighting = true;
                if (!lighterOpenSoundFlag && !mute) {
                    lighterOpenSoundFlag = true;
                    var lighterOpenSound = this.game.add.audio('lighterOpen');
                    lighterOpenSound.play();
                }
            }

            //Left-Right Move
            if ((this.dKey.isDown || cursors.right.isDown) && (this.aKey.isDown || cursors.left.isDown)) {

                if ((this.player.body.touching.down || this.player.body.onFloor()) && !spikedFlag) {
                    this.player.body.velocity.x = 0;
                    if (lighting)
                        this.player.animations.play("idlelighter" + (leftFlag ? 'left' : 'right'), 10);
                    else
                        this.player.animations.play("idle" + (leftFlag ? 'left' : 'right'), 10);
                }
            }
            else if (this.aKey.isDown || cursors.left.isDown) {
                leftFlag = true;
                rightFlag = false;

                if (this.player.body.velocity.x > -1 * moveSpeed)
                    this.player.body.velocity.x = -1 * moveSpeed;

                if ((this.player.body.touching.down || this.player.body.onFloor()) && !spikedFlag) {
                    this.player.body.velocity.x = -1 * moveSpeed;
                    if (lighting)
                        this.player.animations.play("walklighterleft", 10);
                    else if (grabFlag)
                        this.player.animations.play("walkgrableft", 10);
                    else
                        this.player.animations.play("walkleft", 10);
                }
            }
            else if (this.dKey.isDown || cursors.right.isDown) {
                rightFlag = true;
                leftFlag = false;

                if (this.player.body.velocity.x < moveSpeed)
                    this.player.body.velocity.x = moveSpeed;
                if ((this.player.body.touching.down || this.player.body.onFloor()) && !spikedFlag) {
                    this.player.body.velocity.x = moveSpeed;
                    if (lighting)
                        this.player.animations.play("walklighterright", 10);
                    else if (grabFlag)
                        this.player.animations.play("walkgrabright", 10);
                    else
                        this.player.animations.play("walkright", 10);
                }
            }
            else {

                if ((this.player.body.touching.down || this.player.body.onFloor()) && !spikedFlag) {
                    this.player.body.velocity.x = 0;
                    if (lighting)
                        this.player.animations.play("idlelighter" + (leftFlag ? 'left' : 'right'), 10);
                    else
                        this.player.animations.play("idle" + (leftFlag ? 'left' : 'right'), 10);
                }
            }

            grabFlag = false;
            //reset grab in case we walk away from box

            // Stop from drop-triple jump
            // if(!(this.player.body.blocked.down || this.player.body.onFloor()) && jumpCounter == 0)
            //     jumpCounter = 1;
            // Actually, lets allow it

            //Jump
            if (this.spaceKey.isDown && jumpCounter <= 1 && !jumpFlag && !spikedFlag) {
                //console.log(jumpCounter,jumpFlag);
                if (leftFlag)
                    this.player.animations.play("jumpupleft", 10);
                else
                    this.player.animations.play("jumpupright", 10);

                this.player.body.velocity.y = jumpHeight;
                jumpFlag = true;
                jumpCounter += 1;
            }

            if (jumpCounter > 0 && (this.player.body.touching.down == true || this.player.body.onFloor()) && !spikedFlag) {

                if (leftFlag)
                    this.player.animations.play("jumpdownleft", 10);
                else
                    this.player.animations.play("jumpdownright", 10);

                jumpCounter = 0;
                jumpFlag = false;
            }

            spikedFlag = false;

            if (this.player.body.velocity.x > 0 && this.player.body.isMoving) {
                this.background.tilePosition.x -= 0.5;
            }
            else if (this.player.body.velocity.x < 0 && this.player.body.isMoving) {
                this.background.tilePosition.x += 0.5;
            }

            this.player.bringToTop();
        }

        this.ghostMovement();
        this.mothMovement();
        //this.skullMovement();


        if (cheatStar && !winState && !pauseFlag) {
            moveSpeed = 1000;
            jumpHeight = -900;
            terror = 0;
        }

        //reset box velocity
        this.reset();
    },
    // TODO: add hover to pause menu
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
    passCheckPoint: function (player, checkPoint) {
        this.restartx = checkPoint.position.x + 128;
        this.restarty = checkPoint.position.y - 256;
        this.tilepx = this.background.tilePosition.x;
        terror = 0;
    },
    useCheckPoint: function () {
        this.player.position.x = this.restartx;
        this.player.position.y = this.restarty;
        this.background.tilePosition.x = this.tilepx;

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        this.ghost.children.forEach(function (element) {
            element.x = element.spawnPx;
            element.y = element.spawnPy;
        }, this);

        this.moths.children.forEach(function (element) {
            element.x = element.spawnPx;
            element.y = element.spawnPy;
        }, this);

        /* this.skulls.children.forEach(function (element){
            element.x = element.spawnPx;
            element.y = element.spawnPy;
        }, this); */

        this.box.children.forEach(function (element) {
            element.x = element.spawnPx;
            element.y = element.spawnPy;
        }, this);

        terror = 0;
    },
    //step on spike event
    stepOnSpike: function () {

        if (!starFlag || !cheatStar) {
            if (!spikedFlag) {
                this.player.animations.play('spiked' + (rightFlag ? 'right' : 'left'), 10);
            }
            spikedFlag = true;
            if (this.player.body.onFloor())
                this.useCheckPoint();
        }
    },
    //pushing box event
    moveBox: function (player, box) {
        if (!boxMoveSoundFlag && !mute) {
            var boxMoveSound = game.add.audio('boxMoving');
            boxMoveSound.volume = 0.1;
            boxMoveSoundFlag = true;
            boxMoveSound.play();
            boxMoveSound.onStop.add(function () {
                boxMoveSoundFlag = false;
            })
        }
        grabFlag = true;
        if (player.x <= box.position.x - 256 || player.x >= box.position.x + 256) {
            if (box.position.x > this.player.x) {
                box.body.velocity.x += 32;
            }
            else {
                box.body.velocity.x -= 32;
            }
        }
    },
    useCheatGashapon: function () {
        if (!gashaponSoundFlag && !mute) {
            var gashaponSound = game.add.audio('gachaponUse');
            gashaponSound.volume = 0.1;
            gashaponSoundFlag = true;
            gashaponSound.play();
            gashaponSound.onStop.add(function () {
                gashaponSound = false;
            })
        }
        if (this.cheatgashapon.stock > 0) {
            this.cheatgashapon.animations.play('useGashapon', 10)
            this.createStar(this.cheatgashapon.x, this.cheatgashapon.y);
            this.cheatgashapon.stock--;
        }
    },
    useCheatStar: function () {
        cheatStar = true;
        if (this.player.overlap(this.star)) {
            this.star.kill();
        }
    },

    useStar: function () {
        starFlag = true;
        console.log(starFlag);
        if (this.player.overlap(this.star)) {
            this.star.kill();
        }

    },
    useCatapult: function (player, catapult) {

        catapult.animations.play('useCatapult', 30);

        this.player.body.velocity.x = 3000;
        this.player.body.velocity.y = -300;

        catapult.frame = 0;
    },
    //reset
    reset: function () {
        this.box.children.forEach(function (element) {
            element.body.velocity.x = 0;
        }, this);
        this.door.children.forEach(function (element) {
            element.body.velocity.x = 0;
        }, this);
    },
    //button activation event
    boxOnButton: function (box, button) {
        button.frame = 1;
        if (!doorOpenSoundFlag && !mute) {
            var doorOpenSound = game.add.audio('doorOpen');
            doorOpenSoundFlag = true;
            doorOpenSound.play();

        }
    },
    //ghost movement
    ghostMovement: function () {
        this.ghost.children.forEach(function (element) {
            if (this.player.position.x < element.body.position.x && this.player.position.x + 1280 > element.body.position.x) {
                this.game.physics.arcade.moveToObject(element, this.player, 300);
                if (lighting) {
                    element.body.velocity.x *= -1;
                    element.body.velocity.y = -200;
                    element.animations.play('scaredright', 10, true);
                }
                else {
                    element.animations.play('chasingleft', 10, true);
                }

                if (!ghostSoundFlag && !mute) {
                    ghostSound = game.add.audio('ghostSound');
                    ghostSoundFlag = true;
                    ghostSound.play();
                    ghostSound.onStop.add(function () {
                        ghostSoundFlag = false;
                    })
                }
            }
            else if (this.player.position.x > element.body.position.x && this.player.position.x - 1280 < element.body.position.x) {
                this.game.physics.arcade.moveToObject(element, this.player, 200);
                if (lighting) {
                    element.body.velocity.x *= -1;
                    element.body.velocity.y = -200;
                    element.animations.play('scaredleft', 10, true);
                }
                else {
                    element.animations.play('chasingright', 10, true);
                }

                if (!ghostSoundFlag && !mute) {
                    ghostSound = game.add.audio('ghostSound');
                    ghostSoundFlag = true;
                    ghostSound.play();
                    ghostSound.onStop.add(function () {
                        ghostSoundFlag = false;
                    })
                }
            }
            else {
                element.body.velocity.y = 400;
                element.animations.play('floatingleft', 10, true);
                if (element.y > 1664) {
                    element.body.velocity.y = -400;
                    element.animations.play('floatingright', 10, true);
                }
                else if (element.y < 256) {
                    element.body.velocity.y = 400;
                    element.animations.play('floatingleft', 10, true);
                }
            }
        }, this)
    },
    ghostTouch: function () {
        terror += 0.5;
        ghostTouchFlag = true;
        if (leftFlag) {
            this.player.animations.play('gainterrorleft', 10);
        }
        else {
            this.player.animations.play('gainterrorright', 10);
        }
        if (!takeDamageSoundFlag && !mute && !winState) {
            var takeDamageSound = game.add.audio('takeDamage');
            takeDamageSoundFlag = true;
            takeDamageSound.play();
            takeDamageSound.onStop.add(function () {
                takeDamageSoundFlag = false;
            })
        }
    },
    mothMovement: function () {
        this.moths.children.forEach(function (element) {
            if (!lighting) {
                element.body.velocity.y = -400;
                //initialize a speed every 10 frames
                if (element.counter == 0) {
                    var c = Math.floor(Math.random() * 2);
                    if (c == 0) {
                        element.body.velocity.x = -400;
                    }
                    else {
                        element.body.velocity.x = 400;
                    }
                    element.counter += 1;
                }
                //reset the counter
                else if (element.counter >= 20) {
                    element.counter = 0;
                }
                else {
                    element.counter += 1;
                }
                if (element.body.position.y <= 128) {
                    element.body.velocity.y = 0;
                }
                if (element.body.position.x <= 128 && element.body.velocity.x < 0) {
                    element.body.velocity.x *= -1;
                }
                else if (element.body.position.x >= this.map.width * 127 && element.body.velocity.x > 0) {
                    element.body.velocity.x *= -1;
                }
                if (element.body.blocked.left || element.body.blocked.right) {
                    element.body.velocity.x = 0;
                }
            }
            else {
                // Moth at left of the player
                if (element.body.position.x > this.player.position.x - 1280 && element.body.position.x < this.player.position.x) {
                    this.game.physics.arcade.moveToObject(element, this.player, 300);
                    if (element.body.blocked.right) {
                        element.body.velocity.x = 0;
                    }
                    if (element.body.blocked.down) {
                        element.body.velocity.y *= -1;
                    }
                }
                //Moth at right of the player
                else if (this.player.position.x < element.body.position.x && this.player.position.x + 1280 > element.body.position.x) {
                    this.game.physics.arcade.moveToObject(element, this.player, 300);
                    if (element.body.blocked.left) {
                        element.body.velocity.x = 0;
                        if (!element.body.blocked.top && element.body.velocity.y > 0) {
                            element.body.velocity.y *= -1;
                        }
                    }
                    if (element.body.blocked.down) {
                        element.body.velocity.y *= -1;
                    }
                }
            }
            if (element.body.velocity.x >= 0) {
                element.animations.play('flyingRight', 10, true);
            }
            else {
                element.animations.play('flyingLeft', 10, true);
            }
        }, this);
    },
    mothTouch: function () {
        terror += 1;
        if (!takeDamageSoundFlag && !mute && !winState) {
            var takeDamageSound = game.add.audio('takeDamage');
            takeDamageSoundFlag = true;
            takeDamageSound.play();
            takeDamageSound.onStop.add(function () {
                takeDamageSoundFlag = false;
            })
        }
    },
    createCutSceneBar: function () {
        var topCutSceneBarTween = this.game.add.tween(topCutSceneBar);
        topCutSceneBarTween.to({
            alpha: 1
        }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
        var bottomCutSceneBarTween = this.game.add.tween(bottomCutSceneBar);
        bottomCutSceneBarTween.to({
            alpha: 1
        }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.input.enabled = false;
    },
    destroyCutSceneBar: function () {
        var topCutSceneBarTween = this.game.add.tween(topCutSceneBar);
        topCutSceneBarTween.to({
            alpha: 0
        }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
        var bottomCutSceneBarTween = this.game.add.tween(bottomCutSceneBar);
        bottomCutSceneBarTween.to({
            alpha: 0
        }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.input.enabled = true;
    },
    createChatBox: function (text, time) {
        var textStyle = {
            font: "50px Arial",
            fill: "#FFFFFF",
            align: "center"
        };
        chatBox = game.add.text(this.player.position.x + 50, this.player.position.y - 150, text, textStyle);
        chatBox.anchor.setTo(0.5, 0.5);
        chatBoxBar = game.add.sprite(this.player.position.x + 50, this.player.position.y - 100, 'chatBoxBar');
        chatBoxBar.scale.setTo(0.8);
        chatBoxBar.anchor.setTo(0.5, 0.5);
        game.time.events.add(Phaser.Timer.SECOND * time, this.destroyChatBox, this);
    },
    destroyChatBox: function () {
        chatBox.destroy();
        chatBoxBar.destroy();
    },
    //winning event
    winningBear: function () {
        winState = true;
        game.physics.arcade.isPaused = true;
        if (!mute) {
            var winMusic = game.add.audio('winMusic');
            backgroundMusic.pause();
            winMusic.play();
            winMusic.onStop.add(function () {
                if (!mute) {
                    backgroundMusic.resume();
                }
            });
        }
        this.bear.destroy();
        this.ghost.children.forEach(function (element) {

            element.kill();
        });

        //reset item flags and cheats
        cheatStar = false;
        starFlag = false;
        dollFlag = false;
        timerFlag = false;
        cheatDone = false;

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

        if (mapNum < 3) {
            pauseNext = game.add.sprite(game.camera.x + 1024, 900, 'nextLevelButton');
            pauseNext.anchor.setTo(0.5);
            pauseNext.inputEnabled = true;
            pauseNext.events.onInputDown.add(function () {
                game.physics.arcade.isPaused = false;
                if (mapNum == 6) {
                    lv = 6;
                    game.state.start('MainMenu', true, false, completed, lv, mute, this.bgMusic);
                    //ghostSound.stop();
                }
                else if (lv < mapNum + 1) {
                    lv = mapNum + 1;
                    game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, 'level' + lv.toString());
                    //ghostSound.stop();
                }
            }, t);
        }
        pauseMenu = game.add.sprite(game.camera.x + 1024, 1250, 'mainMenuButton');
        pauseMenu.anchor.setTo(0.5);
        pauseMenu.inputEnabled = true;
        pauseMenu.events.onInputDown.add(function () {
            game.physics.arcade.isPaused = false;
            if (mapNum == 6) {
                lv = 6;
            }
            else if (lv < mapNum + 1) {
                lv = mapNum + 1;
            }
            game.state.start('MainMenu', true, false, completed, lv, mute, this.bgMusic);
            //ghostSound.stop();
        }, t);
    },
    terrified: function () {
        pauseFlag = true;
        game.physics.arcade.isPaused = true;
        this.ghost.children.forEach(function (element) {
            element.animations.play('winning', 10, true);
        });
        if (leftFlag) {
            this.player.animations.play('interrifiedleft', 10, true);
        }
        else {
            this.player.animations.play('interrifiedright', 10, true);
        }
        pauseButton.destroy();
        pauseWhite = game.add.sprite(game.camera.x + 1024, 1024, 'white');
        pauseWhite.anchor.setTo(0.5, 0.5);
        pauseWhite.alpha = 0.5;
        if (!mute) {
            var terrifiedMusic = game.add.audio('terrified');
            backgroundMusic.pause();
            terrifiedMusic.play();
            terrifiedMusic.onStop.add(function () {
                if (!mute) {
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

        pauseRespawn = game.add.sprite(game.camera.x + 1024, 800, 'respawnButton');
        pauseRespawn.anchor.setTo(0.5);
        pauseRespawn.inputEnabled = true;
        pauseRespawn.events.onInputDown.add(function () {
            this.useCheckPoint();
            pauseWhite.destroy();
            text.destroy();
            pauseRespawn.destroy();
            pauseRestart.destroy();
            pauseMenu.destroy();
            pauseButton = this.game.add.sprite(2000, 100, 'pauseButton');
            pauseButton.anchor.setTo(0.5);
            pauseButton.scale.setTo(0.5);
            pauseButton.inputEnabled = true;
            pauseButton.fixedToCamera = true;
            pauseButton.events.onInputDown.add(this.pauseGame, this);
            game.physics.arcade.isPaused = false;
            pauseFlag = false;
            //ghostSound.stop();
        }, t);


        pauseRestart = game.add.sprite(game.camera.x + 1024, 1100, 'restartButton');
        pauseRestart.anchor.setTo(0.5);
        pauseRestart.inputEnabled = true;
        pauseRestart.events.onInputDown.add(function () {
            game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, mapname);
            game.physics.arcade.isPaused = false;
            pauseFlag = false;
            //ghostSound.stop();
        }, t);

        pauseMenu = game.add.sprite(game.camera.x + 1024, 1400, 'mainMenuButton');
        pauseMenu.anchor.setTo(0.5);
        pauseMenu.inputEnabled = true;
        pauseMenu.events.onInputDown.add(function () {
            game.state.start('MainMenu', true, false, completed, lv, mute, this.bgMusic);
            game.physics.arcade.isPaused = false;
            //ghostSound.stop();
        }, t);
    },
    pauseGame: function () {
        if (!winState) {
            game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
            if (game.physics.arcade.isPaused) {
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
                    //ghostSound.stop();
                }, t);

                pauseMenu = game.add.sprite(game.camera.x + 1024, 1350, 'mainMenuButton');
                pauseMenu.anchor.setTo(0.5);
                pauseMenu.inputEnabled = true;
                pauseMenu.events.onInputDown.add(function () {
                    t.pauseGame();
                    game.state.start('MainMenu', true, false, completed, lv, mute, this.bgMusic);
                    //ghostSound.stop();

                }, t);

                pauseFlag = true;

            } else {
                pauseWhite.destroy();
                text.destroy();
                pauseResume.destroy();
                pauseRestart.destroy();
                pauseMenu.destroy();

                pauseFlag = false;
            }
        }


    },
    shutdown: function () {
        game.world.setBounds(0, 0, 2048, 2048);
    }

};