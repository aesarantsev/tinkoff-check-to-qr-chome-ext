chrome.webRequest.onBeforeRequest.addListener(
  async (request) => {
    const { url } = request;
    const isShoppingReceipt = url.includes('shopping_receipt');

    if (!isShoppingReceipt) {
      return;
    }

    const operationId = new URL(url).searchParams.get('operationId');

    chrome.storage.sync.set({ [operationId]: url });
  },
  { urls: ['https://www.tinkoff.ru/api/common/v1/*'] },
  []
);
