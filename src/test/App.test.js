import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import sum from "../components/sum";
import TestComponent from "../components/TestComponent";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("renders learn react link", () => {
  render(<TestComponent />);
  const linkElement = screen.getByText(/thinking in react/i);
  expect(linkElement).toBeInTheDocument();

  expect(linkElement).toHaveAttribute(
    "href",
    "https://react.dev/learn/thinking-in-react"
  );
});
