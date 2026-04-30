import { BicepsFlexed } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
// import { UserButton } from "@neondatabase/neon-js/auth/react/ui";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-[var(--color-foreground)]"
        >
          <BicepsFlexed className="w-6 h-6 text-[var(--color-accent)]" />
          <span className="font-semibold text-lg">Train.AI</span>
        </Link>

        <nav>
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/onboarding">
                <Button variant="secondary" size="sm">
                  New Plan
                </Button>
              </Link>

              <Link to="/profile">
                <Button variant="secondary" size="sm">
                  My Plan
                </Button>
              </Link>
              {/* <UserButton className="bg-(--color-accent)" /> */}

              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth/sign-in">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
