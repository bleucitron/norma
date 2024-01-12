import { error, redirect } from '@sveltejs/kit';

interface LoadContext {
    parent: () => Promise<{ 
        session: { user: { id: string } } | null;
        supabase: any;
    }>;
    depends: (key: string) => void;
  }
  
  export const load = async ({ parent, depends }: LoadContext) => {
    const { session, supabase } = await parent();
    const userId = session?.user?.id;
  
    depends('app:users');
  
    if (!userId) {
      throw redirect(307, '/login');
    }
  };
