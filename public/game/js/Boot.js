var sadako = sadako || {};
 
sadako.Boot = function(){};
 
//setting game configuration and loading the assets for the loading screen
sadako.Boot.prototype = {
    preload: function() {
        //assets we'll use in the loading screen
        this.load.image('icon', 'assets/images/icon/icon.png');
        this.load.image('preloadimage', 'assets/images/backstory/preload-backstory(temp).png');
    },
    create: function() {
        
        //loading screen will have a white background
        this.game.stage.backgroundColor = '#FFFFFF';
        
        //scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'icon');
        sprite.anchor.setTo(0.5, 0.5);
        sprite.alpha = 0;
        sprite.scale.setTo(0.5);
        var icon = this.game.add.tween(sprite);
        icon.to({ alpha: 1 }, 4000, Phaser.Easing.Linear.None,true, 0, 0, false);
        
        var textStyle= { font: "60px Arial", fill: "#000000", align:"center" };
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY+550, "< --    Press to start    -- >", textStyle);
        text.anchor.setTo(0.5, 0.5);
        text.alpha = 0;
        var t = this.game.add.tween(text);
        t.to({ alpha: 1 }, 3000, Phaser.Easing.Linear.None,true, 0, -1, true);

        
    },
    update: function() {
        if(this.game.input.activePointer.justPressed()) {
            this.game.state.start('Preload');
        }
    }
};