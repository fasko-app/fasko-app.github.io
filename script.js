// downloadOptions are index fixed. Don't move them!
const downloadOptions = [
  {
    os:'Web',
    link: 'https://fasko-app.web.app',
    img: 'assets/logos/web-logo.png',
    current: false
  },
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
    link: 'https://github.com/fasko-app/fasko/releases/latest/download/fasko.apk',
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

let locale;
let translations = {};

let currentOptionId = getCurrentDownloadOptionId();


document.addEventListener('DOMContentLoaded', () => {
  const initialLocale = supportedOrDefault(browserLocales());

  setLocale(initialLocale);
  bindLocaleSwitcher(initialLocale);
  buildDownloadOptions();
});


function buildPage() {
  translatePage();
  buildDownloadBtn();
  buildLogoImage();
}


// get user supported locales
function browserLocales() {
  return navigator.languages.map((locale) => locale.split("-")[0]);
}

function isSupported(locale) {
  return supportedLocales.indexOf(locale) > -1;
}

function supportedOrDefault(locales) {
  return locales.find(isSupported) || defaultLocale;
}

async function setLocale(newLocale) {
  if (newLocale === locale) return;

  translations = await fetchTranslationsFor(newLocale);
  locale = newLocale;

  buildPage();
}

async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`langs/${newLocale}.json`);
  return await response.json();
}

function translatePage() {
  document
    .querySelectorAll("[data-i18n-key]")
    .forEach(translateElement);
}

function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");
  element.innerText = translations[key];
}

function getCurrentDownloadOptionId() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod']

  let optionIndex = -1;
  if (macosPlatforms.indexOf(platform) !== -1) {
    optionIndex = 0;
    //optionIndex = 1;
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    optionIndex = 0;
    //optionIndex = 2;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    optionIndex = 0;
    //optionIndex = 1;
  } else if (/Android/.test(userAgent)) {
    optionIndex = 4;
  } else if (!os && /Linux/.test(platform)) {
    optionIndex = 0;
    //optionIndex = 4;
  }

  if(optionIndex != -1) {
    downloadOptions[optionIndex].current = true;
    return optionIndex;
  }
  return null;
}

function buildDownloadOptions() {
  let downloadOptionsDiv = document.getElementById('downloadOptionsDiv');
  for (let i = 0; i < downloadOptions.length; i++) {
    const element = downloadOptions[i];
    if(!element.current && element.link != null) {
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
            <a class="btn btn-light w-100 h-100" href="${element.link}" data-i18n-key="${element.os == 'Web' ? 'visit' : 'download'}"></a>
          </div>
        </div>
      </div>
      `;
    }
  }
}

function buildDownloadBtn() {
  let downloadBtn = document.getElementById('downloadBtn');
  if(downloadOptions[currentOptionId] != null && downloadOptions[currentOptionId].link != null) {
    downloadBtn.innerHTML = `<i class="bi bi-download"></i>&nbsp ${translations[currentOptionId == 0 ? 'visit' : 'download']} ${translations['for']} ${downloadOptions[currentOptionId].os}`;
    downloadBtn.setAttribute('href', downloadOptions[currentOptionId].link);
  } else {
    downloadBtn.innerHTML = `<i class="bi bi-download"></i>&nbsp ${translations['download']}`;
    downloadBtn.setAttribute('href', '#otherOptions');
  }
}

function buildLogoImage() {
  const logoImg = document.getElementById('logoImg');
  logoImg.setAttribute("src", translations['logo']);
}


function bindLocaleSwitcher(value) {
  const switcher = document.querySelector("[data-i18n-switcher]");
  switcher.value = value;
  switcher.onchange = e => setLocale(e.target.value);
}