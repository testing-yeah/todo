    export const validateUser = async () => {
    try {

        const response = await fetch('http://localhost:5000/auth/validation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ data: "data" }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.isAuthenticated) {
            localStorage.setItem('userData', JSON.stringify(responseData));
        }
        return responseData;
    } catch (error) {
        console.error('User validation failed:', error);
        throw error; // Re-throw error for React Query to handle
    }
};
