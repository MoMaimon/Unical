import { IUniversityProvider } from "../IUniversityProvider";
import { BAUFetchProvider } from "./BAU/BAUFetchProvider";
import { BAUProvider } from "./BAU/BAUProvider";

export class ProviderFactory {
  static getProvider(university: "BAU" = "BAU"): IUniversityProvider {
    if (university === "BAU") {
      return new BAUProvider(new BAUFetchProvider());
    }
    throw new Error(`Provider for university ${university} not found.`);
  }
}
