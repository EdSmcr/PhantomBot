/**
 * Script  : bandomizerGame.js
 * Purpose : 
 */
(function() {
    var entries = [],
    status = false;
    
    var _userInfo = function(){
        return {
            addedBy: '',
            lastPicked: ''
        };
    };
    
    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            username = $.username.resolve(sender),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            action2 = args[1],
            action3 = args[2];

        if (command.equalsIgnoreCase('bandomizer')) {
            var userinfo = JSON.parse($.inidb.get('bandomizerList', sender ));

            if (!action) {
                if (status){
                    if (userinfo){
                        if (userinfo.addedBy === ''){
                            $.say(username + ' -> ' + $.lang.get('bandomizer.check.self.yes'));
                        }
                        else
                        {
                            $.say(username + ' -> ' + $.lang.get('bandomizer.check.self.includedby',$.username.resolve(userinfo.addedBy)));
                        }
                    }
                    else{
                        $.say(username + ' -> ' + $.lang.get('bandomizer.check.self.notfound'));
                    }
                }
                else
                {
                    $.say($.lang.get('bandomizer.notrunning.viewer'));
                }
            }
            else {
                if (action.equalsIgnoreCase('start')) {
                    status = true;
                    $.inidb.set('bandomizerSettings', 'status', status);
                    $.say($.lang.get('bandomizer.start'));
                }

                if (action.equalsIgnoreCase('end')) {
                    status = false;
                    $.inidb.set('bandomizerSettings', 'status', status);
                    $.say($.lang.get('bandomizer.end'));
                }
                
                if (action.equalsIgnoreCase('pick')) {
                    if (status){
                        
                        var minTime = 2,
                        maxTime = 15;   

                        var randomTimeInMinutes = Math.floor(Math.random() * (maxTime - minTime + 1) + minTime);
                        pickUser(randomTimeInMinutes);
                    }
                    else
                    {
                        $.say($.lang.get('bandomizer.notrunning.mods'));
                    }
                }
                
                if (action.equalsIgnoreCase('clear')) {
                    $.inidb.RemoveFile('bandomizerList');
                    entries = [];
                    $.say($.lang.get('bandomizer.clear'));
                }

                if (action.equalsIgnoreCase('add')) {
                    if (status){
                        if (action2) {
                            if (action3){
//                                userinfo = new _userInfo();
//                                userinfo.addedBy = action3 + '';
//                                var info =  JSON.stringify(userinfo);
//                                $.inidb.set('bandomizerList', action2, info);
//                                addToList(action2);
//
//                                userinfo = new _userInfo();
//                                userinfo.addedBy = '';
//                                info =  JSON.stringify(userinfo);
//                                $.inidb.set('bandomizerList', action3, info);
//                                addToList(action3);
//
//                                $.say($.lang.get('bandomizer.add.success.target', $.username.resolve(action2), $.username.resolve(action3)));
//                                $.say($.lang.get('bandomizer.add.success.requester', $.username.resolve(action3)));
                            }
                            else{
                                $.inidb.set('bandomizerList', action2, info);
                                addToList(action2);
                                $.say($.lang.get('bandomizer.add.success', $.username.resolve(action2)));
                            }
                        } else {
                            $.say($.lang.get('bandomizer.add.noname', sender));
                        }
                    }
                    else
                    {
                        $.say($.lang.get('bandomizer.notrunning.mods'));
                    }
                }

                if (action.equalsIgnoreCase('remove')) {
                    if (status){
                        if (action2) {
                            $.inidb.del('bandomizerList', action2);
                            removeFromList(action2);
                            $.say($.lang.get('bandomizer.remove.success', $.username.resolve(action2)));
                        } else {
                            $.say($.lang.get('bandomizer.remove.noname', sender));
                        }
                    }
                    else
                    {
                        $.say($.lang.get('bandomizer.notrunning.mods'));
                    }
                }

                if (action.equalsIgnoreCase('join')) {
                    if (status){
                        if (userinfo){
                            if (userinfo.addedBy === ''){
                                $.say(username + ' -> ' + $.lang.get('bandomizer.join.alreadyjoined'));
                            }
                            else
                            {
                                $.say(username + ' -> ' + $.lang.get('bandomizer.join.alreadyjoined.by', $.username.resolve(userinfo.addedBy)));
                            }
                        }
                        else{
                            userinfo = new _userInfo();
                            var info =  JSON.stringify(userinfo);
                            $.inidb.set('bandomizerList', sender, info);
                            addToList(sender);
                            $.say(username + ' -> ' + $.lang.get('bandomizer.join.success', username));
                        }
                    }
                    else
                    {
                        $.say($.lang.get('bandomizer.notrunning.viewer'));
                    }
                }



//                if (action.equalsIgnoreCase('check')) {
//                    if (action2) {
//                        var bits_check = $.getSetIniDbNumber('bits', action2.toLowerCase(), 0);
//                        $.say($.lang.get('bits.check.user', ranked_sender, action2, bits_check));
//                    } else {
//                        $.say($.lang.get('bits.check.noname', ranked_sender));
//                    }
//                }
            }
        }
        
        if (command.equalsIgnoreCase('banalooney')) {
            if (!action) {
                $.say($.lang.get('banalooney.usage', username));
            }
            else{
                banALooney(username, action);
            }
        }
        if (command.equalsIgnoreCase('snap')) {
            if (status){
                var minTime = 2,
                maxTime = 15;   
                var i = 1;
                var selected = [];
                
                if (entries.length === 0) {
                    $.say($.lang.get('bandomizer.404'));
                    return;
                }
                            
                $.say($.lang.get('bandomizer.snap.starting'));
                
                
                var loopCount = 5;
                if (entries.length < 5){
                    loopCount = entries.length;
                }
                
                (function myLoop (i) {          
                   setTimeout(function () {   
                        var randomTimeInMinutes = Math.floor(Math.random() * (maxTime - minTime + 1) + minTime);
                        var username = $.randElement(entries);
                        
                        $.consoleLn(username + " selected");
                        
                        if (!isInList(selected, username)){
                            selected.push(username);
                            $.say($.lang.get('bandomizer.snap.pick', username, randomTimeInMinutes));
                            timeoutUserFor(username, randomTimeInMinutes * 60, username + ' was randomly choose by the Bandomizer');
                        
                            if (--i) myLoop(i);      
                        }
                        else{
                            myLoop(i);
                        }
                   }, 2000);
                })(loopCount);
            }
            else
            {
                $.say($.lang.get('bandomizer.notrunning.mods'));
            }
        }
    });

    function banALooney(requester, user){
        var lastBannedTime = $.inidb.get('banalooney', user);
        
        if (lastBannedTime == null){
            timeoutUserFor(user, 600, user + ' was hit by the banALooney. requested by ' + requester);
            $.say($.lang.get('banalooney.success', user));   
            $.inidb.set('banalooney', user, $.systemTime());
        }
        else if (overOneHour(lastBannedTime)){
            timeoutUserFor(user, 600, user + ' was hit by the banALooney. requested by ' + requester);
            $.say($.lang.get('banalooney.success', user));   
            $.inidb.set('banalooney', user, $.systemTime());
        }
        else{
            $.say($.lang.get('banalooney.immune', requester, user));    
        }
    }

    function addToList(user){
        for (var i in entries) {
            if (entries[i].equalsIgnoreCase(user)) {
                return;
            }
        }
        entries.push(user);
    }
    
    function removeFromList(user){
        for (var i in entries) {
            if (entries[i].equalsIgnoreCase(user)) {
                entries.splice(i, 1);
            }
        }
    }
    
    function isInList(list, user){
        return list.indexOf(user) > -1;
    }
    
    function pickUser(time)
    {
        if (entries.length === 0) {
            $.say($.lang.get('bandomizer.404'));
            return;
        }
        
        var username = $.randElement(entries);

            $.say($.lang.get('bandomizer.pick', username, time));
            timeoutUserFor(username, time * 60, username + ' was randomly choose by the Bandomizer');

    };
    
    function overOneHour(time){
        if (($.systemTime() - time) >= 3600000 ){
            return true;
        }
        return false;
    };
    /**
     * 
     * @param {type} username
     * @param {type} time in seconds
     * @param {type} reason
     * @returns {undefined}
     */
    function timeoutUserFor(username, time, reason) {
        $.session.sayNow('.timeout ' + username + ' ' + time + ' ' + reason);
    }
    
    function reloadList(){
        var bdlist = $.inidb.GetKeyList('bandomizerList','');
        for (var i in bdlist){
            entries.push(bdlist[i]);
        }
        status = $.getSetIniDbBoolean('bandomizerSettings', 'status', false);
    }
    
    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/custom/bandomizerGame.js')) {
            $.registerChatCommand('./systems/custom/bandomizerGame.js', 'bandomizer', 7); //Checks if you are in the list.
            $.registerChatCommand('./systems/custom/bandomizerGame.js', 'banalooney', 2); //Times out a viewer and gives him one hour immunity.
            $.registerChatCommand('./systems/custom/bandomizerGame.js', 'snap', 2); //Times out 5 viewers and gives him one hour immunity.
            $.registerChatSubcommand('bandomizer', 'start', 2); //Starts the game.
            $.registerChatSubcommand('bandomizer', 'end', 2); //Ends the game.
            $.registerChatSubcommand('bandomizer', 'pick', 2); //Randomly picks an user and gives him a random timeout.
            $.registerChatSubcommand('bandomizer', 'clear', 2); //Clears the list.
            $.registerChatSubcommand('bandomizer', 'add', 2); //Adds a user.
            $.registerChatSubcommand('bandomizer', 'remove', 2); //Removes a user from the list.
            $.registerChatSubcommand('bandomizer', 'join', 7); //Allows any user to Opt-in.
        }
        reloadList();///Reloads in memory list from DB.
    });
})();