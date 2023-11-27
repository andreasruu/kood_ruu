const apiKey = '97d72919b626d0232aadb696'; // Replace with your actual API key

let allCurrencies = []; // Store all currencies for search functionality

function populateCurrencyOptions() {
    fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`)
        .then(response => response.json())
        .then(data => {
            allCurrencies = data.supported_codes;
            updateCurrencySelect(allCurrencies, 'from-currency-selector');
            updateCurrencySelect(allCurrencies, 'to-currency-selector');
        })
        .catch(error => console.error('Error:', error));
}

function updateCurrencySelect(currencies, selectorId) {
    const selector = document.getElementById(selectorId);
    const optionsContainer = selector.getElementsByClassName('currency-options')[0];
    optionsContainer.innerHTML = ''; // Clear existing options
    currencies.forEach(currency => {
        let option = document.createElement('div');
        option.classList.add('currency-option');
        option.textContent = `${currency[1]} (${currency[0]})`;
        option.setAttribute('data-value', currency[0]);
        option.addEventListener('click', function() {
            selector.getElementsByTagName('input')[0].value = this.textContent;
            optionsContainer.style.display = 'none';
        });
        optionsContainer.appendChild(option);
    });
}

document.querySelectorAll('.currency-selector').forEach(selector => {
    const input = selector.getElementsByTagName('input')[0];
    const optionsContainer = selector.getElementsByClassName('currency-options')[0];

    input.addEventListener('input', function(e) {
        const searchTerm = e.target.value;
        const filteredCurrencies = allCurrencies.filter(currency =>
            currency[1].toLowerCase().includes(searchTerm.toLowerCase()));
        updateCurrencySelect(filteredCurrencies, selector.id);
        optionsContainer.style.display = 'block';
    });

    input.addEventListener('focus', function() {
        optionsContainer.style.display = 'block';
    });

    input.addEventListener('blur', function() {
        setTimeout(() => optionsContainer.style.display = 'none', 200);
    });
});

document.getElementById('convert').addEventListener('click', function() {
    const amount = document.getElementById('amount').value;
    const fromCurrencyElement = document.getElementById('from-currency-selector').getElementsByTagName('input')[0].value;
    const toCurrencyElement = document.getElementById('to-currency-selector').getElementsByTagName('input')[0].value;

    // Extract currency code from the string
    const fromCurrencyCode = fromCurrencyElement.match(/\(([^)]+)\)/)[1];
    const toCurrencyCode = toCurrencyElement.match(/\(([^)]+)\)/)[1];

    fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrencyCode}`)
        .then(response => response.json())
        .then(data => {
            const rate = data.conversion_rates[toCurrencyCode];
            const convertedAmount = (amount * rate).toFixed(2);
            document.getElementById('result').innerText = 
                `${amount} ${fromCurrencyCode} is ${convertedAmount} ${toCurrencyCode}`;
        })
        .catch(error => console.error('Error:', error));
});

populateCurrencyOptions();
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});