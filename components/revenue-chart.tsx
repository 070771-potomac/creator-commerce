// Daily revenue column chart for the dashboard (S12). A server component:
// plain HTML columns sized in %, no chart library and no client JavaScript.
//
// One chart per currency ("small multiples"): dollars and lei can't share an
// axis. Each chart has a single series, so its title names it (no legend).
// Every column shows its value on hover / keyboard focus, and the same
// numbers are available as a table below the chart.
import type { RevenueSeries } from "@/lib/dal/metrics";

export function RevenueChart({ series }: { series: RevenueSeries }) {
  const max = Math.max(...series.days.map((day) => day.cents), 0);
  const first = series.days[0];
  const middle = series.days[Math.floor(series.days.length / 2)];
  const last = series.days[series.days.length - 1];

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{series.currency}</span>
        <span className="text-sm tabular-nums text-muted-foreground">
          <span className="font-medium text-foreground">{series.total}</span> in {series.days.length} days
        </span>
      </figcaption>

      {/* Plot: recessive top gridline with the scale's max, columns growing
          from one baseline. */}
      <div className="relative">
        <span className="absolute -top-0.5 right-0 text-[10px] tabular-nums text-muted-foreground">
          {max > 0 ? series.days.find((day) => day.cents === max)?.amount : ""}
        </span>
        <div
          role="list"
          aria-label={`Daily revenue in ${series.currency}`}
          className="flex h-32 items-end gap-[2px] border-b border-border border-t border-t-border/40 pt-3"
        >
          {series.days.map((day, index) => {
            // Tooltips near the edges open inwards, so they never get cut off.
            const align =
              index < 4 ? "left-0" : index >= series.days.length - 4 ? "right-0" : "left-1/2 -translate-x-1/2";
            const height = max > 0 ? (day.cents / max) * 100 : 0;
            const text = `${day.label}: ${day.amount}, ${day.units} ${day.units === 1 ? "sale" : "sales"}`;
            return (
              <div
                key={day.date}
                role="listitem"
                tabIndex={0}
                aria-label={text}
                // The whole day slot is the hit target, not just the column.
                className="group relative flex h-full flex-1 items-end justify-center outline-none focus-visible:bg-muted/60"
              >
                {day.cents > 0 ? (
                  <span
                    className="block w-full max-w-6 rounded-t-[4px] bg-primary"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                ) : null}
                {/* Tooltip: value first, then date and count. Text uses
                    text colors, never the data color. */}
                <span
                  role="tooltip"
                  className={`pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap ${align} border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-sm group-hover:block group-focus-visible:block`}
                >
                  <span className="font-medium tabular-nums">{day.amount}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {day.label} · {day.units} {day.units === 1 ? "sale" : "sales"}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        {/* X axis: three dates are enough to read the time span. */}
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>{first.label}</span>
          <span>{middle.label}</span>
          <span>{last.label}</span>
        </div>
      </div>

      {/* Table view: the same numbers without the chart (screen readers,
          copying, or anyone who prefers a list). Only days with sales. */}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Show as table
        </summary>
        <table className="mt-2 w-full">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-1 font-normal">Day</th>
              <th className="py-1 text-right font-normal">Sales</th>
              <th className="py-1 text-right font-normal">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {series.days
              .filter((day) => day.units > 0)
              .map((day) => (
                <tr key={day.date} className="border-t">
                  <td className="py-1">{day.label}</td>
                  <td className="py-1 text-right tabular-nums">{day.units}</td>
                  <td className="py-1 text-right tabular-nums">{day.amount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
