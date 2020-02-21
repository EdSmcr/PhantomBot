let DEBUG_MODE = false;
let COLORS = [
        "#D32F2F",
        "#C2185B",
        "#7B1FA2",
        "#512DA8",
        "#303F9F",
        "#1976D2",
        "#0288D1",
        "#0097A7",
        "#00796B",
        "#388E3C",
        "#689F38",
        "#AFB42B",
        "#F9A825",
        "#FFA000",
        "#F57C00",
        "#E64A19",
        "#5D4037",
        "#616161",
        "#455A64"
    ];
let refreshInterval;

let votesTestData = {
    question: ":: TEST DATA :: What do you think of twitch prime?",
    votes: {
        "Will sign up for sure": 12,
        "Might sign up": 5,
        "Already Have it": 8,
        "Good idea not for me": 2,
        "Optimus Prime?": 20
    }
};

function refreshData() {
    let jsonObject = {};
    
    $.get("http://localhost:25000/dbquery?table=livePoll&keyExists=openPoll", { webauth: "ZyL6ixBXa3vZIPQIZtarIYGg0msCSf" } )
    .done(function( data ) {
        if (DEBUG_MODE) console.log('Alerts::DEBUG:: Data Loaded: ' + data);

        jsonObject =  JSON.parse(data);
        if (jsonObject){
            if(jsonObject.table.keyExists)    
            {
                $("#chartWrapper").fadeIn(1000);
                getPollData();
                if (DEBUG_MODE) console.log('Alerts::DEBUG:: Poll open');
            }
            else
            {
                $("#chartWrapper .title").html("No open poll to display.");
                $("#chartWrapper tbody").empty();
                if (DEBUG_MODE) console.log('Alerts::DEBUG:: No poll open');
            }
        }
    })
    .fail(function(data){
        if (DEBUG_MODE) console.log('Alerts::DEBUG:: Error trying to get data: ' + JSON.stringify(data));
        if (data.responseText){
            let response = JSON.parse(data.responseText);
            if (response){
                $("#chartWrapper tbody").empty();
                $("#chartWrapper .title").html("Bot responded with the following error: " + response.error);
            }
        }
    });
}

function getPollData(){
    let jsonObject = {};
    let results = {};
    $.get("http://localhost:25000/dbquery?table=livePoll&getData=openPoll", { webauth: "ZyL6ixBXa3vZIPQIZtarIYGg0msCSf" } )
    .done(function( data ) {
        if (DEBUG_MODE) console.log('Alerts::DEBUG:: Data Loaded: ' + data);

        jsonObject =  JSON.parse(data);
        if (jsonObject){
            if(jsonObject.table.value)    
            {
                results =  JSON.parse(jsonObject.table.value);
                if (results){
                    generateChart(results);
                }
            }
        }
    });
}

function generateChart(data){
    if (data.votes){
        let html = '';
        let i = 1;
        let vals= [];
        html += '<div class="title">' + data.question + '</div>';
        for (let key in data.votes) {
            if (data.votes.hasOwnProperty(key)) {
                html += '<div>';
                    html += '<div>';
                        html += '<div class="count">'+ i +'</div>';
                        html += '<div class="bar">';
                        if (data.votes[key] > 0){
                            html += '<span class="optionsText '+ i +'" style="width:'+ data.votes[key] * 2 +'%;">'+ key +'</span>';
                        }
                        else{
                            html += '<span class="optionsText '+ i +'" style="width:1%;">'+ key +'</span>';
                        }
                        html += '</div>';
                        html += '<div class="votes">'+ data.votes[key] +'</div>';
                    html += '</div>';        
                html += '</div>';

                i++;
                vals.push(data.votes[key]);
            }
        }
        
        let maxValue = function( vals ){
            return Math.max.apply( Math, array );
        };

        $(".chart","#chartWrapper").html(html);

        for (let index = 1; index <= i; index++) {
            $("." + index,"#chartWrapper").css('background-color', COLORS[index - 1]);
        }
    }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getRandomColors() {
    //Material Design 700 variant
    //https://material.io/design/color/the-color-system.html#tools-for-picking-colors
   shuffleArray(COLORS);
}

function init (){
 
	getRandomColors();
	
	let urlParams = new URLSearchParams(window.location.search);
    let showTestData = urlParams.get('test');
    
    if (showTestData) {
        clearInterval(refreshInterval);
        generateChart(votesTestData);
    } else {
        refreshData();
        refreshInterval = setInterval(refreshData, 5000);
    }

}
    
init();

$(document).ready(function(){
    
	init();
    
    $("#chartWrapper").on("resize", function( event, ui ) {
        $('.bar', '#chartWrapper').css({ 
            'max-width': ui.size.width - 82, 
            'min-width': ui.size.width - 82
        });
    });
});