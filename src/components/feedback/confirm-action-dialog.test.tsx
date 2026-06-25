import { describe, expect, it, vi } from "vitest";

import { ConfirmActionDialog } from "@/components/feedback";
import { render, screen, userEvent } from "@/test/test-utils";

function setup(onConfirm = vi.fn()) {
  const user = userEvent.setup();
  render(
    <ConfirmActionDialog
      trigger={<button type="button">Abrir</button>}
      title="Encerrar sessão"
      description="Tem certeza?"
      confirmLabel="Sair"
      onConfirm={onConfirm}
    />,
  );
  return { user, onConfirm };
}

describe("ConfirmActionDialog", () => {
  it("abre pelo trigger e exibe título/descrição", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Abrir" }));

    expect(await screen.findByText("Encerrar sessão")).toBeInTheDocument();
    expect(screen.getByText("Tem certeza?")).toBeInTheDocument();
  });

  it("chama onConfirm ao confirmar", async () => {
    const { user, onConfirm } = setup();

    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.click(await screen.findByRole("button", { name: "Sair" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("não chama onConfirm ao cancelar", async () => {
    const { user, onConfirm } = setup();

    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.click(await screen.findByRole("button", { name: "Cancelar" }));

    expect(onConfirm).not.toHaveBeenCalled();
  });
});
