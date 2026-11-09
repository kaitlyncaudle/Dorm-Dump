import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { rememberDestination, useAuth } from '@/lib/auth';

/**
 * Inline "sign in to do this" prompt for visitors who are only browsing.
 * Returns true when the action may go ahead, false when the sign-in prompt
 * was shown instead.
 */
export function useRequireAccount() {
  const { signedIn } = useAuth();
  const navigate = useNavigate();
  return (title: string, description: string, backTo = '/saved') => {
    if (signedIn) return true;
    rememberDestination(backTo);
    toast(title, {
      description,
      action: { label: 'Sign in', onClick: () => void navigate({ to: '/auth' }) },
    });
    return false;
  };
}
