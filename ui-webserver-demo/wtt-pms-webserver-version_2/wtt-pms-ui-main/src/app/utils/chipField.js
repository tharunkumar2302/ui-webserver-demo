/* eslint-disable no-unused-vars */
export const chipFields = () => {
    const chipField = document?.querySelector('#tags-filled')?.addEventListener('blur', ((e) => {
        const keyEv = new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter',
            charCode: 13,
            keyCode: 13,
            view: window,
            bubbles: true
        });
        e.target.dispatchEvent(keyEv);
    }));
}