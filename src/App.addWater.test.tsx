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
      name: "Добавить запись",
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

    await user.click(screen.getByRole("radio", { name: "Вручную" }));
    await user.type(
      screen.getByRole("textbox", { name: "Выпитый объем, мл" }),
      "275",
    );
    await user.click(addButton);

    expect(
      within(progressCard).getByText("Выпито: 625 мл"),
    ).toBeInTheDocument();
    expect(
      within(progressCard).getByText("Осталось: 1375 мл"),
    ).toBeInTheDocument();
    expect(
      within(progressCard).getByText("Выполнение цели: 31,3%"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("bottle-water")).toHaveStyle({
      height: "68.75%",
    });

    await user.click(screen.getByRole("radio", { name: "По емкости" }));

    expect(screen.getByRole("radio", { name: "300 мл" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Половина" })).toBeChecked();
    expect(screen.getByText("К добавлению: 150 мл")).toBeInTheDocument();

    await user.click(addButton);

    expect(
      within(progressCard).getByText("Выпито: 775 мл"),
    ).toBeInTheDocument();
  });

  it("уменьшает уровень воды в бутылке при добавлении записи", async () => {
    const user = userEvent.setup();

    render(<App />);

    const goalInput = screen.getByRole("spinbutton", {
      name: "Дневная цель, мл",
    });
    await user.clear(goalInput);
    await user.type(goalInput, "400{Enter}");

    const addButton = screen.getByRole("button", { name: "Добавить запись" });

    expect(screen.getByTestId("bottle-water")).toHaveStyle({ height: "100%" });

    await user.click(addButton);
    expect(screen.getByTestId("bottle-water")).toHaveStyle({ height: "50%" });

    await user.click(addButton);
    expect(screen.getByTestId("bottle-water")).toHaveStyle({ height: "0%" });

    await user.click(addButton);
    expect(screen.getByText("Выполнение цели: 150%")).toBeInTheDocument();
    expect(screen.getByTestId("bottle-water")).toHaveStyle({ height: "0%" });
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
      name: "Добавить запись",
    });

    const goalStatus = within(progressCard).getByRole("status");
    expect(goalStatus).toBeEmptyDOMElement();

    await user.click(addButton);

    expect(
      within(progressCard).getByText("Осталось: 0 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Выполнение цели: 100%"),
    ).toBeInTheDocument();

    expect(within(goalStatus).getByText("Цель достигнута")).toBeInTheDocument();
    expect(
      within(goalStatus).queryByText(/больше, чем планировалось/),
    ).not.toBeInTheDocument();

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

    expect(
      within(goalStatus).getByText("На 150 мл больше, чем планировалось"),
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

    await user.dblClick(
      screen.getByRole("button", { name: "Добавить запись" }),
    );

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
