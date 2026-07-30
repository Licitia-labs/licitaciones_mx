const opportunities = [
  { title: "Adquisición de equipo médico", agency: "Secretaría de Salud", state: "Ciudad de México", sector: "Salud", deadline: "2026-08-28", status: "Ejemplo", source: "https://comprasmx.buengobierno.gob.mx/" },
  { title: "Servicios de tecnologías de información", agency: "Comisión Federal de Electricidad", state: "Nuevo León", sector: "Tecnología", deadline: "2026-09-10", status: "Ejemplo", source: "https://msc.cfe.mx/" },
  { title: "Obra de infraestructura hidráulica", agency: "CONAGUA", state: "Jalisco", sector: "Infraestructura", deadline: "2026-09-18", status: "Ejemplo", source: "https://comprasmx.buengobierno.gob.mx/" },
  { title: "Suministro de material de curación", agency: "IMSS", state: "Estado de México", sector: "Salud", deadline: "2026-10-04", status: "Ejemplo", source: "https://www.imss.gob.mx/proveedores" },
  { title: "Mantenimiento de instalaciones públicas", agency: "Secretaría de Infraestructura", state: "Puebla", sector: "Servicios", deadline: "2026-10-22", status: "Ejemplo", source: "https://comprasmx.buengobierno.gob.mx/" },
  { title: "Arrendamiento de equipo de cómputo", agency: "Secretaría de Educación Pública", state: "Veracruz", sector: "Tecnología", deadline: "2026-11-06", status: "Ejemplo", source: "https://comprasmx.buengobierno.gob.mx/" }
];

const $ = (selector) => document.querySelector(selector);
const form = $("#search-form");
const cards = $("#cards");

function addOptions(selectId, key) {
  [...new Set(opportunities.map(item => item[key]))]
    .sort((a, b) => a.localeCompare(b, "es"))
    .forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      $(selectId).append(option);
    });
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "long", year: "numeric" })
    .format(new Date(`${date}T12:00:00`));
}

function cardTemplate(item) {
  return `
    <article class="card">
      <div class="card-body">
        <div class="card-top">
          <span class="badge">${item.sector}</span>
          <span class="status">${item.status}</span>
        </div>
        <h3>${item.title}</h3>
        <div class="detail"><small>Dependencia contratante</small><strong>${item.agency}</strong></div>
        <div class="detail"><small>Ubicación</small><strong>${item.state}</strong></div>
        <div class="detail"><small>Fecha límite demostrativa</small><strong>${formatDate(item.deadline)}</strong></div>
      </div>
      <a class="card-footer" href="${item.source}" target="_blank" rel="noopener noreferrer" aria-label="Consultar fuente oficial para ${item.title}">Consultar fuente oficial →</a>
    </article>`;
}

function render() {
  const query = $("#query").value.trim().toLocaleLowerCase("es");
  const agency = $("#agency").value;
  const state = $("#state").value;
  const sector = $("#sector").value;
  const days = Number($("#deadline").value);
  const today = new Date("2026-07-29T12:00:00");

  const filtered = opportunities.filter(item => {
    const haystack = `${item.title} ${item.agency} ${item.state} ${item.sector}`.toLocaleLowerCase("es");
    const deadline = new Date(`${item.deadline}T12:00:00`);
    const diffDays = Math.ceil((deadline - today) / 86400000);
    return (!query || haystack.includes(query))
      && (!agency || item.agency === agency)
      && (!state || item.state === state)
      && (!sector || item.sector === sector)
      && (!days || (diffDays >= 0 && diffDays <= days));
  });

  cards.innerHTML = filtered.map(cardTemplate).join("");
  $("#empty-state").hidden = filtered.length !== 0;
  $("#result-count").textContent = filtered.length;
  $("#agency-count").textContent = new Set(filtered.map(item => item.agency)).size;
  $("#state-count").textContent = new Set(filtered.map(item => item.state)).size;
}

addOptions("#agency", "agency");
addOptions("#state", "state");
addOptions("#sector", "sector");
render();

form.addEventListener("submit", event => { event.preventDefault(); render(); });
form.addEventListener("change", render);
$("#query").addEventListener("input", render);
$("#clear-filters").addEventListener("click", () => { form.reset(); render(); $("#query").focus(); });
$(".menu-button").addEventListener("click", event => {
  const open = $("#main-nav").classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
