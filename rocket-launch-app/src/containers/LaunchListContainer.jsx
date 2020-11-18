import React, { 
  useEffect,
  useContext,
  useState,
} from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import EnvContext from '../contexts/EnvContext'
import { LaunchList } from '../components'

async function loadLaunches({ 
  env,
  store, 
  setItems,
  setHasMore, 
}) {
  if (store.isFavorites) {
    await store.loadFavorites(env)
  } else if (!await store.loadOlder(env)) return setHasMore(false)
  setItems(store.items)
  setHasMore(!store.isFavorites)
}

export default function LaunchListContainer({ store }) {
  const [items, setItems] = useState(store.items)
  const [hasMore, setHasMore] = useState(true)
  const env = useContext(EnvContext)
  const localStore = { 
    env, 
    store,
    setItems,
    setHasMore,
  };
  const itemsStore = {
    checkFavorite: x => store.favoriteIdsSet[x.id], 
    toggleFavorite: x => {
      store.toggleFavorite(x.id)
      // todo refactoring with global store
      setItems(
        store.items = store.isFavorites
          ? store.items.filter(y => y.id !== x.id)
          : [...store.items]
      )
    }
  };
  useEffect(() => {
    loadLaunches(localStore)
  // because store and env exists in localStore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, env]);

  return <InfiniteScroll
    pageStart={0}
    loadMore={() => loadLaunches(localStore)}
    hasMore={hasMore}
    loader={
      // https://codepen.io/MathieuRichard/pen/LrHeD
      <div className="loader" key={0}>
        <div className="loader-inner" key={0}>
          <div className="circle"></div>
          <p>Loading...</p>
        </div>
      </div>
    }
  >
    <LaunchList items={items} store={itemsStore} />
  </InfiniteScroll>
};
