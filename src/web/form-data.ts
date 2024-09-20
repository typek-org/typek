export type FormDataInit =
  | Record<string, FormDataEntryValue | FormDataEntryValue[]>
  | [string, FormDataEntryValue | FormDataEntryValue[]][];

export function formDataFrom(init: FormDataInit): FormData {
  if (!Array.isArray(init)) init = Object.entries(init);
  const data = new FormData();
  for (let [key, values] of init) {
    if (!Array.isArray(values)) values = [values];
    for (const value of values) {
      data.append(key, value);
    }
  }
  return data;
}

export function formDataEntries(
  data: FormData
): [string, FormDataEntryValue][] {
  const entries: [string, FormDataEntryValue][] = [];
  data.forEach((value, key) => entries.push([key, value]));
  return entries;
}

export type FormDataConstructor = FormData & {
  from: typeof formDataFrom;
  entries: typeof formDataEntries;
};

type FormData_ = FormData;
const FormData_: FormDataConstructor = new Proxy(FormData as any, {
  get(target, prop, receiver) {
    if (prop === "from") return formDataFrom;
    if (prop === "entries") return formDataEntries;
    return Reflect.get(target, prop, receiver);
  },
});

export { FormData_ as FormData };
