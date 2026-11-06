"use client";
//Tumhare filter component mein user interactions hain, jaise:
// - Dropdown se category select karna.
// - Price input karna.
// - Checkbox select/unselect karna.
// - URL change karna using useRouter().
// Isliye ye Client Component hai. Ismein browser-side interactions handle hote hain.

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ProductFilterProps {
  categories: string[];
}

// const categories = ["Electronics", "Apparel"]; //will be made dynamic later
//filters hame url se chahiye hota hai bcoz reload krne pebhi vhi selected filter show hota hai but agr props use kre tb nhi possible hoga

export default function ProductFilters({ categories }: ProductFilterProps) {
  const router = useRouter(); // push whole url into address bar
  const pathname = usePathname(); // Current path deta hai.after slash is pathname and after
  const searchParams = useSearchParams(); // ? all are  searchparams.URL ke query parameters read karta hai.Taaki ek filter change karne par baaki selected filters delete na ho jaayein.

  //when we want to chnge url onClick
  function updateFilter(key: string, value: string): void {
    const params = new URLSearchParams(searchParams.toString());
    //URLSearchParams
    if (value) {
      params.set(key, value); //eg:params.set("maxPrice", "2000");
    } else {
      params.delete(key); // Remove the filter if the value is empty from the url entirely
    }
    router.push(`${pathname}?${params.toString()}`); //jo str pass kerege vo url mai ayega
  }
  return (
    // for less important data we can use aside
    <aside className="w-56">
      <div>
        <h4>Category Filter</h4>
        <select
          className="bg-slate-950 text-white"
          defaultValue={searchParams.get("category") || ""}
          //defaultValue page initially load hone par URL ki existing category select karta hai.
          onChange={(e) => updateFilter("category", e.target.value)}
          //onChange har baar input value badalne par chalta hai.
        >
          <option value="">All Categories</option>

          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4>Max Price</h4>
        <input
          type="number"
          placeholder="e.g 2000"
          defaultValue={searchParams.get("maxPrice") || ""}
          onBlur={(e) => updateFilter("maxPrice", e.target.value)}
          //onBlur tab chalta hai jab user input se bahar click karta hai ya focus hataata hai.
        />
      </div>
      <div>
        <label>
          Instock:{" "}
          <input
            type="checkbox"
            defaultChecked={searchParams.get("Instock") === "true"}
            //defaultValue ki jagah defaultChecked use kiya hai because checkbox ki selected state control karni hoti hai.
            onChange={(e) =>
              updateFilter("Instock", e.target.checked ? "true" : "")
            }
          />
        </label>
        {/* <h4>Instock</h4> */}
      </div>
    </aside>
  );
}
