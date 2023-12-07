import SearchInput from "./components/SearchInput";
import List from "./components/List";
import { useState } from "react";
import UseDebounce from "./hooks/useDebounce";
function App() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = UseDebounce(searchValue, 500);
  return (
    <>
      <SearchInput searchValue={searchValue} setSearchValue={setSearchValue} />
      <List searchTerm={debouncedSearchValue} />
    </>
  );
}

export default App;
