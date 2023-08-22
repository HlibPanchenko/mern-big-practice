export function rolesMapper(userId:string) {
	if (userId === "USER") {
	  return "MANAGER";
	} else if (userId === "MANAGER") {
	  return "ADMIN";
	}
	return "";
 }