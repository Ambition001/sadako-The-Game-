var sadako = sadako || {};


sadako.HelpMenu = function () {};

var backButton;
var arrowButton;
var helpimg;
var arrowCounter;
var completed;
var lv;
var mute;


sadako.HelpMenu.prototype = {
    init: function (complete, level, sound) {
        completed = complete;
        lv = level;
        mute = sound;
    },
    create: function () {
        this.bgMusic = this.game.add.audio('bgMusic1');
        if(!mute){
            this.bgMusic.stop();
            this.bgMusic.play();
        }else{
            this.bgMusic.stop();
        }
        this.bgMusic.loop = true;
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
        } else {
            arrowCounter = 0;
        }
    },
    back: function () {
        this.game.state.start('MainMenu', true, false, completed, lv, mute);
        this.bgMusic.stop();
    },
    soundToggle: function () {
        if(mute){
            soundButton.frame = 0;
            mute = false;
            this.bgMusic.play();
        }else{
            soundButton.frame = 1;
            mute = true;
            this.bgMusic.stop();
        }
    }

};