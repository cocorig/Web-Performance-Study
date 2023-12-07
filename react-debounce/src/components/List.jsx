import useSWR from "swr";
import Item from "./Item";
import { getWikiSearchResults } from "../api/wikiApi";

const List = ({ searchTerm }) => {
  const { isLoading, error, data } = useSWR(
    searchTerm ? searchTerm : null,
    getWikiSearchResults
  );
  console.log(data);
  let content;
  if (isLoading) content = <p>Loading...</p>;
  else if (error) content = <p>{error.message}</p>;
  else if (data?.query?.pages) {
    const results = data?.query?.pages;
    console.log(results);
    content = (
      <ul>
        {Object.values(results).map((result) => {
          console.log(result);
          return <Item key={result.pageid} result={result} />;
        })}
      </ul>
    );
  }

  return content;
};
export default List;

// // state에 따라 key 값을 null로 만들면 fetch가 실행되지 않습니다.
// const { data } = useSWR(shouldFetch ? "/api/data" : null, fetcher);

// // key 함수가 falsy 값을 리턴하면 fetch가 실행되지 않습니다.
// const { data } = useSWR(() => (shouldFetch ? "/api/data" : null), fetcher);

// // user가 존재하지 않아서 user.id에 접근할 때 error가 발생해 fetch가 실행되지 않습니다.
// const { data } = useSWR(() => "/api/data?uid=" + user.id, fetcher);
