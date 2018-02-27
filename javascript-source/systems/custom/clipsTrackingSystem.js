/**
 * Script  : clipsTrackingSystem.js
 * Purpose : Configures the automatic tracking of clips.
 */
(function() {
    var clipInfo = {
        game: '',
        creator: '',
        url: '',
        createdDate: ''
    }; 
    /*
     * @event twitchClip
     */
    $.bind('twitchClip', function(event) {
        var creator = event.getCreator().toLowerCase() + '',
            url = event.getClipURL() + '',
            game = ($.getGame($.channelName) != '' ? $.getGame($.channelName) : "Some Game") + '',
            createdDate = $.systemTime();

        clipInfo.game = game;
        clipInfo.creator = creator;
        clipInfo.url = url;
        clipInfo.createdDate = createdDate;
        
        try {
            var message = creator + ' , url: ' + url + ' , game: ' + game + ' , created date: ' + $.getLocalTimeString('dd-MM-yyyy', parseInt(createdDate));
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