import { useEffect } from 'react';

function useOutside(ref: React.RefObject<HTMLElement>, closePopup: () => void) {
    useEffect(() => {
        function handleMouseDown(e: MouseEvent) {
            if (ref.current && ref.current.contains(e.target as Node)) return;

            closePopup();
        }

        window.addEventListener('mousedown', handleMouseDown);

        return () => window.removeEventListener('mousedown', handleMouseDown);
    }, [ref, closePopup]);
}

export default useOutside;
