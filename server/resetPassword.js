const db = require('./server');

async function getTokenResetPasswordByEmail(email) {
    try {
        const result = await db.query(
            `SELECT token FROM "PasswordResetToken" WHERE email = $1`,
            [email]
        );
        if (result.rows.length === 0) {
            throw new Error('Email not found');
        }
        return result.rows[0].token;
    } catch (error) {
        console.error('Error querying token:', error.message);
        throw error;
    }
}

module.exports = { getTokenResetPasswordByEmail };
