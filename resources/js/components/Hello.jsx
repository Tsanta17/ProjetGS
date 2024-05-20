import React from 'react';
import ReactDOM from 'react-dom/client';

function Hello() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World from React</h1>
      </header>
    </div>
  );
}

const container = document.getElementById('hello-react');
const root = ReactDOM.createRoot(container);
root.render(<Hello />);

export default Hello;
