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
        var preloadtext = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Sadako is a little girl who has bad dreams after \n her uncle played the horror movie: The Ring.\n And here starts her adventure.", textStyle);
        preloadtext.anchor.setTo(0.5, 0.5);
        preloadtext.alpha = 0;
        var t = this.game.add.tween(preloadtext);
        t.to({
            alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 100, 0, false);

        escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escapeKey.onDown.add(function () {
            backstory = true;
        }, this);

        this.game.time.events.add(Phaser.Timer.SECOND * 20, backstorytoggle, this);


        // Load for mainMenu
        this.load.image('mainMenuTitle', 'assets/images/mainMenu/title.png');
        this.load.spritesheet('playButton', 'assets/images/mainMenu/playButton.png', 512, 300);
        this.load.spritesheet('helpButtonT', 'assets/images/mainMenu/helpButtonT.png', 512, 300);
        this.load.spritesheet('helpButtonA', 'assets/images/mainMenu/helpButtonA.png', 512, 300);
        this.load.spritesheet('aboutButton', 'assets/images/mainMenu/aboutButton.png', 512, 300);
        this.load.spritesheet('soundButton', 'assets/images/mainMenu/soundButton.png', 250, 250);
        this.load.audio('bgMusic1', 'assets/sounds/bgMusic1.ogg');
        this.load.audio('bgMusic2', 'assets/sounds/bgMusic2.ogg');
        this.load.audio('bgMusic3', 'assets/sounds/bgMusic3.ogg');
        this.load.audio('bgMusic4', 'assets/sounds/bgMusic4.ogg');
        this.load.audio('bgMusic5', 'assets/sounds/bgMusic5.ogg');
        this.load.audio('bgMusic6', 'assets/sounds/bgMusic6.ogg');
        this.load.audio('bgMusic6First', 'assets/sounds/bgMusic6First.ogg');

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
        this.load.spritesheet('cheatlevels', 'assets/images/levelSelect/cheat.png', 250, 250);

        // Load for real game
        this.load.spritesheet('pauseButton', 'assets/images/game/pause.png', 250, 250);
        this.load.tilemap('level1', 'assets/map/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('level2', 'assets/map/level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('level3', 'assets/map/level3.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('level4', 'assets/map/level4.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('level5', 'assets/map/level5.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('level6', 'assets/map/level6.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('basicColor', 'assets/images/BasicColor.png');
        this.load.image('cutSceneBar', 'assets/images/game/cutSceneBar150.png');
        this.load.image('chatBoxBar', 'assets/images/game/chatBoxBar.png');
        this.load.image('sadakoTiles', 'assets/map/SadakoFullTileSet.png');
        this.load.image('sadakoWoodenCrate', 'assets/sprites/SadakoWoodenCrate.png');
        this.load.spritesheet('sadakoButton', 'assets/sprites/SadakoButton.png',256,256);
        this.load.spritesheet('sadakoDoor', 'assets/sprites/SadakoDoor.png',256,384);
        this.load.spritesheet('catapult', 'assets/sprites/Spring.png',128,128);
        this.load.image('cookie', 'assets/sprites/Cookie.png');
        this.load.image('spike','assets/sprites/Spike.png');
        this.load.image('stopwatch','assets/sprites/Stopwatch.png');
        this.load.spritesheet('checkPoint','assets/sprites/CheckPoint.png',128,128);
        this.load.image('bear','assets/sprites/SadakoBear.png');
        this.load.spritesheet('sadako', 'assets/sprites/Sadako.png', 128, 256);
        this.load.spritesheet('ghost', 'assets/sprites/ghost.png', 256, 256);
        this.load.spritesheet('moth', 'assets/sprites/moth.png', 128, 128);
        this.load.spritesheet('skull', 'assets/sprites/skull.png', 128, 128);
        this.load.spritesheet('uncle', 'assets/sprites/EvilUncle.png', 384, 1280);
        this.load.image('goldStar', 'assets/sprites/goldstar.png');
        this.load.spritesheet('hidingSpot', 'assets/sprites/HidingSpot.png', 192, 262);
        this.load.image('hauntedDoll', 'assets/sprites/HauntedDoll.png');
        this.load.spritesheet('gashapon', 'assets/sprites/Gashapon.png', 192, 288);
        this.load.spritesheet('plate', 'assets/sprites/spikePlate.png', 768, 1280);
        this.load.image('plateS', 'assets/sprites/SpikePlateS.png');
        this.load.image('sadakoInPrison', 'assets/images/SadakoInPrison.png');

        this.load.spritesheet('mainMenuButton', 'assets/images/game/mainMenu.png', 512, 300);
        this.load.spritesheet('nextLevelButton', 'assets/images/game/next.png', 512, 300);
        this.load.spritesheet('restartButton', 'assets/images/game/restart.png', 512, 300);
        this.load.spritesheet('resumeButton', 'assets/images/game/resume.png', 512, 300);
        this.load.spritesheet('respawnButton', 'assets/images/game/respawn.png', 512, 300);
        this.load.image('white', 'assets/images/game/white.png');
        this.load.image('bar', 'assets/images/preloader-bar.png');
        this.load.image('timerBar', 'assets/images/game/timerBar.png');
        this.load.image('brackets', 'assets/images/game/terrorBrackets.png');
        this.load.audio('winMusic', 'assets/sounds/win.ogg');
        this.load.audio('ghostSound', 'assets/sounds/ghost.ogg');
        this.load.audio('takeDamage', 'assets/sounds/takeDamage.ogg');
        this.load.audio('terrified', 'assets/sounds/terrified.ogg');
        this.load.audio('blockLanding', 'assets/sounds/blockLanding.ogg');
        this.load.audio('boxMoving', 'assets/sounds/boxMove.ogg');
        this.load.audio('doorOpen', 'assets/sounds/doorOpen.ogg');
        this.load.audio('gachaponUse', 'assets/sounds/gachaponUse.ogg');
        this.load.audio('lighterOpen', 'assets/sounds/lighterOpen.ogg');
        this.load.audio('uncleSound', 'assets/sounds/boss.ogg');

        this.load.image('background1','assets/backgrounds/background1.png');
        this.load.image('background2','assets/backgrounds/background2.png');
        this.load.image('background3','assets/backgrounds/background3.png');
        this.load.image('background4','assets/backgrounds/background4.png');
        // this.load.image('background5','assets/backgrounds/background5.png');
        this.load.image('background6','assets/backgrounds/background6.png');
        load = true;
        var loadDoneText = this.game.add.text(this.game.world.centerX + 200, this.game.world.centerY - 1024, "Load Completed, Press ESC to skip", textStyle);
        loadDoneText.addColor("#FF0000", 22);
        loadDoneText.addColor("#000000", 25);


    },
    create: function () {
        
        
    },
    update: function () {
        if (backstory && load) {
            this.game.state.start('MainMenu', true, false, false, lv, false);
        }
    }
};
//Change to true at launch
function backstorytoggle() {
    backstory = false;
}