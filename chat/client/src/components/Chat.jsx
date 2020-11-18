import React from 'react';
import Message from './Message'

export default function Chat(props) {
    return <div className="chat">
        {/*
        // TODO real history accross multiple browsers
        props.history.map()
        */}
        {props.store.messages().map(m => <Message key={m.id} {...m} />)}
    </div>
}