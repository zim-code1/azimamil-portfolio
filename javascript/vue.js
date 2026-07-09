document.addEventListener("DOMContentLoaded", () => {
  setupContactForm();

  function setupContactForm() {
    const openBtn = document.getElementById('open-contact-btn');
    const closeBtn = document.getElementById('close-contact-btn');
    const modal = document.getElementById('contact-modal');
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const contactInner = document.getElementById('contact-inner');
    const contactThanks = document.getElementById('contact-thanks');
    const thanksMessage = document.getElementById('thanks-message');

    if (!openBtn || !closeBtn || !modal || !form) return;

    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      modal.classList.remove('hidden');
    });

    const closeModal = () => {
      modal.classList.add('hidden');
      if (status) status.textContent = '';
    };

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (status) {
        status.textContent = 'Sending...';
        status.style.color = 'var(--color-accent)';
      }

      const formData = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          const userName = document.getElementById('form-name').value;
          if (thanksMessage && userName) {
            thanksMessage.textContent = `Your message has been sent successfully. I'll get back to you as soon as possible, ${userName}!`;
          }
          if (contactInner) contactInner.style.display = 'none';
          if (contactThanks) contactThanks.style.display = 'flex';
          form.reset();
          closeModal();
        } else {
          if (status) {
            status.textContent = 'Oops! There was a problem sending your message.';
            status.style.color = '#ff5f56';
          }
        }
      } catch (err) {
        if (status) {
          status.textContent = 'Error. Please check your connection and try again.';
          status.style.color = '#ff5f56';
        }
      }
    });
  }
});