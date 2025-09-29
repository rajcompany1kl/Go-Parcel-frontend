import { useState, useEffect, useMemo, useCallback } from 'react';
import useService from './useServices';
import { useDebounce } from './useDebounce';
import { memoizeAsync } from '../Utils';

export function useSuggestions(searchTerm: string) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const services = useService();

  const fetchApi = useCallback(async (query: string) => {
    const response = await services.home.placesAutocompletion(query);
    return response.data || [];
  }, [services.home]);

  const cachedFetcher = useMemo(() => memoizeAsync(fetchApi), [fetchApi]);

  useEffect(() => {
    const getSuggestions = async () => {
      if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
        setIsLoading(true);
        const data = await cachedFetcher(debouncedSearchTerm);
        setSuggestions(data.map((item: any) => item.display_name));
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    };

    getSuggestions();
  }, [debouncedSearchTerm, cachedFetcher]);

  return { suggestions, isLoading };
}