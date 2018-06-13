/**
 * Script  : candyJarGame.js
 * Purpose : 
 */
(function() {
    //probs = [clear, caught, 1-100 amount]
    var probsArrays = [[0, 25, 75], [10, 25, 65], [25, 25, 50]],
    status = false,
    totalAmount = 500,
    remainingAmount = 0,
    entries = [];
    
    
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
            action3 = args[2];

        if (command.equalsIgnoreCase('candyjar')) {
            if (!action) {
                if(!status){
                    $.say($.lang.get('candyjar.empty'));
                    return;
                }
                
                if (isInList(sender)){
                    $.say($.lang.get('candyjar.alreadytried', username));
                    return;
                }
                else
                {
                    addToList(sender);
                }
                
                var option = 0;
                switch (true){
                    case (remainingAmount > 250):
                        option = Choose(probsArrays[0]); // 251 to 500 candy in jar: clear 0%, caught 25%, 1-100 candy 75%
                        processOptions(option, username, sender);
                        break;
                    case (remainingAmount > 100): 
                        $.consoleLn('over 100');
                        option = Choose(probsArrays[1]); //101 to 250 candy in jar: clear 10%, caught 25%, 1-100 candy 65%
                        processOptions(option, username, sender);
                        break;
                    case (remainingAmount > 1):
                        $.consoleLn('over 1');
                        option = Choose(probsArrays[2]); //100 or less candy in jar: clear 25%, caught 25%, 1-100 candy 50%
                        processOptions(option, username, sender);
                        break;
                }
            }
            else{
                if (action.equalsIgnoreCase('fill')) {
                    if(status){
                        $.say($.lang.get('candyjar.fill.running'));
                        return;
                    }
                    remainingAmount = totalAmount;
                    entries = [];
                    status = true;
                    $.inidb.set('candyJarSettings', 'status', status);
                    $.say($.lang.get('candyjar.fill'));
                }
                
                if (action.equalsIgnoreCase('check')) {
                    if(status && remainingAmount > 0){
                        $.say($.lang.get('candyjar.check', remainingAmount));
                    }
                    else{
                        $.say($.lang.get('candyjar.empty'));
                    }
                }
            }
        }
    });

    function processOptions(option, username, sender){
        switch(option){
            case 0:
                $.say($.lang.get('candyjar.cleared', username, remainingAmount));
                $.inidb.incr('points', sender, remainingAmount);
                remainingAmount = 0;
                break;
            case 1:
                $.say($.lang.get('candyjar.caught', username));
                break;
            case 2:
                var randomAmount = $.randRange(1, 100);

                if(randomAmount > remainingAmount){
                    randomAmount = remainingAmount;
                }

                remainingAmount = remainingAmount - randomAmount;
                if (remainingAmount === 0){
                    $.say($.lang.get('candyjar.cleared', username, randomAmount));
                }
                else
                {
                    $.say($.lang.get('candyjar.raid', username, randomAmount, remainingAmount));
                }
                $.inidb.incr('points', sender, randomAmount);
                break;
        }
        if (remainingAmount === 0){
            status = false;
            $.inidb.set('candyJarSettings', 'status', status);
        }
    }
    
    function addToList(user){
        for (var i in entries) {
            if (entries[i].equalsIgnoreCase(user)) {
                return;
            }
        }
        entries.push(user);
    }
    
    function isInList(user){
        for (var i in entries) {
            if (entries[i].equalsIgnoreCase(user)) {
                return true;
            }
        }
        return false;
    }
    
    function Choose(probs) {
        var randomPoint = $.randRange(1, 100);

        for (var i = 0; i < probs.length; i++) {
            var prob = parseInt(probs[i]);
            if (randomPoint < prob)
                return i;
            else
                randomPoint -= prob;
        }
        return parseInt(probs.length - 1);
    }

    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/custom/candyJarGame.js')) {
            $.registerChatCommand('./systems/custom/candyJarGame.js', 'candyjar', 7);
            $.registerChatSubcommand('candyjar', 'fill', 2); //Starts the game.
            $.registerChatSubcommand('candyjar', 'check', 7); //Checks if the candy jar has any more candy.
        }
    });
})();