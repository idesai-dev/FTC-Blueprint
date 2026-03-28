import { mount } from 'svelte';
import { Copy, Check } from 'lucide-svelte';
import { browser } from '$app/environment';

export function setupCopyButtons() {
    if (!browser) return;

    document.querySelectorAll('pre').forEach((pre) => {
        if (pre.querySelector('.copy-code-button')) return;

        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        
        pre.style.position = 'relative';
        
        const iconWrapper = document.createElement('span');
        iconWrapper.style.display = 'flex';
        iconWrapper.style.alignItems = 'center';
        iconWrapper.style.justifyContent = 'center';
        button.appendChild(iconWrapper);
        
        pre.appendChild(button);

        mount(Copy, {
            target: iconWrapper,
            props: { size: 16, strokeWidth: 2.5 }
        });

        button.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code ? code.textContent : pre.textContent;
            
            if (text) {
                try {
                    await navigator.clipboard.writeText(text.trim());
                    
                    iconWrapper.innerHTML = '';
                    mount(Check, {
                        target: iconWrapper,
                        props: { size: 16, strokeWidth: 2.5, color: '#4ade80' } 
                    });
                    
                    button.classList.add('copied');
                    
                    setTimeout(() => {
                        button.classList.remove('copied');
                        iconWrapper.innerHTML = '';
                        mount(Copy, {
                            target: iconWrapper,
                            props: { size: 16, strokeWidth: 2.5 }
                        });
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            }
        });
    });
}

    