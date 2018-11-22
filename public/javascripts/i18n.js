$.get('/locales/fr.json')
.done(result => {
    console.log(result);
    let FR = result;
    $("[data-i18n]").each((index, element) => {
        console.log($(element).attr("data-i18n"));
        let key = $(element).attr("data-i18n");

        if (key.includes("[placeholder]")) {
            key = key.replace("[placeholder]", '');
            $(element).attr("placeholder", FR[key]);
        } else 
            $(element).text(FR[key]);
    });
}).fail(showErrorModalJquery);