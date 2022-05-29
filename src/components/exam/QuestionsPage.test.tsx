import { render, screen, cleanup, act, waitFor } from "@testing-library/react";
import QuestionsPage from "./QuestionsPage";

const mockfinishAndEvaluateTest = jest.fn();

jest.mock("../DataProvider", () => {
  return {
    __esModule: true,
    getExamData: () => {
      return [
        {
          level: 1,
          questionId: 1,
          questionType: "s",
          questionText: "What's is 4+4+5?",
          answers: [
            { answerId: 1, answerText: "20" },
            { answerId: 2, answerText: "11" },
            { answerId: 3, answerText: "13" },
            { answerId: 4, answerText: "14" },
          ],
        },
        {
          level: 1,
          questionId: 2,
          questionType: "s",
          questionText: "What's is 4+4+6?",
          answers: [
            { answerId: 1, answerText: "20" },
            { answerId: 2, answerText: "11" },
            { answerId: 3, answerText: "14" },
            { answerId: 4, answerText: "15" },
          ],
        },
      ];
    },
  };
});

jest.mock("../DataManipulation", () => {
  return {
    __esModule: true,
    finishAndEvaluateTest: () => {
      return mockfinishAndEvaluateTest();
    },
  };
});

afterEach(() => {
  cleanup();
});

describe("Questions Page should have", () => {
  it("should be rendered with timer, heading and question", () => {
    const mocknavigateAfterTestEnd = jest.fn();

    act(() => {
      render(
        <QuestionsPage
          navigateAfterTestEnd={mocknavigateAfterTestEnd}
          selectedLevel={1}
          examTimeLimit={10}
          registrationData={{
            fName: "TestFname",
            lName: "TestLname",
            email: "",
            gender: "",
          }}
          handleLogOut={() => undefined}
        />
      );
    });
    const questionsPage = screen.getByTestId("testComponent");
    expect(questionsPage).toBeInTheDocument();
    expect(questionsPage).toHaveTextContent("What's is 4+4+5");
    expect(questionsPage).toHaveTextContent("Welcome TestFname, TestLname");
    expect(questionsPage).toContainElement(screen.getByTestId("testtimer-1"));
  });

  it("test should end after the time has finished", () => {
    const mocknavigateAfterTestEnd = jest.fn();
    act(() => {
      () =>
        render(
          <QuestionsPage
            navigateAfterTestEnd={mocknavigateAfterTestEnd}
            selectedLevel={1}
            examTimeLimit={10}
            registrationData={{
              fName: "TestFname",
              lName: "TestLname",
              email: "",
              gender: "",
            }}
            handleLogOut={() => undefined}
          />
        );
    });

    act(() => {
      setTimeout(() => {
        const examOverPage = screen.getByTestId("examOver");
        expect(examOverPage).toBeInTheDocument();
      }, 10000);
    });
  });

  it("test next question button", () => {
    const mocknavigateAfterTestEnd = jest.fn();
    act(() => {
      render(
        <QuestionsPage
          navigateAfterTestEnd={mocknavigateAfterTestEnd}
          selectedLevel={1}
          examTimeLimit={10}
          registrationData={{
            fName: "TestFname",
            lName: "TestLname",
            email: "",
            gender: "",
          }}
          handleLogOut={() => undefined}
        />
      );
    });

    const questionsPage = screen.getByTestId("testComponent");
    expect(questionsPage).toBeInTheDocument();
    expect(questionsPage).toHaveTextContent("What's is 4+4+5");

    act(() => {
      const nextQuestionButton = screen
        .getAllByRole("button")
        .find((b) => b.innerHTML === "Next Question");
      expect(nextQuestionButton).toBeInTheDocument();
      if (nextQuestionButton) {
        nextQuestionButton.click();
      }
    });

    expect(questionsPage).toBeInTheDocument();
    expect(questionsPage).toHaveTextContent("What's is 4+4+6");
  });

  it("test previous question button", () => {
    const mocknavigateAfterTestEnd = jest.fn();
    act(() => {
      render(
        <QuestionsPage
          navigateAfterTestEnd={mocknavigateAfterTestEnd}
          selectedLevel={1}
          examTimeLimit={10}
          registrationData={{
            fName: "TestFname",
            lName: "TestLname",
            email: "",
            gender: "",
          }}
          handleLogOut={() => undefined}
        />
      );
    });

    const questionsPage = screen.getByTestId("testComponent");
    expect(questionsPage).toBeInTheDocument();
    expect(questionsPage).toHaveTextContent("What's is 4+4+5");

    act(() => {
      const nextQuestionButton = screen
        .getAllByRole("button")
        .find((b) => b.innerHTML === "Next Question");
      if (nextQuestionButton) {
        nextQuestionButton.click();
      }
    });

    expect(questionsPage).toHaveTextContent("What's is 4+4+6");

    act(() => {
      const previousQuestionButton = screen
        .getAllByRole("button")
        .find((b) => b.innerHTML === "Previous Question");
      if (previousQuestionButton) {
        previousQuestionButton.click();
      }
    });

    expect(questionsPage).toHaveTextContent("What's is 4+4+5");
  });

  it("test the Download Result button", () => {
    const mocknavigateAfterTestEnd = jest.fn();
    act(() => {
      render(
        <QuestionsPage
          navigateAfterTestEnd={mocknavigateAfterTestEnd}
          selectedLevel={1}
          examTimeLimit={0}
          registrationData={{
            fName: "TestFname",
            lName: "TestLname",
            email: "",
            gender: "",
          }}
          handleLogOut={() => undefined}
        />
      );
    });

    act(() => {
      // Waiting for the exam do get over
      setTimeout(() => {
        const examOverPage = screen.getByTestId("examOver");
        expect(examOverPage).toBeInTheDocument();
      }, 10000);
    });

    act(() => {
      const downloadResultButton = screen
        .getAllByRole("button")
        .find((b) => b.innerHTML === "Download Result");
      if (downloadResultButton) {
        downloadResultButton.click();
      }
    });

    expect(mockfinishAndEvaluateTest).toBeCalled();
  });
});
