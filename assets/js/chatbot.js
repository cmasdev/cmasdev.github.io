document.onreadystatechange = function (e) {
    //loadScript("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css");
    
    if (document.readyState === 'complete') {
        //dom is ready, window.onload fires later
        console.log("hi, inside document.onreadystatechange function");
        if (!window.jQuery) {
            loadScript("https://code.jquery.com/jquery-3.6.0.min.js", loadChatWindow);

        } else {
            //loadScript("//cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js", loadChatWindow);
        }
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/3.1.7/signalr.min.js", loadChatWindow);
        //loadChatWindow();
    }
}

window.ready = function (e) { };

var hubUrl = "https://201.217.4.234:83/PeerToPeerMessageHub";
var apiUrl = "https://201.217.4.234:83/chat/sendmessage";

var IdEmpresa = 1; /*evoxys*/
var _idConversacion;
var RecieverConnectionId;
var SenderConnectionId;
var _visitorId = "";
var _idCliente = 0;
var _idbot = 0;
var _conversacionFinalizada = false;
var _agenteAsignado = false;
var _nombreAgente = "Agente";
var _esAdjunto = false;

function loadStyle(url) {
    var link = document.createElement("link")
    link.type = 'text/css'
    link.rel = "stylesheet";

    if (link.readyState) {
        link.onreadystatechange = function () {
            if (link.readyState == "loaded" ||
                link.readyState == "complete") {
                link.onreadystatechange = null;
            }
        };
    } else {
        link.onload = function () {

        };
    }
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

function getMessageTime() {
    var hoy = new Date();
    var minutos = hoy.getMinutes();
    var hora = hoy.getHours();
    if (hora < 10) {
        hora = "0" + hora;
    }
    if (minutos < 10) {
        minutos = "0" + minutos;
    }
    return hora + ':' + minutos;
}

function loadScript(url, callback) {

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) {  //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

//function initFingerprintJS() {
//    FingerprintJS.load().then(fp => {
//        // The FingerprintJS agent is ready.
//        // Get a visitor identifier when you'd like to.
//        fp.get().then(result => {
//            // This is the visitor identifier:
//            _visitorId = result.visitorId;
//        });
//    });
//}

var loadChatWindow = function () {
    
    if (typeof ($.fn.popover) != 'undefined') {
        console.log("bootstrap is already loaded");
    } else {
        loadStyle("https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css");
    }

    //initFingerprintJS();    

    MessageHub();

    // Copy the compiled minified CSS from assets/css/chatbot.css 
    // and set chatCSSStyle variable with the copied content as shown below
    var chatCSSStyle = "<style type=\"text/css\">.chatbox{position:fixed;bottom:0;right:0;width:350px;height:500px;background-color:#fff;font-family:Roboto,sans-serif;-webkit-transition:all .6s cubic-bezier(.19,1,.22,1);transition:all .6s cubic-bezier(.19,1,.22,1);display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;z-index:1000}.chatbox--tray{bottom:-250px}.chatbox--closed{bottom:-300px}.chatbox .form-control:focus{border-color:#1f2836}.chatbox__body,.chatbox__title{border-bottom:none}.chatbox__title{color:#fdc42e;min-height:50px;padding-right:10px;background-color:#1f2836;border-top-left-radius:4px;border-top-right-radius:4px;cursor:pointer;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center}.chatbox__title h5{height:50px;margin:0 0 0 15px;line-height:50px;position:relative;padding-left:20px;-webkit-flex-grow:1;flex-grow:1}.chatbox__title h5 a{color:#fdc42e;max-width:195px;display:inline-block;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chatbox__title h5:before{content:'';display:block;position:absolute;top:50%;left:0;width:12px;height:12px;background:#4caf50;border-radius:6px;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.chatbox__title__close,.chatbox__title__tray{width:24px;height:24px;outline:0;border:0;background-color:transparent;opacity:.5;cursor:pointer;-webkit-transition:opacity .2s;transition:opacity .2s}.chatbox__title__close:hover,.chatbox__title__tray:hover{opacity:1}.chatbox__title__tray span{width:12px;height:12px;display:inline-block;border-bottom:2px solid #fff}.chatbox__title__close svg{vertical-align:middle;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.2px}.chatbox__body,.chatbox__credentials{padding:15px;border-top:0;background-color:#fff;border-left:1px solid #ddd;border-right:1px solid #ddd;-webkit-flex-grow:1;flex-grow:1}.chatbox__credentials{display:none}.chatbox__credentials .form-control{-webkit-box-shadow:none;box-shadow:none}.chatbox__body{overflow-y:auto}.chatbox__body__message{position:relative}.chatbox__body__message p{padding:10px;border-radius:4px;font-size:14px;background-color:#fff;-webkit-box-shadow:1px 1px rgba(100,100,100,.1);box-shadow:1px 1px rgba(100,100,100,.1)}.chatbox .chatbox__body .botResponse:before{border-right:0;left:0}.botResponse{background-color:#d4d4d4;float:left;color:#343a40;word-wrap:break-word;margin-bottom:-1px;border-radius:.571429rem}.botResponse,.suggestions,.userText{clear:both;padding:10px;border-radius:3px;box-shadow:0 0 1px 0 rgba(0,0,0,.16),0 0 10px 0 rgba(0,0,0,.12);position:relative;border-radius:.571429rem}.userText{border-top-right-radius:0;word-wrap:break-word;background-color:#4679cc;color:#fff;float:right;margin-bottom:-1px;border-radius:.571429rem}.chatbox .chatbox__body .botResponse:before,.chatbox .chatbox__body .suggestions:before,.chatbox .chatbox__body .userText:before{content:'';width:0;height:0;position:absolute;border-top:0 solid transparent;border-bottom:15px solid transparent;margin-top:-10px}.chatbox .chatbox__body .userText:before{border-left:0;right:0}.chatbox .chatbox__body .suggestions:before{border-right:15px solid #7caa2d;left:-15px}.suggestions{background-color:#7caa2d;float:left;border-top-left-radius:0}.sugg-options{display:block;background-color:#9c27b0;color:#fff;padding:5px;text-align:center;cursor:pointer;margin-bottom:5px;border-radius:4px;font-size:14px;font-weight:300}.chatbox__message{padding:15px;min-height:50px;outline:0;resize:none;font-size:16px;border:1px solid #ddd;border-bottom:none;background-color:#fefefe}.chat-message{padding:.75rem 1rem;border-radius:.625rem;position:relative;text-align:right;display:block}.userTextHour{clear:both;font-size:.75rem!important;font-weight:300!important;color:#868e96!important;position:relative;float:right;margin-bottom:4px}.recieveTextHour{clear:both;font-size:.75rem!important;font-weight:300!important;color:#868e96!important;position:relative;float:left;margin-bottom:4px}.nameLabelText{clear:both;font-size:.9rem!important;font-weight:700!important;color:#868e96!important;position:relative;float:left;margin-bottom:2px}.notifyText{clear:both;font-size:.85rem!important;font-weight:300!important;color:#868e96!important;position:relative;margin-bottom:4px;text-align:center}.msg_container{word-break:break-word;flex-direction:column}.img_msg_container{word-wrap:break-word;margin:8px;display:block}.button_chat_att{border:none;background:0 0}.icon_chat{font-size:60px;color:#42c1ea;text-shadow:2px 2px 4px #000;margin-bottom:2px}.img_chat_msg{border-radius:20px;width:100%}.chatbox--empty{height:300px}.chatbox.chatbox--tray{bottom:-450px}.chatbox.chatbox--closed{bottom:-450px;right:-250px}.chatbox--empty.chatbox--tray{bottom:-250px}.chatbox--empty.chatbox--closed{bottom:-250px;right:-250px}.chatbox--empty .chatbox__body,.chatbox--empty .chatbox__message{display:none}.chatbox--empty .chatbox__credentials{display:block}</style>";
    $('head').append(chatCSSStyle);
    var img = '<img src="/image/drako_logo.svg" style = "width: 7.125rem; height: 7.125rem;" />';
    // --------- Start Chat Window HTML -------------//
    var chatWindowHTML = "<div class=\"chatbox chatbox--tray chatbox--empty\"> \
    <div class=\"chatbox__title\"> \
    <h5><a href=\"#\">Drako virtual agent</a></h5> \
    <!-- minimize button --> \
    <button class=\"chatbox__title__tray\"> \
    <span></span> \
    </button> \
    <!-- minimize button ends --> \
    <!-- Close button which closes the chatbot --> \
    <button class=\"chatbox__title__close\"> \
    <span> \
    <svg viewBox=\"0 0 12 12\" width=\"12px\" height=\"12px\"> \
    <line stroke=\"#FFFFFF\" x1=\"11.75\" y1=\"0.25\" x2=\"0.25\" y2=\"11.75\"></line> \
    <line stroke=\"#FFFFFF\" x1=\"11.75\" y1=\"11.75\" x2=\"0.25\" y2=\"0.25\"></line> \
    </svg> \
    </span> \
    </button> \
    <!-- close button ends --> \
    </div> \
    <div class=\"chatbox__body\" id=\"chatbox_body_content\"> \
    <div class=\"text-center\">"+ img + "</div> \
    </div> \
    <form class=\"chatbox__credentials\"> \
    <div class=\"form-group\"> \
    <label for=\"inputName\">Nombre:</label> \
    <input type=\"text\" class=\"form-control\" id=\"inputName\" autocomplete=\"off\"> \
    </div> \
    <div class=\"form-group\"> \
    <label for=\"inputEmail\">Email:</label> \
    <input type=\"text\" class=\"form-control\" id=\"inputEmail\" autocomplete=\"off\"> \
    </div> \
    <button type=\"submit\" class=\"btn btn-success btn-block\" id=\"btnSubmit_drakowidget\">Enviar</button> \
    </form> \
    <input type=\"hidden\" id=\"chat_context\" name=\"conversation_id\" value=\"{}\"> \
    <input type=\"text\" id=\"user_input\" name=\"user_input\" class=\"chatbox__message\" placeholder=\"Escriba aqui...\"></input> \
    </div>";
    // ---------End Chat Window HTML -------------//

    // --------- append chat window HTML contnet to the body ------------//
    $("body").append(chatWindowHTML);

    // ------------- declare and intialize chat window widget variables ----------------//
    var $chatbox = $('.chatbox'),
        $chatboxTitle = $('.chatbox__title'),
        $chatboxTitleClose = $('.chatbox__title__close'),
        $chatboxCredentials = $('.chatbox__credentials');

    // ------------
    $chatboxTitle.on('click', function () {
        $chatbox.toggleClass('chatbox--tray');
        if ($chatbox.hasClass('chatbox--closed'))
            $chatbox.removeClass('chatbox--closed'),
                $chatbox.addClass('chatbox--tray');

    });

    // -------------  execute this when close button is clicked   ---------------------//
    $chatboxTitleClose.on('click', function (e) {
        e.stopPropagation();
        $chatbox.addClass('chatbox--closed');
    });

    // -------------     ---------------------//
    $chatbox.on('transitionend', function () {
        // if ($chatbox.hasClass('chatbox--closed')) $chatbox.remove();
    });

    // ----------- submit button function in the chatbot window -------------//
    $chatboxCredentials.on('submit', function (e) {
        e.preventDefault();
        $chatbox.removeClass('chatbox--empty');
        var userName = $('#inputName').val();
        var userEmail = $('#inputEmail').val();
        //setBotResponse('<span class="alert alert-warning">suggestions 01</span>');
        //sendUserText('My name is ' + userName);
        $("#user_input").focus();
    });

    // given a string set the usertext in the chat window with appropriate styling
    function setUserText(val) {
        var hora = getMessageTime();
        var divHour = '<div class=\"userTextHour\">' + hora + '</div>';
        var msgsend = '<dic class=\"msg_container\"><p class="userText">' + val + '</p>' + divHour + '</div>';
        $('#chatbox_body_content').append(msgsend);
        // set the value of input field to empty string
        $('#user_input').val('');
        // scroll to the bottom of the chatbot body
        $('#chatbox_body_content').scrollTop(1E10);
    }

    // given a string set the bot response in the chat window with appropriate styling
    function setBotResponse(val) {
        
        var hora = getMessageTime();
        var divHour = '<div class=\"recieveTextHour\">' + hora + '</div>';
        var msgsend = '<dic class=\"msg_container\"><p class="botResponse">' + val + '</p>' + divHour + '</div>';
        if (_agenteAsignado) {
            var divNombreAgente = '<div class=\"nameLabelText\">' + _nombreAgente + '</div>';
            $('#chatbox_body_content').append(divNombreAgente);
        }
        $('#chatbox_body_content').append(msgsend);
        // scroll to the bottom of the chatbot body
        $('#chatbox_body_content').scrollTop(1E10);
    }

    function setBotResponseImg(ImgUrl) {
        var hora = getMessageTime();
        var divHour = '<div class=\"recieveTextHour\">' + hora + '</div>';
        var img = "<img src=" + ImgUrl + " class=\"img_chat_msg\" />";
        var msgsend = '<dic class=\"msg_container\"><div class="img_msg_container">' + img + '</div>' + divHour + '</div>';
        $('#chatbox_body_content').append(msgsend);
        // scroll to the bottom of the chatbot body
        $('#chatbox_body_content').scrollTop(1E10);
    }

    function setBotResponseAttachment(AttUrl) {
        var hora = getMessageTime();
        var btnImgUrl = "~/image/doc_dwl.png";
        var onClick = "window.location='" + AttUrl + "'";
        var divHour = '<div class=\"recieveTextHour\">' + hora + '</div>';
        var icon = '<i class=\"fas fa-file-download icon_chat"></i>'
        var button = "<button class=\"button_chat_att\" onclick=" + onClick + ">" + icon + "</button>";
        var msgsend = '<dic class=\"msg_container\"><div class="img_msg_container">' + button + '</div>' + divHour + '</div>';
        $('#chatbox_body_content').append(msgsend);
        // scroll to the bottom of the chatbot body
        $('#chatbox_body_content').scrollTop(1E10);
    }

    function notifyAgenteJoinChat(AgentName) {
        var notification = `<div class=\"notifyText\"> El agente ${AgentName} se ha unido al chat </div>`;
        $('#chatbox_body_content').append(notification);
        $('#chatbox_body_content').scrollTop(1E10);
    }

    // send i.e ajax call to the dialog server 
    // pass the user entered text and get the response
    function sendUserText(text) {
        setUserText(text);
        $.ajax({
            type: "POST",
            url: apiUrl,
            data: JSON.stringify(
                {
                    Text: text,
                    SenderConnectionId: RecieverConnectionId,
                    RecieverConnectionId: SenderConnectionId,
                    IdEmpresa: IdEmpresa,
                    IdConversacion: _idConversacion,
                    VisitorId: _visitorId,
                    IdCliente: _idCliente,
                    ConversacionFinalizada: _conversacionFinalizada,
                    AgenteAsignado: _agenteAsignado,
                    NombreCliente: $("#inputName").val(),
                    CorreoCliente: $("#inputEmail").val()
                }),
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.IdCliente != undefined) {
                    _idConversacion = data.IdConversacion;
                    _idCliente = data.IdCliente;
                }
                if (data.BotMessage != '') {
                    setBotResponse(data.BotMessage);
                }
                _conversacionFinalizada = data.ConversacionFinalizada;
                _agenteAsignado = data.AgenteAsignado;
                _nombreAgente = data.NombreAgente;
                if (data.AgenteAsignado && _nombreAgente != '') {
                    notifyAgenteJoinChat(data.NombreAgente);
                }
                if (data.Adjuntos != null && data.Adjuntos != undefined) {
                    var urlArray = Array.from(data.Adjuntos);
                    urlArray.forEach(function (value, index, array) {
                        setBotResponseImg(value);
                    });    
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    function replyMessage(data) {
        connection.invoke('ClientReply', data, RecieverConnectionId, SenderConnectionId)
            .catch(err => console.error(err));
    }

    function MessageHub() {

        var connection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl(hubUrl)
            .build();

        connection.on("sendToUser", (data, senderconnectionid, IdConversacion, IdCliente, EsImagenOAdjunto) => {
            SenderConnectionId = senderconnectionid;
            //_idConversacion = IdConversacion;
            //_idCliente = IdCliente;
            if (!EsImagenOAdjunto) {
                setBotResponse(data);
            } else {
                setBotResponseImg(data);
            }
        });

        connection.start().catch(function (err) {
            return console.error(err.toString());
        }).then(function () {
            connection.invoke('GetConnectionId').then(function (connectionId) {
                document.getElementById('signalRConnectionId').innerHTML = connectionId;
                RecieverConnectionId = connectionId;
            })
        });
    }

    // execute this when user hits enter button in the chat window input
    $("#user_input").keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            // get user query text
            var userText = $('#user_input').val();
            var contextJSON = $('#chat_context').val();

            if (userText.trim().length > 0) {
                sendUserText(userText);
            } else {
                $('#user_input').val(null);
            }

        } // end of if condition
    }); // end of keypress function

    // Session Init (is important so that each user interaction is unique)-----------
    var session = function () {
        // Retrieve the object from storage
        if (sessionStorage.getItem('session')) {
            var retrievedSession = sessionStorage.getItem('session');
        } else {
            // Random Number Generator
            var randomNo = Math.floor((Math.random() * 1000) + 1);
            // get Timestamp
            var timestamp = Date.now();
            // get Day
            var date = new Date();
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var day = weekday[date.getDay()];
            // Join random number+day+timestamp
            var session_id = randomNo + day + timestamp;
            // Put the object into storage
            sessionStorage.setItem('session', session_id);
            var retrievedSession = sessionStorage.getItem('session');
        }
        return retrievedSession;
        // console.log('session: ', retrievedSession);
    }

    // Call Session init
    var mysession = session();

    // Main function: this method has the logic to handle differen parts of the response returned from the chat server
    function main(data) {
        var action = data.result.action;
        var speech = data.result.fulfillment.speech;
        // use incomplete if you use required in api.ai questions in intent
        // check if actionIncomplete = false
        var incomplete = data.result.actionIncomplete;
        if (data.result.fulfillment.messages) { // check if messages are there
            if (data.result.fulfillment.messages.length > 0) { //check if quick replies are there
                var suggestions = data.result.fulfillment.messages[1];
            }
        }
        switch (action) {
            // case 'your.action': // set in api.ai
            // Perform operation/json api call based on action
            // Also check if (incomplete = false) if there are many required parameters in an intent
            // if(suggestions) { // check if quick replies are there in api.ai
            //   addSuggestion(suggestions);
            // }
            // break;
            default:
                setBotResponse(speech);
                if (suggestions) { // check if quick replies are there in api.ai
                    addSuggestion(suggestions);
                }
                break;
        }
    }

    // Suggestions -----------------------------------------------------------------------------------------
    function addSuggestion(textToAdd) {
        setTimeout(function () {
            var suggestions = textToAdd.replies;
            var suggLength = textToAdd.replies.length;
            var botResponseBefore = '<div class="suggestions"><div class="sugg-title">Suggestions:</div>';
            var botResponseAfter = '</div>';
            var val = '';
            // Loop through suggestions
            for (i = 0; i < suggLength; i++) {
                val += '<span class="sugg-options">' + suggestions[i] + '</span>';
            }
            var botResponseFinal = botResponseBefore + val + botResponseAfter;
            $('#chatbox_body_content').append(botResponseFinal);

            // scroll to the bottom of the chatbot body
            $('#chatbox_body_content').scrollTop(1E10);
        }, 1000);
    }

    // on click of suggestions get value and send to API.AI
    $(document).on("click", ".suggestions span", function () {
        var text = this.innerText;
        setUserText(text);
        sendUserText(text);
        $('.suggestions').remove();
    });    
    // Suggestions end -----------------------------------------------------------------------------------------
}