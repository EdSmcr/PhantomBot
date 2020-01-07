//Goals system. She wants a goal bar that counts danation made using streamlabs 
//and subs.
(function () {
    var REFRESH;
    var _objOBS = [];

    function init() {
        _objOBS.push({
            'message' : '',
            'username' : '',
            'amount_given' : 0,
            'unit' : 'dolars|bits|subs', 
            'goal_id' : 0,
            'goal_start' : 0,
            'goal_end' : 0,
            
        });
        
        calculateTierSteps();
        calculateTiers();
        calculateTierPercentage();

        $.panelsocketserver.sendToAll(JSON.stringify({
            //pull the amount given and send it to the frontend
            'new_goal_event': 'true',
            'data': JSON.stringify(_objOBS)
        }));

        REFRESH = setInterval(
                function () {
                    //pull the amount given and send it to the frontend
                    $.panelsocketserver.sendToAll(JSON.stringify({
                        'new_goal_event': 'true',
                        'data': JSON.stringify(_objOBS)
                    }));
                }, 10000);
    }

    /*
     * @event twitchBits
     */
    $.bind('twitchBits', function (event) {
        var username = event.getUsername().toLowerCase(),
                bits = parseInt(event.getBits()),
                userMessage = event.getMessage();
        var localDate = $.getCurLocalTimeString('dd-MM-yyyy hh:mm');

        handleBits(username, userMessage, bits);
    });

    /*
     * @event streamLabsDonation
     */
    $.bind('streamLabsDonation', function (event) {
        var donationJsonStr = event.getJsonString(),
            JSONObject = Packages.org.json.JSONObject,
            donationJson = new JSONObject(donationJsonStr);

        var donationID = donationJson.get("donation_id"),
            donationCreatedAt = donationJson.get("created_at"),
            donationCurrency = donationJson.getString("currency"),
            donationAmount = parseFloat(donationJson.getString("amount")),
            donationUsername = donationJson.getString("name"),
            donationMsg = donationJson.getString("message");

        var localDate = $.getCurLocalTimeString('dd-MM-yyyy hh:mm');

        var username = $.username.resolve(donationUsername);
        //$.consoleLn(JSON.stringify({user: String(username), amount: String(donationAmount), message: String(donationMsg), currency: 'donation'}));
        //$.inidb.set('communityAdHistory', localDate, JSON.stringify({user: String(username), amount: String(donationAmount), message: String(donationMsg), currency: 'donation'}));
        handleDonation(username, donationMsg, donationAmount);
    });

    function handleDonation(user ,message, dollars) {
        //stores the dollars donation and sends an alert. Maybe send the message to show it on stream.
        $.panelsocketserver.sendToAll(JSON.stringify({
            'new_goal_event': 'true',
            'data': JSON.stringify(_objOBS)
        }));
    }

    function handleBits(user, message, bits) {
        //stores the bits added and sends an alert. Maybe send the message to show it on stream.
        $.panelsocketserver.sendToAll(JSON.stringify({
            'new_goal_event': 'true',
            'data': JSON.stringify(_objOBS)
        }));   
    }

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
        if ($.bot.isModuleEnabled('./systems/custom/goalsSystem.js')) {
            init();
        }
    });
})();