import { fetchAllUniversities, fetchEducationCountries } from "@/lib/data";
import { StaffUniversityDirectory } from "@/components/staff/StaffUniversityDirectory";

export default async function StaffDirectoryPage() {
  const [universities, countries] = await Promise.all([fetchAllUniversities(), fetchEducationCountries()]);
  return <div className="mx-auto max-w-[1440px] p-4 sm:p-7 lg:p-9"><StaffUniversityDirectory universities={universities} countries={countries} /></div>;
}
