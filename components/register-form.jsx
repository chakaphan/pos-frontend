"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"

export function RegisterForm() {
  const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handlerRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    try{
        const registerRes = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,{
            username: formData.email,
            email: formData.email,
            password: formData.password
        })

        const jwt = registerRes.data.jwt;
        const userId = registerRes.data.user.id;

        await axios.put(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`,
            {
                firstName: formData.firstName,
                lastName: formData.lastName,
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            }
        );

        const res = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
        })

        if(!res?.error){
            router.replace("/dashboard");
        }else{
            toast.error("Login failed after registration. Please try again.")
        }
    } catch (error){
        toast.error(error.response?.data?.error?.message || "Registration failed. Please try again.");
    } finally {
        setLoading(false);
    }
  }

  return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register</CardTitle>
          <CardDescription>
            Please enter your details to register.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlerRegister} className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handlerChange} 
                  type="text" 
                  placeholder="firstName" 
                  required 
                />
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handlerChange} 
                  type="text" 
                  placeholder="lastName" 
                  required 
                />
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handlerChange} 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handlerChange} 
                  type="password" 
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
  );
}
