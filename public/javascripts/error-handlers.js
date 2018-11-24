
function showErrorModal(errorMessage, textStatus, jqXHR) {
    let dictionary =  getCurrentDictionary();

    $("#modalTitle").text(dictionary["ERROR"]+" !");
    console.log("006", errorMessage, textStatus, jqXHR);
    let text;
    if (errorMessage) {
        text = dictionary["SERVER_ERROR"]+ ' : ' + translateIfPossible(errorMessage, dictionary);
    } else {
        text = ( 'Status='+textStatus + ', '+ dictionary["PLEASE_VERIFY_SERVER_RUNNING"]);
    }		
    $("#modalText").text(text);
    $('#errorModal').modal('show');
}

function translateIfPossible(msg, dictionaryArg) {
    let dictionary = dictionaryArg || getCurrentDictionary();

    console.log(msg, dictionary[msg], dictionary);
    try {
        let message = dictionary[msg];
        if (!message)    return msg;
        return message;
    }
    catch (ex) { console.log(ex); return msg; }
}


function alertError(error) {
    let dictionary = getCurrentDictionary();
    let message;
    if(error) {
        message = error.message || error;
        message = dictionary["ERROR"] + ' ! ' + translateIfPossible(message, dictionary);
    }
    $("#errorMessage").text(message);
    console.log(message);
    $(".alert.alert-danger").removeClass("d-none");
}

$(".alert>button.close").click(closeAlertError);
function closeAlertError() {
    $(this).parent().addClass("d-none");
}

function showErrorModalJquery(jqXHR, textStatus, errorMessage) {
    showErrorModal(errorMessage, textStatus, jqXHR);
}