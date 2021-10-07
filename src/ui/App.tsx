import * as ReactDOM from 'react-dom';

export function render() {
  ReactDOM.render(
    <div>
      <h2>Hello from React!</h2>
      <div className="file-icon javascript-lang-file-icon" style={{ height: 32, width: 32 }}></div>
    </div>,
    document.getElementById('root'),
  );
}
