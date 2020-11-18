import React from 'react';

export default function Message(props) {
    return <article className="message">
        <h5>
            {props.user}
            &nbsp;
            (<small>{new Date(Date.parse(props.timestamp)).toLocaleString()}</small>)
            :
        </h5>
        <p>{props.message}</p>
    </article>
}