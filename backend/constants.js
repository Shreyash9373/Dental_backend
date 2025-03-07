// cookieOptions.js
const maxAgeValues = {
  access: 15 * 60 * 1000, // 15 minutes in milliseconds
  refresh: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

const cookieOptions = (tokenType) => {
    if (!['access', 'refresh'].includes(tokenType)) {
      throw new Error("Invalid token type. Must be 'access' or 'refresh'.");
    }
  
    
  
    return {
      httpOnly: true, // Ensures the cookie is only accessible via HTTP(S), not JavaScript
      secure: true, // Sends cookie over HTTPS in production
      sameSite: 'none', // Prevents CSRF attacks
      // maxAge: maxAgeValues[tokenType], // Sets the expiration time based on the token type
    };
  };
  
   export default cookieOptions;
  