for file in $(ls *.css); do  node-minify --compressor clean-css --input $file --output minified/$file; done;

**is the DB created auto with Mongoose ?** YES

# To Check if User is Connected, and for Role in FrontEnd
{{#if currentUser }} 
    {{#cond isAdmin '===' true}}
        ADMIN
    {{/cond}}
    Hello
{{/if}}


# Set Proxy NPM ( NOT WORKING )
npm config set proxy http://ENSIAS-Student:wpass1234@10.23.201.11:3128
npm config set https-proxy https://ENSIAS-Student:wpass1234@10.23.201.11:3128 http://<username>:<password>@<proxy-server-url>:<port>
# Unset Proxy NPM
http://luxiyalu.com/how-to-remove-all-npm-proxy-settings/

# Database Size Needed en moyenne :
50mb = 0.05GB per Employee per Month
0.05GB * 50 Emp * 12 Month = 30GB

# Build :
- build:obfuscate
    - Copy * content from . to ./target
    - For Each File .js in ./target :
        obfuscate FILENAME.js --> FILENAME-obfuscated.js
        rm all NOT-obfuscated file
        rename FILENAME-obfuscated.js to FILENAME.js
I'll Write this for loop using Node FS

node-minify --compressor clean-css --input *.css 
# PostBuild
- postbuild:tests 
    # # # # #
- node ./target/app.js


**Global dependencies**
npm install -g express-generator mocha nodemon jshint npm-run-all javascript-obfuscator node-minify win-node-env node-inspector; *shelljs shx Not working with bash scripts*

**Handling AJAX Errors**
- In Backend => HandleAjaxError(res) returns Promise(err) that *Sends Error Stack & Message Status=200*
- In Front End :
    - Cas 200 : if (data.error) alertError({message, stack}) # BS4 alert
    - Cas Ajax Error (Timeout.. ) : .fail(showErrorModalJquery);

**Handling Errors**
- Backend : .catch(handleError(next)) => *printError to console & file; next(err);*
    - In Dev Only: app.use(errorHandler()) => *all Errors catched by Express will be sent back to the client*

**No need for HTTPS for WebCam** Because Browser localhost safe even without SSL certificate.


**Memory issues**
If you log an object to the console => It cannot be Garbage Collected
