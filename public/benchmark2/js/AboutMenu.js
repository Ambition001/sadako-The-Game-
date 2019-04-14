var sadako = sadako || {};


sadako.AboutMenu = function () {};

var backButton;
var aboutimg;
var completed;


sadako.AboutMenu.prototype = {
    init: function(complete) {
        completed = complete;
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

        aboutimg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'aboutMenu');
        aboutimg.anchor.setTo(0.5, 0.5);
        aboutimg.scale.setTo(1.1);



        backButton = this.game.add.sprite(this.game.world.centerX-750, this.game.world.centerY+700, 'backButton');
        backButton.anchor.setTo(0.5, 0.5);
        backButton.scale.setTo(0.5);
        backButton.inputEnabled = true;
        backButton.events.onInputDown.add(this.back, this);



    },
    back: function () {
        this.game.state.start('MainMenu', true, false, completed);
    }

};