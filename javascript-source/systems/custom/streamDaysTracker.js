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
 * streamDaysTracker.js
 *
 * 
 */
(function() {
    var daysCount = 1
    timeout = (6e4 * 5); // 5 minutes.
    
    var _streamInfo = function(){
        return {
            lastDayAdded: ''
        };
    };
    
    /*
     * @event twitchOnline
     */
//    $.bind('twitchOnline', function() {
//        var currentdate = $.getLocalTimeString('dd MM yyyy', $.systemTime());
//        daysCount = $.getSetIniDbNumber('streamDaysTracker', 'daysCount', 1) + 1;
//        var streaminfo = new _streamInfo();
//        streaminfo.lastDayAdded = '';
//        var info =  JSON.stringify(streaminfo);
//        $.inidb.set('streamDaysTracker', 'settings', info);
//        
//        
//        streaminfo = JSON.parse($.inidb.get('streamDaysTracker', 'settings' ));
//        
//        $.consoleLn("Lowco has streamed for " + daysCount + " days.");
//    });
    
    /**
    * @event twitchOffline
    */
   $.bind('twitchOffline', function(event) {
           // Make sure the channel is really off-line before deleting and posting the data. Wait a minute and do another check.
           setTimeout(function() {
                   if (!$.isOnline($.channelName)) {
                       $.consoleLn("Channel is off-line");
                   }
           }, 6e4);
   });

   /**
    * @event twitchOnline
    */
   $.bind('twitchOnline', function(event) {
           // Wait a minute for Twitch to generate a real thumbnail and make sure again that we are online.
           setTimeout(function() {
                   if ($.isOnline($.channelName)) {
                        var currentdate = $.getLocalTimeString('dd MM yyyy', $.systemTime());
                        daysCount = $.getSetIniDbNumber('streamDaysTracker', 'daysCount', 1) + 1;
                        var streaminfo = new _streamInfo();
                        streaminfo.lastDayAdded = '';
                        var info =  JSON.stringify(streaminfo);
                        $.inidb.set('streamDaysTracker', 'settings', info);


                        streaminfo = JSON.parse($.inidb.get('streamDaysTracker', 'settings' ));

                        $.consoleLn("Lowco has streamed for " + daysCount + " days.");
                   }
           }, 6e4);
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
        if ($.bot.isModuleEnabled('./systems/custom/streamDaysTracker.js')) {
            $.registerChatCommand('./systems/custom/streamDaysTracker.js', 'days', 7);
            
        }
    });
})();