
      /* Ajax POST Request To Create a new Employee */
      $("form#newEmployeeForm").submit((evt)=>{
        
          evt.preventDefault();
          let CIN = getInputValue("CIN");
          let firstName = getInputValue("firstName");
          let lastName = getInputValue("lastName");
          let birthDate = getInputValue("birthDate");
          let phoneNumber = getInputValue("phoneNumber");
          
          $.post("/employees", {CIN, firstName, lastName, birthDate, phoneNumber})
            .done(handleServerResponse)
            .fail(showErrorModalJquery);
      });
 
      function getInputValue(inputName) {
        let selector = `input[name='${inputName}']`;
        return $(selector).val();
      }
      
      /* Handle Ajax Response To Add Newly created Employee */  
      function handleServerResponse(data){ 
        let dictionary = getCurrentDictionary();
        console.log("25555", dictionary);
        if (data.success){
            appendNewEmployee(data.employee);
            cleanInputFields();
            $("input[name='CIN']").focus();
            showSuccessMessage(dictionary["SAVED_SUCCESS"]);
        } else {
          let message = dictionary["ERROR_WHILE_PROCESSING"];
          if (data && data.error) message = data.error.message;
          if (message.includes("E11000")){
            message = dictionary["CIN_ALREADY_USED"];
            $("input[name='CIN']").val('');
          }
          showErrorMessage(message);        
        }
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
          .text(msg).show().fadeOut( 3000 );
      }

      function cleanInputFields(){
        $("input[name='CIN']").val('');
        $("input[name='firstName']").val('');
        $("input[name='lastName']").val('');
        $("input[name='phoneNumber']").val('');
      }

 