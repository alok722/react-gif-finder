import { useEffect, useState, useCallback, useRef } from "react";
import useDebounce from "./useDebounce";

const API_KEY = "HJWTLY59W72I";
const BASE_URL = "https://api.tenor.com/v1/search";
const LIMIT = 20;

const useGifSearch = (initialQuery = "random") => {
  const [gifs, setGifs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nextPosRef = useRef("");
  const abortRef = useRef(null);

  const debouncedSearch = useDebounce(search, 400);
  const query = debouncedSearch.trim() || initialQuery;

  const fetchGifs = useCallback(async (q, pos = "", signal) => {
    const url = new URL(BASE_URL);
    url.searchParams.set("q", q);
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("limit", LIMIT);
    if (pos) url.searchParams.set("pos", pos);

    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Tenor API error: ${response.status}`);
    const data = await response.json();
    return { results: data.results ?? [], next: data.next ?? "" };
  }, []);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetchGifs(query, "", controller.signal)
      .then(({ results, next }) => {
        setGifs(results);
        nextPosRef.current = next;
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query, fetchGifs]);

  const loadMore = useCallback(() => {
    if (loading || !nextPosRef.current) return;
    setLoading(true);

    fetchGifs(query, nextPosRef.current)
      .then(({ results, next }) => {
        setGifs((prev) => [...prev, ...results]);
        nextPosRef.current = next;
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [query, loading, fetchGifs]);

  const reset = useCallback(() => {
    setSearch("");
  }, []);

  return {
    gifs,
    search,
    setSearch,
    query,
    loading,
    error,
    loadMore,
    reset,
  };
};

export default useGifSearch;
