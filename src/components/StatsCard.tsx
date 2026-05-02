type Props = {
  label: string;
  value: number | string;
  accent?: 'blue' | 'green' | 'yellow' | 'red';
};

export default function StatsCard({ label, value, accent = 'blue' }: Props) {
  const map = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  } as const;

  return (
    <div className={`border  p-4 bg-white rounded-xl shadow p-6">`}>
      <div className={`inline-block text-xs px-2 py-1 rounded ${map[accent]}`}>{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
