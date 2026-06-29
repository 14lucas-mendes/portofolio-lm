document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  const successMsg = document.querySelector('.success-message');
  const resetBtn = document.querySelector('.reset-form');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    const fields = form.querySelectorAll('[required]');

    fields.forEach(field => {
      const group = field.closest('.form-group');
      group.classList.remove('error');

      if (!field.value.trim()) {
        group.classList.add('error');
        valid = false;
      }

      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          group.classList.add('error');
          valid = false;
        }
      }
    });

    if (valid) {
      form.style.display = 'none';
      successMsg.classList.add('show');
    }
  });

  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.form-group').classList.remove('error');
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = '';
      successMsg.classList.remove('show');
    });
  }
});
