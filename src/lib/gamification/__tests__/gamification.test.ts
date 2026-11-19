import { describe, it, expect, vi } from "vitest";
import {
  calcularStreak,
  avaliarGamificacao,
} from "../engine";
import type { Sessao, Nota, RevisaoHistorico } from "../../db/types";

function criarSessao(parcial: Partial<Sessao> & Pick<Sessao, "id" | "status" | "inicio">): Sessao {
  return {
    usuarioId: "u1",
    objetivo: "Estudo",
    minutosPlanejados: 30,
    itens: [],
    ...parcial,
  };
}

describe("Sistema de Gamificação e Aprendizado Deliberado", () => {
  it("calcula corretamente os pontos de experiência (XP)", () => {
    const sessoesMock: Sessao[] = [
      criarSessao({
        id: "s1",
        status: "concluida",
        inicio: "2026-10-26T10:00:00Z",
        objetivo: "Aprender inglês",
        reflexao: "Excelente sessão!",
        itens: [
          {
            id: "i1",
            sessaoId: "s1",
            videoId: "v1",
            ordem: 1,
            titulo: "V1",
            canalNome: "Canal",
            miniaturaUrl: "",
            duracaoMin: 10,
            status: "concluido",
            segundosAssistidos: 600,
          },
          {
            id: "i2",
            sessaoId: "s1",
            videoId: "v2",
            ordem: 2,
            titulo: "V2",
            canalNome: "Canal",
            miniaturaUrl: "",
            duracaoMin: 10,
            status: "concluido",
            segundosAssistidos: 600,
          },
        ],
      }),
    ];

    const notasMock: Nota[] = [
      { id: "n1", usuarioId: "u1", sessaoId: "s1", videoId: "v1", tempoS: 120, texto: "Nota 1", etiquetas: [], criadoEm: "2026-10-26T10:02:00Z" },
      { id: "n2", usuarioId: "u1", sessaoId: "s1", videoId: "v1", tempoS: 300, texto: "Nota 2", etiquetas: [], criadoEm: "2026-10-26T10:05:00Z" },
    ];

    const revisoesMock: RevisaoHistorico[] = [
      {
        id: "r1",
        cartaoId: "c1",
        qualidade: 5,
        revisadoEm: "2026-10-26T10:10:00Z",
      },
    ];

    const perfil = avaliarGamificacao({
      sessoes: sessoesMock,
      notas: notasMock,
      revisoes: revisoesMock,
    });

    expect(perfil.xpTotal).toBe(380);
    expect(perfil.nivelAtual).toBe(2);
    expect(perfil.nivelTitulo).toBe("Explorador Focado");
  });

  it("desbloqueia os emblemas correspondentes ao atingir as metas", () => {
    const sessoesMock: Sessao[] = [
      criarSessao({
        id: "s1",
        status: "concluida",
        inicio: "2026-10-26T10:00:00Z",
        objetivo: "Inglês para viagens",
        reflexao: "Reflexão 1",
        itens: [
          {
            id: "i1",
            sessaoId: "s1",
            videoId: "v1",
            ordem: 1,
            titulo: "V1",
            canalNome: "Canal",
            miniaturaUrl: "",
            duracaoMin: 60,
            status: "concluido",
            segundosAssistidos: 3600,
          },
        ],
      }),
      criarSessao({
        id: "s2",
        status: "concluida",
        inicio: "2026-10-26T14:00:00Z",
        objetivo: "Inglês profissional",
        reflexao: "Reflexão 2",
        itens: [
          {
            id: "i2",
            sessaoId: "s2",
            videoId: "v2",
            ordem: 1,
            titulo: "V2",
            canalNome: "Canal",
            miniaturaUrl: "",
            duracaoMin: 10,
            status: "concluido",
            segundosAssistidos: 600,
          },
        ],
      }),
    ];

    const perfil = avaliarGamificacao({
      sessoes: sessoesMock,
      notas: [],
      revisoes: [],
    });

    const badgeHoraOuro = perfil.conquistas.find((c) => c.id === "hora_ouro");
    const badgePrimeira = perfil.conquistas.find((c) => c.id === "primeira_sessao");
    const badgePoliglota = perfil.conquistas.find((c) => c.id === "poliglota");
    const badgeFilosofo = perfil.conquistas.find((c) => c.id === "filosofo");

    expect(badgeHoraOuro?.desbloqueada).toBe(true);
    expect(badgePrimeira?.desbloqueada).toBe(true);
    expect(badgePoliglota?.desbloqueada).toBe(true);
    expect(badgeFilosofo?.desbloqueada).toBe(true);
  });

  it("calcula streak diário consecutivo de estudo", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-26T15:00:00Z"));
    try {
      const sessoesConcluidas: Sessao[] = [
        criarSessao({ id: "s1", status: "concluida", inicio: "2026-10-26T10:00:00Z" }),
        criarSessao({ id: "s2", status: "concluida", inicio: "2026-10-25T10:00:00Z" }),
        criarSessao({ id: "s3", status: "concluida", inicio: "2026-10-24T10:00:00Z" }),
      ];

      const streak = calcularStreak(sessoesConcluidas);
      expect(streak).toBe(3);
    } finally {
      vi.useRealTimers();
    }
  });
});

