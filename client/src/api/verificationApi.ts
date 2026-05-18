
import type { ResSimple, ResVerificationStatus } from "@shared/core";
import { apiAuth } from "./authApi";

export const verificationApi = {  
  resendVerificationEmail: ({ email }: { email: string }): Promise<ResSimple> =>
    apiAuth.post("/verification/resend", { email }).then((res) => res.data),

  checkVerificationStatus: ({ email }: { email: string }): Promise<ResVerificationStatus> =>
    apiAuth.get("/verification/check-status", { params: { email } }).then((res) => res.data),
};

