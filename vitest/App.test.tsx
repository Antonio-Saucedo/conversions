import {describe, it, expect} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import App from '../src/App'

const clickButton = (text: string) => {
    fireEvent.click(screen.getByText(text, {selector: '.button'}))
}

describe('App', () => {
    it('renders with an initial value of 0', () => {
        const {container} = render(<App/>)
        expect(container.querySelector('#input-value')).toHaveTextContent('0')
        expect(container.querySelector('#conversion-value')).toHaveTextContent('0')
    })

    it('converts 1 kg to lb by default', () => {
        const {container} = render(<App/>)
        clickButton('1')
        expect(container.querySelector('#conversion-value')).toHaveTextContent('2.2')
    })

    it('builds multi-digit numbers', () => {
        const {container} = render(<App/>)
        clickButton('1')
        clickButton('0')
        expect(container.querySelector('#input-value')).toHaveTextContent('10')
        expect(container.querySelector('#conversion-value')).toHaveTextContent('22.05')
    })

    it('handles decimal input', () => {
        const {container} = render(<App/>)
        clickButton('1')
        clickButton('.')
        clickButton('5')
        expect(container.querySelector('#input-value')).toHaveTextContent('1.5')
    })

    it('toggles the negative sign', () => {
        const {container} = render(<App/>)
        clickButton('5')
        clickButton('±')
        expect(container.querySelector('#input-value')).toHaveTextContent('-5')
        clickButton('±')
        expect(container.querySelector('#input-value')).toHaveTextContent('5')
    })

    it('deletes the last character with backspace', () => {
        const {container} = render(<App/>)
        clickButton('1')
        clickButton('2')
        clickButton('⌫')
        expect(container.querySelector('#input-value')).toHaveTextContent('1')
    })

    it('resets to 0 when Clear is pressed', () => {
        const {container} = render(<App/>)
        clickButton('7')
        clickButton('Clear')
        expect(container.querySelector('#input-value')).toHaveTextContent('0')
    })

    it('swaps the from/to units', () => {
        const {container} = render(<App/>)
        const fromSelect = screen.getByLabelText<HTMLSelectElement>('Convert from unit')
        const toSelect = screen.getByLabelText<HTMLSelectElement>('Convert to unit')
        expect(fromSelect.value).toBe('kg')
        expect(toSelect.value).toBe('lb')

        fireEvent.click(container.querySelector('.swap-button') as HTMLElement)

        expect(fromSelect.value).toBe('lb')
        expect(toSelect.value).toBe('kg')
    })

    it('recalculates when the target unit changes', () => {
        const {container} = render(<App/>)
        clickButton('1')
        const toSelect = screen.getByLabelText<HTMLSelectElement>('Convert to unit')
        fireEvent.change(toSelect, {target: {value: 'g'}})
        expect(container.querySelector('#conversion-value')).toHaveTextContent('1000')
    })
})
