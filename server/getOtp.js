const db = require('./server');

// Fungsi untuk mengambil OTP berdasarkan token
async function getOtpByToken(token) {
  try {
    const result = await db.query(
      `SELECT otp, expires FROM "OtpConfirmation" WHERE token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      throw new Error('Token tidak valid atau OTP tidak ditemukan.');
    }

    return result.rows[0]; // Mengembalikan data OTP dan expires
  } catch (error) {
    console.error('Error querying OTP:', error.message);
    throw error;
  }
}

module.exports = { getOtpByToken };
