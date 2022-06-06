// downloadOptions are index fixed. Don't move them!
let downloadOptions = [
  {
    os:'Windows',
    link: null,
    img: 'assets/windows-logo.png',
    current: false
  },
  {
    os:'Mac OS',
    link: null,
    img: 'assets/macos-logo.png',
    current: false
  },
  {
    os:'iOS',
    link: null,
    img: 'assets/ios-logo.png',
    current: false
  },
  {
    os:'Android',
    link: 'https://github.com/fasko-app/fasko_mobile/releases/latest/download/fasko.apk',
    img: 'assets/android-logo.png',
    current: false
  },
  {
    os:'Linux',
    link: null,
    img: 'assets/linux-logo.png',
    current: false
  },
];

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

let currentOptionId = getCurrentDownloadOptionId();
if(downloadOptions[currentOptionId] != null && downloadOptions[currentOptionId].link != null) {
  downloadBtn.innerHTML += ` ${downloadOptions[currentOptionId].os}`;
  downloadBtn.setAttribute('href', downloadOptions[currentOptionId].link);
} else {
  downloadBtn.innerHTML += ` ${downloadOptions[2].os}`;
  downloadBtn.setAttribute('href', downloadOptions[2].link);
}

loadDownloadOptions();