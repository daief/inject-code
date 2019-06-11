import { handleMethodsImplement } from './background/handleMethodsImplement';
import { handlePageOpenMsg } from './background/handlePageOpenMsg';
import { Log } from './common/log';
import { IMSG_TYPE, Message } from './common/Message';

chrome.runtime.onInstalled.addListener(() => {
  /* */
});

chrome.runtime.onMessage.addListener((data: Message, sender, sendResponse) => {
  Log.Debug(data);

  switch (data.type) {
    case IMSG_TYPE.CONTENT_2_BACKGROUND_PAGE_OPEN: {
      handlePageOpenMsg(data, sender).then(msg => {
        sendResponse(
          new Message(IMSG_TYPE.CONTENT_2_BACKGROUND_PAGE_OPEN_RESP, msg),
        );
      });
      return true;
    }
    case IMSG_TYPE.CONTENT_2_BACKGROUND_CALL_METHOD: {
      handleMethodsImplement(data, sender)
        .then(msg => {
          sendResponse(
            new Message(IMSG_TYPE.CONTENT_2_BACKGROUND_CALL_METHOD_RESP, {
              result: msg,
            }),
          );
        })
        .catch(err => {
          sendResponse(
            new Message(IMSG_TYPE.CONTENT_2_BACKGROUND_CALL_METHOD_RESP, {
              error: err,
            }),
          );
        });
      return true;
    }
  }

  // notice: 当 sendResponse 需要被异步调用时，此处应添加 `return true`
  // https://stackoverflow.com/a/20077854/10528190
  // return true;
});
