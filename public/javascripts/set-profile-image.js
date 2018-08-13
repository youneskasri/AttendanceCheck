
          $("#savePicture").click((evt)=>{

            console.log('savePicture');
            let image = takePicture();
            let idEmployee = $("input[name='idEmp']").val();
            let url = '/employees/'+  idEmployee +'/profileImage'; 
            $.post(url, { image, idEmployee }).done(function(result){
              console.log(result.image.data.toString());
              result.success || true ? $("#empPicture").attr("src", result.image.data.toString())
              : console.log(result);
            })
            .fail(function handleError(err) {
                alert(err.message);
                showErrorMessage(err.message);
                console.log(err);
            });
          });
        