const PASSWORD_RECOVERY_SESSION_KEY = "password_recovery_session";
const PASSWORD_RECOVERY_TTL_MS = 10 * 60 * 1000;

type PasswordRecoverySessionPayload = {
  email: string;
  verificationCode: string;
  expiresAt: number;
};

type PasswordRecoverySessionData = {
  email: string;
  verificationCode: string;
};

const isValidPayload = (
  payload: unknown
): payload is PasswordRecoverySessionPayload => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as PasswordRecoverySessionPayload;
  return (
    typeof candidate.email === "string" &&
    typeof candidate.verificationCode === "string" &&
    typeof candidate.expiresAt === "number"
  );
};

const clear = (): void => {
  sessionStorage.removeItem(PASSWORD_RECOVERY_SESSION_KEY);
};

const save = (email: string, verificationCode: string): void => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedVerificationCode = verificationCode.trim();

  if (!normalizedEmail || !normalizedVerificationCode) {
    clear();
    return;
  }

  const payload: PasswordRecoverySessionPayload = {
    email: normalizedEmail,
    verificationCode: normalizedVerificationCode,
    expiresAt: Date.now() + PASSWORD_RECOVERY_TTL_MS
  };

  sessionStorage.setItem(
    PASSWORD_RECOVERY_SESSION_KEY,
    JSON.stringify(payload)
  );
};

const get = (): PasswordRecoverySessionData | null => {
  const storedValue = sessionStorage.getItem(PASSWORD_RECOVERY_SESSION_KEY);
  if (!storedValue) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(storedValue) as unknown;
    if (!isValidPayload(parsedPayload)) {
      clear();
      return null;
    }

    if (Date.now() > parsedPayload.expiresAt) {
      clear();
      return null;
    }

    return {
      email: parsedPayload.email,
      verificationCode: parsedPayload.verificationCode
    };
  } catch {
    clear();
    return null;
  }
};

export const PasswordRecoverySessionHelper = {
  save,
  get,
  clear
};
