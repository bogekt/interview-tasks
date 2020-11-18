import React, { useState } from 'react';

export default function Login(props) {
    const [login, setLogin] = useState(null)

    return <>
        <input type='text' placeholder='login' onChange={e => setLogin(e.target.value)} />
        <button onClick={() => props.login(login)}>Login</button>
    </>
}