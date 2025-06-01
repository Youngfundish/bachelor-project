'use client'
import { useEffect, useState } from 'react';
import {redirect, useRouter} from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {signIn, useSession} from "next-auth/react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Dumbbell, Eye, EyeOff} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link";
import { loginSchema } from '@/types/login'
import { toast } from 'sonner';



// Your existing login schema
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

type LoginSchema = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('registered') === '1') {
      toast.success('Account created successfully!')
    }
  }, [])
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      });

      if (result?.error) {
        toast.error('Login failed');
        return; // correctly inside if-block now
      }
    
      // Successful login
      toast.success('Login successful');
      router.push('/');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Network error', {
        description: 'Unable to connect to the server. Please check your internet connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-400 to-black">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Dumbbell className="h-12 w-12 text-primary"/>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Login to Helperly</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to get access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register('email')}
                  />
                  {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register('password')}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500"/>
                      ) : (
                          <Eye className="h-4 w-4 text-gray-500"/>
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </div>
              </div>
              <Toaster/>
              <Button
                  className="w-full mt-6"
                  type="submit"
                  disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button variant="link" className="text-sm text-muted-foreground">
              Forgot your password?
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link href="/register" passHref>
                <Button variant="link" className="p-0 h-auto font-semibold">
                  Sign up
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
  );
}