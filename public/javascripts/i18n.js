/* Should come after jQuery
B/C all other front end JS files will need these dictionaries.
Normalement, les dictionnaires doivent être disponible pour chaque page (y)
On va surtout faire appel à la fct: getCurrentDictionnary() pour chercher les translations 
avec une KEY
*/ 



// !!! Question: I assumed sessionStorage would be cleared when i close the Tab. Is that true ?

const locales = ['fr'];

// Default locale
const DEFAULT_LOCALE = "fr";
sessionStorage.setItem("locale", "fr");

// Load the default dictionary 
loadCurrentDictionaryAndUpdateValues();


/* (used in error handlers ) to translate if possible
Get Dico for the current locale */
function getCurrentDictionary() {
    let locale = sessionStorage.getItem("locale") || DEFAULT_LOCALE;
    return JSON.parse(sessionStorage.getItem(locale));
}



function loadCurrentDictionaryAndUpdateValues() {
    let locale = sessionStorage.getItem("locale");
    loadDictionaryAndUpdateValues(locale);
}

/* If not in SessionStorage, load via AJAX */
function loadDictionaryAndUpdateValues(locale) {
    if (sessionStorage.getItem(locale)) {
        updateValues(locale);
    }
    else {
        $.get(`/locales/${locale.toLowerCase()}.json`)
        .done(result => {
            sessionStorage.setItem(locale, JSON.stringify(result));
            updateValues(locale);
        }).fail(console.log);
    }    
}

/* Fill data-i18n nodes */
function updateValues(locale) {
    let dictionary = JSON.parse(sessionStorage.getItem(locale));
    console.log("dico", dictionary);
    $("[data-i18n]").each((index, element) => {
        console.log($(element).attr("data-i18n"));
        let key = $(element).attr("data-i18n");

        if (key.includes("[placeholder]")) {
            key = key.replace("[placeholder]", '');
            $(element).attr("placeholder", dictionary[key]);
        } else {
            $(element).text(dictionary[key]);   
        }
     });
}