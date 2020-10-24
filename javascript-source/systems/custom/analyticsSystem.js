/**
 * Script  : viewsTracker.js
 * Purpose : tracks the view count while the stream is live and sends the information to a googleSheet.
 */
(function () {
    var INTERVAL;
    var _streamStart = String();

    var _streamInfo = function () {
        return {
            title: String($.twitchcache.getStreamStatus()),
            viewers: String($.twitchcache.getViewerCount()),
            bits: 0,
            subs: 0,
            subtier: String(),
            datetime: String($.systemTime()),
            starttime: _streamStart,
            endtime: String()
        };
    };

    /**
     * @event twitchOnline
     */
    $.bind('twitchOnline', function (event) {
        if ($.isOnline($.channelName)) {
            $.consoleLn('Stream is online');

            _streamStart = String($.systemTime());

            INTERVAL = setInterval(
                    function () {
                        if ($.bot.isModuleEnabled('./systems/custom/analyticsSystem.js')) {
                            var info = getStreamInfo();
                            info.starttime = _streamStart;

                            setStreamInfo(info);
                        }
                    }, 60e3);
        }
    });

    /**
     * @event twitchOffline
     */
    $.bind('twitchOffline', function (event) {
        if (!$.isOnline($.channelName)) {
            clearInterval(INTERVAL);

            var info = getStreamInfo();
            info.endtime = String($.systemTime());

            setStreamInfo(info);
            $.consoleLn("Channel is off-line");
        }
    });

    /*
     * @event twitchBits
     */
    $.bind('twitchBits', function (event) {
        var bits = parseInt(event.getBits());

        var info = getStreamInfo();
        info.bits = bits;

        setStreamInfo(info);
    });

    /*
     * @event twitchSubscriber
     */
    $.bind('twitchSubscriber', function (event) {
        var info = getStreamInfo();
        info.subs = 1;

        var plan = event.getPlan();

        if (plan.equals('1000')) {
            info.subtier = 'tier 1';
        } else if (plan.equals('2000')) {
            info.subtier = 'tier 2';
        } else if (plan.equals('3000')) {
            info.subtier = 'tier 3';
        }

        setStreamInfo(info);
    });

    /*
     * @event twitchPrimeSubscriber
     */
    $.bind('twitchPrimeSubscriber', function (event) {
        var info = getStreamInfo();
        info.subs = 1;
        info.subtier = 'tier 1';
        setStreamInfo(info);
    });

    /*
     * @event twitchReSubscriber
     */
    $.bind('twitchReSubscriber', function (event) {
        var info = getStreamInfo();
        info.subs = 1;

        var plan = event.getPlan();

        if (plan.equals('1000')) {
            info.subtier = 'tier 1';
        } else if (plan.equals('2000')) {
            info.subtier = 'tier 2';
        } else if (plan.equals('3000')) {
            info.subtier = 'tier 3';
        }

        setStreamInfo(info);
    });

    /*
     * @event twitchSubscriptionGift
     */
    $.bind('twitchSubscriptionGift', function (event) {
        var info = getStreamInfo();
        info.subs = 1;

        var plan = event.getPlan();

        if (plan.equals('1000')) {
            info.subtier = 'tier 1';
        } else if (plan.equals('2000')) {
            info.subtier = 'tier 2';
        } else if (plan.equals('3000')) {
            info.subtier = 'tier 3';
        }

        setStreamInfo(info);
    });

    /*
     * @event twitchMassSubscriptionGifted
     */
    $.bind('twitchMassSubscriptionGifted', function (event) {
        var amount = parseInt(event.getAmount());

        var info = getStreamInfo();
        info.subs = amount;

        var plan = event.getPlan();

        if (plan.equals('1000')) {
            info.subtier = 'tier 1';
        } else if (plan.equals('2000')) {
            info.subtier = 'tier 2';
        } else if (plan.equals('3000')) {
            info.subtier = 'tier 3';
        }

        setStreamInfo(info);
    });

    /*
     * @event twitchAnonymousSubscriptionGift
     */
    $.bind('twitchAnonymousSubscriptionGift', function (event) {
        var amount = parseInt(event.getAmount());

        var info = getStreamInfo();
        info.subs = amount;

        var plan = event.getPlan();

        if (plan.equals('1000')) {
            info.subtier = 'tier 1';
        } else if (plan.equals('2000')) {
            info.subtier = 'tier 2';
        } else if (plan.equals('3000')) {
            info.subtier = 'tier 3';
        }

        setStreamInfo(info);
    });

    /*
     * @event twitchMassAnonymousSubscriptionGifted
     */
    $.bind('twitchMassAnonymousSubscriptionGifted', function (event) {
        var amount = parseInt(event.getAmount());

        var info = getStreamInfo();
        info.subs = amount;

        var plan = event.getPlan();

        if (plan.equals('1000')) {
            info.subtier = 'tier 1';
        } else if (plan.equals('2000')) {
            info.subtier = 'tier 2';
        } else if (plan.equals('3000')) {
            info.subtier = 'tier 3';
        }

        setStreamInfo(info);
    });

    function getStreamInfo() {
        var info = new _streamInfo();
        return info;
    }

    function setStreamInfo(info) {
        $.consoleLn(JSON.stringify(info));
        $.setIniDbString('analytics', $.systemTime(), JSON.stringify(info));
    }

    /*
     * @event command
     */
    $.bind('command', function (event) {
        var sender = event.getSender().toLowerCase(),
                username = $.username.resolve(sender),
                command = event.getCommand(),
                args = event.getArgs(),
                action = args[0];

        if (command.equalsIgnoreCase('analytics')) {
            if (action) {
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
            }
        }
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function () {
        if ($.bot.isModuleEnabled('./systems/custom/analyticsSystem.js')) {
            $.registerChatCommand('./systems/custom/analyticsSystem.js', 'analytics', 2);
            $.registerChatSubcommand('analytics', 'start', 2); //Starts tracking.
            $.registerChatSubcommand('analytics', 'end', 2); //Ends tracking.
        }
    });
})();