import { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from '../data/auth';
import { useRouter } from "next/router"

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [profile, setProfile] = useState({})
  const [token, setToken] = useState("")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    if (storedToken) {
      getUserProfile().then((profileData) => {
        setProfile(profileData);
        setIsLoading(false); // Profile fetched, stop loading
      });
    } else {
      setIsLoading(false); // No token, stop loading
    }
  }, [token]);

  if (isLoading) return <div>Loading...</div>; // Optionally show a loading spinner

  return (
    <AppContext.Provider value={{ profile, token, setToken, setProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
