import { useState, useEffect } from 'react'
import UserLoginForm from '../Components/UserLoginForm';
import UserSignupForm from '../Components/UserSignupForm';
import useAuth from '../../../shared/hooks/useAuth';
import type { RoleType } from '../../../shared/types';
import { useNavigate } from 'react-router';

const AuthTemplate = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { role, setRole } = useAuth();
  const { trackingId, setTrackingId, fetchDelivery } = useAuth();

  const [showNotice, setShowNotice] = useState(false);   // <-- new

  const navigate = useNavigate();

  const handleTracking = () => fetchDelivery(trackingId, (path: string) => navigate(path));

  // Show bubble after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotice(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center mt-24 md:mt-0 md:justify-center">

      {/* Notice Bubble */}
      {showNotice && (
        <div className="fixed bottom-6 right-6 max-w-xs bg-neutral-900 text-white p-4 rounded-xl shadow-lg text-sm animate-fadeIn z-50">
          <p>
            The server is sometimes on sleep due to inactivity on free deployment,
            plz wait for 60 seconds and try again if it doesn't work.
          </p>

          <button
            onClick={() => setShowNotice(false)}
            className="mt-2 text-xs text-gray-300 hover:underline"
          >
            Close
          </button>
        </div>
      )}

      <span className="text-6xl font-bold mb-14">GoParcel</span>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
        </div>

        <div className="flex justify-end items-center gap-x-2 mt-4 px-8">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleType)}
            className="hover:cursor-pointer px-2 py-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-400"
          >
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className="px-8 py-6">
          {role !== 'user' ? (
            isLogin ? (
              <UserLoginForm role={role}/>
            ) : (
              <UserSignupForm role={role} setIsLogin={setIsLogin} />
            )
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-0.5">
                <label htmlFor="trackingId" className="text-base font-medium">Tracking ID</label>
                <input 
                  type="text" 
                  name="trackingId" 
                  onChange={(event) => setTrackingId(event.target.value)}
                  value={trackingId}
                  className='w-full px-4 py-3 border rounded-lg' 
                />
              </div>
              <button
                onClick={handleTracking}
                className="hover:cursor-pointer w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-700 transition"
              >
                Track your delivery
              </button>
            </div>
          )}

          <p className="hover:cursor-pointer text-center text-sm text-gray-600 mt-6">
            {role !== 'user' && (isLogin ? "Don’t have an account?" : "Already have an account?")}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className=" text-indigo-600 font-medium hover:underline hover:cursor-pointer"
            >
              {role !== 'user' && (isLogin ? "Sign up" : "Login")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthTemplate;
