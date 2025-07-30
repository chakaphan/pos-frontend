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
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handlerLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    })

    if(res?.ok){
      toast.success("Logged in successfully");
      router.push("/dashboard");
    }else{
      toast.error("Invalid credentials");
    }

    setLoading(false);
  }

  return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>
            Please enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlerLogin} className="grid gap-6">
              <div className="grid gap-3">
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
                {loading ? "Logging in..." : "Login"}
              </Button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
  );
}
