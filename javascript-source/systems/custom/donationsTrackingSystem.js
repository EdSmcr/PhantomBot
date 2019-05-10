/**
 * bitsTrackingSystem.js
 *
 * Command handler for a bits system!
 */
(function() {
    var botloginSettings = {},
    printInChat = $.getSetIniDbBoolean('donationsTrackingSettings', 'printInChat', false);
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
    
    /*
     * @event twitchMassSubscriptionGifted
     */
    $.bind('twitchMassSubscriptionGifted', function(event) {
        var currentdate = $.getLocalTimeString('MM yyyy', $.systemTime());
        var gifter = event.getUsername(),
            amount = event.getAmount();

        //Community Reward 
        var plan = event.getPlan();
        
        if (plan.equals('1000')) {
            $.inidb.incr('monthlytier1', currentdate, parseInt(amount));
        } else if (plan.equals('2000')) {
            $.inidb.incr('monthlytier2', currentdate, parseInt(amount));
        } else if (plan.equals('3000')) {
            $.inidb.incr('monthlytier3', currentdate, parseInt(amount));
        } 
        
        calculateAndPrintTotal();
    });

    /*
     * @event twitchAnonymousSubscriptionGift
     */
    $.bind('twitchAnonymousSubscriptionGift', function(event) {
         var currentdate = $.getLocalTimeString('MM yyyy', $.systemTime());
        var gifter = event.getUsername(),
            amount = event.getAmount();

        //Community Reward 
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
     * @event twitchMassAnonymousSubscriptionGifted
     */
    $.bind('twitchMassAnonymousSubscriptionGifted', function(event) {
         var currentdate = $.getLocalTimeString('MM yyyy', $.systemTime());
        var gifter = event.getUsername(),
            amount = event.getAmount();

        //Community Reward 
        var plan = event.getPlan();
        
        if (plan.equals('1000')) {
            $.inidb.incr('monthlytier1', currentdate, parseInt(amount));
        } else if (plan.equals('2000')) {
            $.inidb.incr('monthlytier2', currentdate, parseInt(amount));
        } else if (plan.equals('3000')) {
            $.inidb.incr('monthlytier3', currentdate, parseInt(amount));
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
        if (!printInChat) {
            return;
        }
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
    
    /*
     * @function loadKeywords
     */
    function checkTiltify() {
        var header = {};
        var campaignId = "";
         
        
        if (botloginSettings['TiltifyAPIKey'] === undefined) {
            return;
        } else {
            header['Authorization'] = 'Bearer '+ botloginSettings['TiltifyAPIKey'];
        }

        if (botloginSettings['TiltifyCampaignId'] === undefined) {
            return;
        } else {
            campaignId = botloginSettings['TiltifyCampaignId'];
        }
        
        var response = $.customAPI.readJsonFromUrl("https://tiltify.com/api/v3/campaigns/"+ campaignId +"/donations?count=5", JSON.stringify(header));
        
        if (response !== undefined){
            
            var obj = JSON.parse(response);
        
            if (obj.data){
                for (var key in obj.data) {
                    if (!Object.prototype.hasOwnProperty.call(obj.data, key)) continue;
                    var donation = obj.data[key];
                    if (!$.inidb.HasKey("tiltify", '', donation.id)){
                        //announce donation and add it to the list.
                        $.inidb.set("tiltify", donation.id, JSON.stringify(donation));
                        $.say( $.lang.get('tiltify.donation.message', donation.name));
                    }
                }
            }
        }
    }
    
    function readBotLogin()
    {
        var botLoginFileData = $.readFile('./config/botlogin.txt');
        for (var idx in botLoginFileData) {
            if (botLoginFileData[idx].startsWith('#')) {
                continue;
            }
            var parts = botLoginFileData[idx].split('=', 2);
            botloginSettings[parts[0]] = parts[1];
        }
    }
    
	/**
     * @event initReady
     */
    $.bind('initReady', function() {
         if ($.bot.isModuleEnabled('./systems/custom/donationsTrackingSystem.js')) {
            $.registerChatCommand('./systems/custom/donationsTrackingSystem.js', 'stjudebonus', 7);
            setInterval(checkTiltify, 6e4);
        }
        readBotLogin();
    });
})();