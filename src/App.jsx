const CONVERSION_RATES = {
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

function App() {

    function updateInput(button, inputValueContainer) {
        // The character on the button that was clicked (e.g. '7', '.', '⌫')
        const key = button.target.textContent;

        // Handle digit keys (0-9) separately from the operator keys below
        if (/^[0-9]$/.test(key)) {
            // Strip leading zero(s) — but not "0." for decimals — while preserving
            // a leading "-" sign if one is present (e.g. "-0" + "2" => "-2", not "-02")
            inputValueContainer.textContent = inputValueContainer.textContent.replace(/^(-?)0+(?!\.)/, '$1') + key;
            return; // stop here so we don't fall through into the switch below
        }

        switch (key) {
            case '±':
                // Toggle the negative sign: remove it if present, add it if not
                inputValueContainer.textContent = inputValueContainer.textContent.includes('-') ? inputValueContainer.textContent.slice(1) : '-' + inputValueContainer.textContent;
                break;

            case '.':
                // Only add a decimal point if one doesn't already exist
                if (!inputValueContainer.textContent.includes('.')) {
                    inputValueContainer.textContent = inputValueContainer.textContent + '.';
                }
                break;

            case '⌫':
                // Remove the last character, unless doing so would leave '' or just '-',
                // in which case reset to '0' instead
                if (!['', '-'].includes(inputValueContainer.textContent.slice(0, -1))) {
                    inputValueContainer.textContent = inputValueContainer.textContent.slice(0, -1);
                } else {
                    inputValueContainer.textContent = '0';
                }
                break;

            default:
                // Any other key (e.g. unrecognized button) resets the display
                inputValueContainer.textContent = '0';
                break;
        }
    }

    function convertValue(fromSelectorValue, toSelectorValue, inputValue, conversionValueContainer) {
        const conversionRate = CONVERSION_RATES[fromSelectorValue]?.[toSelectorValue] ?? 1;
        // conversionValueContainer.innerHTML = Number(inputValue) * conversionRate;
        conversionValueContainer.innerHTML = Number((Math.round((Number(inputValue) * conversionRate + Number.EPSILON) * 100) / 100).toFixed(2));
        console.log(Number(inputValue) * conversionRate);

        displayFormula(fromSelectorValue, toSelectorValue, conversionRate);
    }

    function displayFormula(fromSelectorValue, toSelectorValue, conversionRate) {
        const formulaContainer = document.getElementById('formula-container');
        formulaContainer.textContent = fromSelectorValue + ' = ' + toSelectorValue + ' x ' + conversionRate;
    }

    function handleConversion(button) {
        const fromSelectorValue = document.getElementById('from-selector').value;
        const toSelectorValue = document.getElementById('to-selector').value;
        const inputValueContainer = document.getElementById('input-value');
        const conversionValueContainer = document.getElementById('conversion-value');

        if (button) {
            updateInput(button, inputValueContainer);
        }

        const inputValue = inputValueContainer.innerHTML;

        convertValue(fromSelectorValue, toSelectorValue, inputValue, conversionValueContainer);
    }

    function switchConversions() {
        const fromSelector = document.getElementById('from-selector');
        const fromSelectorValue = fromSelector.value;
        const toSelector = document.getElementById('to-selector');

        fromSelector.value = toSelector.value;
        toSelector.value = fromSelectorValue;

        handleConversion();
    }

    return (<>
        <div className="app-container">
            <header className="text-center">
                <h1>Instant Conversion</h1>
                <h2 onClick={() => {
                    const appMode = document.getElementById('app-mode');
                    document.documentElement.setAttribute('data-theme', [null, ''].includes(document.documentElement.getAttribute('data-theme')) ? 'dark' : '');
                    appMode.innerText = appMode.innerText === '☾ Dark' ? '☀ Light' : '☾ Dark';
                }}><span id="app-mode">☾ Dark</span> mode</h2>
            </header>
            <main>
                <div className="computation-type-label text-center dashed-border">Weight Converter</div>
                <div className="display-container flex solid-border">
                    <div id="input-display">
                        <div className="display-label">From</div>
                        <div id="input-value">0</div>
                    </div>
                    <select id="from-selector" className="pointer" aria-label="Convert from unit" onChange={() => {
                        handleConversion()
                    }}>
                        <option value="kg">KG</option>
                        <option value="lb">LB</option>
                        <option value="g">G</option>
                        <option value="mt">MT</option>
                        <option value="mcg">MCG</option>
                        <option value="mg">MG</option>
                        <option value="oz">OZ</option>
                    </select>
                </div>
                <div className="swap-button flex items-center solid-border pointer"
                     onClick={() => switchConversions()}>⇅
                    <span className="swap-button-hover-box solid-border">Swap units of conversion.</span>
                </div>
                <div className="conversion-container flex solid-border">
                    <div id="conversion-display">
                        <div className="display-label">To</div>
                        <div id="conversion-value">0</div>
                    </div>
                    <select id="to-selector" className="pointer" aria-label="Convert to unit" onChange={() => {
                        handleConversion()
                    }}>
                        <option value="lb">LB</option>
                        <option value="kg">KG</option>
                        <option value="g">G</option>
                        <option value="mt">MT</option>
                        <option value="mcg">MCG</option>
                        <option value="mg">MG</option>
                        <option value="oz">OZ</option>
                    </select>
                </div>
                <div className="buttons-container dashed-border">
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>7</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>8</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>9</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>4</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>5</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>6</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>1</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>2</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>3</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>±</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>0</div>
                    <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>.</div>
                    <div className="button-last-row flex">
                        <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>Clear</div>
                        <div className="button solid-border text-center pointer" onClick={(e) => handleConversion(e)}>⌫</div>
                    </div>
                </div>
                <div id="formula-container" className="text-center">kg = lb x 2.20462262</div>
            </main>
            <footer className="text-center">
                <h3>© 2026 | Antonio Saucedo</h3>
            </footer>
        </div>
    </>)
}

export default App
