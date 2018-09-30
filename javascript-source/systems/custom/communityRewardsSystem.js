/*
 * Copyright (C) 2016-2018 phantombot.tv
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * subscribehandler.js
 *
 * Register new subscribers and unsubscribers in the channel
 */
(function() {
    
    /**
     * 
     * @param {type} gifter
     * @param {type} amount
     * @returns {undefined}
     */
    function givePointsAll(gifter, amount) {
        $.inidb.setAutoCommit(false);
        for (var i in $.users) {
            $.inidb.incr('points', $.users[i][0].toLowerCase(), amount);
        }
        $.inidb.setAutoCommit(true);

        $.say('Thank you ' + gifter + ' for your generosity in gifting a sub!  Because of your kindness everyone in chat gets ' + amount + ' candy.');
    };
    
    /*
     * @event twitchSubscriptionGift
     */
    $.bind('twitchSubscriptionGift', function(event) {
        var gifter = event.getUsername();

        //Community Reward 

        if (event.getPlan().equals('1000')) {
            givePointsAll(gifter, 5);
        } else if (event.getPlan().equals('2000')) {
            givePointsAll(gifter, 20);
        } else if (event.getPlan().equals('3000')) {
            givePointsAll(gifter, 50);
        } else
        {
            givePointsAll(gifter, 5);
        }
    });
    
    /*
     * @event twitchMassSubscriptionGifted
     */
    $.bind('twitchMassSubscriptionGifted', function(event) {
        var gifter = event.getUsername(),
            amount = event.getAmount();

        //Community Reward 

        if (event.getPlan().equals('1000')) {
            givePointsAll(gifter, (5 * parseInt(amount)));
        } else if (event.getPlan().equals('2000')) {
            givePointsAll(gifter, (20 * parseInt(amount)));
        } else if (event.getPlan().equals('3000')) {
            givePointsAll(gifter, (50 * parseInt(amount)));
        } else
        {
            givePointsAll(gifter, (5 * parseInt(amount)));
        }
    });

    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            argsString = event.getArguments(),
            args = event.getArgs(),
            action = args[0],
            planId;

        
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {

    });
})();