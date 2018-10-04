
$("#savePicture").click((evt)=>{

  console.log('savePicture');
  let image = takePicture();
  let idEmployee = $("input[name='idEmp']").val();
  let url = '/employees/'+  idEmployee +'/profileImage'; 
  $.post(url, { image, idEmployee }).done(function(result){
    if (result.error) {
      return alertError(result.error);
    }
    if (result.success) {
      $("#empPicture").attr("src", result.image.data.toString());
    } else {
      alertError("Error while setting profile Image !");
    }
  })
  .fail(showErrorModalJquery);
});
        