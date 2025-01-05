const { Builder, By, until } = require('selenium-webdriver');
const { testLogin } = require('./testLogin');
const {getTokenResetPasswordByEmail} = require('./server/resetPassword');
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function new_passwordTest(email, newPassword ) {

  let driver = new Builder().forBrowser('chrome').build();

  try {
    // Buka web app
    await driver.get('https://www.tokorganizer.my.id/');
    console.log('Membuka halaman...');

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

    // menuju halaman forgot password
    const forgotPasswordButton = await driver.findElement(By.css('body > main > div.h-dvh.overflow-auto.w-full.flex.items-center.justify-center.bg-red-600 > div > div > div:nth-child(2) > form > div > div:nth-child(2) > a'));
    await forgotPasswordButton.click();
    console.log('Tombol forgot password diklik.');

    // Jeda untuk memuat halaman forgot password
    await delay(5000);
    const forgotPasswordpage = await driver.getCurrentUrl();
    if (forgotPasswordpage === 'https://www.tokorganizer.my.id/reset-password') {
      console.log('Halaman forgot password berhasil di-load.');
    } else {
      console.log('Halaman forgot password gagal di-load.');
      return;
    }

    // Isi field email
    const emailField = await driver.findElement(By.name('email'));
    await emailField.sendKeys(email);
    console.log('Field email diisi.');

    // Klik tombol reset password
    const resetPasswordButton = await driver.findElement(By.css('button[type="submit"]'));
    await resetPasswordButton.click();
    console.log('Tombol reset password diklik.');

    // Jeda untuk memuat halaman reset password
    await delay(5000);
    const messageTitle = await driver.wait(until.elementLocated(By.id('toastTitle')), 10000);
    const messageDescription = await driver.wait(until.elementLocated(By.id('toastDescription')), 10000);

    // cek apakah email sudah terdaftar
    const validationEmailMessage = await messageTitle.getText();
    if (validationEmailMessage === 'Confirmation Successful ✅') {
      const SuccessDescript = await messageDescription.getText();
      console.log(`Confirmasi Email berhasil dengan pesan: ${validationEmailMessage} dengan deskripsi: ${SuccessDescript}`);

      // menuju halaman new password
      // ambil token dari db
      const getToken = await getTokenResetPasswordByEmail(email); 
      console.log(getToken);
      if(!getToken){
        console.log('Test gagal! terjadi kesalahan di halaman reset password');
        return;
      }
      // menuju halaman new password
      const newPasswordUrl = `https://www.tokorganizer.my.id/new-password?token=${getToken}`;
      console.log('Membuka halaman new password...');
      console.log(newPasswordUrl);
      await driver.get(newPasswordUrl);
      delay(5000);
      const newPasswordpage = await driver.getCurrentUrl();
      if(newPasswordUrl !== newPasswordpage){
        console.log('Test gagal! Tidak dapat memuaat halaman new password');
        return;
      }
      console.log('Halaman new password berhasil di-load.');

      // Isi field password
      const passwordField = await driver.findElement(By.name('password'));
      await passwordField.sendKeys(newPassword);
      console.log('Field password diisi.');

      // Isi field confirm password
      const confirmPasswordField = await driver.findElement(By.name('confirmPassword'));
      await confirmPasswordField.sendKeys(newPassword);
      console.log('Field confirm password diisi.');

      // Klik tombol reset password
      const resetPasswordButton = await driver.findElement(By.css('button[type="submit"]'));
      await resetPasswordButton.click();
      console.log('Tombol reset password diklik.');

      // Jeda untuk memuat halaman reset password
      await delay(5000);
      const newPasswordMessageTitle = await driver.wait(until.elementLocated(By.id('toastTitle')), 10000);
      const newPasswordMessageDescription = await driver.wait(until.elementLocated(By.id('toastDescription')), 10000);

      // cek apakah pasword sudah berhasil update
      const newPasswordValidationEmailMessage = await newPasswordMessageTitle.getText();
      if (newPasswordValidationEmailMessage === 'Reset Successful ✅') {
        const newPasswordSuccessDescript = await newPasswordMessageDescription.getText();
        console.log(`Confirmasi Password berhasil dengan pesan: ${newPasswordValidationEmailMessage} dengan deskripsi: ${newPasswordSuccessDescript}`);

        // test login
        testLogin(email, newPassword, 'https://www.tokorganizer.my.id/main');
      }



    } else {
      console.log('Halaman reset password gagal di-load.');
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


module.exports = { new_passwordTest };