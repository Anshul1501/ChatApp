import React from 'react';
import { RiLogoutBoxLine } from "react-icons/ri";
import useLogoutUser from '../../hooks/useLogoutUser';

const LogoutButton = () => {
   const { loading, logout } = useLogoutUser();
   
   return (
     <div className='mt-auto'>
         {!loading ? (
           <RiLogoutBoxLine className='w-6 h-6 text-white cursor-pointer'
           onClick={logout} // Corrected the typo here
           />
         ) : (
           <span className="loading loading-spinner"></span>
         )}
     </div>
   );
}

export default LogoutButton;
