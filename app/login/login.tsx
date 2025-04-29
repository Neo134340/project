// rafce
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
  } from "@clerk/clerk-react";
  
  const Login = () => {
    return (
      <div>
        Login
        <SignInButton />
      </div>
    );
  };
  
  export default Login;