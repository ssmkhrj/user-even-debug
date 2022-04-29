import { useState } from "react";

export const FetchData = () => {
  const [{ status, data, error }, setState] = useState({
    status: "idle",
    data: null,
    error: null,
  });

  console.log("[STATUS]", status);

  const handleClick = () => {
    setState({ status: "pending", data: null, error: null });
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => setState({ status: "resolved", data, error: null }))
      .catch((error) => setState({ status: "rejected", data: null, error }));
  };

  let bodyEl;
  if (status === "idle") {
    bodyEl = <p>Click the button to fetch data</p>;
  } else if (status === "pending") {
    bodyEl = <p>Loading...</p>;
  } else if (status === "resolved") {
    bodyEl = (
      <ul>
        {data.map(({ id, title }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
    );
  } else {
    bodyEl = <p>{error.message}</p>;
  }

  return (
    <>
      <button onClick={handleClick}>Fetch Todos</button>
      {bodyEl}
    </>
  );
};
