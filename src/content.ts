import BuiltInLib from '@/content/builtIn';
import { Log } from './common/log';
import { IMSG_TYPE, Message } from './common/Message';

// mount buil-in lib on window
window.InjectCode = BuiltInLib;

// this file is excuted when page open, then notifies background to inject code
// one page should be injected once
chrome.runtime.sendMessage(
  new Message(IMSG_TYPE.CONTENT_2_BACKGROUND_PAGE_OPEN),
  (response: Message<string>) => {
    Log.Debug('response', response);
  },
);
