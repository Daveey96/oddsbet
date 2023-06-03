const condition = (v, values, output) => {
  for (let i = 0; i < values.length; i++)
    if (v === values[i])
      return output ? (output === "i" ? i : output[i]) : values[i];
};

export default condition;
