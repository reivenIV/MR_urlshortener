// true if at least one field on the dto is set (not undefined)
/*
  These function is used in 3 different places when
   we udpate a line in the database. The problem is when multiple 
   attributes are optional and they pass the DTO.. so if the user 
   sends all empty the API respond 200.. We want to check that 
   behaviore
*/

export function hasAtLeastOneField(dto: object): boolean {
  let found = false;
  const values = Object.values(dto);
  for (let i = 0; i < values.length; i++) {
    if (values[i] !== undefined) {
      found = true;
    }
  }
  return found;
}
