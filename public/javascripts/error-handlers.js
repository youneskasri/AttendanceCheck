function showErrorModal(errorMessage, textStatus, jqXHR) {
    $("#modalTitle").text("Erreur !");
    console.log(errorMessage, textStatus, jqXHR);
    let text;
    if (errorMessage) {
        text = 'Server Error : ' + errorMessage; 			
    } else {
        text = ( 'Status='+textStatus + ', Please verify that the Server is running');
    }		
    $("#modalText").text(text);
    $('#errorModal').modal('show');
}

function showErrorModalJquery(jqXHR, textStatus, errorMessage) {
    showErrorModal(errorMessage, textStatus, jqXHR);
}

function alertError(error) {
    let message;
    if(error) {
        message = error.message || error;
    }
    $("#errorMessage").text(message);
    console.log(error);
    $(".alert.alert-danger").removeClass("d-none");
}

$(".alert>button.close").click(closeAlertError);
function closeAlertError() {
    $(this).parent().addClass("d-none");
}

