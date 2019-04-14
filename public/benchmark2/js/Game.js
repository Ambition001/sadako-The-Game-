var sadako = sadako || {};


sadako.Game = function () {};

var completed;
var lv;
var mute;


sadako.Game.prototype = {
    init: function (complete, level, sound) {
        completed = complete;
        lv = level;
        mute = sound;
    },
    create: function () {


    },
    update: function () {

    }

};