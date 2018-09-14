**Handling AJAX Errors**
- In Backend => HandleAjaxError(res) returns Promise(err) that *Sends Error Stack & Message Status=200*
- In Front End :
    - Cas 200 : if (data.error) alertError({message, stack}) # BS4 alert
    - Cas Ajax Error (Timeout.. ) : .fail(showErrorModalJquery);

**Handling Errors**
- Backend : .catch(handleError(next)) => *printError to console & file; next(err);*
    - In Dev Only: app.use(errorHandler()) => *all Errors catched by Express will be sent back to the client*

**No need for HTTPS for WebCam** Because Browser localhost safe even without SSL certificate.