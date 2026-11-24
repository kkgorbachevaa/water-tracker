import { StrictMode } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Добавление воды в сессию", () => {
  it("суммирует последовательные добавления и обновляет прогресс", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Начать" }));

    const progressCard = screen.getByRole("region", {
      name: "Мой прогресс",
    });

    const addButton = screen.getByRole("button", {
      name: "Добавить воду",
    });

    await user.click(addButton);

    expect(
      within(progressCard).getByText("Выпито: 200 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Осталось: 1800 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Выполнение цели: 10%"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "300 мл" }));
    await user.click(screen.getByRole("radio", { name: "Половина" }));

    expect(screen.getByText("К добавлению: 150 мл")).toBeInTheDocument();

    // Изменение выбора сохраняет уже выпитый объем.
    expect(
      within(progressCard).getByText("Выпито: 200 мл"),
    ).toBeInTheDocument();

    await user.click(addButton);

    expect(
      within(progressCard).getByText("Выпито: 350 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Осталось: 1650 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Выполнение цели: 17,5%"),
    ).toBeInTheDocument();
  });

  it("позволяет добавлять воду после достижения и превышения цели", async () => {
    const user = userEvent.setup();

    render(<App />);

    const goalInput = screen.getByRole("spinbutton", {
      name: "Дневная цель, мл",
    });

    await user.clear(goalInput);
    await user.type(goalInput, "200{Enter}");

    const progressCard = screen.getByRole("region", {
      name: "Мой прогресс",
    });

    const addButton = screen.getByRole("button", {
      name: "Добавить воду",
    });

    await user.click(addButton);

    expect(
      within(progressCard).getByText("Осталось: 0 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Выполнение цели: 100%"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "300 мл" }));
    await user.click(screen.getByRole("radio", { name: "Половина" }));
    await user.click(addButton);

    expect(
      within(progressCard).getByText("Выпито: 350 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Осталось: 0 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Выполнение цели: 175%"),
    ).toBeInTheDocument();

    await user.click(addButton);

    expect(
      within(progressCard).getByText("Выпито: 500 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Осталось: 0 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Выполнение цели: 250%"),
    ).toBeInTheDocument();
  });

  it("учитывает каждое из двух нажатий в StrictMode ровно один раз", async () => {
    const user = userEvent.setup();

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    );

    await user.click(screen.getByRole("button", { name: "Начать" }));

    await user.dblClick(screen.getByRole("button", { name: "Добавить воду" }));

    const progressCard = screen.getByRole("region", {
      name: "Мой прогресс",
    });

    expect(
      within(progressCard).getByText("Выпито: 400 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Осталось: 1600 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Выполнение цели: 20%"),
    ).toBeInTheDocument();
  });
});
