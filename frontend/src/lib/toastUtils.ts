import toast from "react-hot-toast";

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function showSuccess(message: string) {
  toast.success(message);
}

export function showError(error: unknown, fallback: string) {
  toast.error(getErrorMessage(error, fallback));
}

export function showUpgradeRequired(error: unknown) {
  toast.error(getErrorMessage(error, "Upgrade to PRO to unlock this feature."));
}
