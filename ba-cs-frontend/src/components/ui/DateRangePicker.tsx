import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartChange: (date: Date | null) => void;
  onEndChange: (date: Date | null) => void;
  className?: string;
}

const inputClass = cn(
  'block w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm shadow-sm',
  'placeholder-gray-400 transition-colors',
  'focus:border-[#0D5C73] focus:outline-none focus:ring-1 focus:ring-[#0D5C73]'
);

function DateField({
  selected,
  onChange,
  placeholderText,
  maxDate,
  minDate,
}: {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText: string;
  maxDate?: Date;
  minDate?: Date;
}) {
  return (
    <div className="relative">
      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        dateFormat="yyyy-MM-dd"
        maxDate={maxDate}
        minDate={minDate}
        className={inputClass}
        isClearable
        autoComplete="off"
      />
    </div>
  );
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DateField
        selected={startDate}
        onChange={onStartChange}
        placeholderText="From date"
        maxDate={endDate ?? new Date()}
      />
      <span className="shrink-0 text-gray-400">—</span>
      <DateField
        selected={endDate}
        onChange={onEndChange}
        placeholderText="To date"
        minDate={startDate ?? undefined}
        maxDate={new Date()}
      />
    </div>
  );
}
