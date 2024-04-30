import Main from './components/main';
import Demo from './components/demo';

import './App.css';

const App = () => {
  return (
    <main>
        <div className='main'>
            <div className='gradient' />

        </div>
        <div className='app'>
            <Main />
            <Demo />

        </div>
    </main>
  )
}

export default App
