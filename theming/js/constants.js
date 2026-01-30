// Shared constants used across theme scripts.
// This file is loaded directly by `layout/theme.liquid`, so it must have runtime side-effects
// (otherwise Vite/Rollup will tree-shake it and you'll get an "empty chunk").
const ON_CHANGE_DEBOUNCE_TIMER = 300;

const PUB_SUB_EVENTS = {
    cartUpdate: 'cart-update',
    quantityUpdate: 'quantity-update',
    optionValueSelectionChange: 'option-value-selection-change',
    variantChange: 'variant-change',
    cartError: 'cart-error',
};

// Expose on window for non-module scripts and for backwards compatibility.
if (typeof window !== 'undefined') {
    window.ON_CHANGE_DEBOUNCE_TIMER = ON_CHANGE_DEBOUNCE_TIMER;
    window.PUB_SUB_EVENTS = PUB_SUB_EVENTS;
}