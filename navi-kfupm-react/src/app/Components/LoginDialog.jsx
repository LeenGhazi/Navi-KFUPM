import React, { useState } from 'react';
import { useAuth } from "../../AuthContext";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from './ui/dialog';
import { toast } from 'sonner';
import { mockUsers } from '../../mockData';
import { User, Shield, Wrench, ArrowLeft } from 'lucide-react';
export function LoginDialog({ open, onOpenChange, onSwitchToRegister }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginType, setLoginType] = useState(null);
    const handleLogin = (e) => {
        e.preventDefault();
        // Find the user by email
        const foundUser = mockUsers.find((u) => u.email === email);
        if (!foundUser) {
            toast.error('Invalid credentials');
            return;
        }
        // Validate that user role matches the selected login type
        let expectedRole = null;
        let loginTypeLabel = '';
        if (loginType === 'user') {
            expectedRole = 'student';
            loginTypeLabel = 'User';
        }
        else if (loginType === 'admin') {
            expectedRole = 'admin';
            loginTypeLabel = 'KFUPM Administrator';
        }
        else if (loginType === 'technical_admin') {
            expectedRole = 'maintenance_staff';
            loginTypeLabel = 'Technical Admin';
        }
        if (foundUser.role !== expectedRole) {
            toast.error(`These credentials do not have ${loginTypeLabel} access. Please use the correct login option.`);
            return;
        }
        // Proceed with login
        if (login(email, password)) {
            toast.success('Login successful!');
            onOpenChange(false);
            setEmail('');
            setPassword('');
            setLoginType(null);
        }
        else {
            toast.error('Invalid credentials');
        }
    };
    const handleBack = () => {
        setLoginType(null);
        setEmail('');
        setPassword('');
    };
    const handleDialogChange = (open) => {
        onOpenChange(open);
        if (!open) {
            // Reset state when dialog closes
            setLoginType(null);
            setEmail('');
            setPassword('');
        }
    };
    return (<Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to Navi-KFUPM</DialogTitle>
          <DialogDescription>
            {loginType === null
            ? 'Select your account type to continue'
            : 'Enter your credentials to access personalized features'}
          </DialogDescription>
        </DialogHeader>

        {loginType === null ? (
        // Step 1: Select login type
        <div className="space-y-3">
            <Button variant="outline" className="w-full h-auto py-4 flex items-center gap-3 justify-start" onClick={() => setLoginType('user')}>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600"/>
              </div>
              <div className="text-left">
                <div className="font-semibold">Log in as User</div>
                <div className="text-xs text-muted-foreground">Students, faculty, and visitors</div>
              </div>
            </Button>

            <Button variant="outline" className="w-full h-auto py-4 flex items-center gap-3 justify-start" onClick={() => setLoginType('admin')}>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600"/>
              </div>
              <div className="text-left">
                <div className="font-semibold">Log in as KFUPM Administrator</div>
                <div className="text-xs text-muted-foreground">Content and data management</div>
              </div>
            </Button>

            <Button variant="outline" className="w-full h-auto py-4 flex items-center gap-3 justify-start" onClick={() => setLoginType('technical_admin')}>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-orange-600"/>
              </div>
              <div className="text-left">
                <div className="font-semibold">Log in as Technical Admin</div>
                <div className="text-xs text-muted-foreground">System operations and maintenance</div>
              </div>
            </Button>
          </div>) : (
        // Step 2: Enter credentials
        <form onSubmit={handleLogin} className="space-y-4">
            <Button type="button" variant="ghost" size="sm" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4"/>
              Back to login options
            </Button>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@kfupm.edu.sa" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <div className="font-medium mb-1">Demo accounts:</div>
              <ul className="space-y-0.5 text-xs">
                {loginType === 'user' && (<li>• s201900001@kfupm.edu.sa (User)</li>)}
                {loginType === 'admin' && (<li>• admin@kfupm.edu.sa (KFUPM Administrator)</li>)}
                {loginType === 'technical_admin' && (<li>• maintenance@kfupm.edu.sa (Technical Admin)</li>)}
              </ul>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>)}
      </DialogContent>
    </Dialog>);
}
