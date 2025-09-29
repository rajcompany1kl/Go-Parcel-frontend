import React, { useState } from 'react'
import DriverSignupForm from '../Components/UserSignupForm';
import UserLoginForm from '../Components/UserLoginForm';
import UserSignupForm from '../Components/UserSignupForm';

const AuthTemplate = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"driver" | "admin">("driver");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <span className="text-6xl font-bold mb-14">Commute</span>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
        </div>

       <div className="flex justify-end items-center gap-x-2 mt-4 px-8">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "driver" | "admin")}
          className="px-2 py-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-400"
        >
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>
      </div>


        {/* Form */}
        <div className="px-8 py-6">
          {isLogin ? <UserLoginForm role={role}/> : <UserSignupForm role={role} setIsLogin={setIsLogin} />}

          {/* Toggle */}
          <p className="text-center text-sm text-gray-600 mt-6">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );

}

export default AuthTemplate