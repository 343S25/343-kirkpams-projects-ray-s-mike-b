const currencies_url = 'https://api.frankfurter.dev/v1/currencies';

// set up currency dropdown
fetch(currencies_url)
    .then(response => response.json())
    .then(currencies => {
        let currency_select = document.getElementById('currency-select');
        for (currency_code in currencies) {
            let new_option = document.createElement('option');
            new_option.value = currency_code;
            new_option.textContent = `${currencies[currency_code]} (${currency_code})`;
            currency_select.appendChild(new_option);
        }
    })
    .catch(err => console.log(err));

document.getElementById('settings-save').addEventListener('click', function (event) {
    event.preventDefault();
});
