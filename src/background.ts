import { Log } from './common/log';
import { IMSG_TYPE, Message } from './common/Message';

chrome.runtime.onInstalled.addListener(() => {
  /* */
});

// tslint:disable-next-line: variable-name
chrome.runtime.onMessage.addListener((data: Message, sender, _sendResponse) => {
  Log.Debug(data);

  switch (data.type) {
    case IMSG_TYPE.CONTENT_2_BACKGROUND_PAGE_OPEN: {
      chrome.tabs.executeScript(
        sender.tab.id,
        {
          runAt: 'document_start',
          code: `console.log('log from  background')`,
        },
        (...d: any[]) => {
          Log.Debug('inject script callback');
        },
      );
      break;
    }
  }

  // notice: 当 sendResponse 需要被异步调用时，此处应添加 `return true`
  // https://stackoverflow.com/a/20077854/10528190
  // return true;
});
