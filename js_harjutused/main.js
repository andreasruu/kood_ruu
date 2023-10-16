function harjutus1(nimi) {
    console.log(`Tere ${nimi}!`);
}

function harjutus2(mark, mudel, värv) {
    console.log;
}

function harjutus3(põhjapindala, kõrgus) {
    let ruumala = (1/3) * põhjapindala * kõrgus;
    console.log(`Püramiidi ruumala on ${ruumala}.`);
}

function harjutus4(nimi) {
    if (nimi.length <= 5) {
        console.log(nimi);
    } else {
        console.log(nimi.slice(0, 5) + "...");
    }
}

function harjutus5(string) {
    console.log(string.split('').reverse().join(''));
}

function harjutus6(){
    for (let i = 1; i <= 100; i++) {
            console.log(i);}}

            
function harjutus7(){
    for (let i = 100; i >= 1; i--) {
        console.log(i);}}

function harjutus10(){
    let myNameComponents = ['Samuel', 'L', 'Jackson'];
    console.log(`Minu nimi on ${myNameComponents}.`)}

function average(array) {
        let sum = array.reduce((acc, curr) => acc + curr, 0);
        return sum / array.length;}

function harjutus11(hinded){
    console.log(average(hinded))}

function harjutus12(){
    for (let i = 1; i <= 100; i++) {
        if (i % 3 === 0 && i % 5 === 0) {console.log('Lütseum');}
        else if (i % 3 === 0) {console.log('Tallinna');}
        else if (i % 5 === 0) {console.log('Prantsuse');}
        if i === 50 {console.log('Tallinna Prantsuse Lütseum');}
        else {console.log(i);}}}

function harjutus13(massiiv){
    if massiiv.includes("Marek") {console.log("Marek on massiivis")}
    else {console.log("Marek pole massiivis");}}

function harjutus14(massiiv){
    let inimesed = [
    {
        nimi: 'Alice',
        vanus: 28,
        aadress: 'Pargi 7',
        telefon: '23857493',
        email: 'alice@eesti.ee'
    },
    {
        nimi: 'Bob',
        vanus: 32,
        aadress: 'Tänavaküla 12',
        telefon: '293463847',
        email: 'bob@gmail.com'
    },
    {
        nimi: 'Marek',
        vanus: 22,
        aadress: 'Metsatee 3',
        telefon: '8594032',
        email: 'marek@example.com'
    }
];
}