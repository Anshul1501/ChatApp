import { useEffect, useState } from 'react';

const useUserProfilePic = (userId) => {
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        const fetchProfilePic = async() => {
            try {
                // Make a request to fetch the user's profile picture using the user ID
                const response = await fetch(`/api/users/${userId}/profilePic`);
                if (!response.ok) {
                    throw new Error('Failed to fetch profile picture');
                }
                const data = await response.json();
                setProfilePic(data.profilePic); // Assuming the response contains the profile picture URL
            } catch (error) {
                console.error(error);
                // Handle error (e.g., show default profile picture)
            }
        };

        if (userId) {
            fetchProfilePic();
        }
    }, [userId]);

    return profilePic;
};

export default useUserProfilePic;