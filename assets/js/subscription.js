// takes in input from the email subscription text field
// updates a google sheet on its basis

const emailForm = document.getElementById("emailForm");
const subscriptionMessage = document.getElementById("subscription-message");

if (emailForm) {
    emailForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = emailForm.querySelector('button[type="submit"]');
        const submitText = submitBtn.querySelector('.submit-text');
        const spinner = submitBtn.querySelector('.spinner-border');
        const emailInput = emailForm.querySelector('input[name="email"]');
        const email = emailInput.value.trim();

        if (!email) return;

        // Reset message
        subscriptionMessage.textContent = "";
        subscriptionMessage.className = "small mt-2";

        try {
            // Loading state
            submitBtn.disabled = true;
            submitText.classList.add('d-none');
            spinner.classList.remove('d-none');

            const response = await fetch("https://script.google.com/macros/s/AKfycbyAZ_AJW751GjbK4Lz_XrDTU-Csu1JojLJeUOqcahPMnRbuZx9AucwEG2A1hz400QBP/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.text();

            if (result === "duplicate") {
                subscriptionMessage.textContent = "This email is already subscribed.";
                subscriptionMessage.classList.add('text-warning');
            } else {
                // Show success popup
                $('#subscriptionModal').modal('show');
                emailInput.value = "";
            }
        } catch (err) {
            console.error("Error sending email:", err);
            subscriptionMessage.textContent = "Failed to subscribe. Please try again later.";
            subscriptionMessage.classList.add('text-danger');
        } finally {
            submitBtn.disabled = false;
            submitText.classList.remove('d-none');
            spinner.classList.add('d-none');
        }
    });
}
