import React from 'react';
import './App.css';
import Gif from './Gif/Gif';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import useGifSearch from './hooks/useGifSearch';
import useDarkMode from './hooks/useDarkMode';

const App = () => {
  const {
    gifs,
    search,
    setSearch,
    query,
    loading,
    loadMore,
    reset,
  } = useGifSearch('random');

  const { toggle, theme } = useDarkMode();

  const scrollRef = useBottomScrollListener(() => {
    if (!loading) loadMore();
  });

  const getGifUrl = (gif) => {
    const media = gif.media_formats ?? gif.media?.[0];
    return media?.tinygif?.url ?? media?.gif?.url ?? '';
  };

  return (
    <div className={theme.app} ref={scrollRef}>
      <header className="header">
        <h1 className={theme.title} onClick={reset}>React GiF Finder</h1>
        <div className="search-from">
          <input
            className="search-bar"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="type here..."
          />
        </div>
        <p className={theme.text}>
          showing results for <span className={theme.text}>{query}, </span>
          &nbsp;
          <span className="point">
            <i onClick={toggle} className={theme.icon} aria-hidden="true"></i>
          </span>
        </p>
      </header>
      {gifs.length > 0 ? (
        <div>
          <div className="gif">
            {gifs.map((gif) => (
              <Gif img={getGifUrl(gif)} key={gif.id} />
            ))}
          </div>
          {loading && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}
        </div>
      ) : (
        <img
          src="https://i.pinimg.com/originals/a4/f2/cb/a4f2cb80ff2ae2772e80bf30e9d78d4c.gif"
          alt="loader-icon"
        />
      )}
    </div>
  );
};

export default App;
