import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from "./App";

let container: any = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders App component with a header", async () => {
  await act(async () => {
    await waitFor(() => render(<App />, container));
  });

  const testAppHeader = screen.getByTestId("testAppHeader");
  expect(testAppHeader).toBeInTheDocument();
});
