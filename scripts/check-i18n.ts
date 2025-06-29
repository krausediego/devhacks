import en from "../src/i18n/locales/en.json";
import pt from "../src/i18n/locales/pt.json";

type Json = { [key: string]: string | Json };

function findMissingKeys(base: Json, target: Json, prefix = ""): string[] {
  const missing: string[] = [];

  for (const key in base) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const baseVal = base[key];
    const targetVal = target[key];

    if (typeof baseVal === "object" && baseVal !== null) {
      if (typeof targetVal !== "object" || targetVal === null) {
        missing.push(fullKey);
      } else {
        missing.push(...findMissingKeys(baseVal, targetVal as Json, fullKey));
      }
    } else if (!(key in target)) {
      missing.push(fullKey);
    }
  }

  return missing;
}

const missingInPt = findMissingKeys(en, pt);
const missingInEn = findMissingKeys(pt, en);

console.log("\n🔍 Verificando consistência dos arquivos i18n:\n");

if (missingInPt.length) {
  console.log("❌ Faltando em pt.json:");
  console.log(missingInPt.map((k) => `  - ${k}`).join("\n"));
}

if (missingInEn.length) {
  console.log("\n❌ Faltando em en.json:");
  console.log(missingInEn.map((k) => `  - ${k}`).join("\n"));
}

if (!missingInPt.length && !missingInEn.length) {
  console.log("✅ Tudo certo! Arquivos sincronizados.\n");
}
