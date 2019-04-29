var sadako = sadako || {};


sadako.LevelSelect = function () {};

var backButton;
var completed;
var lv1;
var lv2;
var lv3;
var lv4;
var lv5;
var lv6;
var lv;
var mute;

sadako.LevelSelect.prototype = {
    init: function (complete, level, sound, bgMusic) {
        completed = complete;
        lv = level;
        mute = sound;
        this.bgMusic = bgMusic;
    },
    create: function () {
        var mainMenuTitle = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 800, 'mainMenuTitle');
        mainMenuTitle.anchor.setTo(0.5, 0.5);
        mainMenuTitle.scale.setTo(0.4);
        mainMenuTitle.alpha = 0;
        var mainMenuTitleTween = this.game.add.tween(mainMenuTitle);
        mainMenuTitleTween.to({
            alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);

        var textStyle = {
            font: "100px Arial",
            fill: "#000000",
            align: "center"
        };
        var text = this.game.add.text(this.game.world.centerX - 700, this.game.world.centerY - 400, "Select a level", textStyle);
        text.anchor.setTo(0.5, 0.5);
        text.alpha = 0;
        var t = this.game.add.tween(text);
        t.to({
            alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 100, 0, false);

        lv1 = this.game.add.sprite(this.game.world.centerX - 700, this.game.world.centerY, 'levelSelect1');
        lv1.anchor.setTo(0.5);
        lv1.inputEnabled = true;
        lv1.events.onInputDown.add(this.level1, this);

        lv2 = this.game.add.sprite(this.game.world.centerX - 400, this.game.world.centerY, 'levelSelect2');
        lv2.anchor.setTo(0.5);
        lv2.inputEnabled = true;
        lv2.events.onInputDown.add(this.level2, this);
        lv2.inputEnabled = false;

        lv3 = this.game.add.sprite(this.game.world.centerX - 100, this.game.world.centerY, 'levelSelect3');
        lv3.anchor.setTo(0.5);
        lv3.inputEnabled = true;
        lv3.events.onInputDown.add(this.level3, this);
        lv3.inputEnabled = false;

        lv4 = this.game.add.sprite(this.game.world.centerX + 200, this.game.world.centerY, 'levelSelect4');
        lv4.anchor.setTo(0.5);
        lv4.inputEnabled = true;
        lv4.events.onInputDown.add(this.level4, this);
        lv4.inputEnabled = false;

        lv5 = this.game.add.sprite(this.game.world.centerX + 500, this.game.world.centerY, 'levelSelect5');
        lv5.anchor.setTo(0.5);
        lv5.inputEnabled = true;
        lv5.events.onInputDown.add(this.level5, this);
        lv5.inputEnabled = false;

        lv6 = this.game.add.sprite(this.game.world.centerX + 800, this.game.world.centerY, 'levelSelect6');
        lv6.anchor.setTo(0.5);
        lv6.inputEnabled = true;
        lv6.events.onInputDown.add(this.level6, this);
        lv6.inputEnabled = false;


        backButton = this.game.add.sprite(this.game.world.centerX - 750, this.game.world.centerY + 700, 'backButton');
        backButton.anchor.setTo(0.5, 0.5);
        backButton.scale.setTo(0.5);
        backButton.inputEnabled = true;
        backButton.events.onInputDown.add(this.back, this);


        switch (lv) {
            case 6:
                lv6.inputEnabled = true;
            case 5:
                lv5.inputEnabled = true;
            case 4:
                lv4.inputEnabled = true;
            case 3:
                lv3.inputEnabled = true;
            case 2:
                lv2.inputEnabled = true;
            default:
                break;
        }

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
        if (lv1.input.pointerOver()) {
            lv1.frame = 1;
        } else {
            lv1.frame = 0;
        }

        if (!lv2.inputEnabled) {
            lv2.frame = 2;
        } else {
            if (lv2.input.pointerOver()) {
                lv2.frame = 1;
            } else {
                lv2.frame = 0;
            }
        }

        if (!lv3.inputEnabled) {
            lv3.frame = 2;
        } else {
            if (lv3.input.pointerOver()) {
                lv3.frame = 1;
            } else {
                lv3.frame = 0;
            }
        }

        if (!lv4.inputEnabled) {
            lv4.frame = 2;
        } else {
            if (lv4.input.pointerOver()) {
                lv4.frame = 1;
            } else {
                lv4.frame = 0;
            }
        }

        if (!lv5.inputEnabled) {
            lv5.frame = 2;
        } else {
            if (lv5.input.pointerOver()) {
                lv5.frame = 1;
            } else {
                lv5.frame = 0;
            }
        }

        if (!lv6.inputEnabled) {
            lv6.frame = 2;
        } else {
            if (lv6.input.pointerOver()) {
                lv6.frame = 1;
            } else {
                lv6.frame = 0;
            }
        }

    },
    back: function () {
        this.game.state.start('MainMenu', true, false, completed, lv, mute, this.bgMusic);
    },
    level1: function () {
        this.game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, 'level1');
    },
    level2: function () {
        this.game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, 'level2');
    },
    level3: function () {
        this.game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, 'level3');
    },
    level4: function () {
        this.game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, 'level4');
    },
    level5: function () {
        this.game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, 'level5');
    },
    level6: function () {
        this.game.state.start('Game', true, false, completed, lv, mute, this.bgMusic, 'level6');
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