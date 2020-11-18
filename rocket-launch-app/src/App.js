import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';
import { uuid } from './helpers';
import { LaunchList } from './models'

import HttpClient from './services/HttpClient';
import { EnvContextProvider } from './contexts/EnvContext'
import { LaunchListContainer, NavigationContainer } from './containers'

const env = {
  http: new HttpClient()
    .setBaseURL('1.4')
    .setCorrelationId(uuid())
    .addErrorHandling(console.error)
}
const tabs = { 
  main: 'Main', 
  favorites: 'Favorites'
}
const reverseTabs = Object.assign({}, ...Object.entries(tabs).map(([a,b]) => ({ [b]: a })));
const restored = LaunchList.restore()

function search({ setStore, searchInputRef}) { 
  setStore(Object.assign(
    LaunchList.createDefault(),
    { filter: searchInputRef.current.value},
  ))
}

function onNavigate({ setTab, tab }, event, newTab) {
  event.preventDefault()
  if (tab === newTab) return
  if (!reverseTabs[newTab])
    throw new Error(`Invalid tab: ${newTab}`)
  setTab(newTab)
}

function App() {
  const searchInputRef = React.createRef();
  const [tab, setTab] = useState(
    restored && restored.isFavorites 
      ? tabs.favorites 
      : tabs.main
  )
  const [store, setStore] = useState(LaunchList.createDefault(restored))
  const [favoritesStore, setFavoritesStore] = useState(LaunchList.createFavorites(store))
  const localStore = {
    setStore,
    setFavoritesStore,
    setTab,
    searchInputRef,
    env,
    tab,
  }
  const navigationStore = {
    tabs: Object.values(tabs),
    onNavigate: onNavigate.bind(null, localStore),
  }

  return (
    <EnvContextProvider value={env}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div className="search">
            <input 
              id="search-txt" 
              placeholder="Launch search" 
              ref={searchInputRef}
              onKeyPress={e => e.key === 'Enter' && search(localStore)}
            >
            </input>
            &nbsp;
            <button 
              id="search-btn"
              onClick={() => search(localStore)} 
            >
              Go
            </button>
          </div>
          <NavigationContainer store={navigationStore} />
        </header>
        <main>
          {
            tab === tabs.main && <section>
              <h1>Main</h1>
              <LaunchListContainer store={store} />
            </section>
          }
          {
            tab === tabs.favorites && <section>
              <h1>Favorites</h1>
              <LaunchListContainer store={favoritesStore} />
            </section>
          }
          <br/>
          ↓	↓	↓	Scroll down to load more ↓	↓	↓	
        </main>
      </div>
      <footer>
        <b>Eugene Borys &copy; 2020</b>
      </footer>
    </EnvContextProvider>
  );
}

export default App;
