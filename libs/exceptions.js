const ExceptionI18N = (locale, translations) => translations[locale.toUpperCase()];

const EmployeeNotFoundException = (locale) => ExceptionI18N(locale, {
    FR: "L'employé recherché n'existe pas",
    EN: 'Employee not found',
    AR: 'هذا الرقم غير موجود' 
});



module.exports = {
    EmployeeNotFoundException
};

