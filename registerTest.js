const { Builder, By, until } = require('selenium-webdriver');
const { getOtpByToken } = require('./server/getOtp'); 

// fungsi delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function registerTest(name,email, password, phone, confirmPassword ,expectedUrl) {
    let driver = new Builder().forBrowser('chrome').build();

    try {

        // Buka web app
        await driver.get('https://www.tokorganizer.my.id/');
        console.log('Membuka halaman...');
        await delay(5000);
        // Tunggu hingga halaman siap
        await driver.wait(until.titleIs('Tokorganizer'), 10000);
        console.log('Halaman berhasil di-load.');

        // Klik tombol login
        const button = await driver.findElement(By.id('login'));
        await button.click();
        console.log('Tombol login diklik.');

        // Jeda untuk memuat halaman login
        await delay(5000);
        const loginpage = await driver.getCurrentUrl();
        if (loginpage === 'https://www.tokorganizer.my.id/login') {
            console.log('Halaman login berhasil di-load.');
        } else {
            console.log('Halaman login gagal di-load.');
            return;
        }
        // menuju halaman register
        const registerButton = await driver.findElement(By.css('body > main > div.h-dvh.overflow-auto.w-full.flex.items-center.justify-center.bg-red-600 > div > div > div:nth-child(4) > a'));
        await registerButton.click();
        console.log('Tombol register diklik.');

        // Jeda untuk memuat halaman register
        await delay(5000);
        const registerpage = await driver.getCurrentUrl();
        if (registerpage === 'https://www.tokorganizer.my.id/register') {
            console.log('Halaman register berhasil di-load.');
        } else {
            console.log('Halaman register gagal di-load.');
            return;
        }

        // Isi Form Register
        const nameField = await driver.findElement(By.name('name'));
        await nameField.sendKeys(name);

        const emailField = await driver.findElement(By.name('email'));
        await emailField.sendKeys(email);

        const phoneField = await driver.findElement(By.name('phone'));
        await phoneField.sendKeys(phone);

        const passwordField = await driver.findElement(By.name('password'));
        await passwordField.sendKeys(password);

        
        const confirmPasswordField = await driver.findElement(By.name('confirmPassword'));
        await confirmPasswordField.sendKeys(confirmPassword);

        // Klik tombol register
        const registerButton1 = await driver.findElement(By.css('button[type="submit"]'));
        await registerButton1.click();
        console.log('Tombol register diklik.');

        // Jeda untuk proses Register
        await delay(12000);

        // Validasi URL setelah submit
        const verifiedUrl = await driver.getCurrentUrl();
        if (verifiedUrl.includes('verification')) {
            console.log('Register Berhasil');
        } else {
            console.log('Register Gagal halaman verification tidak ditemukan.');
            return;
        }
         // verifikasi email
        const url = new URL(verifiedUrl);
        const token = url.searchParams.get('token');
        if (token) {
            console.log(`Token ditemukan: ${token}`);
      
             // Cek OTP berdasarkan token
            const otpData = await getOtpByToken(token);
            console.log(`OTP ditemukan: ${otpData.otp}, Expired pada: ${otpData.expires}`);

            // Isi OTP
            const otpField = await driver.findElement(By.name('otp'));
            await otpField.sendKeys(otpData.otp);

            // Klik tombol verifikasi
            const verifyButton = await driver.findElement(By.css('button[type="submit"]'));
            await verifyButton.click();
            console.log('Tombol verifikasi diklik.');

            // Jeda untuk memuat halaman dashboard
            await delay(5000);
            const dashboardUrl = await driver.getCurrentUrl();
            if (dashboardUrl === expectedUrl) {
                console.log('Akun Berhasil dibuat.');
            } else {
                console.log('Akun Gagal dibuat.');
                      // Ambil pesan error
                const messageTitle = await driver.wait(until.elementLocated(By.id('toastTitle')), 10000);
                const messageDescription = await driver.wait(until.elementLocated(By.id('toastDescription')), 10000);

                const titleText = await messageTitle.getText();
                const descriptionText = await messageDescription.getText();
                console.log(`Test gagal! Pesan Error: ${titleText} - ${descriptionText}`);
                return;
            }
        } else {
            console.log('Token tidak ditemukan di URL.');
      return;
    }

        
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Tutup browser
    console.log('Menutup browser...');
    await delay(2000);
    await driver.quit();
  }

}

module.exports = { registerTest };