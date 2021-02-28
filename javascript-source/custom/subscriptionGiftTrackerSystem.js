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
 * subscriptionGiftTrackerSystem.js
 *
 * 
 */
(function() {
     /*
     * @event twitchSubscriptionGift
     */
    $.bind('twitchSubscriptionGift', function(event) {
        var gifter = event.getUsername();
        $.consoleLn('twitchSubscriptionGift called.');
        
        storeSubsGifts(gifter, 1);
    });
  
    /*
     * @event twitchSubscriptionGift
     */
    $.bind('twitchMassSubscriptionGifted', function(event) {
        var gifter = event.getUsername(),
            amount = event.getAmount();
        $.consoleLn('twitchMassSubscriptionGifted called.');

        storeSubsGifts(gifter, amount);
    });

    /*
     * @event twitchAnonymousSubscriptionGift
     */
    $.bind('twitchAnonymousSubscriptionGift', function(event) {
        var gifter = event.getUsername();
        $.consoleLn('twitchAnonymousSubscriptionGift called.');
        
        storeSubsGifts(gifter, 1);
    });

    /*
     * @event twitchMassAnonymousSubscriptionGifted
     */
    $.bind('twitchMassAnonymousSubscriptionGifted', function(event) {
        var gifter = event.getUsername(),
            amount = event.getAmount();
        $.consoleLn('twitchMassAnonymousSubscriptionGifted called.');
        
        storeSubsGifts(gifter, amount);
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

    /*
     * 
     * @param {type} gifter
     * @param {type} total
     * @param {type} amount
     * @returns {undefined}
     */
    function storeSubsGifts(gifter, amount){
        $.inidb.incr('subsGifts', gifter, amount);
    }
    
    /**
     * @event initReady
     */
    $.bind('initReady', function() {

    });
})();