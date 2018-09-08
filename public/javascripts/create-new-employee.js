
      
      /* Ajax POST Request To Create a new Employee */
      $("form#newEmployee").submit((evt)=>{
        
          evt.preventDefault();
          let CIN = getInputValue("CIN"); // A TESTER
          let firstName = getInputValue("firstName");
          let lastName = getInputValue("lastName");
          let birthDate = getInputValue("birthDate");
          let phoneNumber = getInputValue("phoneNumber");
          
          $.post("/employees", {CIN, firstName, lastName, birthDate, phoneNumber})
            .done(handleServerResponse)
            .fail((jqXHR, textStatus, errorMessage) => {
              showErrorModal(errorMessage, textStatus, jqXHR);
            });
      });
 

      /* A TESTER */
      function getInputValue(inputName) {
        let selector = `input[name='${inputName}']`;
        return $(selector).val();
      }
      
      /* Handle Ajax Response To Add Newly created Employee */  
      function handleServerResponse(data){    
        if (data.error) {
          if (data.error.code === 11000){
            showErrorMessage("CIN already used! ");
            $("input[name='CIN']").val('');
          } else {
            handleError(data.error);
          }
        } else if (data.success){
            console.log("Received employee : " + data.employee);
            appendNewEmployee(data.employee);
            cleanInputFields();
            $("input[name='CIN']").focus();
            showSuccessMessage("Saved! ");
        }
      }

      function handleError(err) {
        showErrorMessage(err.message);
        console.log(err);
        alert(err.message);
      } 

      function appendNewEmployee(emp){
        
        $("#link").attr("href", "/employees/" + emp._id);
        if (emp.profileImage && emp.profileImage.data) {
          $("#img").attr("src", emp.profileImage.data);
        }
        $("#fullName").text(emp.firstName + ' ' + emp.lastName);
        $("#CIN").text(emp.CIN);
        $("#phoneNumber").text(emp.phoneNumber);

        let htmlEmp = $("#emptyEmployee").html();
        $("#listOfEmployees").prepend(htmlEmp);
      }

      function showSuccessMessage(msg){
        $( "#newEmployeeMessage").removeClass("text-danger d-none").addClass("text-success")
                  .text(msg).show().fadeOut( 1500 );
      }

      function showErrorMessage(msg){
        $( "#newEmployeeMessage").removeClass("text-success d-none").addClass("text-danger small")
          .text(msg).show().fadeOut( 2500 );
      }

      function cleanInputFields(){
        $("input[name='CIN']").val('');
        $("input[name='firstName']").val('');
        $("input[name='lastName']").val('');
        $("input[name='phoneNumber']").val('');
      }

 