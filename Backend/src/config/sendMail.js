import { sendMail } from "./emailService.js";

// Function to send a welcome email
const sendWelcomeEmail = async (to) => {
    const subject = "Welcome to our platform!";
    const text = "Welcome to our platform! We are excited to have you on board.";
    const html = "<b>Welcome to our platform!</b><p>We are excited to have you on board.</p>";

    try {
        await sendMail(to, subject, text, html);
    } catch (error) {
        console.error("Error sending welcome email: ", error);
        throw error;
    }
};

// // Function to send a goodbye email
// const sendGoodbyeEmail = async (to) => {
//     const subject = "Goodbye!";
//     const text = "We are sad to see you go! Please let us know how we can improve.";
//     const html = "<b>Goodbye!</b><p>We are sad to see you go! Please let us know how we can improve.</p>";

//     try {
//         await sendMail(to, subject, text, html);
//     }

//     catch (error) {
//         console.error("Error sending goodbye email: ", error);
//         throw error;
//     }

// }


sendMail("try.bhadarka@gmail.com");
