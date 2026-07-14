import * as React from "react";
import { cn } from "../../lib/cn";

/*
  DescriptionList — a <dl> of label→value rows for detail panels.

    <DescriptionList
      items={[
        { term: "Plan", details: "Team" },
        { term: "Seats", details: "12 of 20" },
      ]}
    />

    <DescriptionList columns divided>
      <DescriptionRow>
        <DescriptionTerm>Region</DescriptionTerm>
        <DescriptionDetails>us-east-1</DescriptionDetails>
      </DescriptionRow>
    </DescriptionList>

  Rows stack on mobile; with `columns` they become a label/value grid on sm+.
  Terms read muted (text-fg/55), details at full contrast. Pass `items` for the
  quick path, or compose DescriptionRow with a DescriptionTerm/DescriptionDetails
  pair. `divided` draws a hairline between rows.
*/

export interface DescriptionListItem {
  term: React.ReactNode;
  details: React.ReactNode;
}

interface RowLayout {
  columns: boolean;
  divided: boolean;
}

const RowLayoutContext = React.createContext<RowLayout>({ columns: false, divided: false });

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  /** Two-column label/value grid on sm+ (rows stack on mobile). */
  columns?: boolean;
  /** Draws a hairline divider between rows. */
  divided?: boolean;
  /** Convenience data path; renders a DescriptionRow per item. */
  items?: DescriptionListItem[];
}

export const DescriptionList = React.forwardRef<HTMLDListElement, DescriptionListProps>(
  ({ className, columns = false, divided = false, items, children, ...props }, ref) => (
    <RowLayoutContext.Provider value={{ columns, divided }}>
      <dl ref={ref} className={cn("text-sm", className)} {...props}>
        {items
          ? items.map((item, i) => (
              <DescriptionRow key={i}>
                <DescriptionTerm>{item.term}</DescriptionTerm>
                <DescriptionDetails>{item.details}</DescriptionDetails>
              </DescriptionRow>
            ))
          : children}
      </dl>
    </RowLayoutContext.Provider>
  )
);
DescriptionList.displayName = "DescriptionList";

/** One label→value row. Wraps a DescriptionTerm + DescriptionDetails pair. */
export const DescriptionRow = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { columns, divided } = React.useContext(RowLayoutContext);
    return (
      <div
        ref={ref}
        className={cn(
          "py-2.5",
          columns ? "grid gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4" : "flex flex-col gap-0.5",
          divided && "border-t border-border/60 first:border-t-0",
          className
        )}
        {...props}
      />
    );
  }
);
DescriptionRow.displayName = "DescriptionRow";

export const DescriptionTerm = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <dt ref={ref as React.Ref<HTMLElement>} className={cn("text-fg/55", className)} {...props} />
  )
);
DescriptionTerm.displayName = "DescriptionTerm";

export const DescriptionDetails = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <dd ref={ref as React.Ref<HTMLElement>} className={cn("text-fg", className)} {...props} />
  )
);
DescriptionDetails.displayName = "DescriptionDetails";
