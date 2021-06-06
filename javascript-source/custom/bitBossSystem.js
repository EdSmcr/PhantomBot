(function () {
    var REFRESH;
    var TIMER;
    var objOBS = [];
    
    var vote1 = ['#bookers', '#booker'],
        vote2 = ['#jesters', '#jester'],
        vote3 = ['#2525s', '#twofivetwofives', '#twofives', '#2525', '#25s', '#25'],
        baseHP = 5000,
        maxHP = 7500,
        _timer = 0;

    var _hp = 7500;
    var _boss = '#bookers';
    var _percentage = 100;
    
    function init() {
        _hp = $.getSetIniDbNumber('bitBoss', 'health', 7500);
        _boss = $.getSetIniDbString('bitBoss', 'boss', 'lowco');
        _timer = $.getSetIniDbNumber('bitBoss', _boss + 'Time', 0);
        
        
        
        objOBS.push({
            'health': _hp,
            'boss': _boss,
            'percentage': _percentage,
            'timer': _timer
        });
        
        setInterval(
                function (){
                    postEvent();
                }, 15000);
    }
    
    /*
     * @event channelPointRedemptions
     */
    $.bind('PubSubChannelPoints', function (event) {
        var redemptionID = event.getRedemptionID(),
            rewardID = event.getRewardID(),
            userID = event.getUserID(),
            username = event.getUsername(),
            displayName = event.getDisplayName(),
            rewardTitle = event.getRewardTitle(),
            cost = event.getCost(),
            inputPromt = event.getInputPrompt(),
            userInput = event.getUserInput(),
            fulfillmentStatus = event.getFulfillmentStatus();

        $.consoleLn("Channel point event '" + rewardTitle + 
                "' parsed to javascript. ID is: " + rewardID + 
                ", reward cost: " + cost + 
                ", userInput: " + userInput + 
                ", redemptionId: " + redemptionID +
                ", userID: " + userID +
                ", userName: " + username +
                ", displayName: " + displayName +
                ", inputPromt: " + inputPromt + 
                ", fulfillmentStatus: " + fulfillmentStatus);
        
        //processData(userInput, cost);
    });
    
    /*
     * @event twitchBits
     */
    $.bind('twitchBits', function(event) {
        var username = event.getUsername().toLowerCase(),
            bits = parseInt(event.getBits()),
            userMessage = event.getMessage();
            
        processData(userMessage, bits);
    });
    
    function processData(message, bits){
        if (message !== ''){
            var team = getTeam(message);
            var isDamage = true;

            _hp = $.getSetIniDbNumber('bitBoss', 'health', 5000);
            // check if the message has any of the tags
            if (messageHasKeywords(message,vote1.concat(vote2).concat(vote3))){
                //heal or damage
                if (team === _boss)
                {
                    isDamage = false;
                }
                handleHP(isDamage, bits, team);

                $.inidb.set('bitBoss','health', _hp);
                $.inidb.set('bitBoss','boss', _boss);        

                calculateBitsPercentage();

                $.alertspollssocket.sendJSONToAll(JSON.stringify({
                                'new_bitboss_vote': 'true',
                                'data': JSON.stringify(objOBS)
                            }));
                $.consoleLn(JSON.stringify(objOBS));
            }
            else{
                $.consoleLn('Does not contain any tag.');
            }
            postEvent();
        }
    }
    
    function handleHP(isDamage, bits, team){
        var excess = 0;
        //damage
        if (isDamage){
            excess = bits - _hp;
            _hp = _hp - bits;
            if (_hp <= 0)
            {
                //reset health
                _hp = baseHP;
                //overshield
                if (excess > 0){
                    _hp = _hp + (excess / 4);
                }
                
                //store current boss time
                $.setIniDbNumber('bitBoss', _boss + 'Time', _timer);
                //New boss
                _boss = team;
                
                //get new boss time
                _timer = $.getSetIniDbNumber('bitBoss', _boss + 'Time', 0);
            }
        }
        //heal
        else {
            if (_hp <= baseHP && _hp < maxHP)
            {
                _hp = _hp + bits;
            }
            //heal over baseHP aka shield
            else if (_hp >= baseHP && _hp < maxHP)
            {
                _hp = _hp + Math.floor(bits / 4);
            }
            //can't heal pass the max health
            if (_hp > maxHP){
                _hp = maxHP;
            }
        }
    }
    
    function getTeam(message){
        var regexp = new RegExp(/\B\#\w\w+\b/g);
        if (regexp.test(message)) {
            var tags = message.match(regexp);
            
            if (tags.some((r) => vote1.includes(r))){
                return '#bookers';
            }
            if (tags.some((r) => vote2.includes(r))){
                return '#jesters';
            }
            if (tags.some((r) => vote3.includes(r))){
                return '#2525s';
            }
        }
        return 'lowco';
    }
    
    function messageHasKeywords(message, keywords){
        var i, t;
        for (i in keywords) {
            var keys = keywords[i].split(',');
            for(t in keys){
                keys[t] = (keys[t] + '').trim();
                if(message.toLowerCase().includes(keys[t])){
                    return true;
                }
            }
        }
        return false;
    }
    
    function calculateBitsPercentage(){
        if (_hp > 0){
            _percentage = (_hp * 100) / baseHP;
        }
                
        objOBS[0].health = _hp;
        objOBS[0].boss = _boss;
        objOBS[0].percentage = _percentage;
        objOBS[0].timer = _timer;
    }
    
    function startTimer(){
        clearInterval(TIMER);
        clearInterval(REFRESH);
        _timer = $.getSetIniDbNumber('bitBoss', _boss + 'Time', 0);
        TIMER = setInterval(
                function (){
                    _timer++; 
                }, 1000);  
    }
    
    function stopTimer(){
        clearInterval(TIMER);
        clearInterval(REFRESH);
        $.setIniDbNumber('bitBoss', _boss + 'Time', _timer);
    }
    
    function postEvent() {
        _hp = parseInt($.inidb.get('bitBoss','health'));
        _boss = $.getSetIniDbString('bitBoss', 'boss', 'lowco');
        
        
        calculateBitsPercentage();

        $.alertspollssocket.sendJSONToAll(JSON.stringify({
            'new_bitboss_vote': 'true',
            'data': JSON.stringify(objOBS)
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
        
        if (command.equalsIgnoreCase('bitbossreset')) {
            $.consoleLn('RESET PLEASE');
            $.inidb.set('bitBoss','health', 7500);
            $.inidb.set('bitBoss', 'boss', 'lowco');
            $.inidb.set('bitBoss', '#2525sTime', 0);
            $.inidb.set('bitBoss', '#bookersTime', 0);
            $.inidb.set('bitBoss', '#jestersTime', 0);
            postEvent();
        }
        
        if (command.equalsIgnoreCase('bitboss')) {
            if (argString) {
                if(isNaN(action)){ //bits last
                    $.consoleLn('bits last');
                    processData(action, parseInt(subAction));
                }
                else if(isNaN(subAction)){ //bits first
                    $.consoleLn('bits first');
                    processData(subAction, parseInt(action));
                }
                else{
                 //do nothing
                }
            }
            return;
        }
        
        if (command.equalsIgnoreCase('bosstimer')) {
            $.consoleLn('bosstimer called');
            if (action) {
                if (action.equalsIgnoreCase('start')) {
                    startTimer();
                    $.say('Boss timer started.');
                    $.consoleLn('timer started');
                    return;
                }
                if (action.equalsIgnoreCase('stop')) {
                    stopTimer();
                    $.say('Boss timer stopped.');
                    $.consoleLn('timer stopped');
                    return;
                }
            }
        }
        if (command.equalsIgnoreCase('leaderboard')) {
            $.setIniDbNumber('bitBoss', _boss + 'Time', _timer);
            
            var secsBookers = parseInt($.getSetIniDbNumber('bitBoss', '#bookersTime', 0));
            var secs25s = parseInt($.getSetIniDbNumber('bitBoss', '#2525sTime', 0));
            var secsJesters = parseInt($.getSetIniDbNumber('bitBoss', '#jestersTime', 0));
            
            var TimeBookers = new Date(null);
            var Time25s = new Date(null);
            var TimeJesters = new Date(null);
            
            TimeBookers.setSeconds(secsBookers);
            Time25s.setSeconds(secs25s);
            TimeJesters.setSeconds(secsJesters);
            
            var MHSBookers = TimeBookers.toISOString().substr(11, 8);
            var MHS25s = Time25s.toISOString().substr(11, 8);
            var MHSJesters = TimeJesters.toISOString().substr(11, 8);
            
            var daysBookers = Math.floor(secsBookers / 86400);
            var days25s = Math.floor(secs25s / 86400);
            var daysJesters = Math.floor(secsJesters / 86400);
            
            var message = 'Bosses timers (d-h:m:s) ';
            if (daysBookers > 0) message = message + '#bookers: ' + daysBookers + 'd-' + MHSBookers;
            else message = message + '#bookers: ' + MHSBookers;
            if (daysJesters> 0) message = message + ', #jesters: ' + daysJesters + 'd-' + MHSJesters;
            else message = message + ', #jesters: ' + MHSJesters;
            if (days25s > 0) message = message + ', #25s: ' + days25s + 'd-' + MHS25s;
            else message = message + ', #25s: ' + MHS25s;
            $.say(message);
        }
    });
        

    /*
     * @event initReady
     */
    $.bind('initReady', function () {
        if ($.bot.isModuleEnabled('./custom/bitBossSystem.js')) {
            $.registerChatCommand('./custom/bitBossSystem.js', 'leaderboard', 7);
            $.registerChatCommand('./custom/bitBossSystem.js', 'bitbossreset', 2);
            $.registerChatCommand('./custom/bitBossSystem.js', 'bitboss', 2);
            $.registerChatCommand('./custom/bitBossSystem.js', 'bosstimer', 2);
            $.registerChatSubcommand('bosstimer', 'start', 2);
            $.registerChatSubcommand('bosstimer', 'stop', 2);
            init();
        }
    });
})();