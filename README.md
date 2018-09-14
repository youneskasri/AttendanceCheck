**Handling AJAX Errors**
- In Backend => HandleAjaxError(res) returns Promise(err) that *Sends Error Stack & Message Status=200*
- In Front End :
    - Cas 200 : if (data.error) alertError({message, stack}) # BS4 alert
    - Cas Ajax Error (Timeout.. ) : .fail(showErrorModalJquery);

**Handling Errors**
- Backend : 


**No need for HTTPS for WebCam** Because Browser localhost safe even without SSL certificate.