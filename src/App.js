/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './App.css';
import Gif from './Gif/Gif';
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
 

const App = () => {

  const API_KEY = 'HJWTLY59W72I';
  const [gifs, setGif] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('random');
  const [sty, setSty] = useState('App');
  const [pos, setPos] = useState(1);
  const [styName, setStyName] = useState('fa fa-toggle-off');
  const [styTitle, setTitleName] = useState('title');
  const [stypDarkMode, setpDarkMode] = useState('');
  const [gifCIP, setGifCIP] = useState(false);  // CIP = Call in process

  useEffect(() => {
    getGif().then(all => setGif(all));
  }, [query])

  const getGif = async (position = 1) => {
    const response = await fetch(`https://api.tenor.com/v1/search?q=${query}&key=${API_KEY}&limit=20&pos=${position}`);
    const data = await response.json();
    return data.results;
  }

  const updateSearch = e => {
    setSearch(e.target.value);
  }

  const getSearch = e => {
    e.preventDefault();
    setQuery(search);
    setSearch('');
  }

  const reload = () => {
    setQuery('random');
  }

  const handleContainerScrollEvent  = () => {
    setGifCIP(true)
    loadMore() 
  }

  const loadMore = () => {
    let position = 21 + pos;
    setPos(position);
    getGif(position).then(more => { 
      setGif([...gifs, ...more]);
      setGifCIP(false)
    });
  }

  const scrollRef = useBottomScrollListener(handleContainerScrollEvent)

  const toggle = () => {
    if (styName !== 'fa fa-toggle-off') {
      setStyName('fa fa-toggle-off');
      setSty('App');
      setTitleName('title');
      setpDarkMode('');
    } else {
      setStyName('fa fa-toggle-on');
      setSty('DarkApp');
      setTitleName('darkTitle');
      setpDarkMode('pDarkMode')
    }
  }
 
  return (
    <div className={sty} ref={scrollRef}>
      <header className="header">
        <h1 className={styTitle} onClick={reload}>React GiF Finder</h1>
        <form onSubmit={getSearch} className="search-from">
          <input className="search-bar" type="text" value={search}
            onChange={updateSearch} placeholder="type here..." />
          <button className="search-button" type="submit">Search</button>
        </form>
        <p className={stypDarkMode}>showing results for <span className={stypDarkMode}>{query}, </span> &nbsp; <span className="point"><i onClick={toggle} className={styName} aria-hidden="true"></i></span></p>
      </header>
      {
        gifs.length >= 20
          ?
          <div>
            <div className="gif">
              {gifs.map(gif => (
                <Gif
                  img={gif.media[0].tinygif.url}
                  key={gif.id}
                />
              ))}
            </div>
            {gifCIP && 
              <div class="loader-container">
                <div class="loader"></div>
              </div>
            }
          </div>
          : <img src="https://i.pinimg.com/originals/a4/f2/cb/a4f2cb80ff2ae2772e80bf30e9d78d4c.gif" alt="loader-icon" />
      }
    </div>
  );
}

export default App;
