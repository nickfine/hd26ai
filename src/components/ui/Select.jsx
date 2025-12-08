/**
 * Select Component
 * A dropdown select component with custom styling.
 * 
 * @example
 * <Select value={value} onChange={setValue} options={options} />
 * <Select label="Choose" placeholder="Select an option">
 *   <Select.Option value="1">Option 1</Select.Option>
 *   <Select.Option value="2">Option 2</Select.Option>
 * </Select>
 */

import { forwardRef, useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '../../lib/design-system';

// Context for sharing select state
const SelectContext = createContext({
  value: '',
  onChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

/**
 * @typedef {Object} SelectProps
 * @property {string} [value] - Selected value
 * @property {(value: string) => void} [onChange] - Callback when value changes
 * @property {Array<{value: string, label: string}>} [options] - Array of options
 * @property {string} [label] - Label text
 * @property {string} [placeholder='Select...']
 * @property {string} [helperText]
 * @property {string} [error]
 * @property {boolean} [disabled=false]
 * @property {boolean} [required=false]
 * @property {boolean} [clearable=false]
 * @property {'sm' | 'md' | 'lg'} [size='md']
 * @property {string} [className]
 */

const SIZE_MAP = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
};

const Select = forwardRef(({
  value,
  onChange,
  options = [],
  label,
  placeholder = 'Select...',
  helperText,
  error,
  disabled = false,
  required = false,
  clearable = false,
  size = 'md',
  className,
  children,
  id,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  // Find selected option label
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || '';

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        break;
    }
  }, [disabled, isOpen]);

  const handleSelect = useCallback((optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
  }, [onChange]);

  const handleClear = useCallback((e) => {
    e.stopPropagation();
    onChange?.('');
  }, [onChange]);

  return (
    <SelectContext.Provider value={{ value, onChange: handleSelect, isOpen, setIsOpen }}>
      <div ref={selectRef} className={cn('relative w-full', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold text-neutral-700 mb-1.5"
          >
            {label}
            {required && <span className="text-error-500 ml-0.5">*</span>}
          </label>
        )}

        {/* Select Trigger */}
        <button
          ref={ref}
          id={inputId}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={!!error}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full flex items-center justify-between border-2 bg-white text-left',
            'transition-colors duration-200 focus:outline-none',
            SIZE_MAP[size],
            error
              ? 'border-error-500 focus:border-error-600'
              : isOpen
                ? 'border-neutral-900'
                : 'border-neutral-300 focus:border-neutral-900',
            disabled && 'opacity-50 cursor-not-allowed bg-neutral-50',
            !disabled && 'cursor-pointer'
          )}
          {...props}
        >
          <span className={cn(
            value ? 'text-neutral-900' : 'text-neutral-400'
          )}>
            {displayValue || placeholder}
          </span>
          
          <div className="flex items-center gap-1 ml-2">
            {clearable && value && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
                className="p-0.5 hover:bg-neutral-100 rounded"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </span>
            )}
            <ChevronDown className={cn(
              'w-4 h-4 text-neutral-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div
            role="listbox"
            className={cn(
              'absolute z-dropdown w-full mt-1 bg-white border-2 border-neutral-900 shadow-lg',
              'max-h-60 overflow-auto animate-slide-down'
            )}
          >
            {options.length > 0 ? (
              options.map((option) => (
                <SelectOption
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectOption>
              ))
            ) : children ? (
              children
            ) : (
              <div className="px-3 py-2 text-sm text-neutral-400">
                No options available
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-1.5 text-sm text-error-600">{error}</p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    </SelectContext.Provider>
  );
});

Select.displayName = 'Select';

/**
 * Select.Option - Individual option in dropdown
 */
function SelectOption({ value: optionValue, disabled = false, children, className }) {
  const { value, onChange } = useContext(SelectContext);
  const isSelected = value === optionValue;

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => !disabled && onChange(optionValue)}
      className={cn(
        'w-full flex items-center justify-between px-3 py-2 text-sm text-left',
        'transition-colors duration-150',
        isSelected
          ? 'bg-neutral-100 text-neutral-900 font-bold'
          : 'text-neutral-700 hover:bg-neutral-50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
      {isSelected && <Check className="w-4 h-4" />}
    </button>
  );
}

SelectOption.displayName = 'Select.Option';

// Attach sub-component
Select.Option = SelectOption;

/**
 * MultiSelect - Select multiple options
 */
export const MultiSelect = forwardRef(({
  value = [],
  onChange,
  options = [],
  label,
  placeholder = 'Select...',
  helperText,
  error,
  disabled = false,
  required = false,
  size = 'md',
  className,
  id,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const inputId = id || `multiselect-${Math.random().toString(36).substr(2, 9)}`;

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = useCallback((optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  }, [value, onChange]);

  const removeOption = useCallback((optionValue, e) => {
    e.stopPropagation();
    onChange?.(value.filter(v => v !== optionValue));
  }, [value, onChange]);

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  return (
    <div ref={selectRef} className={cn('relative w-full', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-bold text-neutral-700 mb-1.5"
        >
          {label}
          {required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Select Trigger */}
      <button
        ref={ref}
        id={inputId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between border-2 bg-white text-left min-h-[42px]',
          'transition-colors duration-200 focus:outline-none',
          SIZE_MAP[size],
          error
            ? 'border-error-500 focus:border-error-600'
            : isOpen
              ? 'border-neutral-900'
              : 'border-neutral-300 focus:border-neutral-900',
          disabled && 'opacity-50 cursor-not-allowed bg-neutral-50'
        )}
        {...props}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map(opt => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-sm rounded"
              >
                {opt.label}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-error-500"
                  onClick={(e) => removeOption(opt.value, e)}
                />
              </span>
            ))
          ) : (
            <span className="text-neutral-400">{placeholder}</span>
          )}
        </div>
        
        <ChevronDown className={cn(
          'w-4 h-4 text-neutral-400 transition-transform duration-200 ml-2 flex-shrink-0',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-dropdown w-full mt-1 bg-white border-2 border-neutral-900 shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-sm text-left',
                  'transition-colors duration-150',
                  isSelected
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-700 hover:bg-neutral-50'
                )}
              >
                {option.label}
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-error-600">{error}</p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
});

MultiSelect.displayName = 'MultiSelect';

export default Select;



