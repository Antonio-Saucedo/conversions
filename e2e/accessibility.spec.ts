import {test, expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
    test('home page has no accessibility violations', async ({page}) => {
        await page.goto('/')

        const results = await new AxeBuilder({page})
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        expect(results.violations).toEqual([])
    })
})
