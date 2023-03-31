import { createContext } from 'react';

const ProfileContext = createContext({
	profileData: null,
	loadProfileData: () => {},
});

export default ProfileContext;
