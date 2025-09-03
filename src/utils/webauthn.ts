import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';
import type { 
  WebAuthnRegistrationOptions, 
  WebAuthnAuthenticationOptions,
  BiometricAuthError 
} from '@/types/webauthn';

// Check if WebAuthn is supported
export const isWebAuthnSupported = (): boolean => {
  return browserSupportsWebAuthn();
};

// Check if platform authenticator (fingerprint/Face ID/Windows Hello) is available
export const isPlatformAuthenticatorAvailable = async (): Promise<boolean> => {
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
};

// Convert base64url to ArrayBuffer
export const base64urlToBuffer = (base64url: string): ArrayBuffer => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return buffer;
};

// Convert ArrayBuffer to base64url
export const bufferToBase64url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

// Create proper registration options for WebAuthn
export const createRegistrationOptions = (username: string) => {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));
  
  return {
    challenge: bufferToBase64url(challenge),
    rp: {
      name: 'Passkey Portals',
      id: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
    },
    user: {
      id: bufferToBase64url(userId),
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' as const },  // ES256
      { alg: -257, type: 'public-key' as const }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform' as const,
      userVerification: 'required' as const,
      residentKey: 'preferred' as const,
    },
    timeout: 60000,
    attestation: 'none' as const,
  };
};

// Create proper authentication options for WebAuthn
export const createAuthenticationOptions = () => {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  
  return {
    challenge: bufferToBase64url(challenge),
    timeout: 60000,
    rpId: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
    allowCredentials: [], // In real app, this would contain user's registered credentials
    userVerification: 'required' as const,
  };
};

// Handle WebAuthn registration with better error handling
export const handleBiometricRegistration = async (
  username: string
): Promise<{ success: boolean; credential?: any; error?: BiometricAuthError }> => {
  try {
    console.log('Starting biometric registration for:', username);
    
    if (!isWebAuthnSupported()) {
      throw new Error('WebAuthn is not supported on this device');
    }

    const platformAvailable = await isPlatformAuthenticatorAvailable();
    if (!platformAvailable) {
      throw new Error('Biometric authentication is not available on this device');
    }

    // Create proper options format for @simplewebauthn/browser
    const optionsJSON = createRegistrationOptions(username);
    console.log('Registration options:', optionsJSON);
    
    // Use the correct format for startRegistration
    const credential = await startRegistration({ optionsJSON });
    console.log('Registration successful:', credential);
    
    return { success: true, credential };
  } catch (error: any) {
    console.error('Registration failed:', error);
    
    const authError: BiometricAuthError = {
      name: error.name || 'RegistrationError',
      message: error.message || 'Failed to register biometric authentication',
      code: error.code,
    };
    
    return { success: false, error: authError };
  }
};

// Handle WebAuthn authentication with better error handling
export const handleBiometricAuthentication = async (
  username: string
): Promise<{ success: boolean; assertion?: any; error?: BiometricAuthError }> => {
  try {
    console.log('Starting biometric authentication for:', username);
    
    if (!isWebAuthnSupported()) {
      throw new Error('WebAuthn is not supported on this device');
    }

    // Create proper options format for @simplewebauthn/browser
    const optionsJSON = createAuthenticationOptions();
    console.log('Authentication options:', optionsJSON);
    
    // Use the correct format for startAuthentication
    const assertion = await startAuthentication({ optionsJSON });
    console.log('Authentication successful:', assertion);
    
    return { success: true, assertion };
  } catch (error: any) {
    console.error('Authentication failed:', error);
    
    const authError: BiometricAuthError = {
      name: error.name || 'AuthenticationError',
      message: error.message || 'Failed to authenticate with biometrics',
      code: error.code,
    };
    
    return { success: false, error: authError };
  }
};

// Get user-friendly error messages with iframe-specific handling
export const getWebAuthnErrorMessage = (error: BiometricAuthError): string => {
  switch (error.name) {
    case 'NotSupportedError':
      return 'Biometric authentication is not supported on this device';
    case 'NotAllowedError':
      if (error.message?.includes('feature is not enabled')) {
        return 'For full biometric authentication, please open this app in a new tab or deploy it to a custom domain';
      }
      return 'Biometric authentication was cancelled or timed out';
    case 'AbortError':
      return 'Authentication request was cancelled';
    case 'ConstraintError':
      return 'No suitable authenticator found';
    case 'InvalidStateError':
      return 'A credential with this ID already exists';
    case 'SecurityError':
      return 'Security requirements not met (HTTPS required)';
    default:
      return error.message || 'An unknown error occurred during biometric authentication';
  }
};