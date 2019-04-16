var sadako = sadako || {};

//loading the game assets
sadako.Preload = function () {};

var load = false;
var backstory = false;
var escapeKey;
var lv = 1;
var cheatKey;

sadako.Preload.prototype = {
    preload: function () {



        // TODO: load game assets(tilemap/image/sprites/audio)

        // Load for mainMenu
        this.load.image('mainMenuTitle', 'assets/images/mainMenu/title.png');
        this.load.spritesheet('playButton', 'assets/images/mainMenu/playButton.png', 512, 300);
        this.load.spritesheet('helpButtonT', 'assets/images/mainMenu/helpButtonT.png', 512, 300);
        this.load.spritesheet('helpButtonA', 'assets/images/mainMenu/helpButtonA.png', 512, 300);
        this.load.spritesheet('aboutButton', 'assets/images/mainMenu/aboutButton.png', 512, 300);
        this.load.spritesheet('soundButton', 'assets/images/mainMenu/soundButton.png', 250, 250);

        // Load for helpMenu
        this.load.image('helpMenu1', 'assets/images/helpMenu/help1.png');
        this.load.image('helpMenu2', 'assets/images/helpMenu/help2.png');
        this.load.image('rightArrow', 'assets/images/helpMenu/rightArrow.png');
        this.load.image('leftArrow', 'assets/images/helpMenu/leftArrow.png');
        this.load.image('backButton', 'assets/images/helpMenu/backButton.png');

        // Load for aboutMenu
        this.load.image('aboutMenu', 'assets/images/aboutMenu/about.png');

        // Load for levelSelect
        this.load.spritesheet('levelSelect1', 'assets/images/levelSelect/level1.png', 250, 250);
        this.load.spritesheet('levelSelect2', 'assets/images/levelSelect/level2.png', 250, 250);
        this.load.spritesheet('levelSelect3', 'assets/images/levelSelect/level3.png', 250, 250);
        this.load.spritesheet('levelSelect4', 'assets/images/levelSelect/level4.png', 250, 250);
        this.load.spritesheet('levelSelect5', 'assets/images/levelSelect/level5.png', 250, 250);
        this.load.spritesheet('levelSelect6', 'assets/images/levelSelect/level6.png', 250, 250);

        // Load for real game
        this.load.spritesheet('pauseButton', 'assets/images/game/pause.png', 250, 250);
        this.load.tilemap('level1', 'assets/map/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('basicColor', 'assets/images/BasicColor.png');
        this.load.image('sadakoFullTileSet', 'assets/images/SadakoFullTileSet.png');
        this.load.image('sadakoWoodenCrate', 'assets/images/SadakoWoodenCrate.png');
        this.load.spritesheet('sadakoButton', 'assets/images/SadakoButton.png',256,256);
        this.load.spritesheet('sadakoDoor', 'assets/images/SadakoDoor.png',256,384);
        this.load.image('spike','assets/images/Spike.png');
        this.load.image('checkPoint','assets/images/CheckPoint.png');
        this.load.image('bear','assets/images/SadakoBear.png');
        this.load.spritesheet('sadako', 'assets/sprites/ghost.png', 256, 256);
        this.load.spritesheet('ghost', 'assets/sprites/ghost.png', 256, 256);
        this.load.spritesheet('mainMenuButton', 'assets/images/game/mainMenu.png', 512, 300);
        this.load.spritesheet('nextLevelButton', 'assets/images/game/next.png', 512, 300);
        this.load.spritesheet('restartButton', 'assets/images/game/restart.png', 512, 300);
        this.load.spritesheet('resumeButton', 'assets/images/game/resume.png', 512, 300);
        this.load.image('white', 'assets/images/game/white.png');

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

        cheatKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
        cheatKey.onDown.add(function () {
            lv = 6;
        }, this);

        this.game.time.events.add(Phaser.Timer.SECOND * 20, backstorytoggle, this);
    },
    update: function () {
        if (backstory && load) {
            this.game.state.start('MainMenu', true, false, false, lv, false);
        }
    }
};

function backstorytoggle() {
    backstory = true;
}