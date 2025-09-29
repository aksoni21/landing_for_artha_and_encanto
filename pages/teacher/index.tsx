import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Simple redirect to overview page
export default function TeacherIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/teacher/overview');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to teacher dashboard...</p>
      </div>
    </div>
  );
}