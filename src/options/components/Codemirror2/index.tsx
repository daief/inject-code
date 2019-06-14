import { SOURCE_TYPE } from '@/interfaces/entities';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import * as React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

export const Codemirror2: React.SFC<{
  value?: string;
  options?: {
    sourceType?: SOURCE_TYPE;
    theme?: string;
  } & Record<string, any>;
  onChange?(val: string): void;
}> = props => {
  const { value, onChange = () => void 0 } = props;
  const [innerValue, setInnerValue] = React.useState(value || '');
  const options = {
    sourceType: SOURCE_TYPE.JS,
    ...props.options,
  };

  React.useEffect(() => {
    setInnerValue(value || '');
  }, [value]);

  const handleChange = (editor, data, codevalue) => {
    if (!('value' in props)) {
      setInnerValue(codevalue);
    }
    onChange(codevalue);
  };

  const modeMap: { [k in SOURCE_TYPE]: string } = {
    [SOURCE_TYPE.JS]: 'javascript',
    [SOURCE_TYPE.CSS]: 'css',
  };

  return (
    <CodeMirror
      value={innerValue}
      options={{
        theme: 'material',
        lineNumbers: true,
        ...options,
        mode: modeMap[options.sourceType] || 'xml',
      }}
      onBeforeChange={handleChange}
    />
  );
};
