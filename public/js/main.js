(function () {
  var form = document.getElementById('contact-form');

  if (!form) return;

  var messageEl = document.getElementById('form-message');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var service = document.getElementById('service').value;
    var message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showError('Please fill in all required fields.');
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, phone: phone, service: service, message: message }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          showSuccess(data.message);
          form.reset();
        } else {
          showError(data.error || 'Something went wrong. Please try again.');
        }
      })
      .catch(function () {
        showError('Could not reach the server. Please try again later.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
  });

  function showError(msg) {
    messageEl.innerHTML = '<div class="form-error">' + msg + '</div>';
  }

  function showSuccess(msg) {
    messageEl.innerHTML = '<div class="form-success">' + msg + '</div>';
  }
})();
