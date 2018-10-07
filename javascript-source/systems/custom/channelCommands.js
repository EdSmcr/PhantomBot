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
            
        var isModOrCaster =  $.isModv3(event.getSender(), event.getTags()) || $.isCaster(event.getSender());
                        $.consoleLn('isModOrCaster ' + isModOrCaster);

        if (command.equalsIgnoreCase('ouch')) {
            if ($.inidb.exists('settings', 'lastOuch')) {
                $.consoleLn('exists');
                date = new Date(parseInt($.inidb.get('settings', 'lastOuch')));
                time = (now - date);
                
                $.consoleLn('date ' + $.getTimeString(date));
                
                $.say($.lang.get('channelcommands.ouch', $.getTimeString(time / 1000) + ' '));

                if (isModOrCaster){
                   $.inidb.set('settings', 'lastOuch', now);
                }
            } else {
                $.say($.lang.get('channelcommands.ouch', '0 seconds'));
                if (isModOrCaster){
                    $.getSetIniDbString('settings', 'lastOuch', now);
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
        }
    });
})();