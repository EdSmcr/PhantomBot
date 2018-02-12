/*
 * Copyright (C) 2017 phantombot.tv
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

/*
 * @author IllusionaryOne
 */

/*
 * bitTrackingPanel.js
 * Drives the Bit Tracking Panel
 */
(function() {


    let _section = 0;
    let _webauth = '38xVUOaiLdOp3GDfth2kR6tu3cmEXU';

    /*
     * 
     * @returns {undefined}
     */
    function doRefresh(){
        var bitTrackingData = [],
            html = "";
    
        _section = $( "#bitTrackingAccordion" ).accordion( "option", "active" );
        
        ///Track by keywords.
        if (_section === 0){
            html = "<br><table><th><span style='width:80%; display:inline-block;padding-left:5px;'>Keywords</span><span style='width:10%; display:inline-block;padding-left:5px;'>Bits</span></th></tr>";
            $.get("http://localhost:25000/dbquery?table=bitKeywords&getSortedRows", { webauth: _webauth } )
            .done(function( data ) {
                jsonObject =  JSON.parse(data);
                if (jsonObject){
                    if(jsonObject.table.results)    
                    {
                        bitTrackingData = jsonObject.table.results;
                        if (bitTrackingData.length === 0) {
                            html = "<i>There are no keywords presently defined</i>";
                        }
                        else if (bitTrackingData){
                            for (idx = 0; idx < bitTrackingData.length; idx++) {
                                keywords = bitTrackingData[idx]['key'];
                                bits = bitTrackingData[idx]['value'];
                                html += "<tr class=\"textList\">" +
                                        "    <td><form onkeypress=\"return event.keyCode != 13\">" +
                                        "        <input type=\"text\" class=\"input-control\" id=\"inlineKeywordsEdit_" + encodeId(keywords) + "\"" +
                                        "               value=\"" + keywords + "\" style=\"width: 80%\"/>" +
                                        "        <input type=\"text\" class=\"input-control\" id=\"inlineBitsEdit_" + encodeId(keywords) + "\"" +
                                        "               value=\"" + bits + "\" style=\"width: 10%\"/>" +
                                        "        <button type=\"button\" class=\"btn btn-default btn-xs\" data-val=\"" + encodeId(keywords) + "\"" +
                                        "                onclick=\"$.updateBitTracking(this, " + idx + ")\"><i class=\"fa fa-hdd-o\" />" +
                                        "        <button type=\"button\" class=\"btn btn-default btn-xs\" data-val=\"" + encodeId(keywords) + "\"" +
                                        "                onclick=\"$.deleteBitTracking(this)\"><i class=\"fa fa-trash\" />" +
                                        "        </button>" +
                                        "    </form></td>" +
                                        "</tr>";
                            }
                            html += "</table>";
                        }

                        $("#bitsByKeywords").html(html);
                    }
                }
            });
        }
        else if (_section === 1) ///Track by User.
        {
            
        }
    }
    
    /**
     * @function sortBitTracking
     * @param {type} a
     * @param {type} b
     * @returns {Number}
     */
    function sortBitTracking(a, b) {
        var valA = a['key'],
            valB = b['key'];
        return parseInt(valA) - parseInt(valB);
    }

    /**
     * @function addBitTracking
     */
    function addKeywords_BitTracking() {
        var keywords = $("#addBitTrackingInput").val();
        
        $("#addBitTrackingInput").val('');

        sendDBUpdate("add_BitKeyword", "bitKeywords", keywords, '0');
        setTimeout(function() { doRefresh(); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * 
     * @param {type} element
     * @returns {undefined}
     */
    function updateBitTracking(element) {
        let decodedId = decodeId($(element).attr('data-val'));
        let keywords = $(document.getElementById("inlineKeywordsEdit_" + $(element).attr('data-val'))).val();
        let bits = $(document.getElementById("inlineBitsEdit_" + $(element).attr('data-val'))).val();
        
        if (isNaN(bits) || bits.indexOf('.') !== -1 || (parseInt(bits) < 1 && parseInt(bits) !== 0)) {
            newPanelAlert('Only natural numbers are allowed.', 'danger', 1000);
            return;
        }
        
        sendDBDelete("update_BitKeyword", "bitKeywords", decodedId);
        setTimeout(function() { sendDBUpdate("update_BitKeyword", "bitKeywords", keywords, bits); }, TIMEOUT_WAIT_TIME);
        
        $(document.getElementById("inlineKeywordsEdit_" + $(element).attr('data-val'))).val(keywords);
        $(document.getElementById("inlineBitsEdit_" + $(element).attr('data-val'))).val(bits);
        setTimeout(function() { doRefresh(); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * 
     * @param {type} element
     * @returns {undefined}
     */
    function deleteBitTracking(element) {
        $(element).html("<i style=\"color: var(--main-color)\" class=\"fa fa-spinner fa-spin\" />");
        sendDBDelete("delete_BitKeyword", "bitKeywords", decodeId($(element).attr('data-val')));
        setTimeout(function() { doRefresh(); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * 
     * @param {type} str
     * @returns {undefined}
     */
    function encodeId(str){
         return window.btoa(str);
    }
    
    /**
     * 
     * @param {type} str
     * @returns {String}
     */
    function decodeId(str){
        return window.atob(str);
    }
    
    // Import the HTML file for this panel.
    $("#bitTrackingPanel").load("/panel/bitTracking.html");

    // Load the DB items for this panel, wait to ensure that we are connected.
    var interval = setInterval(function() {
        if (isConnected && TABS_INITIALIZED) {
            var active = $("#tabs").tabs("option", "active");
            if (active == 19) {
                doRefresh();
                clearInterval(interval);
            }
        }
    }, INITIAL_WAIT_TIME);

    // Query the DB every 30 seconds for updates.
    setInterval(function() {
        var active = $("#tabs").tabs("option", "active");
        if (active == 19 && isConnected && !isInputFocus()) {
            newPanelAlert('Refreshing Bit Tracking Data', 'success', 1000);
            doRefresh();
        }
    }, 3e4);

    // Export functions - Needed when calling from HTML.
    $.bitTrackingDoRefresh = doRefresh;
    $.updateBitTracking = updateBitTracking;
    $.deleteBitTracking = deleteBitTracking;
    $.addKeywords_BitTracking = addKeywords_BitTracking;
})();
