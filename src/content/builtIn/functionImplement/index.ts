import { Log } from '@/common/log';
import { CallBackParam, IMSG_TYPE, Message } from '@/common/Message';
import { invokeFunc } from '@/common/utils';
import { PropType } from '@/interfaces/utils';
import { injectJS } from './injectJS';

export function functionImplement(methodName: PropType, argArray?: any[]) {
  Log.Debug('proxy call', methodName, argArray);

  switch (methodName) {
    case 'injectJS':
      return invokeFunc(injectJS, ...argArray);
  }

  // return method from background
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      new Message(IMSG_TYPE.CONTENT_2_BACKGROUND_CALL_METHOD, {
        methodName,
        argArray,
      }),
      (response: Message<CallBackParam>) => {
        const { result, error } = response.data;
        if (error) {
          return reject(error);
        }
        resolve(result);
      },
    );
  });
}
