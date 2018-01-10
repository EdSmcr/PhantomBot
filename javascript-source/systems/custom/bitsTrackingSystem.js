/**
 * bitsSystem.js
 *
 * Command handler for a bits system!
 */
(function() {
	/*
	 * @event twitchBits
	 */
	$.bind('twitchBits', function(event) {
		var username = event.getUsername(),
		    bits = event.getBits(),
                    userMessage = event.getMessage();

                var bits_sender = $.getSetIniDbNumber('bits', username, 0);
                
		if (bits_sender === 0) {
			$.inidb.incr('bits', username, bits);
		} else {
			$.getSetIniDbNumber('bits', username, bits);
		}
                
	});

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            channel = $.resolveRank($.botName),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            action2 = args[1],
            action3 = args[2],
            intAction1 = parseInt(args[0]),
            intAction2 = parseInt(args[1]);

        if (command.equalsIgnoreCase('bits')) {
            var ranked_sender = $.username.resolve(sender),
                bits_sender = $.getSetIniDbNumber('bits', sender, 0);

            if (!action) {
                $.say($.lang.get('bits.check.self', ranked_sender, bits_sender));
            } else {
                if (action.equalsIgnoreCase('set')) {
                    if (intAction2) {
                        if (action3) {
                            $.setIniDbString('bits', action3.toLowerCase(), intAction2);
                            $.say($.lang.get('bits.set.pass', ranked_sender, action3, intAction2));
                        } else {
                            $.say($.lang.get('bits.set.useage', ranked_sender, action3));
                        }
                    } else {
                        $.say($.lang.get('bits.set.useage', ranked_sender));
                    }
                }

                if (action.equalsIgnoreCase('reset')) {
                    if (action2) {
                        $.setIniDbString('bits', action2.toLowerCase(), 0);
                        $.say($.lang.get('bits.reset.user', ranked_sender, action2));
                    } else {
                        $.say($.lang.get('bits.reset.noname', ranked_sender));
                    }
                }

                if (action.equalsIgnoreCase('check')) {
                    if (action2) {
                        var bits_check = $.getSetIniDbNumber('bits', action2.toLowerCase(), 0);
                        $.say($.lang.get('bits.check.user', ranked_sender, action2, bits_check));
                    } else {
                        $.say($.lang.get('bits.check.noname', ranked_sender));
                    }
                }
            }
        }
        
        if (command.equalsIgnoreCase('bitranking')){
            var ranked_sender = $.username.resolve(sender),
                bits_sender = $.getSetIniDbNumber('bits', sender, 0),
                rank = 0;

            if (!action) {
                if ($.inidb.exists('bitranking', sender)) {
                    rank = parseInt($.inidb.get('bitranking', sender));
                    
                    if (rank > 1){
                        var closest_ranked_users = $.inidb.GetKeysByLikeValues('bitranking','', rank - 1);
                        
                        if (closest_ranked_users){
                            var bits_user2 = $.getSetIniDbNumber('bits', closest_ranked_users[0], 0);
                            
                            var difference = parseInt(bits_user2) - parseInt(bits_sender);
                            
                            $.say($.lang.get('bits.ranking.user', sender, $.getOrdinal(rank), $.username.resolve(closest_ranked_users[0]),difference));
                        }
                    }
                    else{
                        var closest_ranked_users = $.inidb.GetKeysByLikeValues('bitranking','', rank + 1);
                        var difference = 0;
                        
                        if (closest_ranked_users){
                            var bits_user2 = $.getSetIniDbNumber('bits', closest_ranked_users[0], 0);
                            
                            difference =  parseInt(bits_sender) - parseInt(bits_user2);
                        }
                        
                        $.say($.lang.get('bits.ranking.userfirst', sender, difference));
                    }
                }
                else{
                    $.say($.lang.get('bits.ranking.norank', sender));
                }
            } 
        }
    });

	/**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/custom/bitsTrackingSystem.js')) {
            $.registerChatCommand('./systems/custom/bitsTrackingSystem.js', 'bits', 7);
            $.registerChatCommand('./systems/custom/bitsTrackingSystem.js', 'bitranking', 7);
            $.registerChatSubcommand('bits', 'set', 2);
            $.registerChatSubcommand('bits', 'check', 2);
            $.registerChatSubcommand('bits', 'reset', 2);
        }
    });
})();