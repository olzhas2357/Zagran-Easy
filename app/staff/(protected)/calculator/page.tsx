import { CalculatorForm } from "@/components/staff/CalculatorForm";
import { getCalculatorSettings } from "@/lib/staff-data";

export default async function StaffCalculatorPage() {
  const settings = await getCalculatorSettings();

  return (
    <div className="p-6 sm:p-9">
      <h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Калькулятор</h1>
      <p className="mt-2 text-[14px] text-ze-muted">Расчёт стоимости услуг для клиента, с отправкой в WhatsApp.</p>
      <div className="mt-5">
        <CalculatorForm initialSettings={settings} />
      </div>
    </div>
  );
}

