/*
 * Copyright (C) 2016-2019 phantombot.tv
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Main stuff.
$(function() {
    var webSocket = new ReconnectingWebSocket((getProtocol() === 'https://' || window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host.split(':')[0] + ':' + getPanelPort(), null, { reconnectInterval: 500 }),
        localConfigs = getQueryMap(),
        chart;
    var popGun = document.getElementById("popGun"); 
    /*
     * @function Gets a map of the URL query
     */
    function getQueryMap() {
        let queryString = window.location.search, // Query string that starts with ?
            queryParts = queryString.substr(1).split('&'), // Split at each &, which is a new query.
            queryMap = new Map(); // Create a new map for save our keys and values.

        for (let i = 0; i < queryParts.length; i++) {
            let key = queryParts[i].substr(0, queryParts[i].indexOf('=')),
                value = queryParts[i].substr(queryParts[i].indexOf('=') + 1, queryParts[i].length);

            if (key.length > 0 && value.length > 0) {
                queryMap.set(key.toLowerCase(), value);
            }
        }

        return queryMap;
    }

    /*
     * @function Used to send messages to the socket. This should be private to this script.
     *
     * @param {Object} message
     */
    const sendToSocket = function(message) {
        try {
            let json = JSON.stringify(message);

            webSocket.send(json);

            // Make sure to not show the user's token.
            if (json.indexOf('authenticate') !== -1) {
                logSuccess('sendToSocket:: ' + json.substring(0, json.length - 20) + '.."}');
            } else {
                logSuccess('sendToSocket:: ' + json);
            }
        } catch (e) {
            logError('Failed to send message to socket: ' + e.message);
        }
    };

    /*
     * @function Checks if the query map has the option, if not, returns default.
     *
     * @param  {String} option
     * @param  {String} def
     * @return {String}
     */
    const getOptionSetting = function(option, def) {
        option = option.toLowerCase();

        if (localConfigs.has(option)) {
            return localConfigs.get(option);
        } else {
            return def;
        }
    };

    /*
     * @function Used to log things in the console.
     */
    const logSuccess = function(message) {
        console.log('%c[PhantomBot Log]', 'color: #6441a5; font-weight: 900;', message);
    };

    /*
     * @function Used to log things in the console.
     */
    const logError = function(message) {
        console.log('%c[PhantomBot Error]', 'color: red; font-weight: 900;', message);
    };

    // WebSocket events.

    /*
     * @function Called when the socket opens.
     */
    webSocket.onopen = function() {
        logSuccess('Connection established with the websocket.');

        // Auth with the socket.
        sendToSocket({
            authenticate: getAuth()
        });
    };

    /*
     * @function Socket calls when it closes
     */
    webSocket.onclose = function() {
        logError('Connection lost with the websocket.');
    };

    /*
     * @function Updates our meter.
     *
     * @param obj The object of data
     */
    const updateMeter = function(obj) {
        var percentage = 0,
            tier = 1,
            animate = false;
        
        JSON.parse(obj.data).map(json => {
            percentage = json.leftpercentage;
            tier = json.lefttier;
            animate = json.leftanimate;
        });
        
        if (animate){
            popGun.play();
            $('#gun').attr('src', 'tug-of-war-left/images/left-tier-'+ tier +'.png').addClass('slide-in-elliptic-top-fwd').delay(1000).queue(function(){
                $(this).removeClass("slide-in-elliptic-top-fwd").dequeue();
            });
        }
        else{
            $('#gun').attr('src', 'tug-of-war-left/images/left-tier-'+ tier +'.png');
        }
        
        removeTierClass();
        $('#progress').addClass('tier_'+ tier );
        $('.progress-moved .progress-bar2').css('width', percentage + '%');
        
    };
    
    const removeTierClass = function (){
        $("#progress").removeClass (function (index, className) {
            return (className.match (/(^|\s)tier_\S+/g) || []).join(' ');  
        });
    };
    
    /*
     * @function Called when we get a message.
     *
     * @param {Object} e
     */
    webSocket.onmessage = function(e) {
        try {
            // Handle PING/PONG
            if (e.data == 'PING') {
                webSocket.send('PONG');
                return;
            }

            let rawMessage = e.data,
                message = JSON.parse(rawMessage);

            if (!message.hasOwnProperty('query_id')) {
                // Check for our auth result.
                if (message.hasOwnProperty('authresult')) {
                    if (message.authresult === 'true') {
                        logSuccess('Successfully authenticated with the socket.');
                    } else {
                        logError('Failed to authenticate with the socket.');
                    }
                } else {
                    // Handle our stats.
                   if (message.hasOwnProperty('new_tugOfWar2_event')) { // New vote, handle it.
                        updateMeter(message);
                    } 
                }
            }
        } catch (ex) {
            logError('Error while parsing socket message: ' + ex.message);
            logError('Message: ' + e.data);
        }
    };
});