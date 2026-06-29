"use client";

import { useState } from "react";

export default function DealCalculator() {
  // Inputs
  const [purchasePrice, setPurchasePrice] = useState(5000000);
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(25);
  const [noi, setNoi] = useState(350000);
  const [buildingSf, setBuildingSf] = useState(25000);
  const [capRateAtSale, setCapRateAtSale] = useState(6.5);
  const [closingCosts, setClosingCosts] = useState(2);
  const [capexReserve, setCapexReserve] = useState(0.15); // $/sf/year

  // Calculated
  const downPayment = purchasePrice * (downPaymentPct / 100);
  const loanAmount = purchasePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const annualDebtService = monthlyPayment * 12;
  const cashFlow = noi - annualDebtService - (capexReserve * buildingSf);
  const cocReturn = noi > 0 ? (cashFlow / (downPayment + purchasePrice * (closingCosts / 100))) * 100 : 0;
  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
  const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;
  const pricePsf = buildingSf > 0 ? purchasePrice / buildingSf : 0;
  const exitPrice = noi / (capRateAtSale / 100);
  const exitEquity = exitPrice - loanAmount;
  const totalInvestment = downPayment + purchasePrice * (closingCosts / 100);

  function format(n: number): string {
    return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function formatPct(n: number): string {
    return n.toFixed(2) + "%";
  }

  function formatMoney(n: number): string {
    return "$" + Math.round(n).toLocaleString();
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">🧮 Deal Calculator</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Run the numbers on any commercial deal. Adjust inputs to see how cash flow, cap rate, and returns change.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm text-[#f59e0b]">📥 Inputs</h2>

          <InputSlider label="Purchase Price" value={purchasePrice} set={setPurchasePrice} min={100000} max={50000000} step={100000} prefix="$" />
          <InputSlider label="Down Payment" value={downPaymentPct} set={setDownPaymentPct} min={10} max={50} step={1} suffix="%" />
          <InputSlider label="Interest Rate" value={interestRate} set={setInterestRate} min={3} max={12} step={0.1} suffix="%" />
          <InputSlider label="Loan Term" value={loanTerm} set={setLoanTerm} min={5} max={30} step={1} suffix="yr" />
          <InputSlider label="NOI (Net Operating Income)" value={noi} set={setNoi} min={10000} max={5000000} step={10000} prefix="$" />
          <InputSlider label="Building SF" value={buildingSf} set={setBuildingSf} min={1000} max={500000} step={1000} suffix="sf" />
          <InputSlider label="Exit Cap Rate" value={capRateAtSale} set={setCapRateAtSale} min={4} max={12} step={0.25} suffix="%" />
          <InputSlider label="Closing Costs" value={closingCosts} set={setClosingCosts} min={1} max={6} step={0.5} suffix="%" />
          <InputSlider label="CapEx Reserve" value={capexReserve} set={setCapexReserve} min={0.05} max={0.50} step={0.05} prefix="$" suffix="/sf/yr" />
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
            <h2 className="font-semibold text-sm text-[#10b981] mb-3">📊 Returns</h2>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard label="Cash-on-Cash Return" value={formatPct(cocReturn)} color={cocReturn > 8 ? "text-[#10b981]" : cocReturn > 4 ? "text-[#f59e0b]" : "text-[#ef4444]"} />
              <MetricCard label="Debt Service Coverage" value={dscr.toFixed(2)} color={dscr > 1.35 ? "text-[#10b981]" : dscr > 1.15 ? "text-[#f59e0b]" : "text-[#ef4444]"} />
              <MetricCard label="Cap Rate (Purchase)" value={formatPct(capRate)} color="text-[#06b6d4]" />
              <MetricCard label="Annual Cash Flow" value={formatMoney(cashFlow)} color={cashFlow > 0 ? "text-[#10b981]" : "text-[#ef4444]"} />
            </div>
          </div>

          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
            <h2 className="font-semibold text-sm text-[#8b5cf6] mb-3">📋 Deal Summary</h2>
            <div className="space-y-2 text-sm">
              <SummaryRow label="Purchase Price" value={formatMoney(purchasePrice)} />
              <SummaryRow label="Down Payment (20% closing)" value={formatMoney(totalInvestment)} />
              <SummaryRow label="Loan Amount" value={formatMoney(loanAmount)} />
              <SummaryRow label="Monthly Payment" value={formatMoney(monthlyPayment)} />
              <SummaryRow label="Annual Debt Service" value={formatMoney(annualDebtService)} />
              <SummaryRow label="NOI" value={formatMoney(noi)} />
              <SummaryRow label="Price PSF" value={formatMoney(pricePsf)} />
              <SummaryRow label="Estimated Exit Value" value={formatMoney(exitPrice)} />
              <SummaryRow label="Exit Equity" value={formatMoney(exitEquity)} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-[#8b95a9] text-center">
        For illustrative purposes only. Not financial advice. Consult your lender and accountant.
      </div>
    </main>
  );
}

function InputSlider({ label, value, set, min, max, step, prefix, suffix }: {
  label: string; value: number; set: (v: number) => void;
  min: number; max: number; step: number;
  prefix?: string; suffix?: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#8b95a9]">{label}</span>
        <span className="text-[#e2e8f0] font-mono">{prefix || ""}{Math.round(value).toLocaleString()}{suffix || ""}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full accent-[#f59e0b]"
      />
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg p-3">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-[#8b95a9] mt-0.5">{label}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#8b95a9]">{label}</span>
      <span className="font-mono text-[#e2e8f0]">{value}</span>
    </div>
  );
}
