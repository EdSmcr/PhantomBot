(function() {
   
    /**
     * @function sgidTimer
     */
    function sgidTimer() {
        var keys,
            parts,
            lastTime = parseInt($.getSetIniDbNumber('steamgameinfosystem', 'last_time', 0)),
            checkTime = lastTime + parseInt(1440 * 6e4);

        
        if (lastTime > 0 && checkTime > $.systemTime()) {
            return;
        }
        
        $.consoleLn('Steam Game Info: Processing Data (see event logs for details)');
        $.log.event('Steam Game Info: Handler Process Start');
        
        $.log.event('Steam Game Info: Loading Game List.');
        var response = $.customAPI.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/').content;
        
        if (response !== undefined){
            $.log.event('Steam Game Info: Game List loaded.');
            
            var steamGames = JSON.parse(response);
            
            if (steamGames.applist){
                if (steamGames.applist.apps){
                    
                    $.log.event('Steam Game Info: Processing Games.');
                    
                    //Disable auto commit to perform faster DB writes.
                    $.inidb.setAutoCommit(false);
                    for (var key in steamGames.applist.apps)
                    {
                        var entity = $.getSetIniDbString('steamGames', steamGames.applist.apps[key].appid , getJSONString(steamGames.applist.apps[key].appid + '', steamGames.applist.apps[key].name + '', '', ''));
                       
                        if (entity !== ''){
                           var gameinfo = JSON.parse(entity);
                           
                           if (gameinfo.name !== steamGames.applist.apps[key].name)
                           {
                               $.setIniDbString('steamGames', steamGames.applist.apps[key].appid , getJSONString(steamGames.applist.apps[key].appid + '', steamGames.applist.apps[key].name + '', '', ''));
                           }
                        }
                    }
                    // Enable auto commit again and force save.
                    $.inidb.setAutoCommit(true);
                    $.inidb.SaveAll(true);
                }
            }
        }
        else{
            $.log.event('Steam Game Info: Game List not available.');
        }
        
        $.log.event('Steam Game Info: Handler Process Complete');
        $.setIniDbNumber('steamgameinfosystem', 'last_time', $.systemTime());

        $.consoleLn('Steam Game Info: Data has been Processed');
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs();

        /**
         * @commandpath gameinfo - Gets the steam game information and displays it on chat.
         */
        if (command.equalsIgnoreCase('gameinfo')) {
            var game = ($.getGame($.channelName) != '' ? $.getGame($.channelName) : "Some Game") + '';
            
            if (game.toLowerCase() == "irl" || game.toLowerCase() == "some game"){
                $.say($.lang.get('games.gameinfo.irl', game));
            }
            else{
                if(!handleHumbleBundle(game)){
                    var appid = $.inidb.searchByValue('steamGames', game);

                    if (appid.length > 0){
                        var details =  JSON.parse($.inidb.get('steamGames',appid[0]));

                        if (!details.description){
                            var response = $.customAPI.get('http://store.steampowered.com/api/appdetails/?appids=' + appid[0]).content;

                            if (response !== undefined){
                                var obj = JSON.parse(response);
                                for (var key in obj) {
                                    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
                                    obj = obj[key];
                                    break;
                                }
                                var steamGameInfo = obj;

                                if (steamGameInfo){
                                    if (steamGameInfo.success){
                                        if(steamGameInfo.data){
                                            var description = '';
                                            if(steamGameInfo.data.short_description){    
                                                description = steamGameInfo.data.short_description;
                                            }
                                            else if (steamGameInfo.data.detailed_description){
                                                description = steamGameInfo.data.detailed_description;
                                            }
                                            else if (steamGameInfo.data.about_the_game)
                                            {
                                                description = steamGameInfo.data.about_the_game;
                                            }

                                            description = description.substring(0, description.lastIndexOf('.', 300)).replace(/<(?:.|\n)*?>/gm, '');

                                            $.inidb.set('steamGames', appid[0], getJSONString(appid[0] + '', game + '', description,  'http://store.steampowered.com/app/' + appid[0]));

                                            $.say($.lang.get('games.gameinfo.onsteam', game, description, 'http://store.steampowered.com/app/' + appid[0] ));
                                        }
                                    }
                                    else{
                                        $.say($.lang.get('games.gameinfo.notfound'));
                                    }
                                }
                                else{
                                    $.say($.lang.get('games.gameinfo.notfound'));
                                }
                            }
                        }
                        else{
                            $.say($.lang.get('games.gameinfo.onsteam', game, details.description, details.url));
                        }
                    }
                    else
                    {
                        $.say($.lang.get('games.gameinfo.notfound'));
                    }
                } 
            }
            return;
        }

    });
    
    function handleHumbleBundle(name){
        //HumbleBundle.com luckup search
        var formatedName = name.replace(/[^a-zA-Z 0-9]/g, "").replace(/ /g, '-').toLowerCase();
        $.consoleLn(formatedName);
        var response = $.customAPI.get("https://www.humblebundle.com/store/api/lookup?products[]="+ formatedName +"&request=1&edit_mode=false").content;
        if (response !== undefined){
            var gameInfo = JSON.parse(response);
            
            if (gameInfo){
                if (!isEmpty(gameInfo.result)){
                    
                    var foundName = '',
                    foundURL = '',
                    foundDescription = '';
        
                    foundName = gameInfo.result[0].human_name;
                    
                    foundDescription = gameInfo.result[0].description + '';
                    foundDescription = foundDescription.replace(/<(?:.|\n)*?>/gm, '');
                    foundDescription = foundDescription.substring(3, foundDescription.lastIndexOf('.', 300)) + '';
                    foundDescription = foundDescription.replace("&#39;", "'");
                    
                    foundURL = "https://www.humblebundle.com/store/" +  gameInfo.result[0].human_url + "/?partner=Lowco2525";
                    
                    $.consoleLn('name: ' + foundName);                    
                    $.consoleLn('description: ' + foundDescription);
                    $.consoleLn('url: ' + foundURL);

                    //$.say($.lang.get('games.gameinfo.onhumble', foundName, foundDescription, foundURL ));
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
       
        //var result = JSON.parse(response.result);
//        if (response.result){
//            for (var key in response.result) {
//                
//                $.consoleLn(key);
//            }
//            $.say("result not empty");
//        }
//        else
//        {
//            $.say("result empty");
//        }
        
//        if (response.contains("<meta name=\"application-name\" content=\"Humble Bundle\">")){
//            
//            if (response.contains("<h1 data-entity-kind=\"product\" data-anchor-name=\"#human_name\" class=\"property-view human_name-view js-admin-edit\">"))
//            {
//                var index = response.indexOf("<h1 data-entity-kind=\"product\" data-anchor-name=\"#human_name\" class=\"property-view human_name-view js-admin-edit\">") + 114;
//                foundName = response.substring(index,response.indexOf("\">", index));
//            }
//            else
//            {
//                foundName = "No name.";
//                
//            }
//            $.consoleLn(response);
//            if (response.contains("<link rel=\"canonical\" href=\"")&& response.contains("<meta itemprop=\"description\" content=\"")){
//                if (response.contains("<link rel=\"canonical\" href=\"")){
//                    var index = response.indexOf("<link rel=\"canonical\" href=\"") + 28;
//                    foundURL = response.substring(index,response.indexOf("\">", index)) + "/?partner=Lowco2525";
//                    foundURL = $.shortenURL.getShortURL(foundURL);
//                }
//                if (response.contains("<meta itemprop=\"description\" content=\"")){
//                    var index = response.indexOf("<meta itemprop=\"description\" content=\"") + 38;
//                    foundDescription = response.substring(index,response.indexOf("\">", index));
//                    foundDescription = foundDescription.substring(0, foundDescription.lastIndexOf('.', 300)) + '';
//                    foundDescription = foundDescription.replace(/<(?:.|\n)*?>/gm, '');
//                    foundDescription = foundDescription.replace("&#39;", "'");
//                }
//                $.say($.lang.get('games.gameinfo.onhumble', name, foundDescription, foundURL ));
//            }
//            else
//            {
//               $.say($.lang.get('games.gameinfo.notfound')); 
//            }
//        }else
//        {
//            return false;
//        }
        return true;
    };
    
    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }
    
    /**
     * @function getJSONString
     * @param {type} appid
     * @param {type} name
     * @param {type} description
     * @param {type} url
     * @returns {String}
     */
    function getJSONString(appid, name, description, url){
        JSONStringer = Packages.org.json.JSONStringer;
        
        var jsonStringer = new JSONStringer();

        jsonStringer.object();
        jsonStringer.key('appid').value(appid);
        jsonStringer.key('name').value(name);
        jsonStringer.key('description').value(description);
        jsonStringer.key('url').value(url);
        jsonStringer.endObject();
        
        return jsonStringer.toString();
    };
    
    
    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        $.registerChatCommand('./systems/custom/steamGameInfoSystem.js', 'gameinfo', 7);
        
        if ($.bot.isModuleEnabled('./systems/custom/steamGameInfoSystem.js')) {
           
            setInterval(sgidTimer, 6e4);
        }
    });
})();
