import React, { useState, useEffect } from "react";

const UseDebounce = (value, delay = 500) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);
  return debounceValue;
};

export default UseDebounce;
