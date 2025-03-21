import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, User, Lock } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");
  const { setUserRole } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (username === "admin" && password === "admin123") {
        setUserRole("admin");
        toast({
          title: "Login successful",
          description: "Welcome back, Admin!"
        });
        navigate("/dashboard");
      } else if (username === "user" && password === "user123") {
        setUserRole("user");
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });
        navigate("/user-dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col h-screen w-full justify-center items-center bg-white">
      <div className="mb-8 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-white p-1 rounded-full">
            <img 
              src="/lovable-uploads/f4210512-c171-4ac1-aba7-91d1777e6989.png" 
              alt="University Logo" 
              className="h-24 w-24 mb-2 drop-shadow-lg"
            />
          </div>
          <div className="text-gray-800 text-center">
            <h1 className="text-2xl font-bold tracking-wide">NED UNIVERSITY</h1>
            <p className="text-sm tracking-wider">OF ENGINEERING & TECHNOLOGY</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95">
        <CardHeader className="space-y-1 bg-gray-600 rounded-t-lg py-4">
          <CardTitle className="text-2xl font-bold text-center text-white">
            NED Portal Login
          </CardTitle>
        </CardHeader>

        <Tabs defaultValue="admin" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="mt-0">
            <div className="px-6 pt-4 pb-2">
              <h3 className="text-xl text-gray-600 font-semibold flex items-center gap-2">
                Admin <User className="h-5 w-5" />
              </h3>
            </div>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-700" /> 
                    Portal ID
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter Portal ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="border-gray-300"
                  />
                  {activeTab === "admin" && (
                    <p className="text-xs text-muted-foreground">
                      Use "admin" for testing
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-700" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Password is case sensitive</p>
                    {activeTab === "admin" && (
                      <p className="text-xs text-muted-foreground">
                        Use "admin123" for testing
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-36 mx-auto bg-gray-600 hover:bg-gray-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="text-sm text-gray-600 hover:underline text-center w-full">
                  <a href="#">Recover Password | Sign Up</a>
                </div>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="user" className="mt-0">
            <div className="px-6 pt-4 pb-2">
              <h3 className="text-xl text-gray-600 font-semibold flex items-center gap-2">
                User <User className="h-5 w-5" />
              </h3>
            </div>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username-user" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-700" /> 
                    Portal ID
                  </Label>
                  <Input
                    id="username-user"
                    placeholder="Enter Portal ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="border-gray-300"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use "user" for testing
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-user" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-700" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password-user"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Password is case sensitive</p>
                    <p className="text-xs text-muted-foreground">
                      Use "user123" for testing
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-36 mx-auto bg-gray-600 hover:bg-gray-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="text-sm text-gray-600 hover:underline text-center w-full">
                  <a href="#">Recover Password | Sign Up</a>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
