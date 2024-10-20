export const isValidOperation = (updatesKeys, updatesArr) => {
  const updates = Object.keys(updatesKeys);
  const allowedUpdates = updatesArr;
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  return isValidOperation;
};
