import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Установка дневной цели", () => {
  it("начинает сессию с целью 2000 мл по умолчанию", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Проверяем значение, которое пользователь видит до запуска
    const goalInput = screen.getByRole("spinbutton", {
      name: "Дневная цель, мл",
    });

    expect(goalInput).toHaveValue(2000);

    await user.click(screen.getByRole("button", { name: "Начать" }));

    // После запуска проверяем основной экран и сохраненную цель
    expect(
      screen.getByRole("heading", { name: "Сегодня" }),
    ).toBeInTheDocument();

    expect(screen.getByText("2000 мл")).toBeInTheDocument();
  });

  it("сохраняет введенную цель и начинает сессию по Enter", async () => {
    const user = userEvent.setup();
    render(<App />);

    const goalInput = screen.getByRole("spinbutton", {
      name: "Дневная цель, мл",
    });

    // Заменяем начальное значение и отправляем форму с клавиатуры
    await user.clear(goalInput);
    await user.type(goalInput, "1750{Enter}");

    expect(
      screen.getByRole("heading", { name: "Сегодня" }),
    ).toBeInTheDocument();

    expect(screen.getByText("1750 мл")).toBeInTheDocument();
  });

  it.each([
    ["пустое значение", ""],
    ["ноль", "0"],
    ["отрицательное число", "-200"],
    ["дробное число", "1.5"],
  ])("не начинает сессию: %s", async (_description, value) => {
    const user = userEvent.setup();
    render(<App />);

    const goalInput = screen.getByRole("spinbutton", {
      name: "Дневная цель, мл",
    });

    await user.clear(goalInput);

    // Для пустого значения достаточно очистить поле
    if (value !== "") {
      await user.type(goalInput, value);
    }

    await user.click(screen.getByRole("button", { name: "Начать" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Укажи цель в миллилитрах — целое число больше нуля",
    );
    expect(goalInput).toHaveAttribute("aria-invalid", "true");

    expect(
      screen.queryByRole("heading", { name: "Сегодня" }),
    ).not.toBeInTheDocument();
  });

  it("позволяет исправить ошибку и начать сессию", async () => {
    const user = userEvent.setup();
    render(<App />);

    const goalInput = screen.getByRole("spinbutton", {
      name: "Дневная цель, мл",
    });

    // Отправляем пустое поле с клавиатуры и получаем ошибку
    await user.clear(goalInput);
    await user.type(goalInput, "{Enter}");

    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Исправляем значение: ошибка должна исчезнуть еще до отправки
    await user.type(goalInput, "2500");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(goalInput).toHaveAttribute("aria-invalid", "false");

    await user.click(screen.getByRole("button", { name: "Начать" }));

    expect(
      screen.getByRole("heading", { name: "Сегодня" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2500 мл")).toBeInTheDocument();
  });
});
