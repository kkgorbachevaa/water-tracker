import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AddWaterForm from "./AddWaterForm";

describe("Форма добавления воды", () => {
  it("показывает начальный выбор и добавляет 200 мл целиком", async () => {
    const user = userEvent.setup();
    const onAddWater = vi.fn();

    render(<AddWaterForm onAddWater={onAddWater} />);

    expect(screen.getByRole("radio", { name: "Стакан" })).toBeChecked();

    expect(screen.getByRole("radio", { name: "200 мл" })).toBeChecked();

    expect(screen.getByRole("radio", { name: "Вся емкость" })).toBeChecked();

    expect(screen.getByText("К добавлению: 200 мл")).toBeInTheDocument();
    expect(onAddWater).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Добавить запись" }));

    expect(onAddWater).toHaveBeenCalledTimes(1);
    expect(onAddWater).toHaveBeenCalledWith(
      expect.objectContaining({
        amountMl: 200,
        source: {
          method: "container",
          container: { type: "glass", volumeMl: 200 },
          portion: 1,
        },
      }),
    );
  });

  it("пересчитывает предварительный объем без добавления воды", async () => {
    const user = userEvent.setup();
    const onAddWater = vi.fn();

    render(<AddWaterForm onAddWater={onAddWater} />);

    await user.click(screen.getByRole("radio", { name: "Чашка" }));
    await user.click(screen.getByRole("radio", { name: "300 мл" }));
    await user.click(screen.getByRole("radio", { name: "Половина" }));

    expect(screen.getByText("К добавлению: 150 мл")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Четверть" }));

    expect(screen.getByText("К добавлению: 75 мл")).toBeInTheDocument();
    expect(onAddWater).not.toHaveBeenCalled();
  });

  it.each([
    { label: "Четверть", portion: 0.25, amountMl: 75 },
    { label: "Половина", portion: 0.5, amountMl: 150 },
    { label: "Три четверти", portion: 0.75, amountMl: 225 },
    { label: "Вся емкость", portion: 1, amountMl: 300 },
  ])("передает выбранную емкость и долю: $label", async (testCase) => {
    const user = userEvent.setup();
    const onAddWater = vi.fn();

    render(<AddWaterForm onAddWater={onAddWater} />);

    await user.click(screen.getByRole("radio", { name: "Бутылка" }));
    await user.click(screen.getByRole("radio", { name: "300 мл" }));
    await user.click(screen.getByRole("radio", { name: testCase.label }));

    expect(
      screen.getByText(`К добавлению: ${testCase.amountMl} мл`),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Добавить запись" }));

    expect(onAddWater).toHaveBeenCalledTimes(1);
    expect(onAddWater).toHaveBeenCalledWith(
      expect.objectContaining({
        amountMl: testCase.amountMl,
        source: {
          method: "container",
          container: { type: "bottle", volumeMl: 300 },
          portion: testCase.portion,
        },
      }),
    );
  });

  it("сохраняет выбор после отправки и позволяет повторить добавление", async () => {
    const user = userEvent.setup();
    const onAddWater = vi.fn();

    render(<AddWaterForm onAddWater={onAddWater} />);

    await user.click(screen.getByRole("radio", { name: "Бутылка" }));
    await user.click(screen.getByRole("radio", { name: "500 мл" }));
    await user.click(screen.getByRole("radio", { name: "Половина" }));

    const addButton = screen.getByRole("button", { name: "Добавить запись" });

    await user.click(addButton);

    expect(screen.getByRole("radio", { name: "Бутылка" })).toBeChecked();

    expect(screen.getByRole("radio", { name: "500 мл" })).toBeChecked();

    expect(screen.getByRole("radio", { name: "Половина" })).toBeChecked();

    expect(screen.getByText("К добавлению: 250 мл")).toBeInTheDocument();

    await user.click(addButton);

    expect(onAddWater).toHaveBeenCalledTimes(2);
    expect(onAddWater).toHaveBeenLastCalledWith(
      expect.objectContaining({
        amountMl: 250,
        source: {
          method: "container",
          container: { type: "bottle", volumeMl: 500 },
          portion: 0.5,
        },
      }),
    );
  });

  it("позволяет выбрать параметры и отправить форму с клавиатуры", async () => {
    const user = userEvent.setup();
    const onAddWater = vi.fn();

    render(<AddWaterForm onAddWater={onAddWater} />);

    await user.tab();
    expect(screen.getByRole("radio", { name: "По емкости" })).toHaveFocus();

    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: "Чашка" })).toBeChecked();

    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: "300 мл" })).toBeChecked();

    await user.tab();
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("radio", { name: "Три четверти" })).toBeChecked();

    await user.tab();

    expect(
      screen.getByRole("button", { name: "Добавить запись" }),
    ).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(onAddWater).toHaveBeenCalledTimes(1);
    expect(onAddWater).toHaveBeenCalledWith(
      expect.objectContaining({
        amountMl: 225,
        source: {
          method: "container",
          container: { type: "cup", volumeMl: 300 },
          portion: 0.75,
        },
      }),
    );
  });

  it.each([
    ["пустое поле", ""],
    ["ноль", "0"],
    ["отрицательное число", "-5"],
    ["дробное число", "12.5"],
    ["дробь, которая округляется до целого", "275.00000000000001"],
    ["число больше безопасного диапазона", "9007199254740992"],
  ])("показывает ошибку ручного ввода — %s", async (_label, value) => {
    const user = userEvent.setup();
    const onAddWater = vi.fn();

    render(<AddWaterForm onAddWater={onAddWater} />);

    await user.click(screen.getByRole("radio", { name: "Вручную" }));
    const amountInput = screen.getByRole("textbox", {
      name: "Выпитый объем, мл",
    });

    if (value !== "") {
      await user.type(amountInput, value);
    }

    await user.click(screen.getByRole("button", { name: "Добавить запись" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Укажи объем в миллилитрах — целое число больше нуля",
    );
    expect(amountInput).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("К добавлению: —")).toBeInTheDocument();
    expect(onAddWater).not.toHaveBeenCalled();
  });

  it("позволяет исправить ручной объем и добавить запись по Enter", async () => {
    const user = userEvent.setup();
    const onAddWater = vi.fn();

    render(<AddWaterForm onAddWater={onAddWater} />);

    await user.click(screen.getByRole("radio", { name: "Вручную" }));
    await user.click(screen.getByRole("button", { name: "Добавить запись" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    const amountInput = screen.getByRole("textbox", {
      name: "Выпитый объем, мл",
    });
    await user.type(amountInput, "275");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("К добавлению: 275 мл")).toBeInTheDocument();

    await user.keyboard("{Enter}");

    expect(onAddWater).toHaveBeenCalledTimes(1);
    expect(onAddWater).toHaveBeenCalledWith(
      expect.objectContaining({
        amountMl: 275,
        source: { method: "manual" },
      }),
    );
  });
});
