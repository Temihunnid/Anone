const supportForm = document.getElementById('support-form');
const supportSuccessEl = document.getElementById('support-success');
const ticketNumberEl = document.getElementById('ticket-number');
const supportHintEl = document.getElementById('support-hint');

function saveSupportTicket(ticket) {
  const existingTickets = JSON.parse(localStorage.getItem('anone-support-tickets') || '[]');
  existingTickets.push(ticket);
  localStorage.setItem('anone-support-tickets', JSON.stringify(existingTickets));
}

function buildMailtoLink(ticket) {
  const recipient = 'anoneabs@aol.com';
  const subject = encodeURIComponent(`Anone Support Request - ${ticket.id}`);
  const body = encodeURIComponent(
    `Hello Anone Support Team,\n\nName: ${ticket.name}\nEmail: ${ticket.email}\n\nMessage:\n${ticket.message}\n\nTicket ID: ${ticket.id}`
  );

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

if (supportForm) {
  supportForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('support-name').value.trim();
    const email = document.getElementById('support-email').value.trim();
    const message = document.getElementById('support-message').value.trim();

    if (!name || !email || !message) {
      alert('Please complete all fields before submitting your request.');
      return;
    }

    const ticket = {
      id: `ANONE-${Date.now().toString().slice(-6)}`,
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    saveSupportTicket(ticket);
    const mailtoLink = buildMailtoLink(ticket);

    try {
      window.location.href = mailtoLink;
    } catch (error) {
      console.warn('Could not open the mail client.', error);
    }

    supportForm.style.display = 'none';
    if (supportSuccessEl) {
      supportSuccessEl.hidden = false;
    }
    if (ticketNumberEl) {
      ticketNumberEl.textContent = `Ticket ID: ${ticket.id}`;
    }
    if (supportHintEl) {
      supportHintEl.textContent = 'Your email app should now open with this request pre-filled for Anone support.';
    }
  });
}
