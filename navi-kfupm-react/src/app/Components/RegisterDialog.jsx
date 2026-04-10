import React, { useState } from 'react';
import { useAuth } from "../../AuthContext";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from './ui/dialog';
import { toast } from 'sonner';
export function RegisterDialog({ open, onOpenChange, onSwitchToLogin }) {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const handleRegister = (e) => {
        e.preventDefault();
        // Always register as student - admins and maintenance staff have pre-created accounts
        if (register(email, password, name, 'student')) {
            toast.success('Registration successful!');
            onOpenChange(false);
            setEmail('');
            setPassword('');
            setName('');
        }
        else {
            toast.error('Registration failed. Please try again.');
        }
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for Navi-KFUPM</DialogTitle>
          <DialogDescription>
            Create an account to access personalized features.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="Ahmed Al-Otaibi" value={name} onChange={(e) => setName(e.target.value)} required/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input id="register-email" type="email" placeholder="your.email@kfupm.edu.sa" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input id="register-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Register
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => {
            onOpenChange(false);
            onSwitchToLogin();
        }}>
              Login Instead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);
}
