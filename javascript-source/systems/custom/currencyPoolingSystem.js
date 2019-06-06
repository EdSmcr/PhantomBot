/**
 * Script  : customCommands.js
 * Purpose : I was wondering if we could develop a community currency pooling feature for the bot. 
 * Basically there would be a goal, and users to enter a command to contribute their candy towards the pool. 
 * The bot would say thanks x for contributing y candy for <cause name>. z candy left to reach our goal!
 */
(function() {

    
    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            username = $.username.resolve(sender),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            action2 = args[1],
            action3 = args[2],
            date,
            now = $.systemTime(),
            time;
            
//        if (command.equalsIgnoreCase('ouch')) {
//            if (!action) {
//                if ($.inidb.exists('settings', 'lastOuch')) {
//                    date = new Date(parseInt($.inidb.get('settings', 'lastOuch')));
//                    time = (now - date);
//                    $.say($.lang.get('channelcommands.ouch', $.getTimeString(time / 1000) + ' '));
//                } else {
//                    $.say($.lang.get('channelcommands.ouch', '0 seconds'));
//                    $.getSetIniDbString('settings', 'lastOuch', now);
//                }
//            }
//            else {
//                if (action.equalsIgnoreCase('reset')) {
//                    $.inidb.set('settings', 'lastOuch', now);
//                    $.say('Ouch time reset.');
//                }
//            }
//        }
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function() {
//        if ($.bot.isModuleEnabled('./systems/custom/currencyPoolingSystem.js')) {
//            $.registerChatCommand('./systems/custom/currencyPoolingSystem.js', 'contribute', 7);
//            $.registerChatSubcommand('contribute', 'reset', 2); //resets.
//        }
    });
})();