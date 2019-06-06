(function() {
    var TIMEOUT_WAIT_TIME;
    var BACK_TO_CERO;
    var objOBS = [];
    
    var voteYeah = 'PogChamp',
        voteNay = 'DansGame',
        minHype = -50,
        maxHype = 50;
    
    function init(){
        $.setIniDbNumber('hypeMeterSystem', 'hype', 0);
        objOBS.push({
            'hype': 0
        });
        $.panelsocketserver.sendToAll(JSON.stringify({
            'new_vote': 'true',
            'data': JSON.stringify(objOBS)
        }));
    }
    
    /*
     * @event ircChannelMessage
     */
    $.bind('ircChannelMessage', function(event) {
        var message = event.getMessage();
        
        if (!$.bot.isModuleEnabled('./systems/custom/hypeMeterSystem.js')) {
            return;
        }
        
        // Don't check commands
        if (message.startsWith('!')) {
            return;
        }
        
        var votedHype = message.match(new RegExp('(\\b('+voteYeah+')\\b)','gi'));
        var votedNotHype = message.match(new RegExp('(\\b('+voteNay+')\\b)','gi'));
        
        if (votedHype !== null && votedNotHype !== null)
        {
            //Vote null.
            return;
        }
        
        var hypeCount = parseInt($.getSetIniDbNumber('hypeMeterSystem', 'hype', 0));
        clearTimeout(TIMEOUT_WAIT_TIME);
        clearInterval(BACK_TO_CERO);
        
        if (votedHype !== null)
        {
            if (hypeCount < maxHype){
                hypeCount = hypeCount + 1;
            }
        }
        
        if (votedNotHype !== null)
        {
            if (hypeCount > minHype){
                hypeCount = hypeCount - 1;
            }
        }
        
        $.setIniDbNumber('hypeMeterSystem', 'hype', hypeCount);
        
        objOBS[0].hype = hypeCount;
                
        $.panelsocketserver.sendToAll(JSON.stringify({
            'new_vote': 'true',
            'data': JSON.stringify(objOBS)
        }));
        
        //start 1 minute timer to start returning back to 0 hype.
        TIMEOUT_WAIT_TIME = setTimeout(function() {
            clearTimeout(TIMEOUT_WAIT_TIME);
            BACK_TO_CERO = setInterval(
                function () {
                    if (hypeCount <= maxHype && hypeCount < 0){
                        hypeCount = hypeCount + 1;
                    }
                    else if (hypeCount >= minHype  & hypeCount > 0){
                        hypeCount = hypeCount - 1;
                    }

                    if (hypeCount === 0){
                        clearInterval(BACK_TO_CERO);
                    }
                    
                    $.setIniDbNumber('hypeMeterSystem', 'hype', hypeCount);
                    
                    objOBS[0].hype = hypeCount;
                    
                    $.panelsocketserver.sendToAll(JSON.stringify({
                        'new_vote': 'true',
                        'data': JSON.stringify(objOBS)
                    }));
                }, 500);
        }, 6e4);
    });

    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            argString = event.getArguments().trim(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1],
            actionArgs = args[2];

        /*
         * @commandpath freefishmoley - Base command for freefishmoley
         */
//        if (command.equalsIgnoreCase('freefishmoley')) {
//            var time; //seconds
//            clearInterval(interval);
//            
//            if (!action || isNaN(parseInt(action))) {
//                time = 60;
//                removeFishMoley();
//                $.say('FishMoley has been freed for 1 minute, you will not get timed out.');
//                interval = setInterval(function(){
//                    addFishMoley();
//                }, time * 1000);
//            }
//            else{
//                removeFishMoley();
//                time = parseInt(action);
//                $.say('FishMoley has been freed for '+ time +' seconds, you will not get timed out.');
//                interval = setInterval(function(){
//                    addFishMoley();
//                }, time * 1000);
//            }
//        }
//        
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/custom/hypeMeterSystem.js')) {
            init();
        }
    });
})();