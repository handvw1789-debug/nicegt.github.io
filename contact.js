const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
const error = document.getElementById('formError');
const button = form.querySelector('button[type="submit"]');
let sending = false;
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    sending = true;
    button.disabled = true;
    button.textContent = 'Enviando solicitud…';
    form.setAttribute('aria-busy', 'true');
    success.style.display = 'none';
    error.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
        const response = await fetch(form.action, {
            method: 'POST', body: new FormData(form),
            headers: { Accept: 'application/json' }, signal: controller.signal
        });
        if (!response.ok) throw new Error('submission_failed');
        form.reset();
        success.style.display = 'block';
    } catch {
        error.textContent = 'No pudimos confirmar el envío. Tus datos siguen en el formulario. Puedes intentarlo de nuevo o contactarnos por WhatsApp; si ya recibiste confirmación, evita repetir la solicitud.';
        error.hidden = false;
    } finally {
        clearTimeout(timeout);
        sending = false;
        button.disabled = false;
        button.textContent = 'Enviar solicitud por correo';
        form.removeAttribute('aria-busy');
    }
});
