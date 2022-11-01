export const strings = {
  capitalizeFirstLetter,
};

function capitalizeFirstLetter(str: string): string {
  return str.length === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1);
}
