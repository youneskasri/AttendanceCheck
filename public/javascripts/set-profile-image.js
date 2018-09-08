
          $("#savePicture").click((evt)=>{

            console.log('savePicture');
            let image = takePicture();
            let idEmployee = $("input[name='idEmp']").val();
            let url = '/employees/'+  idEmployee +'/profileImage'; 
            $.post(url, { image, idEmployee }).done(function(result){
              if (result.error) {
                return alert(result.error.message);
              }
              console.log(result.image.data.toString());
              result.success || true ? $("#empPicture").attr("src", result.image.data.toString())
              : console.log(result);
            })
            .fail((jqXHR, textStatus, errorMessage) => {
              showErrorModal(errorMessage, textStatus, jqXHR);
            });
          });
        