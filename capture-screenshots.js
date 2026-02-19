const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to check if server is running
function checkServerRunning() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001', (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
  });
}

// Wait for server with timeout
async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await checkServerRunning()) {
      console.log('✓ Server is running');
      return true;
    }
    console.log(`Waiting for server... (${i + 1}/${maxAttempts})`);
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

// Install playwright if needed and capture screenshots
async function main() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  
  // Create screenshots directory
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Check if server is running
  console.log('Checking if development server is running...');
  if (!await waitForServer()) {
    console.error('Server did not start in time');
    process.exit(1);
  }

  try {
    // Try to use installed playwright or install it
    let playwright;
    try {
      playwright = require('playwright');
    } catch (e) {
      console.log('Installing playwright...');
      await new Promise((resolve, reject) => {
        exec('npm install --save-dev @playwright/test', (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      playwright = require('playwright');
    }

    const browser = await playwright.chromium.launch();
    const context = await browser.createBrowserContext({
      viewport: { width: 480, height: 800 }
    });

    const page = await context.newPage();

    // Page configurations for screenshots
    const pages = [
      { name: '1-splash-screen', url: 'http://localhost:3001', wait: 1000, desc: 'Splash Screen' },
      { name: '2-role-selection', url: 'http://localhost:3001', wait: 2500, desc: 'Role Selection' },
      { name: '3-teacher-profile', url: 'http://localhost:3001', wait: 2500, desc: 'Teacher Profile (after clicking Teacher)', action: async () => {
        await page.click('button:has-text("Teacher")');
        await page.waitForTimeout(800);
      }},
      { name: '4-parent-profile', url: 'http://localhost:3001', wait: 2500, desc: 'Parent Profile (after clicking Parent)', action: async () => {
        // Navigate back and select parent
        await page.reload();
        await page.waitForTimeout(2500);
        const parentBtn = await page.$('button:nth-child(2)');
        if (parentBtn) await parentBtn.click();
        await page.waitForTimeout(800);
      }},
    ];

    console.log('\nCapturing screenshots...\n');

    for (const pageConfig of pages) {
      try {
        console.log(`📸 Capturing: ${pageConfig.desc}`);
        await page.goto(pageConfig.url);
        
        if (pageConfig.wait) {
          await page.waitForTimeout(pageConfig.wait);
        }

        if (pageConfig.action) {
          await pageConfig.action();
        }

        const imagePath = path.join(screenshotsDir, `${pageConfig.name}.png`);
        await page.screenshot({ path: imagePath, fullPage: false });
        console.log(`   ✓ Saved: screenshots/${pageConfig.name}.png`);
      } catch (err) {
        console.log(`   ✗ Error capturing ${pageConfig.desc}: ${err.message}`);
      }
    }

    await browser.close();
    console.log('\n✓ Screenshots captured successfully!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
