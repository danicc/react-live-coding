import { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';

import getGifs from '../services/getGifs';

function flatGroups(data) {
  let array = [];
  if (data && !!data.length) {
    data.forEach((group) => {
      array = array.concat(group);
    });
  }
  return array;
}

function getGifsQuery(key, keyword, limit, nextPage = 0) {
  return getGifs({ limit, page: nextPage, keyword });
}

export function useGifs({ keyword } = { keyword: null }) {
  // recuperamos la keyword del localStorage
  const keywordToUse =
    keyword || localStorage.getItem('lastKeyword') || 'random';

  const { data, status, fetchMore } = useInfiniteQuery(
    ['gifs', keywordToUse],
    [15],
    getGifsQuery,
    {
      getFetchMore: (lastGroup, allGroups) => {
        return allGroups.length;
      },
    }
  );

  useEffect(
    function () {
      // guardamos la keyword en el localStorage
      localStorage.setItem('lastKeyword', keyword);
    },
    [keyword]
  );

  const gifs = flatGroups(data);
  const loading = status === 'loading';
  return { fetchMore, loading, gifs };
}
