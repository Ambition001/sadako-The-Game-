var sadako = sadako || {};

//loading the game assets
sadako.MainMenu = function () {};

var playButton;
var helpButton;
var aboutButton;
var completed = false;


sadako.MainMenu.prototype = {
    init: function(complete) {
        completed = complete;
    },
    preload: function () {


    },
    create: function () {
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
        if(completed){
            helpButton = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY+250, 'helpButtonA');
            helpButton.anchor.setTo(0.5);
            helpButton.inputEnabled = true;
            helpButton.events.onInputDown.add(this.helpMenu, this);
        }else{
            helpButton = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY+250, 'helpButtonT');
            helpButton.anchor.setTo(0.5);
            helpButton.inputEnabled = true;
            helpButton.events.onInputDown.add(this.helpMenu, this);
        }


        aboutButton = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY+500, 'aboutButton');
        aboutButton.anchor.setTo(0.5);
        aboutButton.inputEnabled = true;
        aboutButton.events.onInputDown.add(this.aboutMenu, this);

    },
    update: function () {
        if(playButton.input.pointerOver()){
            playButton.frame = 1;
        }else{
            playButton.frame = 0;
        }

        if(helpButton.input.pointerOver()){
            helpButton.frame = 1;
        }else{
            helpButton.frame = 0;
        }

        if(aboutButton.input.pointerOver()){
            aboutButton.frame = 1;
        }else{
            aboutButton.frame = 0;
        }
    },
    levelSelect: function(){
        alert("play");
    },
    helpMenu: function() {
        this.game.state.start("HelpMenu");
    },
    aboutMenu: function() {
        this.game.state.start("AboutMenu");
    }
};