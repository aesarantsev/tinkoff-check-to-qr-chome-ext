import qrcode from 'qrcode';
import axios from 'axios';
import { createQrContent } from './qrContent';

(async function () {
  const [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const { url } = currentTab;

  if (!url || !url.includes('operationId')) {
    return;
  }

  const operationId = new URL(url).searchParams.get('operationId');
  const operationFromStorage = await chrome.storage.sync.get(operationId);
  const apiUrl = operationFromStorage[operationId];

  const { data } = await axios.get(apiUrl);

  if (!data) {
    return;
  }

  const { payload } = data;

  const {
    operationDateTime: { milliseconds },
    receipt: {
      totalSum,
      fiscalDriveNumber,
      fiscalDocumentNumber,
      fiscalSign,
      taxationType,
      retailPlace,
    },
  } = payload;

  const qrContent = createQrContent({
    t: milliseconds,
    s: totalSum,
    fn: fiscalDriveNumber,
    i: fiscalDocumentNumber,
    fp: fiscalSign,
    n: taxationType,
  });

  const app = document.getElementById('app');
  const header = document.getElementById('header');
  const qrCanvas = document.createElement('canvas');

  header.innerText = `Покупка на ${totalSum} ₽ ${
    retailPlace ? `в ${retailPlace}` : ''
  }`;

  qrcode.toCanvas(
    qrCanvas,
    qrContent,
    { width: 200, height: 200 },
    function (error) {
      if (error) console.error(error);
      console.log('success!');
    }
  );

  app.appendChild(qrCanvas);
})();
