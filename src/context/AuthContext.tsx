import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TrainingPlan, User, UserProfile } from "../types";
import { authClient } from "../lib/auth";
import { api } from "../lib/api";

interface AuthContextType {
  user: User | null;
  plan: TrainingPlan | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  saveProfile: (
    profile: Omit<UserProfile, "userId" | "updatedAt">,
  ) => Promise<void>;
  generatePlan: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [neonUser, setNeonUser] = useState<any>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRefreshingRef = useRef(false);

  // useEffect(() => {
  //   async function loadUser() {
  //     try {
  //       const result = await authClient.getSession();
  //       if (result && result.data?.user) {
  //         setNeonUser(result.data.user);
  //         console.log("AuthContext: User loaded, isLoading set to false");
  //       } else {
  //         setNeonUser(null);
  //       }
  //     } catch (err) {
  //       setNeonUser(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   loadUser();
  // }, []);

  const refreshAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      const result = await authClient.getSession();
      console.log("refreshAuth result:", result);

      if (result?.data?.user) {
        setNeonUser(result.data.user);
      } else {
        setNeonUser(null);
        setPlan(null);
      }
    } catch (err) {
      setNeonUser(null);
      setPlan(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // refreshData memoize
  const refreshData = useCallback(async () => {
    if (!neonUser || isRefreshingRef.current) return;

    isRefreshingRef.current = true;

    try {
      const planData = await api.getCurrentPlan(neonUser.id).catch(() => null);
      if (planData) {
        setPlan({
          id: planData.id,
          userId: planData.userId,
          overview: planData.planJson.overview,
          weeklySchedule: planData.planJson.weeklySchedule,
          progression: planData.planJson.progression,
          version: planData.version,
          createdAt: planData.createdAt,
        });
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [neonUser?.id]);

  useEffect(() => {
    if (!isLoading) {
      if (neonUser?.id) {
        refreshData();
        console.log("AuthContext: User ID detected, refreshing data");
      } else {
        setPlan(null);
      }
    }
  }, [neonUser?.id, isLoading, refreshData]);

  async function saveProfile(
    profileData: Omit<UserProfile, "userId" | "updatedAt">,
  ) {
    if (!neonUser) {
      throw new Error("User must be authenticated to save profile");
    }

    await api.saveProfile(neonUser.id, profileData);
    await refreshData();
  }

  async function generatePlan() {
    if (!neonUser) {
      throw new Error("User must be authenticated to generate plan");
    }

    await api.generatePlan(neonUser.id);
    await refreshData();
  }

  async function signOut() {
    try {
      await authClient.signOut();
    } finally {
      setNeonUser(null);
      setPlan(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: neonUser,
        plan,
        isLoading,
        signOut,
        saveProfile,
        generatePlan,
        refreshData,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
