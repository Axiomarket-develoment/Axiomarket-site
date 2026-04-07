export const DateSeparator = ({ date }: { date: number }) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = messageDate.toDateString() === today.toDateString();
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();

  let label = messageDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (isToday) label = "Today";
  if (isYesterday) label = "Yesterday";

  return (
    <div className="flex justify-center my-4">
      <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
        {label}
      </span>
    </div>
  );
};
export default DateSeparator;