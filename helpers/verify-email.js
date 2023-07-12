const createVerifyEmail = (email, baseURL, verificationToken) => {
    let verifyLink = `${baseURL}/verify/${verificationToken}`;

    const verifyEmail = {
        to: email,
        subject: "Email verification",
        html: `<a target="_blank" href="${verifyLink}">Click to verify email</a>`,
    };

    return verifyEmail;
};

module.exports = createVerifyEmail;
