/**
 * Script  : clipsTrackingSystem.js
 * Purpose : Configures the automatic tracking of clips.
 */
(function() {
    var clipInfo = {
        game: '',
        creator: '',
        url: '',
        createdDate: '',
        title: '',
        thumbnails: new JSONObject()
        
    }; 
    /*
     * @event twitchClip
     */
    $.bind('twitchClip', function(event) {
        var creator = event.getCreator().toLowerCase() + '',
            url = event.getClipURL() + '',
            game = ($.getGame($.channelName) != '' ? $.getGame($.channelName) : "Some Game") + '',
            title = event.getClipTitle(),
            thumbnails = getThumbnailObject(),
            createdDate = $.systemTime();

        clipInfo.game = game;
        clipInfo.creator = creator;
        clipInfo.url = url;
        clipInfo.title = title;
        clipInfo.thumbnails = thumbnails;
        clipInfo.createdDate = createdDate;
        
        try {
            var message = creator + ' , url: ' + url + ' , game: ' + game + ' , created date: ' + $.getLocalTimeString('dd-MM-yyyy', parseInt(createdDate))+ ' , title: ' + title;
            $.log.file('clips', '' + message);
        } catch (e) {

        }
        
        $.getSetIniDbString('clips', JSON.stringify(clipInfo), '');
    });

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