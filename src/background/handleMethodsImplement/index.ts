import { Message } from '@/common/Message';
import { invokeFunc } from '@/common/utils';
import { PropType } from '@/interfaces/utils';
import axios from 'axios';

export async function handleMethodsImplement(
  data: Message<{
    methodName: PropType;
    argArray?: any[];
  }>,
  _sender: chrome.runtime.MessageSender,
) {
  const { methodName, argArray = [] } = data.data;
  const wrapInvoke = fn => invokeFunc(fn, ...argArray);

  switch (methodName) {
    case 'axios':
      return wrapInvoke(axios);
    case 'axiosGet':
      return wrapInvoke(axios.get);
    case 'axiosPost':
      return wrapInvoke(axios.post);
    case 'axiosGetUri':
      return wrapInvoke(axios.getUri);
    default:
      return Promise.reject(`${methodName.toString()} not impleaments`);
  }
}
