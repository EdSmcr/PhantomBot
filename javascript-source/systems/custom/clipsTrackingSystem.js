/**
 * Script  : clipsTrackingSystem.js
 * Purpose : Configures the automatic tracking of clips.
 */
(function() {
    var clipInfo = {};
    /*
     * @event twitchClip
     */
    $.bind('twitchClip', function(event) {
        var creator = event.getCreator().toLowerCase() + '',
            url = event.getClipURL() + '',
            game = ($.getGame($.channelName) !== '' ? $.getGame($.channelName) : "Some Game") + '',
            title = event.getClipTitle(),
            thumbnails = event.getThumbnailObject(),
            createdDate = $.systemTime();
        
        clipInfo = {
            game: String(game),
            creator: String(creator),
            url: String(url),
            createdDate: String(createdDate),
            title: String(title),
            thumbnails: String(thumbnails),
            isSub: $.isSub(creator),
            views: 0
        }; 
                
        try {
            var message = creator + ' , url: ' + url + ' , game: ' + game + ' , created date: ' + $.getLocalTimeString('dd-MM-yyyy', parseInt(createdDate))+ ' , title: ' + title + ' , isSub: ' + $.isSub(creator);
            $.log.file('clips', '' + message);
        } catch (e) {

        }
        
        $.getSetIniDbString('clips', getGUID(), JSON.stringify(clipInfo));
    });

    //Function to generate a GUID
    function getGUID(){
        //example 50415256-0aa1-4763-bb52-674443786f2d
        var guid = getRandomString(8) + '-' + getRandomString(4) + '-' + getRandomString(4) + '-' + getRandomString(4) + '-' + getRandomString(12);
        if ($.inidb.exists('clips', guid))
        {
            guid = getGUID();
        }
        return guid;
    }
    
    // Function to generate a random string of letters.
    function getRandomString(size) {
        // Local variables just for this function.
        var letters = 'abcdefghijklmnopqrstuvwxyz0123456789',
            data = '',
            i;

        for (i = 0; i < size; i++) {
            data += letters.charAt(Math.floor(Math.random() * letters.length));
        }

        return data;
    }
    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            argsString = event.getArguments(),
            action = args[0];

        
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function() {

    });

})();