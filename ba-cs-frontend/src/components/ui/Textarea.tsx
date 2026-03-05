import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          rows={4}
          className={cn(
            'block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors resize-y',
            'focus:outline-none focus:ring-1',
            error
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#0D5C73] focus:ring-[#0D5C73]',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
