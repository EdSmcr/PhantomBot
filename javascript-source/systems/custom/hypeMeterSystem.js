(function () {
    var TIMEOUT_WAIT_TIME;
    var BACK_TO_CERO;
    var objOBS = [];

    var voteYeah = 'PogChamp',
            voteNay = 'DansGame',
            minHype = -50,
            maxHype = 50;


    var hypeCount = 0;

    function init() {
        hypeCount = 0;

        objOBS.push({
            'hype': 0
        });
        $.panelsocketserver.sendToAll(JSON.stringify({
            'hypeMeterSystem_new_vote': 'true',
            'data': JSON.stringify(objOBS)
        }));

        BACK_TO_CERO = setInterval(
                function () {
                    if (hypeCount !== 0) {
                        //dansgame
                        if (hypeCount <= maxHype && hypeCount < 0) {
                            if (hypeCount > -10) {
                                hypeCount = hypeCount + 0.1;
                            } else if (hypeCount > -20) {
                                hypeCount = hypeCount + 0.25;
                            } else {
                                hypeCount = hypeCount + 0.5;
                            }
                        }
                        //pogchamp
                        else if (hypeCount >= minHype & hypeCount > 0) {
                            if (hypeCount < 10) {
                                hypeCount = hypeCount - 0.1;
                            } else if (hypeCount < 20) {
                                hypeCount = hypeCount - 0.25;
                            } else {
                                hypeCount = hypeCount - 0.5;
                            }
                        }
                    }

                    objOBS[0].hype = hypeCount;

                    $.panelsocketserver.sendToAll(JSON.stringify({
                        'hypeMeterSystem_new_vote': 'true',
                        'data': JSON.stringify(objOBS)
                    }));
                }, 1000);
    }

    /*
     * @event ircChannelMessage
     */
    $.bind('ircChannelMessage', function (event) {
        var message = event.getMessage();

        if (!$.bot.isModuleEnabled('./systems/custom/hypeMeterSystem.js')) {
            return;
        }

        // Don't check commands
        if (message.startsWith('!')) {
            return;
        }

        var votedHype = message.match(new RegExp('(\\b(' + voteYeah + ')\\b)', 'gi'));
        var votedNotHype = message.match(new RegExp('(\\b(' + voteNay + ')\\b)', 'gi'));

        if (votedHype !== null && votedNotHype !== null)
        {
            //Vote null.
            return;
        }

        if (votedHype !== null)
        {
            var increment = 0;
            if (votedHype.length >= 5) {
                increment = 5;
            } else {
                increment = votedHype.length;
            }

            if ((hypeCount + increment) <= maxHype) {
                hypeCount = hypeCount + increment;
            } else {
                hypeCount = maxHype;
            }
        }

        if (votedNotHype !== null)
        {
            var votesPerMessage = 0;
            if (votedNotHype.length >= 5)
            {
                votesPerMessage = 5;
            } else {
                votesPerMessage = votedNotHype.length;
            }

            if ((hypeCount - votesPerMessage) >= minHype) {
                hypeCount = hypeCount - votesPerMessage;
            } else {
                hypeCount = minHype;
            }
        }

        objOBS[0].hype = hypeCount;

        $.panelsocketserver.sendToAll(JSON.stringify({
            'hypeMeterSystem_new_vote': 'true',
            'data': JSON.stringify(objOBS)
        }));


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
        if ($.bot.isModuleEnabled('./systems/custom/hypeMeterSystem.js')) {
            init();
        }
    });
})();