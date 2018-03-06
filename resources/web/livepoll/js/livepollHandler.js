let DEBUG_MODE = true;
let COLORS = [];
let refreshInterval;
let myStorage = window.localStorage;
let settings = {
    height: 480,
    width: 600,
    backgroundColor: '#00ff00',
    textColor: '#ffffff'
};


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
    
    $.get("http://localhost:25000/dbquery?table=livePoll&keyExists=openPoll", { webauth: "38xVUOaiLdOp3GDfth2kR6tu3cmEXU" } )
    .done(function( data ) {
        if (DEBUG_MODE) console.log('Alerts::DEBUG:: Data Loaded: ' + data);

        jsonObject =  JSON.parse(data);
        if (jsonObject){
            if(jsonObject.table.keyExists)    
            {
                $("#chartLocation").fadeIn(1000);
                getPollData();
                if (DEBUG_MODE) console.log('Alerts::DEBUG:: Poll open');
            }
            else
            {
                $("#chartLocation .title").html("No open poll to display.");
                $("#chartLocation tbody").empty();
                if (DEBUG_MODE) console.log('Alerts::DEBUG:: No poll open');
            }
        }
    })
    .fail(function(data){
        if (DEBUG_MODE) console.log('Alerts::DEBUG:: Error trying to get data: ' + JSON.stringify(data));
        if (data.responseText){
            let response = JSON.parse(data.responseText);
            if (response){
                $("#chartLocation tbody").empty();
                $("#chartLocation .title").html("Bot responded with the following error: " + response.error);
            }
        }
    });
}

function getPollData(){
    let jsonObject = {};
    let results = {};
    $.get("http://localhost:25000/dbquery?table=livePoll&getData=openPoll", { webauth: "38xVUOaiLdOp3GDfth2kR6tu3cmEXU" } )
    .done(function( data ) {
        if (DEBUG_MODE) console.log('Alerts::DEBUG:: Data Loaded: ' + data);

        jsonObject =  JSON.parse(data);
        if (jsonObject){
            if(jsonObject.table.value)    
            {
               // $("#chartLocation").html(jsonObject.table.value);
                results =  JSON.parse(jsonObject.table.value);
                if (results){
                    generateChart(results);
                }
            }
        }
    });
}

function generateChart(data){
    $(".title","#chartLocation").html(data.question);
    if (data.votes){
        let html = '';
        let i = 1;
        let vals= [];
        for (let key in data.votes) {
            if (data.votes.hasOwnProperty(key)) {
                html += '<tr>';
                html += '<td class="count">'+ i +'</td>';
                html += '<td class="bar">';
                if (data.votes[key] > 0){
                    html += '<span class="'+ i +'" style="width:'+ data.votes[key] * 2 +'%;">'+ key +'</span>';
                }
                else{
                    html += '<span class="'+ i +'" style="width:1%;">'+ key +'</span>';
                }
                html += '</td>';
                html += '<td class="votes">'+ data.votes[key] +'</td>';
                html += '</tr>';
                i++;
                vals.push(data.votes[key]);
            }
        }
        
        let maxValue = function( vals ){
            return Math.max.apply( Math, array );
        };

        $("tbody","#chartLocation").html(html);

        for (let index = 1; index <= i; index++) {
            $("." + index,"#chartLocation").css('background-color', COLORS[index]);
            //if ()
        }
    }
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    return '#' + parts.join('');
}

function applySavedSettings(){
    let set = localStorage.getItem("settings");
    if (set){
        settings = JSON.parse(set);
    }
    $("#chartLocation").css('background-color', settings.backgroundColor);
    $("#chartLocation *").css('color', settings.textColor);
    let backgroundColor = hexc(settings.backgroundColor);
    let textColor = hexc(settings.textColor);
    $("#txtColor").val(backgroundColor);
    $("#txtTextColor").val(textColor);
    $("#lblColor").html(backgroundColor);
    $("#lblTextColor").html(textColor);
    if (settings.width && settings.height){
        $('#chartLocation').css({ 
            'width': settings.width, 
            'height': settings.height
        });
        $('#lblDimensions').html(settings.width.replace('px','') + ' x ' + settings.height.replace('px',''));
    }
}

function saveSettings(){
    try {        
        settings = {
            backgroundColor: $("#chartLocation").css('background-color'),
            textColor: $("#chartLocation *").css('color'),
            height:  $("#chartLocation").css('height'),
            width:  $("#chartLocation").css('width')
        };
        
        localStorage.setItem('settings', JSON.stringify(settings));
        
        toastr.success('Settings saved.');
    } catch (error) {
        toastr.error('There was an error trying to save.');
    }
    
}

function init (){
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    for (let index = 0; index < 20; index++) {
        COLORS.push(getRandomColor());
    }

    refreshData();
    refreshInterval = setInterval(refreshData, 10000);

}
    
init();

$(document).ready(function(){
    $('#chkShowTestData').on('change', function(event){
        var checkbox = event.target;
        if (checkbox.checked) {
            clearInterval(refreshInterval);
            generateChart(votesTestData);
        } else {
            refreshData();
            refreshInterval = setInterval(refreshData, 10000);
        }
    });
    
    $("#chartLocation").resizable();

    $("#chartLocation").on("resize", function( event, ui ) {
        $('.bar', '#chartLocation').css({ 
            'max-width': ui.size.width - 82, 
            'min-width': ui.size.width - 82
        });
        $('#lblDimensions').html(ui.size.width + ' x ' + ui.size.height);
    });

    $("#chartLocation").on("resizestop", function( event, ui ) {
        saveSettings();
    } );
    
    $('#txtColor').on('change', function(event){
        var color = event.target;
        $("#chartLocation").css('background-color', color.value);
        
        $("#lblColor").html(color.value);
    });

    $('#txtTextColor').on('change', function(event){
        var color = event.target;
        $("#chartLocation *").css('color', color.value);
        
        $("#lblTextColor").html(color.value);
    });

    $('#saveSettings').on('click', function(){
       saveSettings();
    });
    
    $(window).bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
            case 's':
                event.preventDefault();
                saveSettings();
                break;
            case 'f':
                //event.preventDefault();
                //alert('ctrl-f');
                break;
            case 'g':
                //event.preventDefault();
                //alert('ctrl-g');
                break;
            }
        }
    });
    applySavedSettings();
});