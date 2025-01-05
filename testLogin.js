const { Builder, By, until } = require('selenium-webdriver');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testLogin(email, password, expectedUrl) {
  let driver = await new Builder().forBrowser('chrome').build();

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
    }else {
      console.log('Halaman login gagal di-load.');
      return;
    }

    // Isi field email
    const emailField = await driver.findElement(By.name('email'));
    await emailField.sendKeys(email);
    console.log(`Field email diisi dengan: ${email}`);

    // Isi field password
    const passwordField = await driver.findElement(By.name('password'));
    await passwordField.sendKeys(password);
    console.log(`Field password diisi dengan: ${password}`);

    // Submit form
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();
    console.log('Form berhasil disubmit.');

    // Jeda untuk proses login
    await delay(12000);

    // Validasi URL setelah submit
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl === expectedUrl) {
      console.log(`Test berhasil! Halaman saat ini: ${currentUrl}`);
    } else if (currentUrl === 'https://www.tokorganizer.my.id/login') {

      console.log('Login gagal! Mencari pesan error...');
      // Ambil pesan error
      const messageTitle = await driver.wait(until.elementLocated(By.id('toastTitle')), 10000);
      const messageDescription = await driver.wait(until.elementLocated(By.id('toastDescription')), 10000);

      const titleText = await messageTitle.getText();
      const descriptionText = await messageDescription.getText();

      console.log(`Test gagal! Pesan Error: ${titleText} - ${descriptionText}`);

    }else {
      console.log(`Test gagal! terjadi kesalahan. Halaman saat ini: ${currentUrl}`);
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

module.exports = { testLogin };
