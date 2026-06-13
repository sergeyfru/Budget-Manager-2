import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCurrenciesStore } from "../../store/currenciesStore";
import { useSettingsStore } from "../../store/settingsStore";

export const CurrencySelector = () => {
  const { currencies } = useCurrenciesStore();
  const { defaultCurrency, setSelectedCurrency } = useSettingsStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // const current = currencies.find(c => c.currency_code === defaultCurrency?.currency_code);

  const filtered = currencies.filter(
    (c) =>
      c.currency_name.toLowerCase().includes(query.toLowerCase()) ||
      c.currency_code.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const select = async (code: string) => {
    const c = currencies.find((x) => x.currency_code === code);
    if (c) await setSelectedCurrency(c);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative flex-1" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors text-sm"
      >
        <span className="flex items-center gap-2.5">
          {/* <span className="text-base">{defaultCurrency.flag}</span> */}
          <span className="font-medium text-foreground">{defaultCurrency.currency_code}</span>
          <span className="text-muted-foreground">— {defaultCurrency.currency_name}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search currency..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.map((c) => (
              <button
                key={c.currency_code}
                onClick={() => select(c.currency_code)}
                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors text-sm ${
                  defaultCurrency?.currency_code === c.currency_code ? "text-primary" : "text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {/* <span className="text-base">{c.flag}</span> */}
                  <span className="font-medium">{c.currency_code}</span>
                  <span className="text-muted-foreground">{c.currency_name}</span>
                </span>
                {defaultCurrency?.currency_code === c.currency_code && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
            {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No results</p>}
          </div>
        </div>
      )}
    </div>
  );
};
