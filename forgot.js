document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgot-password-form");
  if (!form) return alert("Form not found!");

  console.log("Reset password form loaded");
  const newPassword = document.getElementById("forgot-password");
  const confirmPassword = document.getElementById("confirm-password");

  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  const token = params.get('token');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = newPassword.value.trim();
    const confirm = confirmPassword.value.trim();

    if (password !== confirm) return alert("Passwords do not match.");
    if (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return alert("Password must be at least 8 characters and include a special symbol.");
    }

    /*const response = await fetch("/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password })
    });*/
    alert("Password has been reset");
  });
});
