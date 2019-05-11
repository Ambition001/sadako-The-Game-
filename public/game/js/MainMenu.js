var sadako = sadako || {};

//loading the game assets
sadako.MainMenu = function () {};

var playButton;
var helpButton;
var aboutButton;
var soundButton;
var completed = false;
var lv;
var mute = false;


sadako.MainMenu.prototype = {
    init: function (complete, level, sound, bgMusic) {
        completed = complete;
        lv = level;
        mute = sound;
        this.bgMusic = bgMusic;

    },
    create: function () {
        var firstTime = this.bgMusic == undefined;

        if(firstTime){
            this.bgMusic = this.game.add.audio('bgMusic1');
            this.bgMusic.play();
            this.bgMusic.onStop.add(function(){this.bgMusic.play();},this);
        }
        if(this.bgMusic.name != "bgMusic1"){
            this.bgMusic.onStop._bindings = new Array(); 
            this.bgMusic.stop();
            this.bgMusic = this.game.add.audio('bgMusic1');
            this.bgMusic.play();
            this.bgMusic.onStop.add(function(){this.bgMusic.play();},this);
        }
        
        var mainMenuTitle = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 400, 'mainMenuTitle');
        mainMenuTitle.anchor.setTo(0.5, 0.5);
        mainMenuTitle.alpha = 0;
        var mainMenuTitleTween = this.game.add.tween(mainMenuTitle);
        mainMenuTitleTween.to({
            alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        
        playButton = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playButton');
        playButton.anchor.setTo(0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(this.levelSelect, this);

        // TODO: change helpButton sprite to 'helpButtonA' if completed all levels
        if (completed) {
            helpButton = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 250, 'helpButtonA');
            helpButton.anchor.setTo(0.5);
            helpButton.inputEnabled = true;
            helpButton.events.onInputDown.add(this.helpMenu, this);
        } else {
            helpButton = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 250, 'helpButtonT');
            helpButton.anchor.setTo(0.5);
            helpButton.inputEnabled = true;
            helpButton.events.onInputDown.add(this.helpMenu, this);
        }


        aboutButton = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 500, 'aboutButton');
        aboutButton.anchor.setTo(0.5);
        aboutButton.inputEnabled = true;
        aboutButton.events.onInputDown.add(this.aboutMenu, this);

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
        
        if (playButton.input.pointerOver()) {
            playButton.frame = 1;
        } else {
            playButton.frame = 0;
        }

        if (helpButton.input.pointerOver()) {
            helpButton.frame = 1;
        } else {
            helpButton.frame = 0;
        }

        if (aboutButton.input.pointerOver()) {
            aboutButton.frame = 1;
        } else {
            aboutButton.frame = 0;
        }
    },
    levelSelect: function () {
        this.game.state.start("LevelSelect", true, false, completed, lv, mute, this.bgMusic);
    },
    helpMenu: function () {
        this.game.state.start("HelpMenu", true, false, completed, lv, mute, this.bgMusic);
    },
    aboutMenu: function () {
        this.game.state.start("AboutMenu", true, false, completed, lv, mute, this.bgMusic);
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