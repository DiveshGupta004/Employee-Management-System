"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  username: z.string().min(2, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export default function Login() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: values.username, password: values.password }),
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Invalid credentials!")
        setLoading(false)
        return
      }

      const validateRes = await fetch("http://localhost:5000/api/auth/validate", {
        method: "GET",
        credentials: "include",
      })
      const validateData = await validateRes.json()

      setLoading(false)

      if (validateData.isAdmin) {
        navigate("/dashboard")
      } else {
        navigate("/employee/dashboard")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-200 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login</h2>

        {error && <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-100">Username</FormLabel>
                  <FormControl>
                    <Input className="bg-white dark:bg-neutral-800 dark:text-white" placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-100">Password</FormLabel>
                  <FormControl>
                    <Input className="bg-white dark:bg-neutral-800 dark:text-white" type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-sm text-blue-500 hover:underline dark:text-blue-400">
                Forgot Password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}