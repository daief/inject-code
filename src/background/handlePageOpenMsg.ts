import { Message } from '@/common/Message';
import { SOURCE_TYPE, SourceFile } from '@/interfaces/entities';
import { store } from '@/options/store';

export async function handlePageOpenMsg(
  // tslint:disable-next-line: variable-name
  _data: Message,
  sender: chrome.runtime.MessageSender,
) {
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
