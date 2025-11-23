"use server";

import { revalidatePath } from "next/cache";
import {
    createUser,
    updateUser,
    deleteUser
} from "../service/user.service";
import { User } from "../service/user.service";

/* ================= USER ACTIONS ================= */

// CREATE
export async function createUserAction(formData: FormData) {
    const payload = {
        username: formData.get("username"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber"),
        roleId: formData.get("roleId"),
        password: formData.get("password"),
    };

    await createUser(payload as Partial<User>);
    revalidatePath("/users");
}

// UPDATE
export async function updateUserAction(userId: string, formData: FormData) {
    const payload = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber"),
        roleId: formData.get("roleId"),
        active: formData.get("active") === "true",
    };

    await updateUser(userId, payload as Partial<User>);
    revalidatePath(`/users/${userId}`);
}

// DELETE
export async function deleteUserAction(userId: string) {
    await deleteUser(userId);
    revalidatePath("/users");
}
