import { useState } from "react";
import useAuth from "../../../shared/hooks/useAuth";
import { useNavigate } from "react-router";
import type { LoginCredential } from "../../../shared/types";

const UserLoginForm: React.FC<{ role: string }> = ({ role }) => {
    const navigate = useNavigate()
    const [credential, setCredential] = useState<LoginCredential>({email: '', password: ''})
    const { login } = useAuth();

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        login(role,credential,navigate)
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                name="email"
                value={credential.email}
                onChange={(event) => setCredential((prev) => {
                    return {
                        ...prev,
                        email: event.target.value
                    }
                })}
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                name="password"
                value={credential.password}
                onChange={(event) => setCredential((prev) => {
                    return {
                        ...prev,
                        password: event.target.value
                    }
                })}
            />
            <button
                type="submit"
                className="hover:cursor-pointer  w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-700 transition"
            >
                { role === 'driver' ? 'Login as Driver' : 'Login' }
            </button>
        </form>
    );
}
export default UserLoginForm