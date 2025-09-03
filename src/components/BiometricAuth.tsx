import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Shield, Scan, CheckCircle, AlertCircle, Loader2, Smartphone, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  handleBiometricRegistration, 
  handleBiometricAuthentication,
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  getWebAuthnErrorMessage
} from '@/utils/webauthn';
import BankingDashboard from './BankingDashboard';
import fingerprintIcon from '@/assets/fingerprint-icon.png';

type AuthState = 'idle' | 'scanning' | 'success' | 'error';
type AuthMode = 'login' | 'register';

const BiometricAuth = () => {
  const [username, setUsername] = useState('');
  const [authState, setAuthState] = useState<AuthState>('idle');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isSupported, setIsSupported] = useState(false);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSupport = async () => {
      const webauthnSupported = isWebAuthnSupported();
      const platformAvailable = await isPlatformAuthenticatorAvailable();
      
      setIsSupported(webauthnSupported);
      setIsPlatformAvailable(platformAvailable);
      
      // Check if running in iframe (like Lovable sandbox)
      const isInIframe = window !== window.top;
      
      if (!webauthnSupported) {
        toast({
          title: "WebAuthn Not Supported",
          description: "Your browser doesn't support biometric authentication",
          variant: "destructive"
        });
      } else if (!platformAvailable) {
        toast({
          title: "Biometrics Unavailable",
          description: "No biometric authenticators found on this device",
          variant: "destructive"
        });
      } else if (isInIframe) {
        toast({
          title: "Limited Sandbox Mode",
          description: "For full biometric testing, open in a new tab or deploy to a domain",
        });
      }
    };
    
    checkSupport();
  }, [toast]);

  const performBiometricAuth = async () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to continue",
        variant: "destructive"
      });
      return;
    }

    if (!isSupported || !isPlatformAvailable) {
      toast({
        title: "Authentication Unavailable",
        description: "Biometric authentication is not available on this device",
        variant: "destructive"
      });
      return;
    }

    setAuthState('scanning');
    
    try {
      let result;
      
      if (authMode === 'register') {
        result = await handleBiometricRegistration(username);
      } else {
        result = await handleBiometricAuthentication(username);
      }
      
      if (result.success) {
        setAuthState('success');
        toast({
          title: authMode === 'login' ? "Login Successful" : "Registration Complete",
          description: `Biometric ${authMode} completed for ${username}`,
        });
        
        // If login successful, show banking dashboard
        if (authMode === 'login') {
          setTimeout(() => {
            setIsLoggedIn(true);
          }, 1500);
        } else {
          setTimeout(() => setAuthState('idle'), 3000);
        }
      } else {
        setAuthState('error');
        const errorMessage = result.error ? getWebAuthnErrorMessage(result.error) : 'Unknown error occurred';
        console.log('Error details:', result.error);
        toast({
          title: "Authentication Failed",
          description: errorMessage,
          variant: "destructive"
        });
        setTimeout(() => setAuthState('idle'), 3000);
      }
    } catch (error: any) {
      setAuthState('error');
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      setTimeout(() => setAuthState('idle'), 3000);
    }
  };

  const getStateIcon = () => {
    switch (authState) {
      case 'scanning':
        return <Loader2 className="w-8 h-8 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Fingerprint className="w-8 h-8 text-primary" />;
    }
  };

  const getDeviceType = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobile ? 'mobile' : 'desktop';
  };

  const getBiometricTypeText = () => {
    const deviceType = getDeviceType();
    if (deviceType === 'mobile') {
      return 'Fingerprint / Face ID';
    } else {
      const isWindows = /Windows/i.test(navigator.userAgent);
      const isMac = /Mac/i.test(navigator.userAgent);
      if (isWindows) return 'Windows Hello';
      if (isMac) return 'Touch ID / Face ID';
      return 'Biometric Authentication';
    }
  };

  const getStateMessage = () => {
    const biometricType = getBiometricTypeText();
    switch (authState) {
      case 'scanning':
        return authMode === 'login' ? `Authenticating with ${biometricType}...` : `Registering ${biometricType}...`;
      case 'success':
        return authMode === 'login' ? 'Authentication successful!' : 'Registration complete!';
      case 'error':
        return 'Authentication failed. Please try again.';
      default:
        return authMode === 'login' ? `Ready to authenticate with ${biometricType}` : `Ready to register ${biometricType}`;
    }
  };

  const getDeviceIcon = () => {
    const deviceType = getDeviceType();
    return deviceType === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthState('idle');
    setUsername('');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  // If user is logged in, show banking dashboard
  if (isLoggedIn) {
    return <BankingDashboard username={username} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full gradient-biometric flex items-center justify-center biometric-glow">
                <Shield className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 rounded-full gradient-scan opacity-30"></div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Passkey Portals
            </h1>
            <p className="text-muted-foreground">Secure biometric authentication</p>
          </div>
        </div>

        {/* Device Support Status */}
        {(!isSupported || !isPlatformAvailable) && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">
                  {!isSupported 
                    ? "WebAuthn not supported in this browser"
                    : "No biometric authenticators available"
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auth Mode Toggle */}
        <div className="flex rounded-lg p-1 bg-secondary">
          <Button
            variant={authMode === 'login' ? 'default' : 'ghost'}
            onClick={() => setAuthMode('login')}
            className="flex-1"
          >
            Login
          </Button>
          <Button
            variant={authMode === 'register' ? 'default' : 'ghost'}
            onClick={() => setAuthMode('register')}
            className="flex-1"
          >
            Register
          </Button>
        </div>

        {/* Main Auth Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              {getStateIcon()}
              {authMode === 'login' ? 'Biometric Login' : 'Biometric Registration'}
            </CardTitle>
            <CardDescription>
              {getStateMessage()}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={authState === 'scanning'}
                className="bg-input/50"
              />
            </div>

            {/* Biometric Scanner Visual */}
            <div className="flex justify-center py-4">
              <div className="relative">
                <div 
                  className={`w-32 h-32 rounded-full border-2 border-primary/30 flex items-center justify-center transition-all duration-500 ${
                    authState === 'scanning' ? 'scan-animation biometric-glow' : ''
                  } ${authState === 'success' ? 'border-green-500' : ''} ${
                    authState === 'error' ? 'border-red-500' : ''
                  }`}
                >
                  <img 
                    src={fingerprintIcon} 
                    alt="Fingerprint" 
                    className={`w-16 h-16 opacity-70 transition-all duration-500 ${
                      authState === 'scanning' ? 'fingerprint-scan' : ''
                    }`}
                  />
                </div>
                {authState === 'scanning' && (
                  <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping"></div>
                )}
              </div>
            </div>

            {/* Auth Button */}
            <Button
              onClick={performBiometricAuth}
              disabled={authState === 'scanning' || !username.trim() || !isSupported || !isPlatformAvailable}
              className="w-full gradient-biometric text-primary-foreground hover:opacity-90 transition-opacity"
              size="lg"
            >
              {authState === 'scanning' ? (
                <>
                  <Scan className="w-4 h-4 mr-2 animate-pulse" />
                  {authMode === 'login' ? 'Authenticating...' : 'Registering...'}
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 mr-2" />
                  {authMode === 'login' ? `Login with ${getBiometricTypeText()}` : `Register ${getBiometricTypeText()}`}
                </>
              )}
            </Button>

            {/* Security Features */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  WebAuthn
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Fingerprint className="w-3 h-3 mr-1" />
                  Passkey
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {getDeviceIcon()}
                  <span className="ml-1">{getBiometricTypeText()}</span>
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🔒 Zero Password
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="border-border/30 bg-secondary/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Your biometric data stays secure on your device
              </p>
              <p className="text-xs text-muted-foreground/80">
                No passwords • No SMS codes • Just you
              </p>
              {isSupported && isPlatformAvailable && (
                <p className="text-xs text-primary/80">
                  ✓ {getBiometricTypeText()} ready on this device
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BiometricAuth;