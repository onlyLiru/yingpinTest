import { useLazyQuery, gql } from "@apollo/client";
import { useState, useCallback } from "react";
import _ from "lodash";

const GET_COUNTRY_EMOJI = gql`
  query GetCountryEmoji($code: ID!) {
    country(code: $code) {
      emoji
    }
  }
`;

function App() {
  const [code, setCode] = useState("");

  const [search, { loading, error, data }] = useLazyQuery(GET_COUNTRY_EMOJI);
  const debouncer = useCallback(_.debounce(search, 1000), []);

  if (error) return `Error! ${error}`;

  return (
    <div className="App">
      <input
        placeholder="Enter country code (e.g., US)"
        onChange={(e) => {
          const value = e.target.value.toUpperCase();

          debouncer({ variables: { code: value } });
          setCode(value);
        }}
      />
      <button
        onClick={() => {
          !loading && debouncer({ variables: { code } });
        }}
      >
        Get Country Emoji
      </button>
      <>
        {data?.country ? (
          <div>{data?.country?.emoji}</div>
        ) : (
          code &&
          data &&
          !loading && <div>Sorry, we didn't find the result you want</div>
        )}
      </>
    </div>
  );
}

export default App;
