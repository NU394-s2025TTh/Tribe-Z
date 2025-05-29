import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    User,
} from 'firebase/auth';
import { Button } from '../ui/button';
import React from 'react';
import { app } from '@/lib/firebase';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function ProfileNav() {
    const [showProfileMenu, setShowProfileMenu] = React.useState(false); // State to control profile menu visibility
    const [user, setUser] = React.useState<User | null>(null); // State to hold the user object
    const handleGoogleSignIn = async () => {
        try {
          if (user) {
            console.log('User is already signed in:', user);
            return; // If the user is already signed in, do nothing
          }
    
          const result = await signInWithPopup(auth, provider);
          const signedInUser = result.user;
          console.log('User signed in:', signedInUser);
          setUser(signedInUser); // Update the user state
        } catch (error) {
          console.error('Error signing in with Google:', error);
        }
      };
    
      const handleSignOut = async () => {
        try {
          await signOut(auth);
          console.log('User signed out');
          setUser(null); // Clear the user from state
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };

    return(
    <div className="flex-1 flex justify-end align-middle gap-4 m-4">
        <div className="relative inline-block">
          {!user && (
            <Button
              onClick={handleGoogleSignIn}
              className="rounded-md px-4 py-4 justify-self-end button-pointer"
              variant="outline"
            >
              Sign In
            </Button>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <img
                  src={user.photoURL || ''}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  referrerPolicy="no-referrer"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuLabel>
                  <b>My Account</b>
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Button
                    onClick={handleSignOut}
                    variant="secondary"
                    className=" text-gray-700 bg-cream hover:bg-red-700 hover:border-gray-200 hover:text-white"
                  >
                    Sign Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
    </div>
    );
}

export default ProfileNav;