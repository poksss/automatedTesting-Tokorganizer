//============================REGISTER TEST======================================//

const { registerTest } = require('./registerTest');

// Akun Register 
const name = 'John Doe';
const email = 'john.doe@example.com';
const password = 'Password123';
const phone = '081234567890';
const confirmPassword = 'Password123';

(async () => {
// // Test Case: Register Berhasil
// await registerTest(name, email, password, phone, confirmPassword, 'https://www.tokorganizer.my.id/login');

// // Test Case: Register Gagal
// //1. Email sudah terdaftar
// await registerTest(name, email, password, phone, confirmPassword, 'https://www.tokorganizer.my.id/register'); // -> expected :register gagal! Pesan Error: Register Failed ❌ - Email already exists

// //2. Password tidak sesuai
// await registerTest(name, email, password, phone, 'Password12', 'https://www.tokorganizer.my.id/register'); // -> expected :register gagal! Pesan Error: Register Failed ❌ - Password doesn't match

// //3. terjadi kesalahan
// // await registerTest(name, email, password, phone, confirmPassword, 'https://www.tokorganizer.my.id/register'); // -> expected :terjadi kesalahan di halaman register


})();

//======================================================================//



//===================login test================================//
// login test
const { testLogin } = require('./testLogin');

// Test Case: Login Berhasil
// testLogin(email, password, 'https://www.tokorganizer.my.id/main');

// Test Case: Login Gagal
//1. User tidak ditemukan
//  testLogin('invalid@mail.ts', 'wrongpassword', 'https://www.tokorganizer.my.id/main'); // -> expected :login gagal! Pesan Error: Login Failed ❌ - Email not found

//2. Password salah
//  testLogin('test@mail.ts', 'wrongpassword', 'https://www.tokorganizer.my.id/login');  // -> expected :login  gagal! Pesan Error: Login Failed ❌ - Email not found

//3. terjadi kesalahan
// testLogin('test@mail.ts', 'test12345', 'https://www.tokorganizer.my.id/main'); // -> expected :terjadi kesalahan di halaman login url : https://www.tokorganizer.my.id/erorr

// ==================reset password================================//

const { new_passwordTest } = require('./new_passwordTest');

// Test Case: Reset Password Berhasil
// new_passwordTest(email, password);

// Test Case: Reset Password Gagal
//1. Email tidak ditemukan
// new_passwordTest('invalid@mail.ts', 'wrongpassword'); // -> expected :login gagal! Pesan Error: Login Failed ❌ - Email not found

//2. Link reset salah 
// new_passwordTest(email, password);  // -> expected :login  gagal! Pesan Error: Login Failed ❌ - Email not found
