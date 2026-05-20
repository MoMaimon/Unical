import { College, Degree, Department } from "@/types/Data";
import { getLocale } from "next-intl/server";

export type FilterType = "multi-select" | "range" | "boolean";

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterConfigItem {
  id: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  // Dynamic options like 'degrees', 'colleges', 'departments' are populated at runtime
  dynamicOptionsKey?: "degrees" | "colleges" | "departments";
  min?: number;
  max?: number;
  step?: number;
}

export const filterConfig: FilterConfigItem[] = [
  {
    id: "degreeId",
    label: "degree",
    type: "multi-select",
    dynamicOptionsKey: "degrees",
  },
  {
    id: "collegeId",
    label: "college",
    type: "multi-select",
    dynamicOptionsKey: "colleges",
  },
  {
    id: "departmentId",
    label: "department",
    type: "multi-select",
    dynamicOptionsKey: "departments",
  },
  {
    id: "credits",
    label: "credit_hours",
    type: "range",
    options: [
      { id: "1", label: "1 Hour" },
      { id: "2", label: "2 Hours" },
      { id: "3", label: "3 Hours" },
      { id: "4", label: "4 Hours" },
      { id: "5", label: "5 Hours" },
      { id: "6", label: "6 Hours" },
    ],
  },
];

// Helper to populate dynamic options
export async function getPopulatedFilters(
  degrees: Degree[],
  colleges: College[],
  departments: Department[],
): Promise<FilterConfigItem[]> {
  const locale = await getLocale();
  const nameField = locale === "ar" ? "arabicName" : "englishName";
  return filterConfig.map((config) => {
    if (config.dynamicOptionsKey === "degrees") {
      return {
        ...config,
        options: degrees.map((d) => ({
          id: d.id,
          label: d[nameField],
        })),
      };
    }
    if (config.dynamicOptionsKey === "colleges") {
      return {
        ...config,
        options: colleges.map((c) => ({
          id: c.id,
          label: c[nameField],
        })),
      };
    }
    if (config.dynamicOptionsKey === "departments") {
      return {
        ...config,
        options: departments.map((d) => ({
          id: d.id,
          label: d[nameField],
        })),
      };
    }
    return config;
  });
}
