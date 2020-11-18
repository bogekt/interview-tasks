import React, { 
    // useEffect,
    // useContext,
    // useState,
} from 'react';

// import EnvContext from '../contexts/EnvContext'

export default function NavigationContainer({ store }) {
  const { tabs, onNavigate } = store
  const navItems = tabs.map(
    (x, i) => 
      <li key={x} className="navigation-item">
        <a href={`#${x}`} onClick={e => onNavigate(e, x)}>Tab{i + 1} ({x})</a>
      </li>
  )

  return <nav className="navigation">
    <ul className="navigation-list">
      {navItems}
    </ul>
  </nav>
}