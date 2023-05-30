const errors = {
  CODE_001: (_: TemplateStringsArray, name: string, age: number, x: string) => `Mi nombre es ${name} y tengo ${age} años, ${x}`,
};

export default errors;
