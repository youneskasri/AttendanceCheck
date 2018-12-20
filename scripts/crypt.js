const crypto = require('crypto');
const fs = require('fs');
const cipher = crypto.createCipher('aes192', 'x0_func_003');

const input = fs.createReadStream('credentials.txt');
const output = fs.createWriteStream('target/credentials.txt');

/*
    Khass nbedel l'algo
    Hadchi ti crypté l fichier kamel o ti 3tini data erroné

*/

input.pipe(cipher).pipe(output);

