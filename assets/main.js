const config = window.PROJECT_CONFIG || {};

const byId = (id) => document.getElementById(id);
const isReady = (value) => value && !value.startsWith("REEMPLAZAR_");

function setLink(id, value) {
  const element = byId(id);
  if (!element) return;
  if (isReady(value)) {
    element.href = value;
    element.classList.remove("is-disabled");
    element.removeAttribute("aria-disabled");
  } else {
    element.href = "#configuracion";
    element.classList.add("is-disabled");
    element.setAttribute("aria-disabled", "true");
  }
}

setLink("cvFormLink", config.CV_FORM_URL);
setLink("promoFormLink", config.PROMO_FORM_URL);
setLink("footerCvLink", config.CV_FORM_URL);
setLink("footerPromoLink", config.PROMO_FORM_URL);

byId("year").textContent = new Date().getFullYear();

const status = byId("chatStatus");
if (isReady(config.N8N_CHAT_WEBHOOK_URL)) {
  status.textContent = "Chatbot conectado con n8n";
  import("https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js")
    .then(({ createChat }) => {
      createChat({
        webhookUrl: config.N8N_CHAT_WEBHOOK_URL,
        mode: "window",
        target: "#n8n-chat",
        showWelcomeScreen: false,
        initialMessages: [
          "Hola, soy el asistente del proyecto. Puedo explicar las automatizaciones, formularios y próximos pasos."
        ],
        i18n: {
          en: {
            title: "Asistente n8n",
            subtitle: "Consulta sobre CV, promomail o automatización",
            inputPlaceholder: "Escribe tu consulta..."
          }
        },
        metadata: {
          source: "github-pages",
          page: window.location.pathname
        }
      });
    })
    .catch(() => {
      status.textContent = "No se pudo cargar el widget del chatbot";
      status.classList.add("is-warning");
    });
} else {
  status.textContent = "Pendiente: pegar la Chat URL de n8n en assets/config.js";
  status.classList.add("is-warning");
}
