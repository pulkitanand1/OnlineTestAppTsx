import { render, screen, cleanup, act } from "@testing-library/react";
import TimerForTest from "./TimerForTest";

afterEach(() => {
  cleanup();
});

describe("Test timer render behaviour", () => {
  it("Should render timer with timer class", () => {
    act(() => {
      render(<TimerForTest timeLeft={60} />);
    });
    const testTimer = screen.getByTestId("testtimer-1");
    const actualTimer = screen.getByTestId("actualTimer");
    expect(testTimer).toBeInTheDocument();
    expect(actualTimer).toBeInTheDocument();
    expect(actualTimer).toHaveClass("timer");
    expect(actualTimer).toHaveTextContent("01 : 00");
  });

  it("Should render timer with timer-red class", () => {
    render(<TimerForTest timeLeft={50} />);
    const testTimer = screen.getByTestId("testtimer-1");
    const actualTimer = screen.getByTestId("actualTimer");
    expect(testTimer).toBeInTheDocument();
    expect(actualTimer).toBeInTheDocument();
    expect(actualTimer).toHaveClass("timer-red");
    expect(actualTimer).toHaveTextContent("00 : 50");
  });
});
