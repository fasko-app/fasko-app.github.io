// downloadOptions are index fixed. Don't move them!
let downloadOptions = [
  {
    os:'Windows',
    link: null,
    img: 'assets/logos/windows-logo.png',
    current: false
  },
  {
    os:'Mac OS',
    link: null,
    img: 'assets/logos/macos-logo.png',
    current: false
  },
  {
    os:'iOS',
    link: null,
    img: 'assets/logos/ios-logo.png',
    current: false
  },
  {
    os:'Android',
    link: 'https://github.com/fasko-app/fasko_mobile_public/releases/latest/download/fasko.apk',
    img: 'assets/logos/android-logo.png',
    current: false
  },
  {
    os:'Linux',
    link: null,
    img: 'assets/logos/linux-logo.png',
    current: false
  },
];

const defaultLocale = "en";
const supportedLocales = ["en", "uk"];
// The active locale
let locale;
// Gets filled with active locale translations
let translations = {};


function browserLocales(languageCodeOnly = true) {
  return navigator.languages.map((locale) =>
    languageCodeOnly ? locale.split("-")[0] : locale,
  );
}


function isSupported(locale) {
  return supportedLocales.indexOf(locale) > -1;
}
// Retrieve the first locale we support from the given
// array, or return our default locale
function supportedOrDefault(locales) {
  return locales.find(isSupported) || defaultLocale;
}

async function setLocale(newLocale) {
  if (newLocale === locale) return;
  const newTranslations = 
    await fetchTranslationsFor(newLocale);
  locale = newLocale;
  translations = newTranslations;
  translatePage();
}
// Retrieve translations JSON object for the given
// locale over the network
async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`langs/${newLocale}.json`);
  return await response.json();
}
// Replace the inner text of each element that has a
// data-i18n-key attribute with the translation corresponding
// to its data-i18n-key
function translatePage() {
  document
    .querySelectorAll("[data-i18n-key]")
    .forEach(translateElement);
  loadDownloadBtn();
  loadLogoImage();
}

function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");
  const translation = translations[key];
  element.innerHTML = translation;
}

function getCurrentDownloadOptionId() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod']

  let optionIndex = -1;
  if (macosPlatforms.indexOf(platform) !== -1) {
    optionIndex = 1;
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    optionIndex = 2;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    optionIndex = 0;
  } else if (/Android/.test(userAgent)) {
    optionIndex = 3;
  } else if (!os && /Linux/.test(platform)) {
    optionIndex = 4;
  }

  if(optionIndex != -1) {
    downloadOptions[optionIndex].current = true;
    return optionIndex;
  }
  return null;
}

function loadDownloadOptions() {
  let downloadOptionsDiv = document.getElementById('downloadOptionsDiv');
  for (let i = 0; i < downloadOptions.length; i++) {
    const element = downloadOptions[i];
    if(element.link != null && element.current == false) {
      downloadOptionsDiv.innerHTML += 
      `
      <div class="col-sm-6">
        <div class="card border-dark mb-3">
        <div class="card-header bg-transparent border-dark">
          <h6 class="m-1 text-center">${element.os}</h6>
        </div>
          <div class="card-body d-flex justify-content-center align-items-center">
            <img src="${element.img}" class="card-img-top w-25" alt="${element.os}">
          </div>
          <div class="card-footer bg-transparent border-dark p-0">
            <a class="btn btn-light w-100 h-100" href="${element.link}">Download</a>
          </div>
        </div>
      </div>
      `;
    }
  }
}

function loadDownloadBtn() {
  let downloadBtn = document.getElementById('downloadBtn');
  let currentOptionId = getCurrentDownloadOptionId();
  if(downloadOptions[currentOptionId] != null && downloadOptions[currentOptionId].link != null) {
    downloadBtn.innerText += ` ${translations['for']} ${downloadOptions[currentOptionId].os}`;
    downloadBtn.setAttribute('href', downloadOptions[currentOptionId].link);
  } else {
    downloadBtn.setAttribute('href', '#otherOptions');
  }
}

function loadLogoImage() {
  let logoImg = document.getElementById('logoImg');
  logoImg.setAttribute("src", translations['logo']);
}


function bindLocaleSwitcher(initialValue) {
  const switcher = document.querySelector("[data-i18n-switcher]");
  switcher.value = initialValue;
  switcher.onchange = e => setLocale(e.target.value);
}

document.addEventListener('DOMContentLoaded', () => {
  const initialLocale = supportedOrDefault(browserLocales(true));

  setLocale(initialLocale);
  bindLocaleSwitcher(initialLocale);

  loadDownloadBtn();
  loadDownloadOptions();
});

