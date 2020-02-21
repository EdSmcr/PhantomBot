/**
 * Script  : customCommands.js
 * Purpose : 
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
            
        if (command.equalsIgnoreCase('ouch')) {
            if (!action) {
                if ($.inidb.exists('settings', 'lastOuch')) {
                    date = new Date(parseInt($.inidb.get('settings', 'lastOuch')));
                    time = (now - date);
                    $.say($.lang.get('channelcommands.ouch', $.getTimeString(time / 1000) + ' '));
                } else {
                    $.say($.lang.get('channelcommands.ouch', '0 seconds'));
                    $.getSetIniDbString('settings', 'lastOuch', now);
                }
            }
            else {
                if (action.equalsIgnoreCase('reset')) {
                    $.inidb.set('settings', 'lastOuch', now);
                    $.say('Ouch time reset.');
                }
            }
        }
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/custom/channelCommands.js')) {
            $.registerChatCommand('./systems/custom/channelCommands.js', 'ouch', 7);
            $.registerChatSubcommand('ouch', 'reset', 2); //resets the timer
        }
    });
})();