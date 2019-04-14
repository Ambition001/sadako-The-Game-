var sadako = sadako || {};

sadako.game = new Phaser.Game(2048, 2048, Phaser.AUTO, '');

sadako.game.state.add('Boot', sadako.Boot);
sadako.game.state.add('Preload', sadako.Preload);
sadako.game.state.add('MainMenu', sadako.MainMenu);
sadako.game.state.add('HelpMenu', sadako.HelpMenu);
sadako.game.state.add('Game', sadako.Game);

sadako.game.state.start('Boot');