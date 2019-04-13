var sadako = sadako || {};

//loading the game assets
sadako.Preload = function(){};

sadako.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    // load game assets
    // this.load.tilemap('level1', 'assets/tilemaps/380level.json', null, Phaser.Tilemap.TILED_JSON);
    // this.load.image('gameTiles', 'assets/images/tiles1.png');
    // this.load.spritesheet('player', 'assets/images/praying_mantis.png',128,128);

    
  },
  create: function() {
    this.state.start('Game');
  }
};