export const isValidOperation = (updates, updatesArr) => {
  const allowedUpdates = updatesArr;
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  return isValidOperation;
};
