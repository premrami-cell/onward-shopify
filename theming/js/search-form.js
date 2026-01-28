// Base class used by predictive-search and others.
// Keep a proper global name (SearchForm) so other scripts can extend it.

class SearchForm extends HTMLElement {
    constructor() {
        super();
        this.input = this.querySelector('input[type="search"]');
        this.resetButton = this.querySelector('button[type="reset"]');

        if (this.input) {
            this.input.form.addEventListener('reset', this.onFormReset.bind(this));
            this.input.addEventListener(
                'input',
                debounce((event) => {
                    this.onChange(event);
                }, 300).bind(this)
            );
        }
    }

    toggleResetButton() {
        const isHidden = this.resetButton.classList.contains('hidden');
        if (this.input.value.length > 0 && isHidden) {
            this.resetButton.classList.remove('hidden');
        } else if (this.input.value.length === 0 && !isHidden) {
            this.resetButton.classList.add('hidden');
        }
    }

    onChange() {
        this.toggleResetButton();
    }

    shouldResetForm() {
        return !document.querySelector('[aria-selected="true"] a');
    }

    onFormReset(event) {
        event.preventDefault();
        if (!this.shouldResetForm()) return;

        this.input.value = '';
        this.input.focus();
        this.toggleResetButton();
    }
}

customElements.define('search-form', SearchForm);

// Expose globally so predictive-search.js can extend SearchForm.
if (typeof window !== 'undefined') {
    window.SearchForm = SearchForm;
}
