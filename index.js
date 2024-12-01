"use strict";

document.addEventListener('DOMContentLoaded', function () {
    const htmlSrc = document.location.href;
    if (htmlSrc.endsWith('/') || htmlSrc.endsWith('/index.html')) {
        setInterval(() => {
            const aboutRandom = document.querySelector("#about-random");
            if (aboutRandom) {
                aboutRandom.textContent = Array.from({ length: 15 }, () => String.fromCharCode(Math.floor(Math.random() * 200 + 55))).join("");
            }
        }, 200);
    }

    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        setupLanguageSelector(languageSelector);
    }

    // Load texts for the initial language
    if (sessionStorage.getItem("language")) {
        window.language = sessionStorage.getItem("language");
    } else {
        window.language = "en"; // Default language
        sessionStorage.setItem("language", window.language);
    }
    loadTexts(window.language);
});

function setupLanguageSelector(languageSelector) {
    languageSelector.style.backgroundImage = `url("/assets/images/languages/${window.language}.png")`;
    languageSelector.style.backgroundSize = '32px 24px';
    languageSelector.style.backgroundColor = '#121212';
    languageSelector.style.backgroundRepeat = 'no-repeat';
    languageSelector.style.padding = '5px';
    languageSelector.style.color = 'white';
    languageSelector.style.border = 'none';

    languageSelector.addEventListener('change', function () {
        const selectedLanguage = this.value;
        sessionStorage.setItem("language", selectedLanguage);
        window.language = selectedLanguage;
        loadTexts(window.language);
    });
}

function changeLanguage(language) {
    window.language = language; location.reload();
}

function loadTexts(language) {
    fetch(`/texts/${language}/index.json`)
        .then(response => response.json())
        .then(data => {
            // Set text for elements based on their ID
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.innerHTML = data[key];
                }
            });

            // Set text for datapoint-choice elements
            const datapointChoices = [
                { selector: '.datapoint-choice[target="Audio"] > header', key: 'datapoint-choice-audio' },
                { selector: '.datapoint-choice[target="Holograms"] > header', key: 'datapoint-choice-holograms' },
                { selector: '.datapoint-choice[target="Text-Quests"] > header', key: 'datapoint-choice-text-quests' },
                { selector: '.datapoint-choice[target="Text-World"] > header', key: 'datapoint-choice-text-world' },
                { selector: '.datapoint-choice[target="Text-Machines"] > header', key: 'datapoint-choice-text-machines' },
                { selector: '.datapoint-choice[target="Scanned-Glyphs"] > header', key: 'datapoint-choice-scanned-glyphs' }
            ];

            datapointChoices.forEach(({ selector, key }) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerText = data[key];
                }
            });
        })
        .catch(error => console.error('Error loading texts:', error));
}
