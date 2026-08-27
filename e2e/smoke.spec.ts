import {test, expect} from '@playwright/test'

test.describe('Instant Conversion smoke tests', () => {
    test('loads the app and shows the calculator', async ({page}) => {
        await page.goto('/')
        await expect(page.locator('h1')).toHaveText('Instant Conversion')
        await expect(page.locator('#input-value')).toHaveText('0')
    })

    test('converts 1 kg to lb end-to-end', async ({page}) => {
        await page.goto('/')
        await page.locator('.buttons-container .button.pointer').filter({hasText: /^1$/}).click()
        await expect(page.locator('#conversion-value')).toHaveText('2.2')
    })

    test('toggles dark mode', async ({page}) => {
        await page.goto('/')
        const html = page.locator('html')
        await expect(html).not.toHaveAttribute('data-theme', 'dark')

        await page.locator('header h2').click()

        await expect(html).toHaveAttribute('data-theme', 'dark')
        await expect(page.locator('#app-mode')).toHaveText('☀ Light')
    })

    test('shows the swap hint text on hover', async ({page}) => {
        await page.goto('/')
        const hoverBox = page.locator('.swap-button-hover-box')

        await expect(hoverBox).toBeHidden()

        await page.locator('.swap-button').hover()

        await expect(hoverBox).toBeVisible()
        await expect(hoverBox).toHaveText('Swap units of conversion.')
    })
})
