(function () {
    var BACK_TO_CERO;
    var objOBS = [];
    var isPaused = false;
    
    var TIMEOUT_WAIT_TIME; 
        
    var voteYeah = ['PogChamp', 'lowcoHype', 'lowcoPog', 'lowcoPOGGERS', 'POGGERS', 'VoteYea'],
            voteNay = ['DansGame', 'ResidentSleeper', 'lowcoOk', 'lowcoGlare', 'lowcoNo', 'VoteNay'],
            minHype = -50,
            maxHype = 50;


    var hypeCount = 0;

    function init() {
        hypeCount = 0;

        objOBS.push({
            'hype': 0
        });
        $.alertspollssocket.sendJSONToAll(JSON.stringify({
            'hypemeter_new_vote': 'true',
            'data': JSON.stringify(objOBS)
        }));

        BACK_TO_CERO = setInterval(
                function () {
                    if (!$.bot.isModuleEnabled('./custom/hypeMeterSystem.js')) {
                        return;
                    }
                    if(!isPaused) {
                        if (hypeCount !== 0) {
                            //dansgame
                            if (hypeCount <= maxHype && hypeCount < 0) {
                                if (hypeCount > -10) {
                                    hypeCount = hypeCount + 1;
                                } else if (hypeCount > -20) {
                                    hypeCount = hypeCount + 2;
                                } else {
                                    hypeCount = hypeCount + 4;
                                }
                            }
                            //pogchamp
                            else if (hypeCount >= minHype & hypeCount > 0) {
                                if (hypeCount < 10) {
                                    hypeCount = hypeCount - 1;
                                } else if (hypeCount < 20) {
                                    hypeCount = hypeCount - 2;
                                } else {
                                    hypeCount = hypeCount - 4;
                                }
                            }
                        }
                    }

                    objOBS[0].hype = hypeCount;

                    $.alertspollssocket.sendJSONToAll(JSON.stringify({
                        'hypemeter_new_vote': 'true',
                        'data': JSON.stringify(objOBS)
                    }));
                }, 1000);
    }

    /*
     * @event ircChannelMessage
     */
    $.bind('ircChannelMessage', function (event) {
        var message = event.getMessage();

        if (!$.bot.isModuleEnabled('./custom/hypeMeterSystem.js')) {
            return;
        }

        // Don't check commands
        if (message.startsWith('!')) {
            return;
        }

        isPaused = true;

        var votedHype = message.match(new RegExp('(\\b(' + voteYeah.join('|') + ')\\b)', 'gi'));
        var votedNotHype = message.match(new RegExp('(\\b(' + voteNay.join('|') + ')\\b)', 'gi'));

        if (votedHype !== null && votedNotHype !== null)
        {
            //Vote null.
            return;
        }

        if (votedHype !== null)
        {
            var increment = 10;
//            if (votedHype.length >= 10) {
//                increment = 10;
//            } else {
//                increment = 5;
//            }

            if ((hypeCount + increment) <= maxHype) {
                hypeCount = hypeCount + increment;
            } else {
                hypeCount = maxHype;
            }
        }

        if (votedNotHype !== null)
        {
            var votesPerMessage = 10;
//            if (votedNotHype.length >= 10)
//            {
//                votesPerMessage = 10;
//            } else {
//                votesPerMessage = 5;
//            }

            if ((hypeCount - votesPerMessage) >= minHype) {
                hypeCount = hypeCount - votesPerMessage;
            } else {
                hypeCount = minHype;
            }
        }
        
        clearInterval(TIMEOUT_WAIT_TIME);
        TIMEOUT_WAIT_TIME = setInterval(function() {
            isPaused = false;    
        }, 5000);
        
//        objOBS[0].hype = hypeCount;
//
//        $.alertspollssocket.sendJSONToAll(JSON.stringify({
//            'hypemeter_new_vote': 'true',
//            'data': JSON.stringify(objOBS)
//        }));
    });

    /*
     * @event command
     */
    $.bind('command', function (event) {
        var sender = event.getSender(),
                command = event.getCommand(),
                argString = event.getArguments().trim(),
                args = event.getArgs(),
                action = args[0],
                subAction = args[1],
                actionArgs = args[2];
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function () {
        if ($.bot.isModuleEnabled('./custom/hypeMeterSystem.js')) {
            init();
        }
    });
})();