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

                    resolve({
                        address: data.display_name || "Location not found",
                        coordinates: [longitude, latitude], // [lon, lat] for GeoJSON
                    });
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


const getCoordinatesFromAddress = async (address) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
            const { lon, lat, display_name } = data[0];
            return {
                address: display_name,
                coordinates: [parseFloat(lon), parseFloat(lat)],
            };
        } else {
            throw new Error("No results found");
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return {
            address,
            coordinates: [0, 0],
        };
    }
};

module.exports = { getCurrentLocation, getCoordinatesFromAddress };
