document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const rows = document.querySelectorAll('.deploy-table tbody tr');
  const cards = document.querySelectorAll('.deploy-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      rows.forEach(row => {
        if (filter === 'all' || row.dataset.category === filter) {
          row.classList.remove('hidden');
        } else {
          row.classList.add('hidden');
        }
      });

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
});
