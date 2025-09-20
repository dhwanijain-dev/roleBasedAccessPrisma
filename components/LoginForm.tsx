"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUBADMIN" | "USER">("USER");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      // store user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      // redirect to home
      router.push("/home");
    } else {
      setMessage(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded-xl shadow-md w-80">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "ADMIN" | "SUBADMIN" | "USER")}
        className="p-2 border rounded"
      >
        <option value="ADMIN">Admin</option>
        <option value="SUBADMIN">Subadmin</option>
        <option value="USER">User</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Login
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
