import { useState, type Dispatch, type SetStateAction } from "react";
import type { AdminUserAccount, DriverUserAccount } from "../../../shared/types";
import { default_values } from "../../../shared/context/AuthContext";
import useAuth from "../../../shared/hooks/useAuth";

const UserSignupForm: React.FC<{ role: string, setIsLogin: Dispatch<SetStateAction<boolean>> }> = ({ role, setIsLogin }) => {
  const [userData, setUserData] = useState<AdminUserAccount>(default_values.admin)
  const { register } = useAuth()

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const cloneObject = JSON.parse(JSON.stringify(userData))
    delete cloneObject.id;
    if(role === 'driver') {
      delete cloneObject.status;
      delete cloneObject.currentLoc
    }

    register(role,cloneObject,(updatedFormState:boolean) =>{
      setIsLogin(updatedFormState)
    })
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="First Name"
          className="w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          name='firstName'
          value={userData.firstName}
          onChange={(event) => setUserData((prev) => {
            return {
              ...prev,
              firstName: event.target.value
            }
          })}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          name='lastName'
          value={userData.lastName}
          onChange={(event) => setUserData((prev) => {
            return {
              ...prev,
              lastName: event.target.value
            }
          })}
        />
      </div>
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        name='email'
        value={userData.email}
        onChange={(event) => setUserData((prev) => {
          return {
            ...prev,
            email: event.target.value
          }
        })}
      />
      <input
        type="number"
        placeholder="Phone"
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        name="phone"
        value={userData.phone}
        onChange={(event) => {
          const value = event.target.value;
          setUserData((prev) => ({
            ...prev,
            phone: Number(value)
          }));
        }}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        name='password'
        value={userData.password}
        onChange={(event) => setUserData((prev) => {
          return {
            ...prev,
            password: event.target.value
          }
        })}
      />
      <button
        type="submit"
        className="w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-700 transition"
      >
        {role === 'driver' ? 'Sign up as Driver' : 'Sign up'}
      </button>
    </form>
  );
}

export default UserSignupForm