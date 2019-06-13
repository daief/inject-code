import { Message } from '@/common/Message';
import { getGlobalOptions } from '@/common/utils';
import {
  EXTENSION_GLOBAL_OPTIONS_KEY,
  SOURCE_TYPE,
  SourceFile,
  STATUS,
} from '@/interfaces/entities';
import { store } from '@/options/store';

export async function handlePageOpenMsg(
  _data: Message,
  sender: chrome.runtime.MessageSender,
) {
  const globalOpts = getGlobalOptions();
  if (globalOpts[EXTENSION_GLOBAL_OPTIONS_KEY.status] === STATUS.DISABLE) {
    // skip inject
    return `${DEFINE.displayName} has been disabled now.`;
  }
  const { tab } = sender;
  const { id: tabId } = tab;
  const backgroundDispatch = store.dispatch.background;
  const url = new URL(tab.url);

  const sourceFileList: SourceFile[] = await backgroundDispatch.getInjectedAbleSourceFileList(
    {
      url,
    },
  );

  // insert code
  return Promise.all(
    sourceFileList.map(({ sourceType, runAt, content }) => {
      return new Promise(resolve => {
        const params: [number, chrome.tabs.InjectDetails, any] = [
          tabId,
          {
            runAt,
            code: content,
          },
          () => {
            // TODO how to get the error when inject code error
            resolve('Excute done!');
          },
        ];

        if (sourceType === SOURCE_TYPE.CSS) {
          return chrome.tabs.insertCSS(...params);
        }
        if (sourceType === SOURCE_TYPE.JS) {
          return chrome.tabs.executeScript(...params);
        }
      });
    }),
  );
}
