export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-grow bg-gray-50">
      {children}
    </div>
  );
} 