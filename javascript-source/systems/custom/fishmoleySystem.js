(function() {
    var randomword = '',
    interval,
    isFree = false;
    var word = 'FishMoley';
    
    /*
     * @function loadKeywords
     */
    function loadFishMoleyWord() {
        var keys,
            parts,
            lastTime = parseInt($.getSetIniDbNumber('fishmoleysystem', 'last_time', 0)),
            checkTime = lastTime + parseInt(1440 * 6e4);

        
        if (lastTime > 0 && checkTime > $.systemTime()) {
            return;
        }
        
        $.consoleLn('FishMoley: Getting daily word');
        $.log.event('FishMoley: Getting daily word');
                
        loadWord();
        
        $.log.event('FishMoley: Handler Process Complete');
        $.consoleLn('FishMoley: Data has been Processed');

        $.setIniDbNumber('fishmoleysystem', 'last_time', $.systemTime());
    }

    function loadWord(){
        randomword = $.inidb.GetString('randomword', '', 'randomword');
        
        if (randomword !== ''){
            $.log.event('FishMoley: Random word found: ' + randomword);
        }
        else{
            $.log.event('FishMoley: Random word not found.');
        }
    }
    function addFishMoley(){
        if ($.inidb.exists('blackList', word)) {
            return;
        }
        $.command.run($.botName, 'blacklist', 'add 60 FishMoley');
    }

    function removeFishMoley(){
        if (!$.inidb.exists('blackList', word)) {
            return;
        }
        $.command.run($.botName, 'blacklist', 'remove FishMoley');
    }
    /*
     * @event ircChannelMessage
     */
    $.bind('ircChannelMessage', function(event) {
        var message = event.getMessage(),
            sender = event.getSender();
        
        // Don't check commands
        if (message.startsWith('!')) {
            return;
        }
        //If it is already free don't do it again.
        if (isFree){
            return;
        }

        if (randomword === ''){
            return;
        }
        
        var myPattern = new RegExp('(\\w*'+randomword+'\\w*)','gi');
        var matches = message.match(myPattern);

        if (matches === null)
        {
            //Not found.
            return;
        }
        else
        {
            clearInterval(interval);
            //run command to delete the blacklisted word.
            removeFishMoley();
            
            //start 1 hour timer.
            //run command to add the blacklisted word.
            interval = setInterval(function() {
                addFishMoley();
                loadWord();
            }, 3.6e6);

            //Found.
        }
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
        if (command.equalsIgnoreCase('freefishmoley')) {
            var time; //seconds
            clearInterval(interval);
            
            if (!action || isNaN(parseInt(action))) {
                time = 60;
                removeFishMoley();
                $.say('FishMoley has been freed for 1 minute, you will not get timed out.');
                interval = setInterval(function(){
                    addFishMoley();
                }, time * 1000);
            }
            else{
                removeFishMoley();
                time = parseInt(action);
                $.say('FishMoley has been freed for '+ time +' seconds, you will not get timed out.');
                interval = setInterval(function(){
                    addFishMoley();
                }, time * 1000);
            }
        }
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        $.registerChatCommand('./systems/custom/fishmoleySystem.js', 'freefishmoley', 2);
        if ($.bot.isModuleEnabled('./systems/custom/fishmoleySystem.js')) {
           
            setInterval(loadFishMoleyWord, 6e4);
        }
    });
})();