/**
 * Script  : trickortreatGame.js
 * Purpose : 
 */
(function() {
    var status = false;

    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            username = $.username.resolve(sender),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0];

        if (command.equalsIgnoreCase('trickOrTreat')) {
            var alreadytried = $.inidb.exists('trickOrTreatList', sender );

            if (!action) {
                if (status){
                    if (alreadytried){
                        //already played
                        $.say($.tags(event, $.lang.get('trickortreat.alreadytried'), false));
                    }
                    else{
                        ///randomize trick or treat
                        var randomPoint = $.randRange(1, 2);
                        var randomMessage = $.randRange(1, 6);
                        if (randomPoint === 1)
                        {
                            //trick
                            $.say($.tags(event, $.lang.get('trickortreat.trick.' + randomMessage), false));
                            //time out
                            timeoutUserFor(sender, 60, username + ' got treat.');
                        }
                        else
                        {
                            //treat
                            var candy = $.randRange(1, 25);
                            $.inidb.incr('points', sender, candy); //give candy
                            $.say($.tags(event, $.lang.get('trickortreat.treat.' + randomMessage, candy), false));
                        }
                        $.inidb.set('trickOrTreatList', sender, true);
                    }
                }
                else
                {
                    $.say($.lang.get('trickortreat.notrunning'));
                }
            }
            else {
                if (action.equalsIgnoreCase('start')) {
                    status = true;
                    $.inidb.set('trickOrTreatSettings', 'status', status);
                    $.say($.lang.get('trickortreat.start'));
                }

                if (action.equalsIgnoreCase('end')) {
                    status = false;
                    $.inidb.set('trickOrTreatSettings', 'status', status);
                    $.say($.lang.get('trickortreat.end'));
                }
                        
                if (action.equalsIgnoreCase('clear')) {
                    $.inidb.RemoveFile('trickOrTreatList');
                    $.say($.lang.get('trickortreat.clear'));
                }
            }
        }
    });

    /**
     * 
     * @param {type} username
     * @param {type} time in seconds
     * @param {type} reason
     * @returns {undefined}
     */
    function timeoutUserFor(username, time, reason) {
        $.session.sayNow('.timeout ' + username + ' ' + time + ' ' + reason);
    }
    
    function init(){
        status = $.getSetIniDbBoolean('trickOrTreatSettings', 'status', false);
    }
    
    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/custom/trickOrTreatGame.js')) {
            $.registerChatCommand('./systems/custom/trickOrTreatGame.js', 'trickortreat', 7); //Tries to trick or treat
            $.registerChatSubcommand('trickortreat', 'start', 2); //Starts the game.
            $.registerChatSubcommand('trickortreat', 'end', 2); //Ends the game.
            $.registerChatSubcommand('trickortreat', 'clear', 2); //Clears the list.
        }
        init();///Reloads in memory list from DB.
    });
})();