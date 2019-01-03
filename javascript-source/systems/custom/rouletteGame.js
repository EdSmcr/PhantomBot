/**
 * Script  : rouletteGame.js
 * Purpose : 
 */
(function() {
    var isRunning = false;

    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];
        
        if (command.equalsIgnoreCase('roulette')){
            isRunning = $.getSetIniDbBoolean('rouletteSettings', 'isRunnig', false);
            if (isRunning){
                $.say($.whisperPrefix(sender) + $.lang.get('rouletteGame.global.running'));
            }
            else{
                start();
            }
        }
        else if (command.equalsIgnoreCase('bet')) {
            if (action === undefined) {
                $.say($.whisperPrefix(sender) + $.lang.get('rouletteGame.global.usage'));
                return;
            }
            else {
                if (subAction === undefined) {
                    $.say($.whisperPrefix(sender) + $.lang.get('rouletteGame.global.usage'));
                    return;
                }
                else{
                    bet(sender, args[0], args[1]);
                }
            }
        }
    });

    function start(){
        $.setIniDbBoolean('rouletteSettings', 'isRunnig', true);
        $.say($.lang.get('rouletteGame.global.start'));
    }
    
    function bet(sender, bet, amount){
        var points = $.getUserPoints(sender);
        
        if (amount > points){
            $.say(sender + ' -> ' + $.lang.get('rouletteGame.global.notEnoughPoints', String($.getPointsString(amount))));
        }
        else{
            var b;
            switch (bet) {
                case "col1":
                    b = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
                    break;
                case "col2":
                    b = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
                    break;
                case "col3":
                    b = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
                    break;
                case "first12":
                    b = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                    break;
                case "second12":
                    b = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
                    break;
                case "third12":
                    b = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
                    break;
                case "first18":
                    b = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
                    break;
                case "second18":
                    b = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
                    break;
                case "even":
                    b = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
                    break;
                case "black":
                    b = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
                    break;
                case "red":
                    b = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
                    break;
                case "odd":
                    b = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35];
                    break;
                default:
                    
            }
        }
    }
        
    function init(){
        isRunning = $.getSetIniDbBoolean('rouletteSettings', 'isRunnig', false);
    }
    
    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/custom/rouletteGame.js')) {
            //$.registerChatCommand('./systems/custom/rouletteGame.js', 'roulette', 2); 
            //$.registerChatCommand('./systems/custom/rouletteGame.js', 'bet', 7); 
        }
        init();///Reloads in memory list from DB.
    });
})();