// 1 bit =  1 point
// 1 candy = 0.25 point
// 1 tier_1 sub = 500 points
// 1 tier_2 sub = 1000 points
// 1 tier_3 sub = 2500 points
// $1 = 100 points

(function () {
    var REFRESH;
    var _objOBS = [];
    var _options = {
        voteLeft: ['#vault'],
        voteRight: ['#psycho'],
        tierLeft: 1,
        tierRight: 1,
        maxLeft: 1500000,
        maxRight: 1500000,
        tiers: [1, 2, 3, 5, 9, 14, 19, 22, 25]
    };

    var _LeftTiersAndPoints = [],
            _RightTiersAndPoints = [],
            _TierPointSteps = [];
    
    var _pointsLeft = 0,
            _pointsRight = 0,
            _currentLeftTier = 0,
            _currentRightTier = 0;



    function init() {
        _pointsLeft = $.getSetIniDbNumber('communityAdSet', 'pointsLeft', 0);
        _pointsRight = $.getSetIniDbNumber('communityAdSet', 'pointsRight', 0);
        _objOBS.push({
            'leftpercentage': 0,
            'rightpercentage': 0,
            'lefttier': 1,
            'righttier': 1,
            'leftanimate': false,
            'rightanimate' : false
        });
        
        calculateTierSteps();
        calculateTiers();
        calculateTierPercentage();

        $.panelsocketserver.sendToAll(JSON.stringify({
            'new_tugOfWar2_event': 'true',
            'data': JSON.stringify(_objOBS)
        }));

        REFRESH = setInterval(
                function () {
                    _pointsLeft = $.getIniDbNumber('communityAdSet', 'pointsLeft', 0);
                    _pointsRight = $.getIniDbNumber('communityAdSet', 'pointsRight', 0);
                    $.consoleLn('interval _pointsLeft ' + _pointsLeft);
                    $.consoleLn('interval _pointsRight ' + _pointsRight);
                    
                    calculateTierPercentage();  

                    $.consoleLn(JSON.stringify(_objOBS));
                    $.panelsocketserver.sendToAll(JSON.stringify({
                        'new_tugOfWar2_event': 'true',
                        'data': JSON.stringify(_objOBS)
                    }));
                }, 5000);
    }

    /*
     * @event twitchBits
     */
    $.bind('twitchBits', function (event) {
        var username = event.getUsername().toLowerCase(),
                bits = parseInt(event.getBits()),
                userMessage = event.getMessage();
        var localDate = $.getCurLocalTimeString('dd-MM-yyyy hh:mm');

        handleBits(userMessage, bits);

        $.inidb.set('communityAdHistory', localDate, JSON.stringify({user: String(username), amount: String(bits), message: String(userMessage), currency: 'bits'}));
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
        $.consoleLn(JSON.stringify({user: String(username), amount: String(donationAmount), message: String(donationMsg), currency: 'donation'}));
        $.inidb.set('communityAdHistory', localDate, JSON.stringify({user: String(username), amount: String(donationAmount), message: String(donationMsg), currency: 'donation'}));
        handleDonation(donationMsg, donationAmount);
    });

    function handleDonation(message, dollars) {
        //$1 = 100 points
        var bits = dollars * 100;

        handleBits(message, parseInt(bits));
    }

    function handleCandy(message, candy) {
        //1 candy = 0.25 point
        var bits = parseInt(candy) / 4;

        handleBits(message, bits);
    }

    function handleBits(message, bits) {
        
        _pointsLeft = $.getIniDbNumber('communityAdSet', 'pointsLeft', 0);
        _pointsRight = $.getIniDbNumber('communityAdSet', 'pointsRight', 0);
        $.consoleLn(message + ' , ' + handleMessage(message, _options.voteRight));
        //handle leftSide
        if (handleMessage(message, _options.voteLeft)) {
            _pointsLeft = _pointsLeft + bits;
            if (_pointsLeft > _options.maxLeft) {
                _pointsLeft = _options.maxLeft;
            }
        }
        //handle rightSide
        else if (handleMessage(message, _options.voteRight)) {
            _pointsRight = _pointsRight + bits;
            if (_pointsRight > _options.maxRight) {
                _pointsRight = _options.maxRight;
            }
        }
        
        $.inidb.set('communityAdSet', 'pointsLeft', _pointsLeft);
        $.inidb.set('communityAdSet', 'pointsRight', _pointsRight);

        calculateTierPercentage();

        $.panelsocketserver.sendToAll(JSON.stringify({
            'new_tugOfWar2_event': 'true',
            'data': JSON.stringify(_objOBS)
        }));


        $.consoleLn(JSON.stringify(_objOBS));
    }

    function calculateTiers() {
        var i;
        var cumulatedPoints = 0;
        for (i in _options.tiers) {
            cumulatedPoints = cumulatedPoints + parseInt(_options.maxLeft * (parseInt(_options.tiers[i]) / 100));
            _LeftTiersAndPoints.push(
                    cumulatedPoints
                    );
            _RightTiersAndPoints.push(
                    cumulatedPoints
                    );
        }
        $.consoleLn(_LeftTiersAndPoints.toString());
    }

    function calculateCurrentLeftTier() {
        var index = _LeftTiersAndPoints.findIndex(findInLeftPoints);
        
        if (index === -1){
            return 9;
        }
        return index + 1;
    }
    function calculateCurrentRightTier() {
        var index = _RightTiersAndPoints.findIndex(findInRightPoints);
        
        if (index === -1){
            return 9;
        }
        return index + 1;
    }
    
    function findInLeftPoints (element){
        return _pointsLeft < element;
    }
        
    function findInRightPoints (element){
        return _pointsRight < element;
    }
    
    function handleMessage(message, keywords) {
        var i, t;
        for (i in keywords) {
            var keys = keywords[i].split(',');
            for (t in keys) {
                keys[t] = (keys[t] + '').trim();
                if (message.toLowerCase().includes(keys[t])) {
                    return true;
                }
            }
        }
        return false;
    }

    function calculateTierPercentage() {
        $.consoleLn('ctp _pointsLeft ' + _pointsLeft);
        $.consoleLn('ctp _pointsRight ' + _pointsRight);
        var curTier = 0; 
       
        var leftpercentage = 0,
            rightpercentage = 0;
    
        //LightSide
        if (_pointsLeft > 0) {
            curTier = calculateCurrentLeftTier();
            if (_currentLeftTier === 0)
            {
                _currentLeftTier = curTier;
            }
            else{
                if (curTier > _currentLeftTier){
                    _currentLeftTier = curTier;
                    _objOBS[0].leftanimate = true;
                }
                else{
                    _objOBS[0].leftanimate = false;
                }
            }
            
            var pointsDifference = 0;
            
            if (curTier > 1){
                pointsDifference = _pointsLeft - _LeftTiersAndPoints[curTier - 2];
            }
            else{
                pointsDifference =_pointsLeft;
            }
            leftpercentage = (pointsDifference * 100) / _TierPointSteps[curTier - 1];
            
        }
        
        //DarkSide
        if (_pointsRight > 0)        {
            curTier = calculateCurrentRightTier();
            if (_currentRightTier === 0)
            {
                _currentRightTier = curTier;
            }
            else{
                if (curTier > _currentRightTier){
                    _currentRightTier = curTier;
                    _objOBS[0].rightanimate = true;
                }
                else{
                    _objOBS[0].rightanimate = false;
                }
            }
            
            var pointsDifference = 0;
            
            if (curTier > 1){
                pointsDifference = _pointsRight - _RightTiersAndPoints[curTier - 2];
            }
            else{
                pointsDifference =_pointsRight;
            }
            rightpercentage = (pointsDifference * 100) / _TierPointSteps[curTier - 1];
        }

        _objOBS[0].leftpercentage = leftpercentage;
        _objOBS[0].rightpercentage = rightpercentage;
        _objOBS[0].lefttier = calculateCurrentLeftTier();
        _objOBS[0].righttier = calculateCurrentRightTier();
    }

    function calculateTierSteps() {
        var i;
        for (i in _options.tiers) {
            _TierPointSteps.push(
                    parseInt(_options.maxLeft * (parseInt(_options.tiers[i]) / 100))
                    );
        }
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

        if (command.equalsIgnoreCase('givevault')) {
            if (argString) {
                if (action) {
                    $.consoleLn(action);
                    if (!$.isMod(sender))
                    {
                        if (parseInt(action) > $.getUserPoints(sender)) {
                            $.say(sender + ' You don\'t have enough candy');
                            return;
                        } else {
                            $.inidb.decr('points', sender, parseInt(action));
                        }
                    }
                    handleCandy('#vault', parseInt(action));
                }
            }
        }
        
        if (command.equalsIgnoreCase('givepsycho')) {
            if (argString) {
                if (action){
                    $.consoleLn(action);
                    if (!$.isMod(sender))
                    {
                        if (parseInt(action) > $.getUserPoints(sender)) {
                            $.say(sender + ' You don\'t have enough candy');
                            return;
                        } else {
                            $.inidb.decr('points', sender, parseInt(action));
                        }
                    }
                    handleCandy('#psycho', parseInt(action));
                }
            }
        }
        
        if (command.equalsIgnoreCase('tugofwarreset')) {
            $.consoleLn('tugofwarreset2 RESET PLEASE');
            
            $.inidb.set('communityAdSet', 'pointsLeft', 0);
            $.inidb.set('communityAdSet', 'pointsRight', 0);
        }
        
        if (command.equalsIgnoreCase('tugofwar')) {
            if (argString) {
                if (isNaN(action)) { //bits last
                    handleBits(action, parseInt(subAction));
                } else if (isNaN(subAction)) { //bits first
                    handleBits(subAction, parseInt(action));
                } else {
                    //do nothing
                }
            }
        }
        
    });


    /*
     * @event initReady
     */
    $.bind('initReady', function () {
        if ($.bot.isModuleEnabled('./systems/custom/tugOfWarSystem2.js')) {
            $.registerChatCommand('./systems/custom/tugOfWarSystem2.js', 'givevault', 7);
            $.registerChatCommand('./systems/custom/tugOfWarSystem2.js', 'givepsycho', 7);
            $.registerChatCommand('./systems/custom/tugOfWarSystem2.js', 'tugofwarreset', 2);
            $.registerChatCommand('./systems/custom/tugOfWarSystem2.js', 'tugofwar', 2);
            init();
        }
    });
})();