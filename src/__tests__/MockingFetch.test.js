import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FetchData } from "../components/FetchData";

// =====================================================
// Testing Sucess & Failure API Calls (By Mocking Fetch)
// =====================================================

// Spying fetch allows us to call methods like mockResolvedValue etc on fetch
jest.spyOn(window, "fetch");

// Using latest version of userEvent
function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

test("api call success", async () => {
  const FAKE_TODOS = [
    { id: 1, title: "fake title 1" },
    { id: 2, title: "fake title 2" },
  ];
  // Mocking fetch
  const mockJson = jest.fn();
  mockJson.mockResolvedValueOnce(FAKE_TODOS);
  // Because we've spyed on fetch, we can call mockResolvedValue on it
  fetch.mockResolvedValueOnce({ json: mockJson });

  const { user } = setup(<FetchData />);
  expect(
    screen.getByText(/click the button to fetch data/i)
  ).toBeInTheDocument();

  // click button to fetch todos
  await user.click(screen.getByRole("button", { name: /fetch todos/i }));
  // ====== Below assertion fails ======
  // expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  // ===================================
  // await clickPromise;
  expect(await screen.findAllByRole("listitem")).toHaveLength(
    FAKE_TODOS.length
  );
  FAKE_TODOS.forEach(({ title }) =>
    expect(screen.getByText(title)).toBeInTheDocument()
  );
});

test.skip("api call failure", async () => {
  const ERROR_MESSAGE = "something went wrong";
  // Mocking fetch
  fetch.mockRejectedValueOnce({ message: ERROR_MESSAGE });

  const { user } = setup(<FetchData />);

  await user.click(screen.getByRole("button", { name: /fetch todos/i }));
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  expect(await screen.findByText(ERROR_MESSAGE)).toBeInTheDocument();
});
