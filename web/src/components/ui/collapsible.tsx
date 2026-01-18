import { cn } from '@/lib/utils';
import * as React from 'react';

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, open, onOpenChange, defaultOpen, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen || false);

    const state = open !== undefined ? open : isOpen;
    const setState = onOpenChange || setIsOpen;

    return (
      <div ref={ref} data-state={state ? 'open' : 'closed'} className={cn(className)} {...props}>
        <CollapsibleContext.Provider value={{ open: state, onOpenChange: setState }}>
          {children}
        </CollapsibleContext.Provider>
      </div>
    );
  }
);
Collapsible.displayName = 'Collapsible';

interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | undefined>(undefined);

const useCollapsible = () => {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error('useCollapsible must be used within a Collapsible');
  }
  return context;
};

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild, onClick, ...props }, ref) => {
  const { open, onOpenChange } = useCollapsible();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & { 'data-state'?: string }
    >;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        // call original onClick if exists
        if (typeof child.props.onClick === 'function') {
          child.props.onClick(e as React.MouseEvent<HTMLElement>);
        }
        onClick?.(e as React.MouseEvent<HTMLButtonElement>);
        onOpenChange(!open);
      },
      'data-state': open ? 'open' : 'closed',
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(!open);
      }}
      data-state={open ? 'open' : 'closed'}
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
});
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open } = useCollapsible();

    if (!open) return null;

    return (
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'overflow-hidden animate-in slide-in-from-top-1 fade-in-0 duration-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
