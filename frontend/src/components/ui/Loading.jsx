export const Loading = () => (
  <div className="flex items-center justify-center py-8">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  </div>
);
