"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  role: "ADMIN" | "SUBADMIN" | "USER";
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage (set after login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p className="text-center mt-10">Loading user...</p>;

  return (
    <div className="flex flex-col items-center gap-4 mt-20">
      <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
      <h2 className="text-lg">Role: {user.role}</h2>

      <div className="flex flex-col gap-2 mt-6">
        {user.role === "ADMIN" && (
          <>
            <button className="bg-blue-600 text-white p-2 rounded">Admin Button 1</button>
            <button className="bg-blue-600 text-white p-2 rounded">Admin Button 2</button>
            <button className="bg-blue-600 text-white p-2 rounded">Admin Button 3</button>
          </>
        )}

        {user.role === "SUBADMIN" && (
          <>
            <button className="bg-green-600 text-white p-2 rounded">SubAdmin Button 1</button>
            <button className="bg-green-600 text-white p-2 rounded">SubAdmin Button 2</button>
          </>
        )}

        {user.role === "USER" && (
          <button className="bg-purple-600 text-white p-2 rounded">User Button</button>
        )}
      </div>
    </div>
  );
}
