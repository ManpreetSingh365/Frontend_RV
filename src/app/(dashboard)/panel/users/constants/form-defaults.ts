import type { CreateUserInput } from "@/lib/validation/user.schema";

export const INITIAL_USER_FORM_VALUES: Partial<CreateUserInput> = {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phoneNumber: "",
    vehicleCreditLimit: 0,
    roleId: "",
    vehicleIds: [],
    addresses: [
        {
            streetLine1: "",
            streetLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
            landmark: "",
            addressType: "HOME",
            primaryAddress: true,
        },
    ],
};
