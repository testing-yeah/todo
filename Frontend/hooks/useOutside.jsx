'use client'
import React, { useEffect } from 'react'

function useOutside(ref, closePopup) {
    useEffect(() => {
        function handleMouseDown(e) {
            if (ref.current && ref.current.contains(e.target)) return

            closePopup()
        }

        window.addEventListener('mousedown', handleMouseDown)

        return (() => window.removeEventListener('mousedown', handleMouseDown))
    }, [ref])
}

export default useOutside