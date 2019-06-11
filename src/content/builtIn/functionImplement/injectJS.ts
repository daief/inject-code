/**
 * inject code to html content
 * @param code js code  string
 */
export function injectJS(code: string): void {
  const myScript = document.createElement('script');
  myScript.textContent = code;
  document.body.appendChild(myScript);
}
