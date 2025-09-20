"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AddCompany from "@/components/AddCompany";
import CompanyList from "@/components/CompanyList";


type User = {
  id: number;
  email: string;
  role: "ADMIN" | "SUBADMIN" | "USER";
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [content,setContent] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUBADMIN" | "USER">("USER");
  const [file,setFile] = useState<File | undefined >(undefined)
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    // Load user from localStorage (set after login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p className="text-center mt-10">Loading user...</p>;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role}),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
    

    setMessage(data.message || data.error);
  };
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    setFile(e.target.files?.[0])
  } 

  const handleCompanyAdd = async(e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();

    console.log({content,file})
    
  }
  return(
    <div className="flex flex-col item-center gap-4 ">
      <div className="px-3 py-2 flex w-full gap-2 items-center justify-end">
{user.role === "ADMIN" && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-white hover:text-black hover:border-black border-[1px]">Add Company</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="mb-4">
                  <DialogTitle>Add New Company</DialogTitle>
                </DialogHeader>
                  <AddCompany />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-white hover:text-black hover:border-black border-[1px]">Add New User</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader className="mb-4">
                    <DialogTitle>Add New User</DialogTitle>
                    
                  </DialogHeader>
                  <div className="flex flex-col gap-2">
                    <Label>Enter Email:</Label>
               <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border rounded"
                  />
                    <Label>Enter Password:</Label>

                  <Input
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
                  </div>
                 
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">  d User</Button>
                    {message && <p>{message}</p>}
                  </DialogFooter>
                </form>

              </DialogContent>

            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-white hover:text-black hover:border-black border-[1px]">All Companies</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="mb-4">
                  <DialogTitle>All Companies</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Here you can find a list of all companies.
                </DialogDescription>
                  <CompanyList />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
                </DialogContent>
            </Dialog>
          </>
        )}
      </div>
      <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
      <h2 className="text-lg">Role: {user.role}</h2>

      <div className="flex flex-col gap-2 mt-6">
  

        

        {user.role === "SUBADMIN" && (
          <>
            <button className="bg-blue-600 text-white p-2 rounded">Create a New Trade</button>

          </>
        )}

        {user.role === "USER" && (
          <button className="bg-blue-600 text-white p-2 rounded">Create a New Trade</button>

        )}
      </div>
    </div>
  );
}
