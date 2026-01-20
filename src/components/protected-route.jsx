import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { isSignedIn, user, isLoaded } = useUser();
    const { pathname } = useLocation();

    console.log("Protected Route Check:", { isLoaded, isSignedIn, user, pathname });

    if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
        console.log("Not signed in, redirecting to home with sign-in=true");
        return <Navigate to="/?sign-in=true" />;
    }

    if (isLoaded && isSignedIn && !user?.unsafeMetadata?.role && pathname !== "/onboarding") {
        console.log("User has no role, redirecting to onboarding");
        return <Navigate to="/onboarding" />;
    }

    return children;
};

export default ProtectedRoute;
