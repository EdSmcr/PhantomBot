/**
 * bitsTrackingSystem.js
 *
 * Command handler for a bits system!
 */
(function() {
    /*
     * @event twitchBits
     */
    $.bind('twitchBits', function(event) {
        var bits = event.getBits();
        
        var currentdate = $.getLocalTimeString('MM yyyy', $.systemTime());
        
        var monthly_bits = $.getSetIniDbNumber('montlybits', currentdate, 0);

        $.inidb.incr('montlybits', currentdate, bits);

        var i = parseInt(bits);

        if (i >= 1000){
            //run the command.
            calculateAndPrintTotal();
        }
    });

    /*
     * @event twitchSubscriber
     */
    $.bind('twitchSubscriber', function(event) {
        var currentdate = $.getLocalTimeString('MM yyyy', $.systemTime());
        var monthly_tier1 = $.getSetIniDbNumber('monthlytier1', currentdate, 0);
        var monthly_tier2 = $.getSetIniDbNumber('monthlytier2', currentdate, 0);
        var monthly_tier3 = $.getSetIniDbNumber('monthlytier3', currentdate, 0);
        
        var plan = event.getPlan();
        
        if (plan.equals('1000')) {
            $.inidb.incr('monthlytier1', currentdate, 1);
        } else if (plan.equals('2000')) {
            $.inidb.incr('monthlytier2', currentdate, 1);
        } else if (plan.equals('3000')) {
            $.inidb.incr('monthlytier3', currentdate, 1);
        } 
        
        calculateAndPrintTotal();
    });

    /*
     * @event twitchPrimeSubscriber
     */
    $.bind('twitchPrimeSubscriber', function(event) {
        var currentdate = $.getLocalTimeString('MM yyyy', $.systemTime());
        var monthly_tier1 = $.getSetIniDbNumber('monthlytier1', currentdate, 0);

        $.inidb.incr('monthlytier1', currentdate, 1);
        
        calculateAndPrintTotal();
    });

    /*
     * @event twitchReSubscriber
     */
    $.bind('twitchReSubscriber', function(event) {
        var currentdate = $.getLocalTimeString('MM yyyy', $.systemTime());
        var monthly_tier1 = $.getSetIniDbNumber('monthlytier1', currentdate, 0);
        var monthly_tier2 = $.getSetIniDbNumber('monthlytier2', currentdate, 0);
        var monthly_tier3 = $.getSetIniDbNumber('monthlytier3', currentdate, 0);
        
        var plan = event.getPlan();
        
        if (plan.equals('1000')) {
            $.inidb.incr('monthlytier1', currentdate, 1);
        } else if (plan.equals('2000')) {
            $.inidb.incr('monthlytier2', currentdate, 1);
        } else if (plan.equals('3000')) {
            $.inidb.incr('monthlytier3', currentdate, 1);
        } 
        
        calculateAndPrintTotal();
    });

    /*
     * @event twitchSubscriptionGift
     */
    $.bind('twitchSubscriptionGift', function(event) {
        var currentdate = $.getLocalTimeString('MM yyyy', $.systemTime());
        var monthly_tier1 = $.getSetIniDbNumber('monthlytier1', currentdate, 0);
        var monthly_tier2 = $.getSetIniDbNumber('monthlytier2', currentdate, 0);
        var monthly_tier3 = $.getSetIniDbNumber('monthlytier3', currentdate, 0);
        
        var plan = event.getPlan();
        
        if (plan.equals('1000')) {
            $.inidb.incr('monthlytier1', currentdate, 1);
        } else if (plan.equals('2000')) {
            $.inidb.incr('monthlytier2', currentdate, 1);
        } else if (plan.equals('3000')) {
            $.inidb.incr('monthlytier3', currentdate, 1);
        } 
        
        calculateAndPrintTotal();
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

        if (command.equalsIgnoreCase('stjudebonus')) {
            calculateAndPrintTotal();
        }
    });

    function calculateAndPrintTotal(){
        //calculate the total donated.
            
            var currentdate = $.getLocalTimeString('MM yyyy', $.systemTime());
        
            var monthly_bits = $.getSetIniDbNumber('montlybits', currentdate, 0);
            
            var amountFromBits = Math.floor(monthly_bits/1000.0);
            
            var monthly_tier1 = $.getSetIniDbNumber('monthlytier1', currentdate, 0);
            var monthly_tier2 = $.getSetIniDbNumber('monthlytier2', currentdate, 0);
            var monthly_tier3 = $.getSetIniDbNumber('monthlytier3', currentdate, 0);
                        
            var total = parseInt((amountFromBits) + (monthly_tier1) + (monthly_tier2 * 2) + (monthly_tier3 * 5));
            
            var message = $.lang.get('stjudebonus.total', '%' + total);
            
            $.say(message.replace('%','$'));
    };
	/**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/custom/donationsTrackingSystem.js')) {
            $.registerChatCommand('./systems/custom/donationsTrackingSystem.js', 'stjudebonus', 7);
        }
    });
})();