interface SessionType {
    uuid: string;
    deviceId: string;
    deviceType: string;
    user: {
        uuid: string;
        email: string;
        name: string;
    };
    ip: string;
    expiresAt: string;
    created_at: string;
}

interface OtpType {
    uuid: string;
    otp: number;
    email: string;
    expiresAt: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface SessionState {
    sessions: SessionType[];
    otps: OtpType[];
    expiresAt: any;
    loading: boolean;
    error: string | null;
}