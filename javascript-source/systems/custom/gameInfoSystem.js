(function() {
   var botloginSettings = {};
   
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs();

        /**
         * @commandpath gameinfo - Gets the game information and displays it on chat.
         */
        if (command.equalsIgnoreCase('gameinfo')) {
            var game = ($.getGame($.channelName) !== '' ? $.getGame($.channelName) : "Some Game") + '';

            if (game.toLowerCase() === "irl" || game.toLowerCase() === "some game"){
                    $.say($.lang.get('games.gameinfo.irl', game));
            }
            else{
                if(!handleHumbleBundle(game)){
                    var gamesInList = $.inidb.searchByValue('gameInfoList', game);
                    if (gamesInList.length > 0){
                        for (var key in gamesInList) {
                            var info = JSON.parse($.inidb.get('gameInfoList', gamesInList[key]));
                            if(info.name === game){
                                $.say($.lang.get('games.gameinfo.found', game, info.description, info.url));
                                return;
                            }
                        }
                        handleIGDB(game);
                    }
                    else
                    {
                        handleIGDB(game);
                    }
                }
            }
            return;
        }

    });
    function handleIGDB(game){
        var response = getIGDBGameInformation(game);
        if (response !== undefined){
            var obj = JSON.parse(response);
            for (var key in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
                obj = obj[key];
                break;
            }
            var gameInfo = obj;
            if (gameInfo){
                var description = '';
                if(gameInfo.summary){
                    description = gameInfo.summary;
                }

                description = description.substring(0, description.lastIndexOf('.', 300)).replace(/<(?:.|\n)*?>/gm, '');

                var officialSite = '', steamSite = '';
                if(gameInfo.websites)
                {
                    for (var key in gameInfo.websites)
                    {
                        switch (gameInfo.websites[key].category) {
                            case 1:
                                officialSite = gameInfo.websites[key].url;
                                break;
                            case 13:
                                steamSite = gameInfo.websites[key].url;
                                break;
                            default:

                                break;
                        } 
                    }
                }
                
                if(description === ''){
                    $.say($.lang.get('games.gameinfo.notfound'));    
                }
                else{
                    $.say($.lang.get('games.gameinfo.found', game, description, ((steamSite !== '') ? steamSite : ((officialSite !== '') ? officialSite : ''))));
                    $.inidb.set('gameInfoList', gameInfo.id, getJSONString(gameInfo.id + '', game + '', description, ((steamSite !== '') ? steamSite : ((officialSite !== '') ? officialSite : ''))));                
                }
            }
            else{
                $.say($.lang.get('games.gameinfo.notfound'));
            }
        }
    }

    function handleHumbleBundle(name){
        //HumbleBundle.com luckup search
        var formatedName = name.replace(/[^a-zA-Z 0-9]/g, "").replace(/ /g, '-').toLowerCase();

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
                    foundDescription = foundDescription.substring(0, foundDescription.lastIndexOf('.', 300)) + '';
                    foundDescription = foundDescription.replace("&#39;", "'");
                    
                    if (botloginSettings['HumblePartnerTag'] === undefined) {
                        foundURL = "https://www.humblebundle.com/store/" +  gameInfo.result[0].human_url;
                    } else {
                        foundURL = "https://www.humblebundle.com/store/" +  gameInfo.result[0].human_url + "/?partner=" + botloginSettings['HumblePartnerTag'];
                    }
                    
                    var shortenedUrl = JSON.parse(shortenUrl(foundURL)).link;
                    
                    if(shortenedUrl){
                        $.say($.lang.get('games.gameinfo.found', foundName, foundDescription, shortenedUrl ));
                    }
                    else
                    {
                        $.say($.lang.get('games.gameinfo.found', foundName, foundDescription, foundURL ));
                    }
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

        return true;
    };

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
            }
        return true;
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

    function getIGDBGameInformation(game) {
        var HttpRequest = Packages.com.gmt2001.HttpRequest,
            HashMap = Packages.java.util.HashMap,
            header = new HashMap(1),
            url = 'https://api-endpoint.igdb.com/games/?search='+ encodeURI(game) +'&fields=name,summary,external,websites&filter[version_parent][not_exists]=1&limit=1';

        header.put('Accept', 'application/json');


        if (botloginSettings['IGDBAPIKey'] === undefined) {
            return;
        } else {
            header.put('user-key', botloginSettings['IGDBAPIKey']);
        }

        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, url, '', header);

        return responseData.content;
    }
    
    function shortenUrl(longurl) {
        var HttpRequest = Packages.com.gmt2001.HttpRequest,
            HashMap = Packages.java.util.HashMap,
            JSONObject = Packages.org.json.JSONObject,
            header = new HashMap(1),
            json = new JSONObject('{}'),
            url = 'https://api-ssl.bitly.com/v4/shorten';

        header.put('Accept', 'application/json');
        header.put('Content-Type', 'application/json');

        if (botloginSettings['BitlyToken'] === undefined) {
            return;
        } else {
            header.put('Authorization', botloginSettings['BitlyToken']);
        }
        
        json
            .put('domain', 'bit.ly')
            .put('long_url', longurl);
        
        var responseData = HttpRequest.getData(HttpRequest.RequestType.POST, url, json.toString(), header);

        return responseData.content;
    }
    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        $.registerChatCommand('./systems/custom/gameInfoSystem.js', 'gameinfo', 7);
        readBotLogin();
    });
})();
