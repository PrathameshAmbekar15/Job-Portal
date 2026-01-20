import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, isLoaded, isSignedIn } = useUser();

  // Open sign-in modal if ?sign-in=true exists
  useEffect(() => {
    if (searchParams.get("sign-in") === "true") {
      setShowSignIn(true);
    }
  }, [searchParams]);

  const closeModal = () => {
    setShowSignIn(false);
    searchParams.delete("sign-in");
    setSearchParams(searchParams, { replace: true });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/">
          <img src="/logo.png" className="h-20" alt="Logo" />
        </Link>

        <div className="flex gap-6 items-center">
          {/* Logged out */}
          <SignedOut>
            <Button
              variant="outline"
              onClick={() => setShowSignIn(true)}
            >
              Login
            </Button>
          </SignedOut>

          {/* Logged in */}
          <SignedIn>
            {isLoaded && isSignedIn && user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={18} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {/* Sign In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleOverlayClick}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SignIn />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
