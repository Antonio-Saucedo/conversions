import {useEffect, useMemo, useState} from 'react';
import './App.css';

type WeightUnit = 'g' | 'kg' | 'mt' | 'mcg' | 'mg' | 'oz' | 'lb';

type ConversionRates = {
    [K in WeightUnit]: {
        [T in WeightUnit as T extends K ? never : T]: number;
    };
};

const CONVERSION_RATES: ConversionRates = {
    g: {kg: 0.001, mt: 0.000001, mcg: 1000000, mg: 1000, oz: 0.03527396195, lb: 0.00220462262},
    kg: {g: 1000, mt: 0.001, mcg: 1000000000, mg: 1000000, oz: 35.27396195, lb: 2.20462262},
    mt: {g: 1000000, kg: 1000, mcg: 1000000000000, mg: 1000000000, oz: 35273.96195, lb: 2204.62262},
    mcg: {
        g: 0.000001, kg: 0.000000001, mt: 0.000000000001, mg: 0.001, oz: 0.00000003527396195, lb: 0.00000000220462262
    },
    mg: {g: 0.001, kg: 0.000001, mt: 0.000000001, mcg: 1000, oz: 0.00003527396195, lb: 0.00000220462262},
    oz: {
        g: 28.349523125, kg: 0.028349523125, mt: 0.000028349523125, mcg: 28349523.125, mg: 28349.523125, lb: 0.0625
    },
    lb: {g: 453.59237, kg: 0.45359237, mt: 0.00045359237, mcg: 453592370, mg: 453592.37, oz: 16},
};

const UNIT_OPTIONS: { value: WeightUnit; label: string }[] = [
    {value: 'kg', label: 'KG'},
    {value: 'lb', label: 'LB'},
    {value: 'g', label: 'G'},
    {value: 'mt', label: 'MT'},
    {value: 'mcg', label: 'MCG'},
    {value: 'mg', label: 'MG'},
    {value: 'oz', label: 'OZ'},
];

const KEYPAD_KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '±', '0', '.'];

function getConversionRate(from: WeightUnit, to: WeightUnit): number {
    if (from === to) return 1;
    const rates = CONVERSION_RATES[from] as Record<WeightUnit, number>;
    return rates[to];
}

function App() {
    const [rawValue, setRawValue] = useState('0');
    const [fromUnit, setFromUnit] = useState<WeightUnit>('kg');
    const [toUnit, setToUnit] = useState<WeightUnit>('lb');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '');
    }, [isDark]);

    const rate = useMemo(() => getConversionRate(fromUnit, toUnit), [fromUnit, toUnit]);
    const result = useMemo(() => {
        const numericValue = Number(rawValue);
        if (numericValue === 0) return '0';
        const raw = numericValue * rate;
        if (Math.abs(raw) < 0.001 || Math.abs(raw) >= 1e9) return raw.toExponential(2);
        return raw.toFixed(2);
    }, [rawValue, rate]);
    const formula = `${toUnit} = ${fromUnit} x ${rate}`;

    function appendDigit(digit: string) {
        setRawValue(prev => prev.replace(/^(-?)0+(?!\.)/, '$1') + digit);
    }

    function toggleSign() {
        setRawValue(prev => (prev.includes('-') ? prev.slice(1) : '-' + prev));
    }

    function appendDecimal() {
        setRawValue(prev => (prev.includes('.') ? prev : prev + '.'));
    }

    function backspace() {
        setRawValue(prev => {
            const next = prev.slice(0, -1);
            return ['', '-'].includes(next) ? '0' : next;
        });
    }

    function clearValue() {
        setRawValue('0');
    }

    function handleKeypadPress(key: string) {
        if (/^[0-9]$/.test(key)) {
            appendDigit(key);
            return;
        }
        switch (key) {
            case '±':
                toggleSign();
                break;
            case '.':
                appendDecimal();
                break;
        }
    }

    function switchConversions() {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    }

    return (<>
        <div className="app-container">
            <header className="text-center">
                <h1>Instant Conversion</h1>
                <h2 className="pointer" role="button" tabIndex={0} onClick={() => setIsDark(prev => !prev)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setIsDark(prev => !prev);
                    }}><span id="app-mode">{isDark ? '☀ Light' : '☾ Dark'}</span> mode</h2>
            </header>
            <main>
                <div className="computation-type-label text-center dashed-border">Weight Converter</div>
                <div className="display-container flex solid-border">
                    <div id="input-display">
                        <div className="display-label">From</div>
                        <div id="input-value">{rawValue}</div>
                    </div>
                    <select id="from-selector" className="solid-border pointer" aria-label="Convert from unit"
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value as WeightUnit)}>
                        {UNIT_OPTIONS.map(({value, label}) => (<option key={value} value={value}>{label}</option>))}
                    </select>
                </div>
                <button type="button" className="swap-button flex items-center solid-border pointer"
                        aria-label="Swap units of conversion" onClick={switchConversions}>⇅
                    <span className="swap-button-hover-box solid-border">Swap units of conversion.</span>
                </button>
                <div className="conversion-container flex solid-border">
                    <div id="conversion-display">
                        <div className="display-label">To</div>
                        <div id="conversion-value" aria-live="polite">{result}</div>
                    </div>
                    <select id="to-selector" className="solid-border pointer" aria-label="Convert to unit"
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value as WeightUnit)}>
                        {UNIT_OPTIONS.map(({value, label}) => (<option key={value} value={value}>{label}</option>))}
                    </select>
                </div>
                <div className="buttons-container dashed-border">
                    {KEYPAD_KEYS.map((key) => (
                        <button key={key} type="button" className="button solid-border text-center pointer"
                                aria-label={key === '±' ? 'Toggle sign' : key === '.' ? 'Decimal point' : undefined}
                                onClick={() => handleKeypadPress(key)}>{key}</button>
                    ))}
                    <div className="button-last-row flex">
                        <button type="button" className="button solid-border text-center pointer"
                                onClick={clearValue}>Clear
                        </button>
                        <button type="button" className="button solid-border text-center pointer" aria-label="Backspace"
                                onClick={backspace}>⌫
                        </button>
                    </div>
                </div>
                <div id="formula-container" className="text-center" aria-live="polite">{formula}</div>
            </main>
            <footer className="text-center">
                <h3>© 2026 | Antonio Saucedo</h3>
            </footer>
        </div>
    </>)
}

export default App
