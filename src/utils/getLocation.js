const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject("Geolocation is not supported by your browser.");
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await res.json();
                    resolve(data.display_name || "Location not found");
                } catch (error) {
                    reject("Failed to get address from coordinates");
                }
            },
            (error) => {
                reject("Location access denied or unavailable.");
            }
        );
    });
};

export default getCurrentLocation;
