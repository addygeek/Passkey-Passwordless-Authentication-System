export interface WebAuthnRegistrationOptions {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    alg: number;
    type: string;
  }>;
  authenticatorSelection: {
    authenticatorAttachment: 'platform' | 'cross-platform';
    userVerification: 'required' | 'preferred' | 'discouraged';
    residentKey: 'required' | 'preferred' | 'discouraged';
  };
  timeout: number;
  attestation: 'none' | 'indirect' | 'direct';
}

export interface WebAuthnAuthenticationOptions {
  challenge: string;
  timeout: number;
  rpId: string;
  allowCredentials: Array<{
    id: string;
    type: string;
    transports?: string[];
  }>;
  userVerification: 'required' | 'preferred' | 'discouraged';
}

export interface WebAuthnCredential {
  id: string;
  rawId: ArrayBuffer;
  response: {
    attestationObject?: ArrayBuffer;
    clientDataJSON: ArrayBuffer;
    authenticatorData?: ArrayBuffer;
    signature?: ArrayBuffer;
    userHandle?: ArrayBuffer;
  };
  type: string;
}

export interface BiometricAuthError {
  name: string;
  message: string;
  code?: string;
}