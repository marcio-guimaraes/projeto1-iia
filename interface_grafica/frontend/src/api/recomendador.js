const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchLivros() {
  const res = await fetch(`${API_BASE}/livros`);
  return res.json();
}

export async function fetchFiltros() {
  const res = await fetch(`${API_BASE}/filtros`);
  return res.json();
}

export async function fetchPopulares(top_n = 10) {
  const res = await fetch(`${API_BASE}/populares?top_n=${top_n}`);
  return res.json();
}

export async function recomendarConteudo(curtidos, top_n = 5) {
  const res = await fetch(`${API_BASE}/recomendar/conteudo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ curtidos, top_n }),
  });
  return res.json();
}

export async function recomendarColaborativo(historico, top_n = 5) {
  const res = await fetch(`${API_BASE}/recomendar/colaborativo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ historico, top_n }),
  });
  return res.json();
}

export async function recomendarHibrido(curtidos, historico, top_n = 5, peso = 0.4) {
  const res = await fetch(`${API_BASE}/recomendar/hibrido`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ curtidos, historico, top_n, peso }),
  });
  return res.json();
}

export async function avaliarModelos(top_k = 5, n_usuarios = 30) {
  const res = await fetch(`${API_BASE}/avaliar?top_k=${top_k}&n_usuarios=${n_usuarios}`);
  return res.json();
}
