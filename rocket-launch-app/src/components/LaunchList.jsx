import React from 'react';
import LaunchListItem from './LaunchListItem'

export default function LaunchList({ items, ...props }) {
  return <section className="launch-list">
    {items.map(item => <LaunchListItem key={item.id} value={item} {...props} />)}
  </section>
};
