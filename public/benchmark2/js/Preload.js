var sadako = sadako || {};

//loading the game assets
sadako.Preload = function () {};

var load = false;
var backstory = false;
var escapeKey;

sadako.Preload.prototype = {
    preload: function () {



        // TODO: load game assets(tilemap/image/sprites/audio)
        
        // Load for mainMenu
        this.load.image('mainMenuTitle', 'assets/images/mainMenu/title.png');
        this.load.spritesheet('playButton', 'assets/images/mainMenu/playButton.png',512,300);
        this.load.spritesheet('helpButtonT', 'assets/images/mainMenu/helpButtonT.png',512,300);
        this.load.spritesheet('helpButtonA', 'assets/images/mainMenu/helpButtonA.png',512,300);
        this.load.spritesheet('aboutButton', 'assets/images/mainMenu/aboutButton.png',512,300);

        // Load for helpMenu
        this.load.image('helpMenu1', 'assets/images/helpMenu/help1.png');
        this.load.image('helpMenu2', 'assets/images/helpMenu/help2.png');
        this.load.image('rightArrow', 'assets/images/helpMenu/rightArrow.png');
        this.load.image('leftArrow', 'assets/images/helpMenu/leftArrow.png');
        this.load.image('backButton', 'assets/images/helpMenu/backButton.png');
        
        // Load for aboutMenu
        this.load.image('aboutMenu', 'assets/images/aboutMenu/about.png');

        load = true;


    },
    create: function () {
        var preloadimg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 400, 'preloadimage');
        preloadimg.anchor.setTo(0.5, 0.5);
        preloadimg.alpha = 0;
        var preloadtween = this.game.add.tween(preloadimg);
        preloadtween.to({
            alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);

        var textStyle = {
            font: "48px Arial",
            fill: "#000000",
            align: "center"
        };
        var preloadtext = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Backstory here!!!!!!!", textStyle);
        preloadtext.anchor.setTo(0.5, 0.5);
        preloadtext.alpha = 0;
        var t = this.game.add.tween(preloadtext);
        t.to({
            alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 100, 0, false);

        var loadDoneText = this.game.add.text(this.game.world.centerX + 200, this.game.world.centerY - 1024, "Load Completed, Press ESC to skip", textStyle);
        loadDoneText.addColor("#FF0000", 22);
        loadDoneText.addColor("#000000", 25);
        escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escapeKey.onDown.add(function () {
            backstory = true;
        }, this);

        this.game.time.events.add(Phaser.Timer.SECOND * 20, backstorytoggle, this);
    },
    update: function () {
        if (backstory && load) {
            this.game.state.start('MainMenu', true, false, false);
        }
    }
};

function backstorytoggle() {
    backstory = true;
}