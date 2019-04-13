var sadako = sadako || {};

//loading the game assets
sadako.Preload = function(){};

var load = false;
var backstory = false;
var escapeKey;

sadako.Preload.prototype = {
    preload: function() {

        var preloadimg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY-400, 'preloadimage');
        preloadimg.anchor.setTo(0.5, 0.5);
        preloadimg.alpha = 0;
        var preloadtween = this.game.add.tween(preloadimg);
        preloadtween.to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None,true, 0, 0, false);

        var textStyle= { font: "48px Arial", fill: "#000000", align:"center" };
        var preloadtext = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Backstory here!!!!!!!", textStyle);
        preloadtext.anchor.setTo(0.5, 0.5);
        preloadtext.alpha = 0;
        var t = this.game.add.tween(preloadtext);
        t.to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None,true, 100, 0, false);

        // TODO:
        // load game assets(tilemap/image/sprites/audio)
        // this.load.tilemap('level1', 'assets/tilemaps/380level.json', null, Phaser.Tilemap.TILED_JSON);
        // this.load.image('gameTiles', 'assets/images/tiles1.png');
        // this.load.spritesheet('player', 'assets/images/praying_mantis.png',128,128);



        load = true;

        var loadDoneText = this.game.add.text(this.game.world.centerX+200, this.game.world.centerY-1024, "Load Completed, Press ESC to skip",textStyle);
        loadDoneText.addColor("#FF0000",22);
        loadDoneText.addColor("#000000",25);
        escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escapeKey.onDown.add(function(){
            backstory = true;
        },this);
    },
    create: function() {
        this.game.time.events.add(Phaser.Timer.SECOND * 20, backstorytoggle, this);
    },
    update: function() {
        if(backstory && load){
            this.game.state.start('Game');
        }
    }
};

function backstorytoggle(){
    backstory = true;
}