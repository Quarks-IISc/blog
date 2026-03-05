//takes in input from the email subscription text field
//updates a google sheet on its basis

//the sheet is stored on my (Soham's) personal gmail for the moment (soham.acharya9341@gmail.com) (!!! temporary !!!)
const emailForm = document.getElementById("emailForm");

emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = emailForm.querySelector('button[type="submit"]');

    const emailInput = emailForm.querySelector('input[name="email"]');
    const email = emailInput.value.trim();

    if (!email) return;

    try {
        submitBtn.disabled = true;
        fetch("https://script.google.com/macros/s/AKfycbyAZ_AJW751GjbK4Lz_XrDTU-Csu1JojLJeUOqcahPMnRbuZx9AucwEG2A1hz400QBP/exec", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: JSON.stringify({ email }),
        })
        .then(response => response.text())
        .then(result => {
            if (result === "duplicate"){
                alert("This email address has already subscribed.");
            }

            else {
                alert("Thanks for subscribing!");
            }
            submitBtn.disabled = false;
            emailInput.value = "";
        });
    } catch (err) {
        console.error("Error sending email:", err);
        alert("Failed to submit email. Please try again.");
    }
});

        