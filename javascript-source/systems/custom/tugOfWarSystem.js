(function () {
//    var REFRESH;
//    var objOBS = [];
//    
//    var voteLight = ['#lightside','lightside'],
//            voteDark = ['#darkside','darkside'],
//            min = -10000,
//            max = 10000;


//    var bitsCount = 0;
//
//    function init() {
//        bitsCount = $.getSetIniDbNumber('tugOfWar', 'bitsCount', 0);
//        objOBS.push({
//            'bits': 0,
//            'light': 0,
//            'dark': 0
//        });
//        
//        $.panelsocketserver.sendToAll(JSON.stringify({
//            'new_tugOfWar_vote': 'true',
//            'data': JSON.stringify(objOBS)
//        }));
//
//        REFRESH = setInterval(
//                function () {
//                    bitsCount = parseInt($.inidb.get('tugOfWar','bitsCount'));
//
//                    calculateBitsPercentage();
//        
//                    $.panelsocketserver.sendToAll(JSON.stringify({
//                        'new_tugOfWar_vote': 'true',
//                        'data': JSON.stringify(objOBS)
//                    }));
//                }, 5000);
//    }
    
    /*
     * @event twitchBits
     */
//    $.bind('twitchBits', function(event) {
//        var username = event.getUsername().toLowerCase(),
//            bits = parseInt(event.getBits()),
//            userMessage = event.getMessage();
//            
//        handleBits(userMessage, bits);
//    });
    
//    function handleBits(message, bits){
//        bitsCount = $.getSetIniDbNumber('tugOfWar', 'bitsCount', 0);
//        //handle Lightside
//        if (handleMessage(message, voteLight)){
//            bitsCount = bitsCount + bits;
//            if (bitsCount > 10000){
//                bitsCount = 10000;
//            }
//        }      
//        //handle Darkside
//        else if (handleMessage(message, voteDark)){
//            bitsCount = bitsCount - bits;
//            if (bitsCount < -10000){
//                bitsCount = -10000;
//            }
//        }
//        
//        $.inidb.set('tugOfWar','bitsCount', bitsCount);
//        
//        calculateBitsPercentage();
//        
//        $.panelsocketserver.sendToAll(JSON.stringify({
//                        'new_tugOfWar_vote': 'true',
//                        'data': JSON.stringify(objOBS)
//                    }));
//        $.consoleLn(JSON.stringify(objOBS));
//    }
    
//    function handleMessage(message, keywords){
//        var i, t;
//        for (i in keywords) {
//            var keys = keywords[i].split(',');
//            for(t in keys){
//                keys[t] = (keys[t] + '').trim();
//                if(message.toLowerCase().includes(keys[t])){
//                    return true;
//                }
//            }
//        }
//        return false;
//    }
    
//    function calculateBitsPercentage(){
//        var lightpercentage = 0, 
//            darkpersentage = 0;
//        //LightSide
//        if (bitsCount > 0){
//            lightpercentage = (bitsCount * 100) / max;
//        }
//        //DarkSide
//        else if(bitsCount < 0)
//        {
//            darkpersentage = (bitsCount * 100) / min;
//        }
//        
//        objOBS[0].bits = bitsCount;
//        objOBS[0].light = lightpercentage;
//        objOBS[0].dark = darkpersentage;
//    }
    
    /*
     * @event command
     */
    $.bind('command', function (event) {
//        var sender = event.getSender(),
//                command = event.getCommand(),
//                argString = event.getArguments().trim(),
//                args = event.getArgs(),
//                action = args[0],
//                subAction = args[1],
//                actionArgs = args[2];
        
//        if (command.equalsIgnoreCase('tugofwarreset')) {
//            $.consoleLn('RESET PLEASE');
//            $.inidb.set('tugOfWar','bitsCount', 0);
//        }
//        
//        if (command.equalsIgnoreCase('tugofwar')) {
//            if (argString) {
//                if(isNaN(action)){ //bits last
//                    $.consoleLn('bits last');
//                    handleBits(action, parseInt(subAction));
//                }
//                else if(isNaN(subAction)){ //bits first
//                    $.consoleLn('bits first');
//                    handleBits(subAction, parseInt(action));
//                }
//                else{
//                 //do nothing
//                }
//            }
//        }
    });
        

    /*
     * @event initReady
     */
    $.bind('initReady', function () {
//        if ($.bot.isModuleEnabled('./systems/custom/tugOfWarSystem.js')) {
//            $.registerChatCommand('./systems/custom/tugOfWarSystem.js', 'tugofwarreset', 2);
//            $.registerChatCommand('./systems/custom/tugOfWarSystem.js', 'tugofwar', 2);
//            init();
//        }
    });
})();