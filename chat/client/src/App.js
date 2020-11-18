import React, { useState, useEffect } from 'react';
import URI from 'urijs'

import logo from './logo.svg';
import './App.css';

import { Chat, Login } from './components'
import { uuid } from './helpers'

import api from './services/api'
import channel from './services/channel'

async function login({ 
  setUser,
  connectedCount,
  setConnectedCount,
  messages,
  setMessages,
  waitBootstrapData,
}, userName) {
  if (!await api.login({ name: userName }))
    alert(500)
  setUser(userName)
  // todo move out
  const [{ hubUrl }, { serverRoot }] = await Promise.all([
    api.config(),
    waitBootstrapData(),
  ])
  ;setConnectedCount(connectedCount());
  (await channel.connect(
    new URI(serverRoot)
      .path(hubUrl)
      .toString()
  )).subscribe(message => {
    if (message.type === 'meta') {
      setConnectedCount(message.data.count)
    } else if (message.type === 'message') {
      const history = messages()
      history.push(message.data)
      window.localStorage.setItem('history', JSON.stringify(history))
      setMessages([...history])
    }
  })
}

async function sendMessage(user, message) {
  return await channel.send({ 
    id: uuid(),
    timestamp: new Date(),
    user,
    message,
  })
}

let bootstrapData
const waitBootstrapData = async () => {
  return bootstrapData || (bootstrapData = await api.bootstrapData()) 
}

function App({ history }) {
  const [user, setUser] = useState(null);
  const [connectedCount, setConnectedCount] = useState(0);
  const [messages, setMessages] = useState(history || []);
  const messageInput = React.createRef();
  const store = {
    waitBootstrapData,
    user: () => user,
    setUser,
    connectedCount: () => connectedCount,
    setConnectedCount,
    messages: () => messages,
    setMessages,
  }

  useEffect(() => {
    // on mount load client bootstrapData and setup api
    (async function loadBootstrapData() {
      const data = await waitBootstrapData();
      console.log('loaded bootstrapData', data)
      api.initialize(data)
    })()
  });

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <h1>{user ? `User: ${user}`: 'Login'}</h1>
        <p>{user && connectedCount ? `Now in chat:${connectedCount}` : ''}</p>
      </header>
      <main>{
        user 
          ? <Chat store={store} /> 
          : <Login login={login.bind(null, store)} />
      }</main>
      <footer>{user && <>
        <textarea ref={messageInput} placeholder="message"></textarea>
        <button onClick={() => sendMessage(user, messageInput.current.value)}>Send</button>
      </>}</footer>
    </div>
  );
}

export default App;
