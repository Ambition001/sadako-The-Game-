var sadako = sadako || {};


sadako.HelpMenu = function () {};

var backButton;
var arrowButton;
var helpimg;
var arrowCounter;
var completed;
var lv;
var mute;
var sadakos;
var items;

sadako.HelpMenu.prototype = {
    init: function (complete, level, sound, bgMusic) {
        completed = complete;
        lv = level;
        mute = sound;
        this.bgMusic = bgMusic;
        sadakos = [];
        items = [];
    },
    create: function () {

        var mainMenuTitle = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 800, 'mainMenuTitle');
        mainMenuTitle.anchor.setTo(0.5, 0.5);
        mainMenuTitle.scale.setTo(0.4)
        mainMenuTitle.alpha = 0;
        var mainMenuTitleTween = this.game.add.tween(mainMenuTitle);
        mainMenuTitleTween.to({
            alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);

        helpimg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'helpMenu1');
        helpimg.anchor.setTo(0.5, 0.5);
        helpimg.scale.setTo(1.2);

        arrowButton = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 400, 'rightArrow');
        arrowButton.anchor.setTo(0.5, 0.5);
        arrowButton.scale.setTo(0.5);
        arrowButton.inputEnabled = true;
        arrowButton.events.onInputDown.add(this.arrowClicked, this);
        arrowCounter = 0;

        backButton = this.game.add.sprite(this.game.world.centerX - 750, this.game.world.centerY + 700, 'backButton');
        backButton.anchor.setTo(0.5, 0.5);
        backButton.scale.setTo(0.5);
        backButton.inputEnabled = true;
        backButton.events.onInputDown.add(this.back, this);

        soundButton = this.game.add.sprite(this.game.world.centerX + 900, this.game.world.centerY - 950, 'soundButton');
        soundButton.anchor.setTo(0.5);
        soundButton.scale.setTo(0.5);
        soundButton.inputEnabled = true;
        soundButton.events.onInputDown.add(this.soundToggle, this);
        if(mute){
            soundButton.frame = 1;
        }else{
            soundButton.frame = 0;
        }

        this.player = this.game.add.sprite(935,710,'sadako');
        this.player.scale.setTo(0.4);
        this.player.animations.add('walkleft',[5,6,7,8,9,10,11,12]);
        this.player.animations.play('walkleft',10,true);
        sadakos.push(this.player);

        this.player = this.game.add.sprite(1720,705,'sadako');
        this.player.scale.setTo(0.4);
        this.player.animations.add('idlelighterleft',[19,20,21,22,23,24,25]);
        this.player.animations.play('idlelighterleft',10,true);
        sadakos.push(this.player);

        this.player = this.game.add.sprite(935,920,'sadako');
        this.player.scale.setTo(0.4);
        this.player.animations.add('jumpupleft',[13,14,15]);
        this.player.animations.play('jumpupleft',3,true);
        sadakos.push(this.player);

        var item1 = this.game.add.sprite(925,715,'hauntedDoll');
        item1.scale.setTo(0.9);
        item1.visible = false;
        items.push(item1);

        var item2 = this.game.add.sprite(907,930,'goldStar');
        item2.scale.setTo(0.9);
        item2.visible = false;
        items.push(item2);

        // this.player.animations.add('jumpupleft',[13,14,15]);
        // this.player.animations.add('jumpdownleft',[17,18]);
        // this.player.animations.add('idlelighterleft',[19,20,21,22,23,24,25]);
        // this.player.animations.add('walklighterleft',[24,25,26,27,28,29,30]);
        // this.player.animations.add('walkgrableft',[32,33,34,35,36,37,38,39]);
        // this.player.animations.add('idleright',[40,41,42,43,44]);
        // this.player.animations.add('walkright',[45,46,47,48,49,50,51]);
        // this.player.animations.add('jumpupright',[52,53,54,55]);
        // this.player.animations.add('jumpdownright',[57,58]);
        // this.player.animations.add('idlelighterright',[59,60,61,62,63]);
        // this.player.animations.add('walklighterright',[64,65,66,67,68,69,70]);
        // this.player.animations.add('walkgrabright',[72,73,74,75,76,77,78,79,80]);
        // this.player.animations.add('gainterrorright',[81,82,83,84,85]);
        // this.player.animations.add('gainterrorleft',[86,87,88,89,90]);
        // this.player.animations.add('toterrifiedleft',[91,92]);
        // this.player.animations.add('interrifiedleft',[93,94,95,96]);
        // this.player.animations.add('toterrifiedright',[97,98]);
        // this.player.animations.add('interrifiedright',[99,100,101,102]);
        // this.player.animations.add('spikedleft',[103,104,105]);
        // this.player.animations.add('spikedright',[106,107,108]);

    },
    update: function () {
        if (arrowCounter == 0) {
            arrowButton.loadTexture('rightArrow');
            helpimg.loadTexture('helpMenu1');
        } else {
            arrowButton.loadTexture('leftArrow');
            helpimg.loadTexture('helpMenu2');
        }
    },
    arrowClicked: function () {
        if (arrowCounter == 0) {
            arrowCounter = 1;
            for(let i = 0;i<sadakos.length;i++){
                sadakos[i].visible = false;
            }

            for(let i = 0;i<items.length;i++){
                items[i].visible = true;
            }
        } else {
            arrowCounter = 0;
            for(let i = 0;i<items.length;i++){
                items[i].visible = false;
            }

            for(let i = 0;i<sadakos.length;i++){
                sadakos[i].visible = true;
            }
            
        }
    },
    back: function () {
        this.game.state.start('MainMenu', true, false, completed, lv, mute, this.bgMusic);
    },
    soundToggle: function () {
        if(mute){
            soundButton.frame = 0;
            mute = false;
            this.bgMusic.resume();
        }else{
            soundButton.frame = 1;
            mute = true;
            this.bgMusic.pause();  
        }
    }

};