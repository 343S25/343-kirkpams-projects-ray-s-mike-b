const currencies_url = 'https://api.frankfurter.dev/v1/currencies';

const currency_select = document.getElementById('currency-select');
// set up currency dropdown
fetch(currencies_url)
    .then(response => response.json())
    .then(currencies => {
        for (currency_code in currencies) {
            let new_option = document.createElement('option');
            new_option.value = currency_code;
            new_option.textContent = `${currencies[currency_code]} (${currency_code})`;
            currency_select.appendChild(new_option);
        }
        let settings = JSON.parse(localStorage.getItem('settings'));
        if (!settings) {
            settings = { currency: 'USD' };
            localStorage.setItem('settings', JSON.stringify(settings));
        }
        currency_select.value = settings.currency;

    })
    .catch(err => console.log(err));

document.getElementById('settings-save').addEventListener('click', function (event) {
    event.preventDefault();
    if (!localStorage.getItem('settings')) {
        localStorage.setItem('settings', '{}');
    }
    let settings = JSON.parse(localStorage.getItem('settings'));
    if (!settings.currency) {
        settings.currency = 'USD';
    }
    settings.currency = document.forms['settings-form']['currency-select'].value;
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('SAVED!');
});

document.getElementById('delete-data').addEventListener('click', function (event) {
    if (confirm('Are you sure you want to delete all of your data?')) {
        localStorage.removeItem('settings');
        localStorage.removeItem('projects');
        alert('Data successfully deleted');
    }
});